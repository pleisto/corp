import {
  useFormulaCommitMutation,
  GetFormulasDocument,
  GetFormulasQueryVariables as Variables,
  GetFormulasQuery as Query
} from '@/BrickdocGraphQL'
import { BackendActions } from '@brickdoc/formula'
import { useImperativeQuery } from '@/common/hooks'

interface useFormulaActionsResult {
  commitFormula: BackendActions['commit']
  queryFormulas: (
    domain: string,
    ids?: string | undefined
  ) => Promise<{
    success: boolean
    data: Query['formulas']
  }>
}

export function useFormulaActions(): useFormulaActionsResult {
  const [commitFormula] = useFormulaCommitMutation()
  const query = useImperativeQuery<Query, Variables>(GetFormulasDocument)

  return {
    commitFormula: async (commitFormulas, deleteFormulas) => {
      const { errors } = await commitFormula({ variables: { input: { commitFormulas, deleteFormulas } } })

      return {
        success: !errors || errors.length === 0
      }
    },

    queryFormulas: async (domain: string, ids?: string) => {
      const { data, error } = await query(ids ? { domain, ids } : { domain })
      return { success: !error, data: data.formulas }
    }
  }
}
