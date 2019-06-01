import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material'
import { TdLoadingService } from '@covalent/core'

import { UserProfileService } from '../../../../../setting/service/user-profile.service'
import { UserProfile } from '../../../../../setting/model/user-profile.model'

@Component({
  selector: 'app-dialog-search-outsider',
  templateUrl: './dialog-search-outsider.component.html',
  styleUrls: ['./dialog-search-outsider.component.styl'],
  providers: [UserProfileService]
})
export class DialogSearchOutsiderComponent implements OnInit {
  name: string
  selectedUser: UserProfile[]

  datas: { i: number, profile: UserProfile, selected: boolean }[]
  allCheck: boolean
  numCheck: number = 0
  isSearch: boolean
  

  constructor(
    public dialogRef: MdDialogRef<DialogSearchOutsiderComponent>,
    private _loadingService: TdLoadingService,
    private _userProfileService: UserProfileService,
  ) { 
    this.selectedUser = []
    this.datas = []
    this.allCheck = false
    this.numCheck = 0
    this.isSearch = false
  }

  ngOnInit() {
  }

  search() {
    this.isSearch = true
    this.datas = []
    this._loadingService.register('main')
    this._userProfileService
      .searchVUserByName(this.name)
      .subscribe(response => {       
        this._loadingService.resolve('main')
        for (let i=0;i<response.length;i++) {
          this.datas.push({ i: i+1, profile: response[i], selected: false })
        }
      })
  }

  checkAll() {
    this.numCheck = (this.allCheck) ? this.datas.length : 0
    this.datas.forEach(user => {
        user.selected = this.allCheck
    })
  }

  select(check: boolean) {
    (check) ? this.numCheck++ : this.numCheck--
  }

  ok() {
    this.datas.forEach(user => {
      if (user.selected) {
        this.selectedUser.push(user.profile)
      }
    })
    this.dialogRef.close(true)
  }

}
