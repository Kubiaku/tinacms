/**
Copyright 2021 Forestry.io Holdings, Inc.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import type { GraphQLConfig } from '../types'
import {
  resolveMediaRelativeToCloud,
  resolveMediaCloudToRelative,
} from './media-utils'

describe('resolveMedia', () => {
  const assetsHost = `assets.tinajs.dev`
  const clientId = `a03ff3e2-1c3a-41af-8afd-ba0d58853191`
  const relativeAssetURL = `/llama.png`
  const cloudAssetURL = `https://assets.tinajs.dev/a03ff3e2-1c3a-41af-8afd-ba0d58853191/llama.png`

  /**
   * When using `useRelativeMedia: true`, the URL should not be changed.
   */
  it('resolves relative media when useRelativeMedia: true', () => {
    const config: GraphQLConfig = {
      useRelativeMedia: true,
    }
    const resolvedURL = resolveMediaRelativeToCloud(relativeAssetURL, config)
    expect(resolvedURL).toEqual(resolvedURL)
  })

  /**
   * When using `useRelativeMedia: false`, the relative URL should be changed to a Cloud URL.
   */
  it('resolves relative media to cloud media when useRelativeMedia: false', () => {
    const config: GraphQLConfig = {
      useRelativeMedia: false,
      assetsHost,
      clientId,
    }
    const resolvedURL = resolveMediaRelativeToCloud(relativeAssetURL, config)
    expect(resolvedURL).toEqual(cloudAssetURL)
  })

  /**
   * When using `useRelativeMedia: false`, the Cloud URL should be changed to relative URL.
   */
  it('resolves cloud media to relative media when useRelativeMedia: false', () => {
    const config: GraphQLConfig = {
      useRelativeMedia: false,
      assetsHost,
      clientId,
    }
    const resolvedURL = resolveMediaCloudToRelative(cloudAssetURL, config)
    expect(resolvedURL).toEqual(relativeAssetURL)
  })

  /**
   * A empty value should return empty, regardless of `useRelativeMedia`
   */
  it('resolved to empty when provided an empty value', () => {
    const config: GraphQLConfig = {
      useRelativeMedia: false,
      assetsHost,
      clientId,
    }
    const aURL = resolveMediaCloudToRelative('', config)
    expect(aURL).toEqual('')

    const bURL = resolveMediaRelativeToCloud('', config)
    expect(bURL).toEqual('')
  })
})
