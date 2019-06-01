import { User } from './user.model'
import { USERSTATUSS } from './user-status-mock'

export const USERS: User[] = [
    {
        version: 1,
        id: 1,
        name: 'test',
        passwords: 'test1234',
        activeDate: '11/11/2556',
        expireDate: null,
        passwordExpireDate: null,
        status: USERSTATUSS[0]

    },{
        version: 1,
        id: 2,
        name: 'texi',
        passwords: 'texi1234',
        activeDate: '11/11/2555',
        expireDate: null,
        passwordExpireDate: null,
        status: USERSTATUSS[0]
    },
]