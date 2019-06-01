export class StructureFolder {
    version: number
    id: number
    structureId: number
    structureFolderName: string
    structureFolderLinkId: number
    structureFolderType: string
    structureFolderDetail: string

    constructor(values: Object = {}) {
        this.version = 1
        this.id = 0
        this.structureId = 0
        this.structureFolderName = ''
        this.structureFolderLinkId = 0
        this.structureFolderType = ''
        this.structureFolderDetail = ''
        Object.assign(this, values)
    }
}
