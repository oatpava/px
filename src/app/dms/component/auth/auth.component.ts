import { Component, OnInit, OnDestroy, Input } from '@angular/core'

import { Router, ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common'
import { Observable } from 'rxjs/Observable'
import { TdLoadingService } from '@covalent/core'

import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/map'

import { FolderService } from '../../service/folder.service'
import { UserProfileService } from '../../../setting/service/user-profile.service'
import { UserProfile } from '../../../setting/model/user-profile.model'

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
        // console.log('ListFolderComponent ngOnInit this.parentId = '+this.parentId)
        if (!isNaN(params['parentId'])) this.folderId = +params['parentId']
        if (params['name'] !== undefined) { this.dmsHeaderName = params['name'] }
        else { this.dmsHeaderName = 'ระบบจัดเก็บเอกสารฯ' }
      })


    // this.getUser()
    this.getAuthFirst()
    // console.log('this.parentId  = ' + this.folderId)
    // console.log(this.dmsHeaderName)

  }




  getAuth2(userId: number): void {

    console.log('--- getAuth2 ---')
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
    console.log('--- authEvent ---')
    // console.log(data)
    // console.log('length', this.authChange.length)
    let check: boolean = false
    let check2: boolean = false
    if (this.authChange.length == 0) {

      this.authChange.push(data)
    } else {
      for (let i = 0; i < this.authChange.length; i++) {
        if (data.structureID == 0) {
          // console.log('is user ')
          if (this.authChange[i].userID == data.userID && this.authChange[i].submoduleAuthId == data.submoduleAuthId) {
            check = false
            check2 = true
            // console.log('user ซ้ำ')
            this.authChange.splice(i, 1)

          } else {
            check = true
            // console.log('user ไม่ซ้ำ')
            // this.authChange.push(data)
            
          }


        } else {
          // console.log('is structure ')
          if (this.authChange[i].structureID == data.structureID && this.authChange[i].submoduleAuthId == data.submoduleAuthId) {
            // console.log('structure ซ้ำ')
            check = false
            check2 = true
            this.authChange.splice(i, 1)
          } else {
            
            check = true
            // console.log('structure ไม่ซ้ำ')
            // this.authChange.push(data)
             
          }
        }

      }
      if (check) {
        this.authChange.push(data)
        if (check2) { this.authChange.splice(this.authChange.length - 1, 1) }
        // console.log('this.authChange', this.authChange)
      }


    }

    
  }


  // authEvent(data): void {
  //   console.log('--- authEvent ---')
  // console.log(data)
  // console.log('length', this.authChange.length)
  // let check: boolean = false
  // let check2: boolean = false
  // if (this.authChange.length == 0) {
  //     console.log('length 0000')
  //     this.authChange.push(data)
  //   } else {
  //     for(let i = 0; i < this.authChange.length; i++) {

  //       if (this.authChange[i].structureID == data.structureID && this.authChange[i].type == data.type && this.authChange[i].type == 'S') {
  //         console.log('-- structure splice')
  //         check = false
  //         check2 = true
  //         this.authChange.splice(i, 1)
  //       } else {
  //         if (this.authChange[i].userID == data.userID && this.authChange[i].type == data.type && this.authChange[i].type == 'U') {
  //           console.log('--  userID splice')
  //           check = false
  //           check2 = true
  //           this.authChange.splice(i, 1)
  //         } else {
  //           console.log('--2 ')
  //           check = true
  //         }
  //       }

  //     }

  //   if (check) {
  //       this.authChange.push(data)
  //       if (check2) { this.authChange.splice(this.authChange.length - 1, 1) }
  //     }
  //   }

  // console.log('this.authChange', this.authChange)
  // }




  selectUser(data) {
    console.log('--- selectUser ---')
    console.log(data)
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
    console.log('--- save ---')

    for (let i = 0; i < this.authChange.length; i++) {
      // console.log('this.authChange =',this.authChange)

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

            })
          this._loadingService.resolve('main')

        } else {//Structure old update updateAuth
          console.log('update --- ')
          this._loadingService.register('main')
          this._folderService
            .updateAuth(this.authChange[i].submoduleUserAuthId, this.authChange[i].structureID, 0, this.authChange[i].submoduleAuthId, this.folderId, authority)
            .subscribe(response => {

            })
          this._loadingService.resolve('main')

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

            })
          this._loadingService.resolve('main')


        } else { //user auth old update
          this._loadingService.register('main')
          this._folderService
            .updateAuth(this.authChange[i].submoduleUserAuthId, 0, this.authChange[i].userID, this.authChange[i].submoduleAuthId, this.folderId, authority)
            .subscribe(response => {

            })
          this._loadingService.resolve('main')

        }

      }


    }
    this._location.back()



  }

  cancel() {
    console.log('--- cancel ---')
    this._location.back()

  }


  getUser(dataUser: any): void {
    this.dataAuths = []

    // console.log('-- dataUser --')
    // console.log('dataUser', dataUser)
    if (dataUser.type == 'S') {
      // console.log('--structure 0')
      let check = true;
      this.structureId = dataUser.id
      for (let i = 0; i < this.dataAuthsStructure.length; i++) {
        if (this.dataAuthsStructure[i].structureID == dataUser.id) {
          // console.log(this.dataAuthsStructure[i].structureID, dataUser.id)
          // console.log('---a')
          // console.log('--structure 1')
          this.dataAuths.push(this.dataAuthsStructure[i])
          check = false;
          // break;
        }
      }
      if (check) {
        let tempstructureId = 0;
        if (dataUser.nodeLevel > 1) {
          tempstructureId = dataUser.parentId
        } else {
          tempstructureId = dataUser.id
        }
        // console.log('--structure 2')
        // console.log('tempstructureId', tempstructureId)

        this._loadingService.register('main')
        this._folderService
          .listSubmoduleUserAuthOfChildByStructureIdFromTree(tempstructureId, this.folderId, 'dms')//structureId:number,folderId:number,submoduleCode:string
          .subscribe(response => {
            let res = response.data
            // console.log(res)
            // console.log(res.length)
            for (let j = 0; j < res.length; j++) {

              if (res[j].userProfile == null) {//is structure
                for (let i = 0; i < res[j].authority.length; i++) {
                  // console.log('i = ',i)
                  let temp: any[] = []
                  temp["submoduleAuthId"] = res[j].authority[i].submoduleAuth.id;
                  temp["name"] = res[j].authority[i].submoduleAuth.auth.authName;
                  temp["type"] = 'S'
                  temp["structureID"] = res[j].structure.id
                  temp["userID"] = 0
                  temp["structureName"] = res[j].structure.name
                  temp["submoduleUserAuthId"] = res[j].authority[i].id;

                  // console.log(res[j].authority)
                  if (res[j].authority[i].authority == '1') {
                    temp["auth"] = true
                  } else {
                    temp["auth"] = false
                  }
                  temp["color"] = "#00FF00"
                  // this.dataAuths.push(temp);
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

                // console.log('--structure 2')
                // console.log('---b')
                // break;
              }
            }
            this._loadingService.resolve('main')
          })

        // this._loadingService.resolve('main')
      }


    }
    if (dataUser.type == 'U') {
      let check = true;
      this.structureId = dataUser.structure.id
      for (let i = 0; i < this.dataAuthsUser.length; i++) {
        if (this.dataAuthsUser[i].userID == dataUser.id) {
          // console.log('--user 1')
          this.dataAuths.push(this.dataAuthsUser[i])
          check = false;
          // break;
        }
      }
      if (check) {
        // console.log('--user 2')
        this._loadingService.register('main')
        this._folderService
          .listSubmoduleUserAuthOfChildByStructureIdFromTree(dataUser.structure.id, this.folderId, 'dms')//structureId:number,folderId:number,submoduleCode:string
          .subscribe(response => {
            let res = response.data
            // console.log(res)
            // console.log(res.length)
            for (let j = 0; j < res.length; j++) {

              if (res[j].userProfile == null) {//is structure
                // console.log('---is structure')
                for (let i = 0; i < res[j].authority.length; i++) {
                  // console.log('i = ',i)
                  let temp: any[] = []
                  temp["submoduleAuthId"] = res[j].authority[i].submoduleAuth.id;
                  temp["name"] = res[j].authority[i].submoduleAuth.auth.authName;
                  temp["type"] = 'S'
                  temp["structureID"] = res[j].structure.id
                  temp["userID"] = 0
                  temp["structureName"] = res[j].structure.name
                  temp["submoduleUserAuthId"] = res[j].authority[i].id;
                  // console.log(res[j].authority)
                  if (res[j].authority[i].authority == '1') {
                    temp["auth"] = true
                  } else {
                    temp["auth"] = false
                  }
                  temp["color"] = "#00FF00"
                  // this.dataAuths.push(temp);
                  this.dataAuthsStructure.push(temp);
                }

              } else {//is user
                // console.log('---is user')
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
            // console.log('-- dataAuthsStructure', this.dataAuthsStructure)
            // console.log('-- dataAuthsUser 1', this.dataAuthsUser)

            for (let i = 0; i < this.dataAuthsUser.length; i++) {
              if (this.dataAuthsUser[i].userID == dataUser.id) {
                this.dataAuths.push(this.dataAuthsUser[i])

                // break;
              }
            }
            this._loadingService.resolve('main')
          })



      }

    }


    // console.log('dataAuths', this.dataAuths)
    // console.log('structureId', this.structureId)
    // console.log('folderId', this.folderId)

  }

  getAuthFirst() {
    // console.log('-- getAuthFirst --')
    this._loadingService.register('main')
    this._folderService
      .listSubmoduleUserAuthOfChildByStructureIdFromTree(1, this.folderId, 'dms')//structureId:number,folderId:number,submoduleCode:string
      .subscribe(response => {
        let res = response.data
        // console.log(res)
        // console.log(res.length)
        for (let j = 0; j < res.length; j++) {

          if (res[j].userProfile == null) {//is structure
            for (let i = 0; i < res[j].authority.length; i++) {
              // console.log('i = ',i)
              let temp: any[] = []
              temp["submoduleAuthId"] = res[j].authority[i].submoduleAuth.id;
              temp["name"] = res[j].authority[i].submoduleAuth.auth.authName;
              temp["type"] = 'S'
              temp["structureID"] = res[j].structure.id
              temp["userID"] = 0
              temp["structureName"] = res[j].structure.name
              temp["submoduleUserAuthId"] = res[j].authority[i].id;
              // console.log(res[j].authority)
              if (res[j].authority[i].authority == '1') {
                temp["auth"] = true
              } else {
                temp["auth"] = false
              }
              temp["color"] = "#00FF00"
              // this.dataAuths.push(temp);
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
        // console.log('-- dataAuthsStructure', this.dataAuthsStructure)
        // console.log('-- dataAuthsUser 2', this.dataAuthsUser)
        this._loadingService.resolve('main')
      })


  }

}
