import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common'
import { Observable } from 'rxjs/Observable'
import { TdLoadingService } from '@covalent/core'
import 'rxjs/add/operator/switchMap'
import { MdDialog, MdDialogRef } from '@angular/material'


@Component({
  selector: 'app-dialog-move',
  templateUrl: './dialog-move.component.html',
  styleUrls: ['./dialog-move.component.styl'],

})
export class DialogMoveComponent implements OnInit {
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _location: Location,
    public dialogRef: MdDialogRef<DialogMoveComponent>
  ) { }

  ngOnInit() {
    console.log('DialogMoveComponent');
  }

  ok(): void {
    this.dialogRef.close(true);
  }
  cancel(): void {
    this.dialogRef.close(false);
  }

}
