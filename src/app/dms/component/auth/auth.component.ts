import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common'
import { TdLoadingService } from '@covalent/core'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/map'
import { FolderService } from '../../service/folder.service'
import { UserProfileService } from '../../../setting/service/user-profile.service'

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.styl'],
  providers: [FolderService, UserProfileService],
})
export class AuthComponent implements OnInit {
  auths: any[] = []
  dataAuths: any[] = []
  dataAuthsStructure: any[] = []
  dataAuthsUser: any[] = []
  dataUser: any[] = []
  on: boolean = true
  currentCompany: string = ''
  listMenu: string = 'menu'
  ModeSearch: boolean = true
  folderId: number
  authChange: any[] = []
  dmsHeaderName: string = 'ระบบจัดเก็บเอกสารฯ a'
  structureId: number = 1

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _folderService: FolderService,

    private _location: Location,
  ) { }

  ngOnInit() {
    this._route.params
      .subscribe((params: Params) => {
        if (!isNaN(params['parentId'])) this.folderId = +params['parentId']
        if (params['name'] !== undefined) { this.dmsHeaderName = params['name'] }
        else { this.dmsHeaderName = 'ระบบจัดเก็บเอกสารฯ' }
      })
    this.getAuthFirst()
  }

  getAuth2(userId: number): void {
    this.dataAuths = []
    this._loadingService.register('main')
    this._folderService
      .getAuth(userId)
      .subscribe(response => {
        this.auths = response as any[]

        for (let i = 0; i < this.auths[0].authority.length; i++) {
          let temp: any[] = []
          temp["id"] = this.auths[0].authority[i].id;
          temp["name"] = this.auths[0].authority[i].submoduleAuth.auth.authName;
          if (this.auths[0].authority[i].authority == 1) {
            temp["auth"] = true
          } else { temp["auth"] = false }
          temp["color"] = "#00FF00"
          this.dataAuths.push(temp);
        }
        this._loadingService.resolve('main')
      })
  }

  authEvent(data): void {
    let check: boolean = false
    let check2: boolean = false
    if (this.authChange.length == 0) {
      this.authChange.push(data)
    } else {
      for (let i = 0; i < this.authChange.length; i++) {
        if (data.structureID == 0) {
          if (this.authChange[i].userID == data.userID && this.authChange[i].submoduleAuthId == data.submoduleAuthId) {
            check = false
            check2 = true
            this.authChange.splice(i, 1)
          } else {
            check = true
          }
        } else {
          if (this.authChange[i].structureID == data.structureID && this.authChange[i].submoduleAuthId == data.submoduleAuthId) {
            check = false
            check2 = true
            this.authChange.splice(i, 1)
          } else {
            check = true
          }
        }
      }
      if (check) {
        this.authChange.push(data)
        if (check2) { this.authChange.splice(this.authChange.length - 1, 1) }
      }
    }
  }

  selectUser(data) {
    this.currentCompany = data.name
  }

  goBack() {
    this._location.back()
  }

  hoverMenuEdit: boolean = true
  overMenu(value: string) {
    this.hoverMenuEdit = false
    this.listMenu = 'keyboard_arrow_up'
  }
  leaveMenu() {
    this.hoverMenuEdit = true
    this.listMenu = 'menu'
  }

  save() {
    for (let i = 0; i < this.authChange.length; i++) {

      if (this.authChange[i].type == 'S') {
        let authority = '2'
        if (this.authChange[i].auth == true) {
          authority = '1'
        }

        if (this.authChange[i].submoduleUserAuthId < 0) {//Structure auth new create
          this._loadingService.register('main')
          this._folderService
            .addAuth(this.authChange[i].structureID, 0, this.authChange[i].submoduleAuthId, this.folderId, authority)
            .subscribe(response => {
              this._loadingService.resolve('main')
            })
        } else {//Structure old update updateAuth
          this._loadingService.register('main')
          this._folderService
            .updateAuth(this.authChange[i].submoduleUserAuthId, this.authChange[i].structureID, 0, this.authChange[i].submoduleAuthId, this.folderId, authority)
            .subscribe(response => {
              this._loadingService.resolve('main')
            })
        }
      } else {
        let authority = '2'
        if (this.authChange[i].auth == true) {
          authority = '1'
        }

        if (this.authChange[i].submoduleUserAuthId < 0) {//user auth new create
          this._loadingService.register('main')
          this._folderService
            .addAuth(0, this.authChange[i].userID, this.authChange[i].submoduleAuthId, this.folderId, authority)
            .subscribe(response => {
              this._loadingService.resolve('main')
            })
        } else { //user auth old update
          this._loadingService.register('main')
          this._folderService
            .updateAuth(this.authChange[i].submoduleUserAuthId, 0, this.authChange[i].userID, this.authChange[i].submoduleAuthId, this.folderId, authority)
            .subscribe(response => {
              this._loadingService.resolve('main')
            })
        }
      }
    }
    this._location.back()
  }

  cancel() {
    this._location.back()
  }

  getUser(dataUser: any): void {
    this.dataAuths = []
    if (dataUser.type == 'S') {
      let check = true;
      this.structureId = dataUser.id
      for (let i = 0; i < this.dataAuthsStructure.length; i++) {
        if (this.dataAuthsStructure[i].structureID == dataUser.id) {
          this.dataAuths.push(this.dataAuthsStructure[i])
          check = false;
        }
      }
      if (check) {
        let tempstructureId = 0;
        if (dataUser.nodeLevel > 1) {
          tempstructureId = dataUser.parentId
        } else {
          tempstructureId = dataUser.id
        }

        this._loadingService.register('main')
        this._folderService
          .listSubmoduleUserAuthOfChildByStructureIdFromTree(tempstructureId, this.folderId, 'dms')//structureId:number,folderId:number,submoduleCode:string
          .subscribe(response => {
            let res = response.data
            for (let j = 0; j < res.length; j++) {

              if (res[j].userProfile == null) {//is structure
                for (let i = 0; i < res[j].authority.length; i++) {
                  let temp: any[] = []
                  temp["submoduleAuthId"] = res[j].authority[i].submoduleAuth.id;
                  temp["name"] = res[j].authority[i].submoduleAuth.auth.authName;
                  temp["type"] = 'S'
                  temp["structureID"] = res[j].structure.id
                  temp["userID"] = 0
                  temp["structureName"] = res[j].structure.name
                  temp["submoduleUserAuthId"] = res[j].authority[i].id;

                  if (res[j].authority[i].authority == '1') {
                    temp["auth"] = true
                  } else {
                    temp["auth"] = false
                  }
                  temp["color"] = "#00FF00"
                  this.dataAuthsStructure.push(temp);
                }
              } else {//is user
                for (let i = 0; i < res[j].authority.length; i++) {
                  let temp: any[] = []
                  temp["submoduleAuthId"] = res[j].authority[i].submoduleAuth.id;
                  temp["name"] = res[j].authority[i].submoduleAuth.auth.authName;
                  temp["type"] = 'U'
                  temp["userID"] = res[j].userProfile.id
                  temp["structureID"] = 0
                  temp["userName"] = res[j].userProfile.fullName
                  temp["submoduleUserAuthId"] = res[j].authority[i].id;
                  if (res[j].authority[i].authority == '1') {
                    temp["auth"] = true
                  } else { temp["auth"] = false }
                  temp["color"] = "#00FF00"
                  this.dataAuthsUser.push(temp);
                }
              }
            }
            for (let i = 0; i < this.dataAuthsStructure.length; i++) {
              if (this.dataAuthsStructure[i].structureID == dataUser.id) {
                this.dataAuths.push(this.dataAuthsStructure[i])
              }
            }
            this._loadingService.resolve('main')
          })
      }
    }
    if (dataUser.type == 'U') {
      let check = true;
      this.structureId = dataUser.structure.id
      for (let i = 0; i < this.dataAuthsUser.length; i++) {
        if (this.dataAuthsUser[i].userID == dataUser.id) {
          this.dataAuths.push(this.dataAuthsUser[i])
          check = false;
        }
      }
      if (check) {
        this._loadingService.register('main')
        this._folderService
          .listSubmoduleUserAuthOfChildByStructureIdFromTree(dataUser.structure.id, this.folderId, 'dms')//structureId:number,folderId:number,submoduleCode:string
          .subscribe(response => {
            let res = response.data
            for (let j = 0; j < res.length; j++) {

              if (res[j].userProfile == null) {//is structure
                for (let i = 0; i < res[j].authority.length; i++) {
                  let temp: any[] = []
                  temp["submoduleAuthId"] = res[j].authority[i].submoduleAuth.id;
                  temp["name"] = res[j].authority[i].submoduleAuth.auth.authName;
                  temp["type"] = 'S'
                  temp["structureID"] = res[j].structure.id
                  temp["userID"] = 0
                  temp["structureName"] = res[j].structure.name
                  temp["submoduleUserAuthId"] = res[j].authority[i].id;
                  if (res[j].authority[i].authority == '1') {
                    temp["auth"] = true
                  } else {
                    temp["auth"] = false
                  }
                  temp["color"] = "#00FF00"
                  this.dataAuthsStructure.push(temp);
                }
              } else {//is user
                for (let i = 0; i < res[j].authority.length; i++) {
                  let temp: any[] = []
                  temp["submoduleAuthId"] = res[j].authority[i].submoduleAuth.id;
                  temp["name"] = res[j].authority[i].submoduleAuth.auth.authName;
                  temp["type"] = 'U'
                  temp["userID"] = res[j].userProfile.id
                  temp["structureID"] = 0
                  temp["userName"] = res[j].userProfile.fullName
                  temp["submoduleUserAuthId"] = res[j].authority[i].id;
                  if (res[j].authority[i].authority == '1') {
                    temp["auth"] = true
                  } else { temp["auth"] = false }
                  temp["color"] = "#00FF00"
                  this.dataAuthsUser.push(temp);
                }
              }
            }
            for (let i = 0; i < this.dataAuthsUser.length; i++) {
              if (this.dataAuthsUser[i].userID == dataUser.id) {
                this.dataAuths.push(this.dataAuthsUser[i])
              }
            }
            this._loadingService.resolve('main')
          })
      }
    }
  }

  getAuthFirst() {
    this._loadingService.register('main')
    this._folderService
      .listSubmoduleUserAuthOfChildByStructureIdFromTree(1, this.folderId, 'dms')//structureId:number,folderId:number,submoduleCode:string
      .subscribe(response => {
        let res = response.data
        for (let j = 0; j < res.length; j++) {

          if (res[j].userProfile == null) {//is structure
            for (let i = 0; i < res[j].authority.length; i++) {
              let temp: any[] = []
              temp["submoduleAuthId"] = res[j].authority[i].submoduleAuth.id;
              temp["name"] = res[j].authority[i].submoduleAuth.auth.authName;
              temp["type"] = 'S'
              temp["structureID"] = res[j].structure.id
              temp["userID"] = 0
              temp["structureName"] = res[j].structure.name
              temp["submoduleUserAuthId"] = res[j].authority[i].id;
              if (res[j].authority[i].authority == '1') {
                temp["auth"] = true
              } else {
                temp["auth"] = false
              }
              temp["color"] = "#00FF00"
              this.dataAuthsStructure.push(temp);
            }
          } else {//is user
            for (let i = 0; i < res[j].authority.length; i++) {
              let temp: any[] = []
              temp["submoduleAuthId"] = res[j].authority[i].submoduleAuth.id;
              temp["name"] = res[j].authority[i].submoduleAuth.auth.authName;
              temp["type"] = 'U'
              temp["userID"] = res[j].userProfile.id
              temp["structureID"] = 0
              temp["userName"] = res[j].userProfile.fullName
              temp["submoduleUserAuthId"] = res[j].authority[i].id;
              if (res[j].authority[i].authority == '1') {
                temp["auth"] = true
              } else { temp["auth"] = false }
              temp["color"] = "#00FF00"
              this.dataAuthsUser.push(temp);
            }
          }
        }
        this._loadingService.resolve('main')
      })
  }

}
