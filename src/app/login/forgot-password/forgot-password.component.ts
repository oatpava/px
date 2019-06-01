import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { Router } from '@angular/router'
import { TdLoadingService } from '@covalent/core'
import { MdDialog, MdDialogRef } from '@angular/material'

import { LoginService } from '../login.service'
import { User } from '../../setting/model/user.model'
import { Message } from 'primeng/primeng';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.styl'],
  providers: [LoginService, TdLoadingService],
})
export class ForgotPasswordComponent implements OnInit {
  title: String = 'ลืมรหัสผ่าน'
  user: User
  msgs: Message[] = []

  constructor(
    private _router: Router,
    private _loadingService: TdLoadingService,
    // private _passService: ChangePasswordService,
    private _loginService: LoginService,
    private _location: Location,
    public dialogRef: MdDialogRef<ForgotPasswordComponent>
  ) {
    this.user = new User()
  }

  ngOnInit() {
  }

  cancel() {
    // this._location.back()
    this.dialogRef.close();
  }

  save(user: User) {
    //ส่งเมล์ขอเปลี่ยนรหัสผ่าน
    // this.log = '';
    this._loadingService.register('main')
    this._loginService
      .checkEmail(user.name, user.passwords)
      .subscribe(response => {
        // window.location.reload();
        console.log(response)
        if (response.data.result) {

          this._loginService
            .sendEmail(user.name, user)
            .subscribe(response => {
              console.log(response)
              if (response.statusText == "OK") {
                this._loadingService.resolve('main')
                this.msgs = [];
                this.msgs.push({ severity: 'success', summary: 'เรียบร้อย', detail: 'ระบบได้ส่งข้อมูลไปยังอีเมล์ของท่าน' }, )
              }
            })


        } else {
          this._loadingService.resolve('main')
          this.msgs = [];
          this.msgs.push({ severity: 'error', summary: 'อีเมล์ไม่ถูกต้อง', detail: 'อีเมล์ของคุณไม่ตรงกับที่ลงทะเบียนไว้' }, )
        }
        // this.dialogRef.close();
      })
    // this.dialogRef.close();
    this._loadingService.resolve('main')
    // }else{
    //   console.log(false)
    //   this._loadingService.resolve('main')
    // }
    localStorage.removeItem('px-auth-token')
  }

}
