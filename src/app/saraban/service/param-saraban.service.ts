import { Injectable } from '@angular/core'
import { Message, TreeNode } from 'primeng/primeng'
import { SarabanAuth } from '../model/sarabanAuth.model'
import { Structure } from '../../setting/model/structure.model'
import { ListReturn } from '../../main/model/listReturn.model'
import { Subscription } from 'rxjs/Rx'
import { SarabanFolder } from '../model/sarabanFolder.model'
import { UserProfile } from '../../shared'

@Injectable()
export class ParamSarabanService {
  clientIp: string = ''
  contentNoFormat: string = '000000'
  bookNoFormat: string = '000000'
  orderNoFormat: string = '000'
  shareBookNo: boolean = true
  folder: SarabanFolder

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
  mwp: { fromMwp: boolean, isUser: boolean, id: number, replyTo: number, inboxIndex: number }
  inboxId: number
  inboxFlag: { open: number, action: number, finish: number }
  folderId: number
  folderName: string
  folderParentName: string
  folderIcon: string
  folderType: number
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
  dmsFolderId: number
  dmsFlagCheck: Boolean[]

  contentAuth: SarabanAuth[]
  structureTree: TreeNode[]
  structureTree_filter: TreeNode[]

  externalTree: TreeNode[]
  externalTree_filter: TreeNode[]//for add node(normal + external)

  privateGroupTree: TreeNode[][]

  structureId: number
  structureName: string

  ScanSubscription: Subscription

  inboxPath: string
  //registedContent: SarabanContent
  registedFolder: SarabanFolder
  inboxToContent: boolean

  userProfiles: UserProfile[]
  userProfileIndex: number
  lastSendTo: TreeNode[] = []

  readonly allowedMimeType: any = [
    'image/png',
    'image/jpeg',
    'image/tiff',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ]

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
    return date ? ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + (date.getFullYear() + 543) : ''
  }

  getStringDateTime(date: Date): string {
    let tzoffset = date.getTimezoneOffset() * 60000
    return date ? ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + (date.getFullYear() + 543) +
      " " + (new Date(Date.now() - tzoffset)).toISOString().slice(11, 19) : ''
  }

  getStringDateAny(date: any): string {
    return date ? ("0" + '' + date.date.day).slice(-2) + "/" + ("0" + '' + date.date.month).slice(-2) + "/" + '' + date.date.year : ''
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

  getFolderType(folderTypeId: number, folderTypeId2: number): number {
    if (folderTypeId == 1) {
      if (folderTypeId2 == 2) {
        return 1
      } else if (folderTypeId2 == 3) {
        return 2
      } else {
        return 1//รับ null
      }
    } else if (folderTypeId == 2) {
      if (folderTypeId2 == 2) {
        return 3
      } else if (folderTypeId2 == 3) {
        return 4
      } else {
        return 3//ส่ง null
      }
    }
  }

  findNode(tree: TreeNode[], id: number, isUser: boolean, parentKey: number[]): any {
    let node = null
    let tmp = this.findNodeRecursive(tree.find(node => node.data.id == parentKey[1]), id, isUser, parentKey, parentKey.length - 1, 1)
    if (tmp) {
      node = tmp
    }
    return node
  }

  private findNodeRecursive(node: TreeNode, id: number, isUser: boolean, parentKey: number[], level: number, currentLevel: number): any {
    if (currentLevel != level) {
      currentLevel++
      let childNode = node.children.find(child => (child.data.id == parentKey[currentLevel] && child.leaf == false))
      return this.findNodeRecursive(childNode, id, isUser, parentKey, level, currentLevel)
    } else {
      let result = null
      if (isUser) {
        result = node.children.find(child => (child.data.id == id && child.leaf == true))
      } else {
        result = node
      }
      return result
    }
  }

  genParentNode(structure: any, parentNode: TreeNode): TreeNode {
    let child: TreeNode[] = []
    return {
      label: structure.name,
      icon: "fa-tag",
      leaf: false,
      data: { id: structure.id, userType: 1, name: structure.name, profile: structure, default: false, fav: false, fguId: 0, favIndex: 0 },
      parent: parentNode,
      children: child
    }
  }

  genNode(user: any, parentNode: TreeNode): TreeNode {
    let child: TreeNode[] = []
    return {
      label: user.fullName,
      icon: "fa-user",
      leaf: true,
      data: { id: user.id, userType: 0, name: user.fullName, profile: user, default: false, fav: false, fguId: 0, favIndex: 0 },
      parent: parentNode,
      children: child
    }
  }

}
