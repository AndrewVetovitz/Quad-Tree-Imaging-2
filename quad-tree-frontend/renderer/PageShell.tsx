import React from 'react'
import { PageContextProvider } from './usePageContext'
import type { PageContext } from './types'

function PageShell({ children, pageContext }: { children: React.ReactNode; pageContext: PageContext }) {
  return (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
         {children}
      </PageContextProvider>
    </React.StrictMode>
  )
}

export { PageShell }
