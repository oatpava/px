import { ListDepartmentComponent } from '../list-department/list-department.component';
import { MdDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, Params } from '@angular/router'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import { Location } from '@angular/common'
import 'rxjs/add/operator/switchMap'
import { TdLoadingService, TdDialogService } from '@covalent/core';

@Component({
  selector: 'app-detail-department',
  templateUrl: './detail-department.component.html',
  styleUrls: ['./detail-department.component.styl']
})
export class DetailDepartmentComponent implements OnInit {

  iconHeader: String = 'person'
  title: String = 'รายละเอียดหน่วยงาน'
  department: any
  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _location: Location,
    private _dialogService: TdDialogService,
    public dialogRef: MdDialogRef<ListDepartmentComponent>
  ) {
  }

  ngOnInit() {
  }

  goBack() {
    this._location.back()
  }
}
