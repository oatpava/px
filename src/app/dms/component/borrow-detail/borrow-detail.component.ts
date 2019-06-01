import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { Location } from '@angular/common'


@Component({
  selector: 'app-borrow-detail',
  templateUrl: './borrow-detail.component.html',
  styleUrls: ['./borrow-detail.component.styl'],
 
})
export class BorrowDetailComponent implements OnInit {
dmsfolderName: string = 'รายละเอียดเอกสาร'


  constructor(
    private _location: Location,
  ) { }

  ngOnInit() {
  }

  goBack() {
    this._location.back()
  }

  cancel() {
    this._location.back()
  }

}
