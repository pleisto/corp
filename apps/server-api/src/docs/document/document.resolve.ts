import { Resolver, Query, Args, Mutation } from '@nestjs/graphql'
import { Document } from './document.object-type'
import { SyncDocumentInput } from './syncDocumentInput.input-type'
import { SyncDocumentResult } from './syncDocumentResult.object-type'
import { DocumentService } from './document.service'

@Resolver((of: unknown) => Document)
export class DocumentResolver {
  constructor(private readonly documentService: DocumentService) {}


  // TODO: add GqlAuthGuard
  @Query(returns => Document, {
    description: 'Return Document by uuid',
    nullable: true
  })
  async document(@Args('id', { type: () => String }) id: string) {
    const result = await this.documentService.getById(id)
    return result.unwrapOr(null)
  }

  @Mutation(returns => SyncDocumentResult, {
    description: 'Sync Document',
    nullable: true
  })
  async syncDocument(
    @Args('input') input: SyncDocumentInput,
  ) {
    return await this.documentService.syncDocument(input)
  }
}
