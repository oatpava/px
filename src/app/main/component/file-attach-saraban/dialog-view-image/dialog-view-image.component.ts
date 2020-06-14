import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material'

@Component({
  selector: 'app-dialog-view-image',
  templateUrl: './dialog-view-image.component.html',
  styleUrls: ['./dialog-view-image.component.styl']
})
export class DialogViewImageComponent implements OnInit {
  type: string = ''
  url: string = ''
  trimmedName: string = ''

  constructor(
    public dialogRef: MdDialogRef<DialogViewImageComponent>
  ) { }

  ngOnInit() {
  }

  cancel() {
    this.dialogRef.close()
  }

}
