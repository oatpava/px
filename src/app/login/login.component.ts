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
  errorCount: number = 0
  userName: string = ''

  constructor(
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _loginService: LoginService,
    private _dialog: MdDialog,
    private _paramSarabanService: ParamSarabanService,
  ) {
    this.logo = 'assets/logo/' + environment.appAcronym + '.png'
  }

  ngOnInit() {
    localStorage.removeItem('px-auth-token')
    this._paramSarabanService.isArchive = false
  }

  checkLogin(user: User): void {
    localStorage.removeItem('px-auth-token')
    this._loadingService.register('main')
    this._loginService
      .checkLogin(user)
      .subscribe(response => {
        console.log('login', response)
        this._paramSarabanService.userProfiles = response.message
        this._loadingService.resolve('main')
        if (response.data.result) {
          this._loadingService.register('main')
          this._loginService
            .checkChangePassword(user)
            .subscribe(response => {
              this._loadingService.resolve('main')
              if (response.data.result) {
                this.openDialogRequestChangePassword(response.message)
              } else {
                this._router.navigate(['/load'])
              }
            })
          this._loadingService.resolve('main')
        } else {
          localStorage.removeItem('px-auth-token')
          if (user.name == this.userName) {
            if (this.errorCount >= 2) {
              user.status.id = 3
              this._loadingService.register('main')
              this._loginService
                .updateStatusByUsername(user)
                .subscribe(response => {
                  this._loadingService.resolve('main')
                })
              this.openDialogErrorPassword("", true)
            } else {
              this.openDialogErrorPassword(response.message, false)
              this.errorCount++
            }
          } else {
            this.userName = user.name
            if (this.errorCount == 0) {
              this.openDialogErrorPassword(response.message, false)
              this.errorCount++
            }
            this.errorCount = 0
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

  openDialogRequestChangePassword(mess: string): void {
    let dialogRef = this._dialog.open(AlertMessageComponent, {
      width: '40%',
    });
    dialogRef.componentInstance.message = mess
    if (mess.indexOf('ชื่อผู้ใช้หมดอายุการใช้งาน') < 0) {
      dialogRef.afterClosed().subscribe(result => {
        this._dialog.open(ChangePasswordComponent, {
          width: '40%',
        });
      });
    }
  }

  openCircularNotice() {
    this._dialog.open(DialogCircularNoticeComponent, {
      height: '90%'
    })
  }

}
