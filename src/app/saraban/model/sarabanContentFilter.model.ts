export class SarabanContentFilter {
    version: number
    wfContentFolderId: number
    wfContentContentYear: number
    wfContentContentNo: string
    wfContentStartContentNo: number
    wfContentEndContentNo: number
    wfContentContentStartDate: any
    wfContentContentEndDate: any
    wfContentBookNo: string
    wfContentBookStartDate: any
    wfContentBookEndDate: any
    wfContentFrom: string
    wfContentTo: string
    wfContentTitle: string
    wfContentText01: string
    status: number
    userName: string
    fileAttachText: String
    wfContentDescription: string
    wfContentStr03: string
    sendingStatus: number

    constructor(values: Object = {}) {
        this.version = 1
        this.wfContentFolderId = 1
        this.wfContentContentYear = 0
        this.wfContentContentNo = ''
        this.wfContentStartContentNo = 0
        this.wfContentEndContentNo = 0
        this.wfContentContentStartDate = null
        this.wfContentContentEndDate  = null
        this.wfContentBookNo = ''
        this.wfContentBookStartDate = null
        this.wfContentBookEndDate = null
        this.wfContentFrom = ''
        this.wfContentTo = ''
        this.wfContentTitle = ''
        this.wfContentText01 = ''
        this.status = 0
        this.userName = ''
        this.fileAttachText = ''
        this.wfContentDescription = ''
        this.wfContentStr03 = ''
        this.sendingStatus = 0
        Object.assign(this, values)
    }
}