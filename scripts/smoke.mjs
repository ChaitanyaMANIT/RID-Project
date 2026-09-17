/**
 * Render smoke test.
 *
 *   npm run smoke
 */
import { createServer } from 'vite'
import { renderToString } from 'react-dom/server'
import { createElement } from 'react'

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
})

const checks = []
const check = (name, ok) => checks.push({ name, ok })

try {
  const { default: App } = await server.ssrLoadModule('/src/App.tsx')
  const html = renderToString(createElement(App))

  check('App rendered some markup', html.length > 400)
  check('prologue cover copy present', html.includes('I made something for you'))
  check('no leftover markers in markup', !html.includes('___'))

  // Updated 6 chapter pages test
  const pages = [
    'Ch2StarterPack',
    'Ch3GameCenter',
    'Ch4JungleTrail',
    'Ch5Scrapbook',
    'Ch6Confessions',
    'Ch10FinalSurprise',
  ]

  const { ExperienceProvider } = await server.ssrLoadModule('/src/context/ExperienceContext.tsx')

  for (const name of pages) {
    try {
      const mod = await server.ssrLoadModule(`/src/pages/${name}.tsx`)
      const tree = createElement(ExperienceProvider, null, createElement(mod.default))
      const out = renderToString(tree)
      check(`${name} renders`, out.length > 200)
    } catch (error) {
      check(`${name} renders`, false)
      console.error(`  ↳ ${name}: ${error?.message ?? error}`)
    }
  }
} finally {
  await server.close()
}

let failed = 0
for (const { name, ok } of checks) {
  if (!ok) failed += 1
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`)
}

console.log(`\n${checks.length - failed}/${checks.length} checks passed`)
process.exit(failed === 0 ? 0 : 1)
