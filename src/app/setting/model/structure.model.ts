export class StructureConvertModel {
    status: number
    structure: Structure
    vStructure: VStructureModel

    constructor(values: Object = {}) {
        this.status = 1
        this.structure = new Structure()
        this.vStructure = new VStructureModel()
        Object.assign(this, values)
    }
}

export class Structure {
    version: number
    id: number
    name: string
    shortName: string
    detail: string
    code: string
    nodeLevel: number
    parentId: number
    parentKey: string
    constructor(values: Object = {}) {
        this.version = 1
        this.id = 1,
        this.name = "",
        this.shortName = "",
        this.detail = "",
        this.code = "",
        this.nodeLevel = 0,
        this.parentId = 0,
        this.parentKey = "฿0฿"
        Object.assign(this, values)
    }

}
export class VStructureModel {
    version: number
    id: number
    name: string
    shortName: string
    detail: string
    code: string
}





