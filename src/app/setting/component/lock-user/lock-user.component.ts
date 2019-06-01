import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common'
import { Observable } from 'rxjs/Observable'
import { TdLoadingService } from '@covalent/core'
import { StepState } from '@covalent/core';
import 'rxjs/add/operator/switchMap'

import { Structure } from '../../model/structure.model'
import { UserStatus } from '../../model/user-status.model'

import { MdDialog, MdDialogRef } from '@angular/material'
import { UserProfileService } from '../../service/user-profile.service'

@Component({
  selector: 'app-lock-user',
  templateUrl: './lock-user.component.html',
  styleUrls: ['./lock-user.component.styl'],
  providers: [UserProfileService]
})
export class LockUserComponent implements OnInit {
  userProfileId: number
  structureId: number
  status: any
  statusData: UserStatus
  // status: UserStatus
  userStatus: UserStatus[] = []
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _location: Location,
    private _userProfileService: UserProfileService,
    public dialogRef: MdDialogRef<LockUserComponent>
  ) { }

  ngOnInit() {
    console.log(this.structureId)
    console.log(this.status)
    this.getUserStatus()
  }

  getUserStatus() {
    this._userProfileService
      .getUserStatus()
      .subscribe(response => {
        console.log(response)
        this.userStatus = response
        this.statusData = this.status.id
      })
  }

  change(event) {
    console.log(event)
    this.status.id = event
  }

  save(status) {
    console.log(status)
    this.dialogRef.close(status)
  }


  close(): void {
    this.dialogRef.close()
  }

}
