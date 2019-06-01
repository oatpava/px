// import { User } from './user.model'
import { User } from '../../model/user.model'

export const USERS: User[] = [
    {
        version: 1,
        id: 1,
        name: 'test',
        passwords: 'test1234',
        activeDate: '11/11/2556',
        expireDate: null,
        passwordExpireDate: null,
        status:null

    },{
        version: 1,
        id: 2,
        name: 'texi',
        passwords: 'texi1234',
        activeDate: '11/11/2555',
        expireDate: null,
        passwordExpireDate: null,
        status:null
    },
    {
        version: 1,
        id: 3,
        name: 'admin',
        passwords: '1234',
        activeDate: '11/11/2555',
        expireDate: null,
        passwordExpireDate: null,
        status:null
    },
]