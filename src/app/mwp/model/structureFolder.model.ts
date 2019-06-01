export class StructureFolder {
    version: number
    id: number
    structureId: number
    structureFolderName: string
    structureFolderType: string
    structureFolderDetail: string
    structure: {
        structureid: number
        name: string
        detail: string
        code: string
        nodeLevel: number
        parentId: number
        parentKey: string
    }
    createdBy: number
    createdDate: string
    orderNo: number
    removedBy: number
    removedDate: string
    updatedBy: number
    updatedDate: string
}
