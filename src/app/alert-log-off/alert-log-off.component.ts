import { Component, OnInit } from '@angular/core'
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
  selector: 'px-alert-log-off',
  templateUrl: './alert-log-off.component.html',
  styleUrls: ['./alert-log-off.component.styl']
})
export class AlertLogOffComponent implements OnInit {

  constructor(
    public dialogRef: MdDialogRef<AlertLogOffComponent>
  ) { }

  ngOnInit() {
    
  }


  close() {
    this.dialogRef.close();
  }

}
