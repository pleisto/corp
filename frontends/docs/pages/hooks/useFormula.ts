import React from 'react'
import {
  useFormulaCreateMutation,
  useFormulaDeleteMutation,
  useFormulaUpdateMutation,
  GetFormulasDocument,
  GetFormulasQueryVariables as Variables,
  GetFormulasQuery as Query
} from '@/BrickdocGraphQL'
import { DocMeta } from '../DocumentContentPage'
import { useImperativeQuery } from '@/common/hooks'

export function useFormula(docMeta: DocMeta) {
  const blockId = React.useRef(docMeta.id)
  const [creation] = useFormulaCreateMutation()
  const [update] = useFormulaUpdateMutation()
  const [deletion] = useFormulaDeleteMutation()
  const query = useImperativeQuery<Query, Variables>(GetFormulasDocument)

  React.useEffect(() => {
    blockId.current = docMeta.id
  }, [docMeta.id])

  return {
    list: async (webid: string) => {
      const { data, error } = await query({ webid })
      return {
        success: !error,
        data: data.formulas
      }
    },
    create: async ({
      id,
      name,
      definition,
      value,
      type
    }: {
      id: string
      type: string
      name: string
      definition: string
      value: string
    }) => {
      if (!blockId.current) return { success: false }

      const { errors } = await creation({
        variables: {
          input: {
            blockId: blockId.current,
            id,
            type,
            name,
            definition,
            view: {},
            dependencyIds: [],
            value
          }
        }
      })

      return {
        success: !errors || errors.length === 0
      }
    },
    update: async ({
      id,
      name,
      definition,
      type,
      value
    }: {
      id: string
      type: string
      name: string
      definition: string
      value: string
    }) => {
      if (!blockId.current) return { success: false }

      const { errors } = await update({
        variables: {
          input: {
            blockId: blockId.current,
            id,
            name,
            type,
            value,
            definition
          }
        }
      })

      return {
        success: !errors || errors.length === 0
      }
    },
    delete: async (id: string) => {
      if (!blockId.current) return { success: false }

      const { errors } = await deletion({
        variables: {
          input: {
            blockId: blockId.current,
            id
          }
        }
      })

      return {
        success: !errors || errors.length === 0
      }
    }
  }
}
