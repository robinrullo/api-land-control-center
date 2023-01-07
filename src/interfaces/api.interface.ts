export interface APIResource {
    name: string
    path: string
    content: any
}

export interface APICollectionResource {
    name: string
    path: string,
    children: APIResource[]
}
