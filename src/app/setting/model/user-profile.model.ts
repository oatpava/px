import { Structure } from './structure.model'
import { Title } from './title.model'
import { UserProfileType } from './user-profile-type.model'
import { Position } from './position.model'
import { PositionType } from './position-type.model'
import { User } from './user.model'
import { UserStatus } from './user-status.model'

export class UserProfile {
    version: number
    id: number
    structure: Structure
    title: Title
    firstName: string
    lastName: string
    fullName: string
    email: string
    userProfileType: UserProfileType
    tel: string
    defaultSelect: number
    firstNameEng: string
    lastNameEng: string
    fullNameEng: string
    idCard: string
    code: string
    address: string
    position: Position
    positionType: PositionType
    digitalKey: string
    user: User
    userStatus: UserStatus
    positionLevel: number

    recentPassword: string

    constructor(values: Object = {}) {
        this.version = 1
        this.id = 0
        this.structure = new Structure()
        this.title = new Title()
        this.firstName = ''
        this.lastName = ''
        this.fullName = ''
        this.email = null
        this.userProfileType = new UserProfileType()
        this.tel = null
        this.defaultSelect = 0
        this.firstNameEng = ''
        this.lastNameEng = ''
        this.fullNameEng = ''
        this.idCard = null
        this.code = null
        this.address = null
        this.position = new Position()
        this.positionType = new PositionType()
        this.digitalKey = null
        this.user = new User()
        this.userStatus = new UserStatus()
        this.positionLevel = 0

        this.recentPassword = ''
        Object.assign(this, values)
    }

}


export class vUserProfile {
    version: number
    id: number
    structure: Structure
    title: Title
    firstName: string
    lastName: string
    fullName: string
    email: string
    userProfileType: UserProfileType
    tel: string
    idCard: string
    firstNameEng: string
    lastNameEng: string
    fullNameEng: string
    code: string
    address: string
    position: Position
    positionType: PositionType
    userStatus: UserStatus
    positionLevel: number

    constructor(values: Object = {}) {
        this.version = 1
        this.id = 0
        this.structure = new Structure()
        this.title = new Title()
        this.firstName = ''
        this.lastName = ''
        this.fullName = ''
        this.email = null
        this.userProfileType = new UserProfileType()
        this.tel = null
        this.idCard = null
        this.firstNameEng = ''
        this.lastNameEng = ''
        this.fullNameEng = ''
        this.code = null
        this.address = null
        this.position = new Position()
        this.positionType = new PositionType()
        this.userStatus = new UserStatus()
        this.positionLevel = 0
        Object.assign(this, values)
    }

}

export class convertUserPorfile {
    status: number
    userProfile: UserProfile
    vUserProfile: vUserProfile

    constructor(values: Object = {}) {
        this.status = 1
        this.userProfile = new UserProfile()
        this.vUserProfile = new vUserProfile()
        Object.assign(this, values)
    }
}