import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material'
import { ImportProfile } from '../../../saraban/model/importProfile.model';

@Component({
  selector: 'app-dialog-add-import-profile',
  templateUrl: './dialog-add-import-profile.component.html',
  styleUrls: ['./dialog-add-import-profile.component.styl']
})
export class DialogAddImportProfileComponent implements OnInit {
  importProfile = new ImportProfile()

  constructor(
    private _dialogRef: MdDialogRef<DialogAddImportProfileComponent>
  ) { }

  ngOnInit() {
  }

  ok() {
    this._dialogRef.close(this.importProfile)
  }

  close() { 
    this._dialogRef.close() 
  }

}
