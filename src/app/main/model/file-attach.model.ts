export class FileAttach {
    version: number
    id: number
    fileAttachName: string
    fileAttachType: string
    fileSize: number
    linkType: string
    linkId: number
    url: string
    thumbnailUrl: string
    urlNoName: string
    referenceId:number
    secrets:number

    constructor(values: Object = {}) {
        this.version = 1
        this.id = 0
        this.fileAttachName = null
        this.fileAttachType = null
        this.fileSize = 0
        this.linkType = null
        this.linkId = null
        this.url = null
        this.thumbnailUrl = null
        this.urlNoName = null
        this.referenceId=0
        this.secrets=1
        Object.assign(this, values)
    }
}
