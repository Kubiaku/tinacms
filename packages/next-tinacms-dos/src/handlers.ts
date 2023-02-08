/**

*/

import {
  _Object,
  S3Client,
  S3ClientConfig,
  ListObjectsCommand,
  ListObjectsCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  DeleteObjectCommand,
  DeleteObjectCommandInput,
} from '@aws-sdk/client-s3'
import type { Media, MediaListOptions } from '@tinacms/toolkit'
import path from 'path'
import fs from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'
import multer from 'multer'
import { promisify } from 'util'

export interface DOSConfig {
  config: S3ClientConfig
  bucket: string
  mediaRoot?: string
  authorized: (_req: NextApiRequest, _res: NextApiResponse) => Promise<boolean>
}

export interface DOSOptions {
  cdnUrl?: string
}

export const mediaHandlerConfig = {
  api: {
    bodyParser: false,
  },
}

export const createMediaHandler = (config: DOSConfig, options?: DOSOptions) => {
  const client = new S3Client(config.config)
  const bucket = config.bucket
  const mediaRoot = config.mediaRoot || ''
  let cdnUrl =
    options?.cdnUrl ||
    config.config.endpoint
      .toString()
      .replace(/http(s|):\/\//i, `https://${bucket}.`)
  cdnUrl = cdnUrl + (cdnUrl.endsWith('/') ? '' : '/')

  return async (req: NextApiRequest, res: NextApiResponse) => {
    const isAuthorized = await config.authorized(req, res)
    // make sure the user is authorized to upload
    if (!isAuthorized) {
      res.status(401).json({ message: 'sorry this user is unauthorized' })
      return
    }
    switch (req.method) {
      case 'GET':
        return listMedia(req, res, client, bucket, mediaRoot, cdnUrl)
      case 'POST':
        return uploadMedia(req, res, client, bucket, mediaRoot, cdnUrl)
      case 'DELETE':
        return deleteAsset(req, res, client, bucket, mediaRoot)
      default:
        res.end(404)
    }
  }
}

async function uploadMedia(
  req: NextApiRequest,
  res: NextApiResponse,
  client: S3Client,
  bucket: string,
  mediaRoot: string,
  cdnUrl: string
) {
  const upload = promisify(
    multer({
      storage: multer.diskStorage({
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        directory: (req, file, cb) => {
          cb(null, '/tmp')
        },
        filename: (req, file, cb) => {
          cb(null, file.originalname)
        },
      }),
    }).single('file')
  )
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  await upload(req, res)

  const { directory } = req.body
  let prefix = directory.replace(/^\//, '').replace(/\/$/, '')
  if (prefix) prefix = prefix + '/'

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const filePath = req.file.path
  const blob = fs.readFileSync(filePath)
  const filename = path.basename(filePath)
  const params: PutObjectCommandInput = {
    Bucket: bucket,
    Key: path.join(mediaRoot, prefix + filename),
    Body: blob,
    ACL: 'public-read',
  }
  const command = new PutObjectCommand(params)

  try {
    await client.send(command)
    res.json({
      type: 'file',
      id: prefix + filename,
      filename,
      directory: prefix,
      previewSrc: cdnUrl + path.join(mediaRoot, prefix + filename),
      src: cdnUrl + path.join(prefix + filename),
    })
  } catch (e) {
    res.status(500).send(findErrorMessage(e))
  }
}

function stripMediaRoot(mediaRoot: string, key: string) {
  if (!mediaRoot) {
    return key
  }
  const mediaRootParts = mediaRoot.split('/').filter((part) => part)
  if (!mediaRootParts || !mediaRootParts[0]) {
    return key
  }
  const keyParts = key.split('/').filter((part) => part)
  // remove each part of the key that matches the mediaRoot parts
  for (let i = 0; i < mediaRootParts.length; i++) {
    if (keyParts[0] === mediaRootParts[i]) {
      keyParts.shift()
    }
  }
  return keyParts.join('/')
}

async function listMedia(
  req: NextApiRequest,
  res: NextApiResponse,
  client: S3Client,
  bucket: string,
  mediaRoot: string,
  cdnUrl: string
) {
  try {
    const {
      directory = '',
      limit = 500,
      offset,
    } = req.query as MediaListOptions
    console.log(mediaRoot)
    let prefix = directory.replace(/^\//, '').replace(/\/$/, '')
    if (prefix) prefix = prefix + '/'

    const params: ListObjectsCommandInput = {
      Bucket: bucket,
      Delimiter: '/',
      Prefix: path.join(mediaRoot, prefix),
      Marker: offset?.toString(),
      MaxKeys: directory && !offset ? +limit + 1 : +limit,
    }
    console.log({ params })

    const response = await client.send(new ListObjectsCommand(params))

    const items = []

    response.CommonPrefixes?.forEach(({ Prefix }) => {
      const strippedPrefix = stripMediaRoot(mediaRoot, Prefix)
      console.log({ Prefix, strippedPrefix })
      items.push({
        id: Prefix,
        type: 'dir',
        filename: path.basename(strippedPrefix),
        directory: path.dirname(strippedPrefix),
      })
    })

    if (response.CommonPrefixes) {
      console.log({ responseCommonPrefixes: response.CommonPrefixes })
    }
    if (response.Contents) {
      console.log({ responseContents: response.Contents })
    }

    items.push(
      ...(response.Contents || [])
        .filter((file) => file.Key !== prefix)
        .map(getDOSToTinaFunc(cdnUrl, mediaRoot))
    )
    console.log({ items })

    res.json({
      items,
      offset: response.NextMarker,
    })
  } catch (e) {
    res.status(500)
    const message = findErrorMessage(e)
    res.json({ e: message })
  }
}

/**
 * we're getting inconsistent errors in this try-catch
 * sometimes we just get a string, sometimes we get the whole response.
 * I suspect this is coming from Digital Ocean Space SDK so let's just try to
 * normalize it into a string here.
 */
const findErrorMessage = (e: any) => {
  if (typeof e == 'string') return e
  if (e.message) return e.message
  if (e.error && e.error.message) return e.error.message
  return 'an error occurred'
}

async function deleteAsset(
  req: NextApiRequest,
  res: NextApiResponse,
  client: S3Client,
  bucket: string,
  mediaRoot: string
) {
  const { media } = req.query
  const [, objectKey] = media as string[]

  const params: DeleteObjectCommandInput = {
    Bucket: bucket,
    Key: path.join(mediaRoot, objectKey),
  }
  const command = new DeleteObjectCommand(params)
  try {
    const data = await client.send(command)
    res.json(data)
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Something went wrong',
    })
  }
}

function getDOSToTinaFunc(cdnUrl: string, mediaRoot: string) {
  return function dosToTina(file: _Object): Media {
    const strippedKey = stripMediaRoot(mediaRoot, file.Key)
    console.log({ Key: file.Key, strippedKey })
    const filename = path.basename(strippedKey)
    const directory = path.dirname(strippedKey) + '/'

    return {
      id: file.Key,
      filename,
      directory,
      src: cdnUrl + file.Key,
      previewSrc: cdnUrl + file.Key,
      type: 'file',
    }
  }
}
