import { Injectable } from '@angular/core'
import { Message, TreeNode } from 'primeng/primeng'
import { SarabanAuth } from '../model/sarabanAuth.model'
import { Structure } from '../../setting/model/structure.model'
import { ListReturn } from '../../main/model/listReturn.model';

@Injectable()
export class ParamSarabanService {
  tmp: string
  tmp2: string
  tmp_i: number
  tmp_b: boolean
  returnToContent: boolean

  isArchive: boolean
  userId: number
  userName: string
  structure: Structure
  sarabanContentId: number
  userProfileTypeId: number

  isContent: boolean//content or myWork
  mwp: { fromMwp: boolean, isUser: boolean, id: number, replyTo: string, inboxIndex: number }
  inboxId: number
  inboxFlag: { open: number, action: number, finish: number }
  folderId: number
  folderName: string
  folderParentName: string
  folderIcon: string
  menuName: string
  menuType: string
  mode: string
  msg: Message

  pathOld: string
  path: string
  searchFilters: any//date to string
  searchFilters_report: any
  searchFilters_tmp: any//not date to date yet
  datas: any[][]
  listReturn: ListReturn[]
  tableFirst: number[]
  barcodeFilter: string[]

  contentAuth: SarabanAuth[]
  structureTree: TreeNode[]
  structureTree_filter: TreeNode[]

  externalTree: TreeNode[]
  externalTree_filter: TreeNode[]//for add node(normal + external)

  privateGroupTree: TreeNode[][]

  structureId: number
  structureName: string

  setMode(mode: string) {
    this.mode = mode
  }

  setAuth(auth: SarabanAuth[]) {
    this.contentAuth = auth
    if (this.isArchive) {
      this.contentAuth[1].auth = false
      this.contentAuth[2].auth = false
      this.contentAuth[3].auth = false
      this.contentAuth[4].auth = false
      this.contentAuth[5].auth = false
      this.contentAuth[6].auth = false
      this.contentAuth[7].auth = false
      this.contentAuth[8].auth = false
    }
  }

  getStringDate(date: Date): string {
    return ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + (date.getFullYear() + 543)
  }

  getStringDateTime(date: Date): string {
    let tzoffset = date.getTimezoneOffset() * 60000
    return ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + (date.getFullYear() + 543) +
      " " + (new Date(Date.now() - tzoffset)).toISOString().slice(11, 19)
  }

  getStringDateAny(date: any): string {
    return ("0" + '' + date.date.day).slice(-2) + "/" + ("0" + '' + date.date.month).slice(-2) + "/" + '' + date.date.year
  }

  genWaitngMsg(action: string): Message {
    return { severity: 'info', summary: 'กำลังดำเนินการ', detail: 'ระบบกำลัง' + action + ' กรุณารอสักครู่' }
  }

  convertParentKey(parentKey: string): number[] {
    let result: number[] = []
    let tmp: string[] = parentKey.split("฿")
    tmp.forEach(key => {
      if (key.length > 0) {
        result.push(+key)
      }
    })
    return result
  }

}
