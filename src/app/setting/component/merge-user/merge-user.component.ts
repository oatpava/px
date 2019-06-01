import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common'
import { Observable } from 'rxjs/Observable'
import { TdLoadingService } from '@covalent/core'
import { StepState } from '@covalent/core';
import 'rxjs/add/operator/switchMap'

import { Structure } from '../../model/structure.model'

import { MdDialog, MdDialogRef } from '@angular/material'
import { UserProfileService } from '../../service/user-profile.service'
import { UserProfile } from '../../../shared/index'
import { resetFakeAsyncZone } from '@angular/core/testing';

@Component({
  selector: 'app-merge-user',
  templateUrl: './merge-user.component.html',
  styleUrls: ['./merge-user.component.styl'],
  providers: [UserProfileService]
})
export class MergeUserComponent implements OnInit {
  userProfileId: number
  structureId: number
  data: any
  dataUserOld: UserProfile
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _location: Location,
    private _userProfileService: UserProfileService,
    public dialogRef: MdDialogRef<MergeUserComponent>
  ) { }

  ngOnInit() {
    console.log(this.data)
  }

  close(): void {
    this.dialogRef.close()
  }
}
