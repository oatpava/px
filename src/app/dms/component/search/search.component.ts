import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, Params } from '@angular/router'
import { TdLoadingService } from '@covalent/core'
import 'rxjs/add/operator/switchMap'

import { FolderService } from '../../service/folder.service'
import { Folder } from '../../model/folder.model'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.styl'],
  providers:[ FolderService ],
})
export class SearchComponent implements OnInit {

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _folderService: FolderService,
  ) { }

  ngOnInit() {
     console.log('---SearchComponent---')
  }

}
