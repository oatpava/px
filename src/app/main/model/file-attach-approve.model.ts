import { UserProfile } from "../../shared"

export class FileAttachApprove {
    version: number
    id: number
    createdDate: string
    fileAttachId: number
    userProfileId: number

    userProfile: UserProfile

    constructor(values: Object = {}) {
        this.version = 1
        this.id = 0
        this.createdDate = null
        this.fileAttachId = 0
        this.userProfileId = 0

        this.userProfile = null
        Object.assign(this, values)
    }
}
