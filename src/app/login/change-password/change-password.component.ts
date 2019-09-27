import { Component, OnInit, Input, trigger, state, animate, transition, style } from '@angular/core'
import { Location } from '@angular/common'
import { Router } from '@angular/router'
import { TdLoadingService } from '@covalent/core'

import { LoginService } from '../login.service'
// import { ChangePasswordService } from '../service/change-password.service'
import { User } from '../../setting/model/user.model'
import { MdDialog, MdDialogRef } from '@angular/material'
import { Http, Response, Headers, RequestOptions } from '@angular/http'
import { coerceBooleanProperty } from '@angular/material/core/coercion/boolean-property';
import { collectAndResolveStyles } from '@angular/platform-browser/src/private_import_core';
import { Message } from 'primeng/primeng';
import { ErrorPasswordComponent } from '../error-password/error-password.component'


// import { AlertMessageComponent } from '../alert-message/alert-message.component'

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.styl'],
  providers: [LoginService],
  animations: [
    trigger('visibleTrigger', [
      state('visible', style({ opacity: '1' })),
      transition('void => *', [style({ opacity: '0' }), animate('200ms 300ms')]),
      transition('* => void', [animate('200ms', style({ opacity: '0' }))])
    ])
  ],
})

export class ChangePasswordComponent implements OnInit {
  title: String = 'เปลี่ยนรหัสผ่าน'
  user: User
  user2: User
  private _headers: Headers
  log = ''
  oldpassword = ''
  newpassword = ''
  chackPass: boolean = false;
  // newOrganizes: any = []

  msgs: Message[] = []
  constructor(
    private _router: Router,
    private _loadingService: TdLoadingService,
    // private _passService: ChangePasswordService,
    private _loginService: LoginService,
    private _location: Location,
    public dialogRef: MdDialogRef<ChangePasswordComponent>,
    private _dialog: MdDialog,
  ) {
    this.user = new User()
    this.user2 = new User()
    // this.user.password = null
  }

  ngOnInit() {
  }

  cancel() {
    // this._location.back()
    //localStorage.removeItem('px-auth-token')
    this.dialogRef.close(false);
  }

  addOption(value: any) {
    this.oldpassword = value;
  }

  addOption2(value: any) {
    this.newpassword = value;
    if (value != this.oldpassword) {
      this.log = '';
      this.log += `รหัสผ่านไม่ถูกต้อง กรุณากรอกใหม่.\n`;
      this.chackPass = false;
    } else {
      this.log = '';
      this.chackPass = true;
    }
  }

  save(user: User) {
    if (this.checkInput()) {
      this._loadingService.register('main')
      this._loginService
        .checkRecentPassword(user)
        // .checkRecentPassword(user.passwords)
        .subscribe(result => {
          console.log('result : ',result)
          this._loadingService.resolve('main')
          if (!result) {
            this.log = '';
            this._loadingService.register('main')
            this._loginService
              .updatePassword(this._loginService.convertDateFormat(user))
              .subscribe(response => {
                this._loadingService.resolve('main')               
                if (response.success) {                 
                  this.msgs = [];
                  this.msgs.push({ severity: 'success', summary: 'แก้ไขข้อมูลสำเร็จ', detail: 'คุณได้ทำการแก้ไขข้อมูลแล้ว' }, )
                  this.dialogRef.close(true);
                } else {
                  this.msgs = [];
                  this.msgs.push({ severity: 'error', summary: 'แก้ไขข้อมูลบไม่สำเร็จ', detail: '' }, )
                }
              })
          } else {
            //localStorage.removeItem('px-auth-token')
            this.user.passwords = ''
            this.user2.passwords = ''
            let dialogRef = this._dialog.open(ErrorPasswordComponent, {
            });
            dialogRef.componentInstance.message = 'รหัสผ่านใหม่ต้องไม่ซ้ำกับรหัสผ่าน 3 ครั้งล่าสุด'
          }
        })
    } else {
      //localStorage.removeItem('px-auth-token')
      this.user.passwords = ''
      this.user2.passwords = ''
      let dialogRef = this._dialog.open(ErrorPasswordComponent, {
      });
      dialogRef.componentInstance.message = 'รหัสผ่านต้องมีขนาดอย่างน้อย 8 ตัวอักษร'
    }
    localStorage.removeItem('px-auth-token')
  }

  checkInput(): boolean {
    let result: boolean = false
    let password = this.user.passwords

    if (password.length > 7) {//(/[a-zA-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*()_+.|]/.test(password) && (password.length > 7))
      result = true
    } else {
      result = false
    }
    return result
  }
}
