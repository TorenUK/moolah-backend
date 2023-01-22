export type Deal = {
  id: string
  name: string
  description: string
  price?: number
  currency?: string
  url: string
  image: string
  category: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  expiration: Date
}
