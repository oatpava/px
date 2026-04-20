import { Component, OnInit, trigger, state, animate, transition, style } from '@angular/core'
import { Router } from '@angular/router'
import { TdLoadingService } from '@covalent/core'
import { MdDialog } from '@angular/material'
import { LoginService } from './login.service'
import { User } from '../setting/model/user.model'
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component'
import { ErrorPasswordComponent } from './error-password/error-password.component'
import { AlertMessageComponent } from './alert-message/alert-message.component'
import { ChangePasswordComponent } from './change-password/change-password.component'
import { DialogCircularNoticeComponent } from '../saraban/component/circular-notice/dialog-circular-notice/dialog-circular-notice.component'
import { ParamSarabanService } from '../saraban/service/param-saraban.service'
import { environment } from '../../environments/environment'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.styl'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {
  user: User = new User({ version: 1.1 })
  titles: any[] = [
    {
      id: 1,
      name: 'ระบบฐานข้อมูลเอกสารปัจจุบัน'
    },
    // {
    //   id: 2,
    //   name: 'ระบบฐานข้อมูลเอกสารเก่าฯ'
    // }
  ]
  selectSystem: number = 1
  showPassword: boolean = false
  logo: string = ''

  wrongPasswordErrorCount: number = 0

  constructor(
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _loginService: LoginService,
    private _dialog: MdDialog,
    private _paramSarabanService: ParamSarabanService,
  ) {
    this.logo = 'assets/logo/' + environment.appAcronym + '.png'
    this._paramSarabanService.isArchive = false
  }

  ngOnInit() {
    localStorage.removeItem('px-auth-token')
  }

  checkLogin(user: User) {
    this._loadingService.register('main')
    this._loginService
      .checkLogin(user)
      .subscribe(response => {
        this._loadingService.resolve('main')
        console.log('login', response)

        if (response.data) {
          this._paramSarabanService.clientIp = response.clientIp
          this._paramSarabanService.userProfiles = response.userProfiles
          this._paramSarabanService.haveCa = response.haveCa
          this._router.navigate(['/load'])
        } else {
          if (response.status == -3) {
            this.wrongPasswordErrorCount++
            
            if (this.wrongPasswordErrorCount == 3) {
              const dialogRef = this._dialog.open(ErrorPasswordComponent)
              dialogRef.componentInstance.message = 'รหัสผ่านผิดครบ 3 ครั้ง ' + response.message

              user.status.id = 3
              this._loadingService.register('main')
              this._loginService
                .updateStatusByUsername(user)
                .subscribe(response => {
                  this._loadingService.resolve('main')
                })
              return
            }
          }
          this.wrongPasswordErrorCount = 0

          const dialogRef = this._dialog.open(AlertMessageComponent, { width: '40%' })
          dialogRef.componentInstance.message = response.message
          if (response.status == 2) {
            dialogRef.afterClosed().subscribe(result => {
              this._dialog.open(ChangePasswordComponent, { width: '40%' })
            })
          }
        }
      })
  }

  onChange(event) {
    if (event == 2) {
      this._paramSarabanService.isArchive = true
    } else {
      this._paramSarabanService.isArchive = false
    }
  }

  openDialogErrorPassword(mess: string, warn: boolean): void {
    let dialogRef = this._dialog.open(ErrorPasswordComponent, {
    });
    if (warn) {
      dialogRef.componentInstance.message = 'รหัสผิดเกิน 3 ครั้ง โปรดติดต่อผู้ดูแลระบบ'
    } else {
      dialogRef.componentInstance.message = mess
    }
  }

  openDialogforgotPassword(): void {
    this._dialog.open(ForgotPasswordComponent, {
      width: '40%',
    });
  }

  openCircularNotice() {
    this._dialog.open(DialogCircularNoticeComponent, {
      height: '90%'
    })
  }

}
