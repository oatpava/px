import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common'
import { Observable } from 'rxjs/Observable'
import { TdLoadingService } from '@covalent/core'
import 'rxjs/add/operator/switchMap'
import { MdDialog, MdDialogRef } from '@angular/material'
import { FolderService } from '../../service/folder.service'
import { UserProfileService } from '../../../setting/service/user-profile.service'
import { UserProfile } from '../../../setting/model/user-profile.model'
import { TreeModule, TreeNode, Message } from 'primeng/primeng';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.styl'],
   providers: [FolderService],
})
export class ListUserDmsComponent implements OnInit {

  dataUser: any[] = []
  msgs: Message[] = []

  constructor(

    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _location: Location,
     private _folderService: FolderService,
     public dialogRef: MdDialogRef<ListUserDmsComponent>
    
  ) { }

  ngOnInit() {
     console.log('-- List User Component --');
    //  this.getUser();
  }

  getUser(): void {
    // console.log('--- user ---')
    this._loadingService.register('main')
    this._folderService
      .getUser()
      .subscribe(response => {
        //  console.log(response)
        this.dataUser = response as any[]
        
      })
    this._loadingService.resolve('main')
    // console.log(this.dataUser)

  }

  save(name:string): void {
    // console.log(name)
    this.dialogRef.close(name);
  }

  addActorInRole(dataUser: UserProfile): void {
    // console.log('---dataUser --',dataUser)

     this.dialogRef.close(dataUser);
  }
  alertMsg(event) {
    this.msgs = [];
    this.msgs.push(event)
  }

}
