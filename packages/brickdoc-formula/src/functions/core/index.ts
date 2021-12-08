import { BaseFunctionClause } from '../..'
import { CORE_OBJECT_CLAUSES } from './object'
import { CORE_STRING_CLAUSES } from './string'
import { CORE_API_CLAUSES } from './api'

export const CORE_CLAUSES: BaseFunctionClause[] = [...CORE_OBJECT_CLAUSES, ...CORE_STRING_CLAUSES, ...CORE_API_CLAUSES]
