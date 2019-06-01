import { Structure } from './structure.model'

export class StructureConvert {
	version: number
    id: number
    status: number // (1=เพิ่ม,2=ลบ,3=แก้ไข)
    structure: Structure
    vStructure: Structure
    constructor(values: Object = {}) {
        this.version = 1
        this.id = 1
        this.status = 0
        this.structure = new Structure 
        this.vStructure = new Structure 
        Object.assign(this, values)
    }

}