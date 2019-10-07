import * as React from 'react'
import { Subscribable } from '@tinacms/core'
/**
 *
 * @param subscribable An object that can be subscribed to
 * @param cb (Optional) A callback to be executed when an event occurs.
 */
export function useSubscribable(subscribable: Subscribable, cb?: Function) {
  const [_, s] = React.useState(0)
  React.useEffect(() => {
    return subscribable.subscribe(() => {
      s(x => x + 1)
      if (cb) cb()
    })
  })
}
