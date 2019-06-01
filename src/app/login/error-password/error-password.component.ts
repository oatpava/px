import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common'
import { Observable } from 'rxjs/Observable'
import { TdLoadingService } from '@covalent/core'
import { TreeModule, TreeNode, Message } from 'primeng/primeng';
import 'rxjs/add/operator/switchMap'

import { MdDialog, MdDialogRef } from '@angular/material'

@Component({
  selector: 'app-error-password',
  templateUrl: './error-password.component.html',
  styleUrls: ['./error-password.component.styl']
})
export class ErrorPasswordComponent implements OnInit {
  message: string = 'คุณกรอก Username และ Password ไม่ถูกต้อง'

  constructor(
    public dialogRef: MdDialogRef<ErrorPasswordComponent>
  ) { }

  ngOnInit( ) {
  }

  close(): void {
    this.dialogRef.close();
  }

}
