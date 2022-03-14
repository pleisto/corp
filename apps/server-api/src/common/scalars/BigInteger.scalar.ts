import { Scalar, CustomScalar } from '@nestjs/graphql'
import { Kind, ValueNode } from 'graphql'

@Scalar('BigInteger')
export class BigInteger implements CustomScalar<String, BigInt> {
  description = 'BigInt scalar type'

  parseValue(value: unknown): BigInt {
    return BigInt(value as string)
  }

  serialize(value: unknown): string {
    return (value as BigInt).toString()
  }

  parseLiteral(ast: ValueNode): BigInt {
    if (ast.kind === Kind.STRING || ast.kind === Kind.BOOLEAN || ast.kind === Kind.INT) {
      return BigInt(ast.value)
    }

    return BigInt('')
  }
}
