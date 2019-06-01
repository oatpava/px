export class Document {
  version: number
  removedDate:string
  updatedDate:string
  userProfileCreate:any
  userProfileUpdate:any
  userProfileDel:any
  id: number
  createdDate: any
  createdBy: number
  removedBy: number
  updatedBy: number
  // updatedDate:string
  // updatedBy:number
  documentPublicDate: any
  documentExpireDate: any
  documentDate01: any
  documentDate02: any
  documentDate03: any
  documentDate04: any
  documentTypeId: number
  documentName: string
  documentPublicStatus: string
  documentFolderId: number
  documentFloat01: number
  documentFloat02: number
  documentVarchar01: string
  documentVarchar02: string
  documentVarchar03: string
  documentVarchar04: string
  documentVarchar05: string
  documentVarchar06: string
  documentVarchar07: string
  documentVarchar08: string
  documentVarchar09: string
  documentVarchar10: string
  documentText01: string
  documentText02: string
  documentText03: string
  documentText04: string
  documentText05: string
  documentInt01: number
  documentInt02: number
  documentInt03: number
  documentInt04: number
  dmsDocumentIntComma: number
  dmsDocumentSec: number
  expType: string
  expNumber: number
  wfTypeId:number
  fullPathName:string
  
  // createdName: string

  constructor(values: Object = {}) {
      // this.version = 1
      this.id = null
      this.createdDate = null
      this.createdBy = 0
      this.removedBy = 0
      this.updatedBy = 0
      this.documentPublicDate = null
      this.documentExpireDate = null
      this.documentDate01 = null
      this.documentDate02 = null
      this.documentDate03 = null
      this.documentDate04 = null
      this.documentTypeId = 1
      this.documentName = null
      this.documentPublicStatus = null
      this.documentFolderId = 0
      this.documentFloat01 = null
      this.documentFloat02 = null
      this.documentVarchar01 = null
      this.documentVarchar02 = null
      this.documentVarchar03 = null
      this.documentVarchar04 = null
      this.documentVarchar05 = null
      this.documentVarchar06 = null
      this.documentVarchar07 = null
      this.documentVarchar08 = null
      this.documentVarchar09 = null
      this.documentVarchar10 = null
      this.documentText01 = null
      this.documentText02 = null
      this.documentText03 = null
      this.documentText04 = null
      this.documentText05 = null
      this.documentInt01 = null
      this.documentInt02 = null
      this.documentInt03 = null
      this.documentInt04 = null
      this.dmsDocumentIntComma = null
      this.dmsDocumentSec = null
      this.expType = null
      this.expNumber = null
      this.wfTypeId = 0
      this.fullPathName=''
      // this.createdName = null
      this.userProfileCreate = {
      "id": 1,
      "structure": {
        "id": 1,
        "name": "โครงสร้างหน่วยงาน",
        "detail": null,
        "code": null,
        "nodeLevel": 0,
        "parentId": 0,
        "parentKey": "฿1฿"
      },
      "fullName": "ผู้ดูแลระบบ",
      "email": null,
      "tel": null,
      "address": null,
      "position": null
    }

    this.userProfileUpdate  = {
      "id": 1,
      "structure": {
        "id": 1,
        "name": "โครงสร้างหน่วยงาน",
        "detail": null,
        "code": null,
        "nodeLevel": 0,
        "parentId": 0,
        "parentKey": "฿1฿"
      },
      "fullName": "ผู้ดูแลระบบ",
      "email": null,
      "tel": null,
      "address": null,
      "position": null
    }
      Object.assign(this, values)
  }

}
