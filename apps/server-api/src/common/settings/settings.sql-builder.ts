import { DatabasePool, sql } from '@brickdoc/nestjs-slonik'

/**
 * create or update a setting value on the database
 */
export const createOrUpdateSetting = async (
  dbPool: DatabasePool,
  key: string,
  value: any,
  scope: string
): Promise<boolean> => {
  const encodedValue = JSON.stringify(value)
  const timestampz = new Date().toISOString()
  const result = await dbPool.query(sql`
INSERT Into settings (key, value, scope, created_at, updated_at)
    VALUES (${key}, ${sql.jsonb(encodedValue)}, ${scope}, ${timestampz}, ${timestampz})
ON CONFLICT (key, scope)
    DO UPDATE SET
        value = ${sql.jsonb(encodedValue)}, updated_at = ${timestampz}
`)
  return result.rowCount === 1
}

/**
 * find a setting by key and scope
 * @param dbPool
 * @param key
 * @param scope
 * @returns
 */
export const findSetting = async <T>(dbPool: DatabasePool, key: string, scope: string): Promise<T | undefined> => {
  const result = await dbPool.maybeOne<{ value: string; depth: number }>(sql`
SELECT
    value,
    nlevel (scope) AS depth
FROM
    settings
WHERE
    key = ${key}
    AND (scope @> ${scope})
ORDER BY
    depth DESC
LIMIT 1
`)
  if (!result) return undefined
  return JSON.parse(result.value) as T
}
