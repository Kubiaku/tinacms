import {it, expect, describe} from 'vitest'
import {fromMarkdown} from 'mdast-util-from-markdown'
import {visit} from 'unist-util-visit'
import {mdxJsx} from './index'
import {mdxJsxFromMarkdown} from 'mdast-util-mdx-jsx'
import * as acorn from 'acorn'

describe('tinaShortcodes', () => {
  it('parses leaf shortcodes as directives', () => {
    const value = `
{

import { foo } from 'bar.js'

const meh = "ok"

$SelfClosing a="b" $

% OpenEnded c="d" %

% OpenEnded g="h" %

$SelfClosing i="j" $

Testing

%/OpenEnded %

Testing

%/OpenEnded %

`

    try {
      const tree = fromMarkdown(value, {
        extensions: [mdxJsx({acorn: acorn, addResult: true})],
        mdastExtensions: [mdxJsxFromMarkdown()]
      })
      console.dir(removePosition(tree, {force: true}), {depth: null})
    } catch (e) {
      console.log(e)
    }
  })
})

// @ts-ignore
export function removePosition(tree, options) {
  const force =
    typeof options === 'boolean' ? options : options ? options.force : false

  visit(tree, remove)

  return tree

  // @ts-ignore
  function remove(node) {
    // node?.attributes?.forEach((att) => {
    //   if (att?.value?.data) {
    //     delete att?.value?.data
    //   }
    //   delete att.data
    // })
    if (force) {
      delete node.position
    } else {
      node.position = undefined
    }
  }
}
