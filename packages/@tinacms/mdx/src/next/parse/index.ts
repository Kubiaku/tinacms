import { RichTypeInner } from '@tinacms/schema-tools'
import { Root } from 'mdast'
import { fromMarkdown } from './markdown'
import { compact } from 'mdast-util-compact'
import { postProcessor } from './post-processing'

export const parseMDX = (
  value: string,
  field: RichTypeInner,
  imageCallback?: (s: string) => string
) => {
  const backup = (v: string) => v
  const callback = imageCallback || backup
  const tree = fromMarkdown(value, field)
  return postProcess(tree, field, callback)
}

const postProcess = (
  tree: Root,
  field: RichTypeInner,
  imageCallback: (s: string) => string
) => {
  // Some of our processing results in adjacent nodes of the same type
  return postProcessor(compact(tree), field, imageCallback)
}
