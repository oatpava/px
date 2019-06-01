import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dialog-view',
  templateUrl: './dialog-view.component.html',
  styleUrls: ['./dialog-view.component.styl']
})
export class DialogViewComponent implements OnInit {
  url: string = ''

  constructor() { }

  ngOnInit() {
  }

}
