export interface UserCredentialInput<T = Record<string, any>> {
  provider: string
  subject: string
  name: string
  avatarUrl: string | null
  bio: string | null
  locale: string | null
  meta: T
}

export interface PodAccessCredentialSchema<T = Record<string, any>> {
  podType: string
  podId: number
  provider: string
  subject: string
  meta: T
}
