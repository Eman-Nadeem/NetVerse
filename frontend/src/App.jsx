import React from 'react'
import { Layout } from './components/layout/Layout'

const App = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
          Phase 3 Complete
        </h1>
        <p className="text-slate-500 dark:text-zinc-400">
          Layout Shell is active. Try resizing the window!
        </p>
      </div>
    </Layout>
  )
}

export default App