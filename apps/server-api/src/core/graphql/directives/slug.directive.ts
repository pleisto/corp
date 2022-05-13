import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils'
import { defaultFieldResolver, GraphQLSchema } from 'graphql'

export function slugDirectiveTransformer(schema: GraphQLSchema, directiveName: string): GraphQLSchema {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: fieldConfig => {
      const slugDirective = getDirective(schema, fieldConfig, directiveName)?.[0]

      if (slugDirective) {
        const { resolve = defaultFieldResolver } = fieldConfig

        // Replace the original resolver with a function that *first* calls
        // the original resolver, then converts its result to upper case
        fieldConfig.resolve = async (source, args, context, info) => {
          const result = await resolve(source, args, context, info)
          if (typeof result === 'number') {
            return `SLUG${result}`
          }
          return result
        }
        return fieldConfig
      }
    }
  })
}
