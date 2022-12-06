export interface User {
    id?: string,
    email?: string
}

export interface UserExtraData extends User {
    username?: string,
    name?:string,
    firstName?:string,
    thumbnail?: {
        url:string,
        alt:string
    },
    poblacion?: string,
    provincia?: string,
    phone?:string,
    about_me?:string
}

//SERVER RESPONSE EXAMPLE:
//     "id": "2",
//     "email": "nvega@birt.eus",
//     "username": null,
//     "pass": "3e6c7d141e32189c917761138b026b74",
//     "verificado": "0",
//     "name": null,
//     "firstName": null,
//     "phone": null,
//     "provincia": null,
//     "poblacion": null,
//     "about_me": null,
//     "activacion_codigo": "2022120511425538747",
//     "recuperacion_codigo": null,
//     "created_at": "2022-12-05 11:42:55",
//     "updated_at": "2022-12-05 11:42:55",
//     "deleted_at": null