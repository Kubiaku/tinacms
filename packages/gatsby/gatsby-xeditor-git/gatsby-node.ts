import * as express from 'express'
import * as cors from 'cors'
import * as fs from 'fs'
import * as path from 'path'

exports.onPreBootstrap = () => {
  let app = express()

  let pathRoot = process.cwd()

  app.use(
    cors({
      origin: function(origin, callback) {
        // TODO: Only accept from localhost.
        callback(null, true)
      },
    })
  )
  app.use(express.json())

  app.put('/markdownRemark', (req, res) => {
    let filePath = path.join(pathRoot, req.body.fileRelativePath)
    fs.writeFileSync(filePath, req.body.content)
    res.send(req.body.content)
  })

  app.listen(4567, () => {
    console.log('------------------------------------------')
    console.log('xeditor local backend running on port 4567')
    console.log('------------------------------------------')
  })
}

exports.onCreateNode = ({ node, actions }: any) => {
  let pathRoot = process.cwd()

  if (node.internal && node.internal.type === 'MarkdownRemark') {
    actions.createNodeField({
      node,
      name: 'fileRelativePath',
      value: node.fileAbsolutePath.replace(pathRoot, ''),
    })
  }
}
