export class WfDocumentType {
    version: number
    id: number
    name: string
    detail: string
    code: string = ''
    nodeLevel: number = 1
    parentId: number = 0
    parentKey: string
}