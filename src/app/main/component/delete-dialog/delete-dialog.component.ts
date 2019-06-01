import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common'
import { Observable } from 'rxjs/Observable'
import { TdLoadingService } from '@covalent/core'
import 'rxjs/add/operator/switchMap'
import { MdDialog, MdDialogRef } from '@angular/material'

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.styl']
})
export class DeleteDialogComponent implements OnInit {
  dataName: string
  title: string = 'ลบ'
  parentId: number
  menuType: string
  folderId: number
  mode: string
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _location: Location,
    public dialogRef: MdDialogRef<DeleteDialogComponent>
  ) { }

  ngOnInit() {
    console.log('DeleteDialogComponent');
  }

  ok(): void {
    this.dialogRef.close(true);
  }
  cancel(): void {
    this.dialogRef.close(false);
  }

}
