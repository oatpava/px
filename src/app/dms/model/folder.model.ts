export class Folder {
      version: number
      id: number
      folderType: string
      folderParentId: number
      folderParentType: string
      folderParentKey: string
      folderOrderId: number
      folderNodeLevel: number
      createBy: number
      removeBy: number
      upDateBy: number
      folderDescription: string
      folderName: string
      folderTypeExpire: string
      folderTypeExpireNumber: number
      documentTypeId: number
      iconColor: string
      icon: string
      createDate: any
      removeDate: string
      upDateDate: string
      userProfileCreate: any
      dmsUserPreExpire: number
      dmsEmailUserPreExpire: string
      dmsUserProfilePreExpire: any
      isWfFolderFromType: string

      userProfileUpdate: any
      constructor(values: Object = {}) {
            this.version = 1
            this.id = 1
            this.folderType = 'C'
            this.folderParentId = 1
            this.folderParentType = 'C'
            this.folderParentKey = '฿1฿'
            this.folderOrderId = 1
            this.folderNodeLevel = 1
            this.createBy = 0
            this.removeBy = 0
            this.upDateBy = 0
            this.folderDescription = ''
            this.folderName = ''
            this.folderTypeExpire = ''
            this.folderTypeExpireNumber = 0
            this.documentTypeId = 1
            this.iconColor = ''
            this.icon = ''
            this.isWfFolderFromType = 'N'
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

            this.userProfileUpdate = {
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
            this.dmsEmailUserPreExpire = ""

            this.dmsUserProfilePreExpire = {
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
            this.dmsUserPreExpire = 0

            Object.assign(this, values)
      }
}
