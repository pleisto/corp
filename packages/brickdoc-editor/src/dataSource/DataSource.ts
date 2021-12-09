export interface Database {
  // define data here

  // file upload
  prepareFileUpload: (
    blockId: string,
    type: 'image' | 'pdf',
    file: any
  ) => Promise<{ endpoint: string; headers: Record<string, any>; blobKey: string; signedId: string; downloadUrl: string; viewUrl: string }>

  // block blobs
  blobs: {
    [blockKey: string]: Array<{
      key: string
      url: string
    }>
  }
}

export class DataSource {
  private database: Database = {
    blobs: {},
    prepareFileUpload() {
      throw new Error('prepare file upload unimplement.')
    }
  }

  public source(): Database {
    return this.database
  }

  public merge(dataSource: DataSource): void {
    this.database = {
      ...this.source(),
      ...dataSource.source()
    }
  }

  get blobs(): Database['blobs'] {
    return this.database.blobs
  }

  set blobs(value: Database['blobs']) {
    this.database.blobs = value
  }

  get prepareFileUpload(): Database['prepareFileUpload'] {
    return this.database.prepareFileUpload
  }

  set prepareFileUpload(value: Database['prepareFileUpload']) {
    this.database.prepareFileUpload = value
  }
}
