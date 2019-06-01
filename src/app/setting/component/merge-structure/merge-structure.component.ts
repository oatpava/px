import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common'
import { Observable } from 'rxjs/Observable'
import { TdLoadingService } from '@covalent/core'
import { StepState } from '@covalent/core';
import 'rxjs/add/operator/switchMap'

import { Structure } from '../../model/structure.model'
import { StructureService } from '../structure/structure.service'

import { MdDialog, MdDialogRef } from '@angular/material'
import { UserProfileService } from '../../service/user-profile.service'

@Component({
  selector: 'app-merge-structure',
  templateUrl: './merge-structure.component.html',
  styleUrls: ['./merge-structure.component.styl'],
  providers: [UserProfileService, StructureService]
})
export class MergeStructureComponent implements OnInit {
  structureId: number
  dataUserOld: Structure
  dataNew: Structure
  data: any
  name: boolean = false
  code: boolean = false
  detail: boolean = false
  shortName: boolean = false
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _location: Location,
    private _userProfileService: UserProfileService,
    private _structureService: StructureService,
    public dialogRef: MdDialogRef<MergeStructureComponent>
  ) { }

  ngOnInit() {
    console.log(this.data)
  }

  close(): void {
    this.dialogRef.close()
  }



}
