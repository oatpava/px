import { Component, OnInit, trigger, state, animate, transition, style } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { environment } from '../../environments/environment'
import { MdDialog, MdDialogRef } from '@angular/material';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core'

import { UserProfileService } from '../setting/service/user-profile.service'
import { SettingService } from '../setting/service/setting.service'
// import { ParamAdminService } from '../setting/service/param-admin.service'

import { UserProfile } from '../setting/model/user-profile.model'
import { Keepalive } from '@ng-idle/keepalive'
import { AlertLogOffComponent } from '../alert-log-off/alert-log-off.component'

import { ParamSarabanService } from '../saraban/service/param-saraban.service'
import { Location } from '@angular/common'
import { ChangePasswordComponent } from '../login/change-password/change-password.component'
import { AlertMessageComponent } from '../login/alert-message/alert-message.component'
// import { SetPasswordComponent } from '../setting/component/set-password/set-password.component'
import { SettingDefultProfileComponent } from '../main/component/setting-defult-profile/setting-defult-profile.component'
import { Response } from '@angular/http/src/static_response';

import { LoginService } from '../login/login.service'
import { DialogInstructionComponent } from './component/dialog-instruction/dialog-instruction.component'
import { Message } from 'primeng/primeng';
import { ConfirmDialogComponent } from './component/confirm-dialog/confirm-dialog.component'
import { DialogWarningComponent } from '../saraban/component/add-saraban-content/dialog-warning/dialog-warning.component'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.styl'],
  providers: [UserProfileService, SettingService, LoginService],
  animations: [
    trigger('visibleTrigger', [
      state('visible', style({ opacity: '1' })),
      transition('void => *', [style({ opacity: '0' }), animate('400ms 300ms')]),
      transition('* => void', [animate('200ms', style({ opacity: '0' }))])
    ])
  ],
  host: { '[@visibleTrigger]': '' }
})
export class MainComponent implements OnInit {
  private appName: string
  private appNameEng: string
  private appAcronym: string
  private sidenavTitle: string = 'Praxticol'
  private archiveHeader: string = ''
  private _mainUrl: string = ''// '/mainlayout'
  private msgs: Message[] = []

  routes: any[] = [
    {
      id: 1,
      title: 'ข้อมูลส่วนตัว',
      route: this._mainUrl + 'mwps',
      icon: 'folder',
      type: ''
    },
    {
      id: 2,
      title: 'ทะเบียนส่วนกลาง',
      route: this._mainUrl + 'sarabans',
      icon: 'class',
      type: 'WF'
    },
    {
      id: 3,
      title: 'ระบบจัดเก็บเอกสารฯ',
      route: this._mainUrl + 'folders',
      icon: 'dashboard',
      type: 'DMS'
    },
    // {
    //   id: 4,
    //   title: 'หนังสือเวียน',
    //   route: this._mainUrl + 'sarabans',//circularNotice
    //   icon: 'chrome_reader_mode',
    //   type: 'CN'
    // },
    {
      id: 0,
      title: 'ส่วนงานผู้ดูแลระบบ',
      route: this._mainUrl + 'settings',
      icon: 'settings',
      type: 'ADMIN'
    }
  ]
  userProfile: UserProfile = new UserProfile()
  userProfiles: UserProfile[] = []
  index: number = 0
  useAD: boolean = false

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userProfileService: UserProfileService,
    private _settingService: SettingService,
    private _paramSarabanService: ParamSarabanService,
    private _location: Location,
    private _dialog: MdDialog,
    private _idle: Idle,
    private _loginService: LoginService,
  ) {
    this.appName = environment.appName
    this.appNameEng = environment.appNameEng
    this.appAcronym = environment.appAcronym
    this.userProfiles = this._paramSarabanService.userProfiles
    this.userProfile = this._paramSarabanService.userProfiles[0]
    this._paramSarabanService.userProfileIndex = 0
  }

  ngOnInit() {
    console.log('MainComponent', this.userProfiles)
    this.setTimeOut()
    this.loadDefaultModule('mwps', { t: new Date().getTime() })
    this.prepareUserProfile()
    //this.showInstructionDialog()
    if (this.appAcronym !== 'demo') {
      this.sidenavTitle = this.appName + ' (' + this.appAcronym + ')'
    }
    //**//
    // if (this._paramSarabanService.isArchive) {
    //   this.archiveHeader = '(ระบบฐานข้อมูลเอกสารเก่า)'
    //   this._loginService
    //     .changeSetapiUrl()
    // }
    this.getSarabanParam()
    this.checkAD()
  }

  loadDefaultModule(defaultModule: string, params: Object) {
    this._router.navigate(
      [{
        outlets: {
          center: [defaultModule, params],
        }
      }],
      { relativeTo: this._route })
  }

  selectModule(moduleId: number, moduleName: string) {
    this._paramSarabanService.pathOld = null
    this._paramSarabanService.path = null
    this._paramSarabanService.searchFilters = null
    this._paramSarabanService.searchFilters_tmp = null
    this._paramSarabanService.datas = null
    this._paramSarabanService.tableFirst = null
    this._paramSarabanService.listReturn = null
    this._paramSarabanService.barcodeFilter = null
    this._paramSarabanService.folder = null
    let param = {}
    switch (moduleId) {
      case (2): param = { 
        parentId: 0,
        path: 'ทะเบียนส่วนกลาง' 
      }; break;
      case (3): param = {
        parentId: 1,
        folderType: 'A',
        t: new Date().getTime()
      }; break;
      case (4): param = { parentId: -1 }; break;
    }
    this._router.navigate(
      [{
        outlets: {
          center: [moduleName, param],
        }
      }],
      { relativeTo: this._route })
  }

  logOut() {
    localStorage.removeItem('px-auth-token')
    let dialogRef = this._dialog.open(ConfirmDialogComponent, {
      width: '50%',
    });
    let instance = dialogRef.componentInstance
    instance.dataName = 'ออกจากระบบ'
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._settingService
          .checkLogout('1.0')
          .subscribe(response => {
          })
        // this._loginService
        //   .changeapiUrl()
        this._router.navigate(['/login'])
        setTimeout(() => {    //<<<---    using ()=> syntax
          window.location.reload()
        }, 500);

      }
    })
  }

  download() {
    // var blob = new Blob([data], { type: 'text/csv' });
    let url = environment.plugIn + '/activex/PlugIn.EXE'
    window.open(url);
  }

  prepareUserProfile() {
    this._paramSarabanService.userId = this.userProfile.id
    this._paramSarabanService.userName = this.userProfile.fullName
    this._paramSarabanService.structure = this.userProfile.structure
    this._paramSarabanService.structureId = this.userProfile.structure.id
    this._paramSarabanService.structureName = this.userProfile.structure.name
    this._paramSarabanService.userProfileTypeId = this.userProfile.userProfileType.id
    if (this.userProfile.userProfileType.id != 1 && this.userProfile.userProfileType.id != 3) {
      this.routes = this.routes.filter(route => route.type != 'ADMIN')
    }
    if (!environment.DMS) {
      this.routes = this.routes.filter(route => route.type != 'DMS')
    }
  }

  settingProfile() {
    let dialogRef = this._dialog.open(SettingDefultProfileComponent, {
      width: '70%',
    });
    let instance = dialogRef.componentInstance
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    })
  }

  openDialogChangePassword(): void {
    let dialogRef = this._dialog.open(ChangePasswordComponent, {
      width: '40%',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let dialogAlert = this._dialog.open(AlertMessageComponent, {
          width: '40%',
        });
        dialogAlert.componentInstance.message = 'กรุณาเข้าระบบใหม่'
      }
    });
  }

  goBack() {
    this._location.back()
  }

  setTimeOut() {
    this._settingService.getParams('TIMEOUT')
      .subscribe(Response => {
        // sets an idle timeout of 5 seconds, for testing purposes.
        this._idle.setIdle(5);
        // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
        if (Response != null) {
          console.log('timeout after ' + Response.paramValue + 's.')
          this._idle.setTimeout(Number(Response.paramValue));
        } else {
          this._idle.setTimeout(6000);
        }
        // idle.setTimeout(300);
        // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
        this._idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
        // this._idle.onTimeoutWarning.subscribe((countdown: number) => {
        //   // console.log('TimeoutWarning: ' + countdown);
        // });
        this._idle.onTimeout.subscribe(() => {
          // console.log('Timeout');
          this._dialog.open(AlertLogOffComponent);
          localStorage.clear();
          this._router.navigate(['/basic', { sessionExpirate: 'true' }]);
        });
        this._idle.watch();
      });
  }

  showInstructionDialog() {
    this._dialog.open(DialogInstructionComponent, {
      //width: '40%',
    })
  }

  listUserProfile(userId: number) {
    this._userProfileService
      .getUserProfilesByUserId(userId)
      .subscribe(response => {

      })
  }

  swapUserProfile(index: number) {
    if (index != this.index) {
      let dialogRef = this._dialog.open(DialogWarningComponent)
      dialogRef.componentInstance.header = "ยืนยันการสลับผู้ใช้งาน"
      dialogRef.componentInstance.message = "คุณต้องการสลับไปที่ผู้ใช้งาน '" + this.userProfiles[index].fullName + "' ดำเนินการต่อใช่ หรือ ไม่"
      dialogRef.componentInstance.confirmation = true
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this._loginService
            .swapUserProfile(this.userProfiles[index])
            .subscribe(response => {
              this.index = index
              this.userProfile = this.userProfiles[index]
              this._paramSarabanService.userProfileIndex = 0
              this._paramSarabanService.userId = this.userProfile.id
              this._paramSarabanService.userName = this.userProfile.fullName
              this._paramSarabanService.structure = this.userProfile.structure
              this._paramSarabanService.structureId = this.userProfile.structure.id
              this._paramSarabanService.structureName = this.userProfile.structure.name
              this._paramSarabanService.userProfileTypeId = this.userProfile.userProfileType.id
              this.loadDefaultModule('mwps', { t: new Date().getTime() })
            })

        }
      })
    }
  }

  getSarabanParam() {
    this._settingService.getParams('CONTENTFORMAT')
      .subscribe(response => {
        if (response != null) {
          this._paramSarabanService.contentNoFormat = this.genN0Format(+response.paramValue)
        }
      })

    this._settingService.getParams('BOOKNOFORMAT')
      .subscribe(response => {
        if (response != null) {
          this._paramSarabanService.bookNoFormat = this.genN0Format(+response.paramValue)
        }
      })

    this._settingService.getParams('ORDERFORMAT')
      .subscribe(response => {
        if (response != null) {
          this._paramSarabanService.orderNoFormat = this.genN0Format(+response.paramValue)
        }
      })

    this._settingService.getParams('SHAREBOOKNO')
      .subscribe(response => {
        if (response != null) {
          if (response.paramValue != 'Y') this._paramSarabanService.shareBookNo = false
        }
      })
  }

  genN0Format(num: number): string {
    let tmp: string = ''
    for (let i = 0; i < num; i++) tmp += '0'
    return tmp
  }

  downloadPluginFileAttach() {
    window.open('plugIn-view.exe')
  }

  downloadPluginScan() {
    window.open('plugIn-twain.exe')
  }

  downloadSetupManual() {
    window.open('manual-setup.pdf')
  }

  downloadUserManual() {
    window.open('manual-user.pdf')
  }

  checkAD() {
    this._settingService.getParams('USE_AD')
      .subscribe(response => {
        if (response != null) {
          if (response.paramValue == 'Y') this.useAD = true
        }
      })
  }

}
