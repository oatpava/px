export class SarabanContent_get {
    wfContentNo: string
    wfContentYear: number
    wfContentPoint: number
    wfContentNumber: number
    wfFolderPre: string
    
    constructor(values: Object = {}) {
        this.wfContentNo = ""
        this.wfContentYear = new Date().getFullYear() + 543
        this.wfContentPoint = 0
        this.wfContentNumber = 1
        this.wfFolderPre = ""
        Object.assign(this, values)
    }
}