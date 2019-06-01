export class UserProfileFolder {
    version: number
    id: number
    userProfileId: number
    userProfileFolderName: string
    userProfileFolderLinkId: number
    userProfileFolderType: string
    userProfileFolderDetail: string

    constructor(values: Object = {}) {
        this.version = 1
        this.id = 0
        this.userProfileId = 0
        this.userProfileFolderName = ''
        this.userProfileFolderLinkId = 0
        this.userProfileFolderType = ''
        this.userProfileFolderDetail = ''
        Object.assign(this, values)
    }
}
