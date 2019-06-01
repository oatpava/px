import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common'
import { Observable } from 'rxjs/Observable'
import { TdLoadingService } from '@covalent/core'
import { TreeModule, TreeNode, Message } from 'primeng/primeng';
import 'rxjs/add/operator/switchMap'

import { MdDialog, MdDialogRef } from '@angular/material'

@Component({
  selector: 'app-alert-message',
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.styl']
})
export class AlertMessageComponent implements OnInit {
  message : String

  constructor(
    public dialogRef: MdDialogRef<AlertMessageComponent>
  ) { }

  ngOnInit() {
  }

  close(): void {
    this.dialogRef.close();
  }

}
