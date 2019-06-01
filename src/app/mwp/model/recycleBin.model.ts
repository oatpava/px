export class RecycleBin {
    version: number
    id: number
    createdDate: string
    moduleName: string
    moduleIcon: string
    entityName: string
    description: string
    userProfileName: string
    ipAddress: string

    selected: boolean

    constructor(values: Object = {}) {
        this.version = 0
        this.id = 0
        this.createdDate = ""
        this.moduleName = "หน้าจอส่วนตัว"
        this.moduleIcon = "mwp.png"
        this.entityName = null
        this.description = "ข้อมูลเข้า : ลบรายการ[ระบบสารบรรณฯ]  เรื่อง : string"
        this.userProfileName = "ผู้ดูแลระบบ"
        this.ipAddress = "127.0.0.1"

        this.selected = false
    }
}
