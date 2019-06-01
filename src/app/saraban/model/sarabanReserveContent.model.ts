export class SarabanReserveContent {
    version: number
    id: number
    reserveContentNoStatus: number
    reserveContentNoFolderId: number
    reserveContentNoContentNo: string
    reserveContentNoContentDate: string
    reserveContentNoContentTime: string
    reserveContentNoUserId: number
    reserveContentNoContentYear: number
    reserveContentNoContentNumber: number
    reserveContentNoNote: string
    reserveContentNoUserName: string

    constructor(values: Object = {}) {
        this.version = 1
        this.id = 0
        this.reserveContentNoStatus = 0
        this.reserveContentNoFolderId = 0
        this.reserveContentNoContentNo = ""
        this.reserveContentNoContentDate = ""
        this.reserveContentNoContentTime = ""
        this.reserveContentNoUserId = 0
        this.reserveContentNoContentYear = 2560
        this.reserveContentNoContentNumber = 0
        this.reserveContentNoNote = ""
        this.reserveContentNoUserName = ""
    }
}