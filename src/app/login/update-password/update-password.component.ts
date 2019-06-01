import { Component, OnInit, Input, trigger, state, animate, transition, style } from '@angular/core';
import { Location } from '@angular/common'
import { Router, ActivatedRoute, Params} from '@angular/router'
import { TdLoadingService } from '@covalent/core'

import { LoginService } from '../login.service'
// import { ChangePasswordService } from '../service/change-password.service'
import { User } from '../../setting/model/user.model'
import { MdDialog, MdDialogRef } from '@angular/material'
import { Http, Response, Headers, RequestOptions } from '@angular/http'
import { coerceBooleanProperty } from '@angular/material/core/coercion/boolean-property';
import { collectAndResolveStyles } from '@angular/platform-browser/src/private_import_core';
import { Message } from 'primeng/primeng';
// import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.styl'],
  providers: [LoginService],
  // animations: [
  //   trigger('visibleTrigger', [
  //     state('visible', style({ opacity: '1' })),
  //     transition('void => *', [style({ opacity: '0' }), animate('200ms 300ms')]),
  //     transition('* => void', [animate('200ms', style({ opacity: '0' }))])
  //   ])
  // ],
})
export class UpdatePasswordComponent implements OnInit {
  title: String = 'เปลี่ยนรหัสผ่าน'
  user: User
  user2: User
  // private _headers: Headers
  log = ''
  oldpassword = ''
  newpassword = ''
  chackPass: boolean = true;
  // // newOrganizes: any = []

  msgs: Message[] = []
  url: any
  usernameUrl: string


//   this.token = this.activatedRoute.snapshot.queryParams['token'];
    //   token = this.activatedRoute.snapshot.queryParams['token'];


  constructor(
    private _router: Router,
    private _loadingService: TdLoadingService,
    // private _passService: ChangePasswordService,
    private _loginService: LoginService,
    private _location: Location,
    private activatedRoute: ActivatedRoute,
    // public dialogRef: MdDialogRef<UpdatePasswordComponent>
  ) {
    this.user = new User()
    this.user2 = new User()
    // this.user.password = null
  }

  ngOnInit() {
    this.usernameUrl = this.activatedRoute.snapshot.queryParams['f'];

    // this.activatedRoute.params.subscribe((params: Params) => {
    //   if (params['f'] == undefined) {
    //     console.log('xxxxxxxxxxxxxxxxxx')
    //   } else {
    //     this.usernameUrl = params['f'];
        console.log('usernameUrl...........');
        console.log(this.usernameUrl);
    //   }
    // this.getUser(this.usernameUrl)
    // });
  }

  getUser(usernameUrl){
    this._loadingService.register('main')
      this._loginService
        .getParmUserChange(encodeURIComponent(usernameUrl), this.user)
        .subscribe(response => {
          console.log(response)
          this._loadingService.resolve('main')
        })
  }

  cancel() {
    // this._location.back()
    console.log("cancel")
    localStorage.removeItem('px-auth-token')
    this._router.navigate(['/'])
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
    //แก้ไขรหัสผ่าน
    if (this.chackPass) {
      console.log(true)
      this.log = '';
      this._loadingService.register('main')
      this._loginService
        .updatePasswordByUrl(this.usernameUrl, this._loginService.convertDateFormat(user))
        .subscribe(response => {
          // window.location.reload();
          console.log(response.success)
          if (response.success) {
            this._loadingService.resolve('main')
            this.msgs = [];
            this.msgs.push({ severity: 'success', summary: 'แก้ไขข้อมูลสำเร็จ', detail: 'คุณได้ทำการแก้ไขข้อมูลแล้ว' }, )
          }else{
            this._loadingService.resolve('main')
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: 'ไม่สามารถแก้ไข', detail: 'ชื่อผู้ใช้งานไม่ถูกต้อง' }, )
          }
          // this.dialogRef.close();
        })
      // this.dialogRef.close();
      this._loadingService.resolve('main')
    } else {
      console.log(false)
      this._loadingService.resolve('main')
    }
    localStorage.removeItem('px-auth-token')
  }
}
