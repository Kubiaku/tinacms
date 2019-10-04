import * as React from 'react'
import { CMS } from '@tinacms/core'

export const ERROR_MISSING_CMS = `useCMS could not find an instance of CMS`

export const CMSContext = React.createContext<CMS | null>(null)

export function useCMS(): CMS {
  const cms = React.useContext(CMSContext)

  if (!cms) {
    throw new Error(ERROR_MISSING_CMS)
  }

  return cms
}
