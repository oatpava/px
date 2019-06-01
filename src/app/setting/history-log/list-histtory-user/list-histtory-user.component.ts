import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common'
import { Observable } from 'rxjs/Observable'
import { TdLoadingService } from '@covalent/core'
import { StepState } from '@covalent/core'
import 'rxjs/add/operator/switchMap'

import { MdDialog, MdDialogRef } from '@angular/material'

@Component({
  selector: 'app-list-histtory-user',
  templateUrl: './list-histtory-user.component.html',
  styleUrls: ['./list-histtory-user.component.styl']
})
export class ListHisttoryUserComponent implements OnInit {
  selectStructureData: any
  constructor(
    public dialogRef: MdDialogRef<ListHisttoryUserComponent>
  ) { }

  ngOnInit() {
  }

  selectStructure(event) {
    this.selectStructureData = event
  }

  selectMove(){
    console.log(this.selectStructureData)
    this.dialogRef.close(this.selectStructureData)
  }

  close(): void {
    this.dialogRef.close(false)
  }

}
