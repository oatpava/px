import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.styl']
})
export class AlertDialogComponent implements OnInit {
  message: string = ''
  hide: boolean = false

  constructor(
     public dialogRef: MdDialogRef<AlertDialogComponent>
  ) { }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close()
  }

}
