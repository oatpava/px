import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Params } from '@angular/router'
import { TdLoadingService } from '@covalent/core'
import { IMyOptions, IMyDateModel } from 'mydatepicker'
import { MdDialogRef } from '@angular/material'

import { SarabanService } from '../../service/saraban.service'

import { SarabanFolder } from '../../model/sarabanFolder.model'

@Component({
  selector: 'app-register-saraban-content',
  templateUrl: './register-saraban-content.component.html',
  styleUrls: ['./register-saraban-content.component.styl'],
  providers: [SarabanService],
})
export class RegisterSarabanContentComponent implements OnInit {
  sarabanContentId: number
  shortCutSaraban: SarabanFolder[] = []
  selectedFolder: SarabanFolder

  constructor(
    private _route: ActivatedRoute,
    private _loadingService: TdLoadingService,
    private _sarabanService: SarabanService,
    public dialogRef: MdDialogRef<RegisterSarabanContentComponent>,
  ) { }

  ngOnInit() {
    console.log('RegisterSarabanContentComponent')
    this._route.params
      .subscribe((params: Params) => {
        if (!isNaN(params['sarabanContentId'])) this.sarabanContentId = +params['sarabanContentId']
        this.getShortcutSarabanFolders()
      })
  }

  getShortcutSarabanFolders(): void {
    this._loadingService.register('main')
    this._sarabanService
      .getSarabanFolderShortcuts()
      .subscribe(response => {
        this._loadingService.resolve('main')
        response.forEach(folder => {
          if (folder.wfContentType2.id != 5) {
            this.shortCutSaraban.push(folder)
          }
        })
      })
  }

  selectShortcutFolder(selectedFolder: SarabanFolder) {
    this.selectedFolder = selectedFolder
    this.dialogRef.close(true)
  }


}
