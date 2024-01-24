import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { PxService } from '../../px.service';
import { TdLoadingService } from '@covalent/core';

@Component({
  selector: 'app-dialog-confirm-password',
  templateUrl: './dialog-confirm-password.component.html',
  styleUrls: ['./dialog-confirm-password.component.styl'],
  providers: [PxService]
})
export class DialogConfirmPasswordComponent implements OnInit {
  title: string = 'ยืนยันรหัสผ่าน'
  returnPasswordOnly: boolean = false
  username: string = ''

  showPassword: boolean = false
  password: string = ''

  constructor(
    public dialogRef: MdDialogRef<DialogConfirmPasswordComponent>,
    private _pxService: PxService,
    private _loadingService: TdLoadingService,
  ) { }

  ngOnInit() {
  }

  ok() {
    if (this.returnPasswordOnly) this.dialogRef.close(this.password)
    else {
      this._loadingService.register('main')
      this._pxService.checkpassword(this.username, this.password).subscribe(response => {
        this._loadingService.resolve('main')
        this.dialogRef.close({ success: response })
      })
    }
  }

  cancel() {
    this.dialogRef.close()
  }

}
