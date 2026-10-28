import type { AppContext } from '@slidev/types'
import deck from '../docs/deck.json'
// Stop ordinary forward navigation at the end of the talk. Explicit Q&A links,
// direct page URLs and print/export routes remain available.
export default ({ router }: AppContext) => {
  router.beforeEach((to, from) => {
    const n = (path: string) => Number(path.match(/\/(\d+)\/?$/)?.[1])
    if (n(from.path) === deck.mainCount && n(to.path) === deck.appendixStart
        && !to.query.appendix && !to.query.print && !from.query.print)
      return false
  })
}
