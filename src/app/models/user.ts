export interface User {
    id?: number,
    email?: string,
    pass?: string,
    username?: string
}

export interface UserExtraData extends User {
    thumbnail?: {
        url:string,
        alt:string
    },
    location?: string
}