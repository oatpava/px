import { Component, OnInit } from '@angular/core';
import { SarabanContent } from '../../../model/sarabanContent.model'

@Component({
  selector: 'app-dialog-view',
  templateUrl: './dialog-view.component.html',
  styleUrls: ['../add-saraban-content.component.styl']
})
export class DialogViewComponent implements OnInit {
  wfe: boolean = true
  url: string = ''
  sarabanContent: SarabanContent

  constructor() { }

  ngOnInit() {
  }

}
