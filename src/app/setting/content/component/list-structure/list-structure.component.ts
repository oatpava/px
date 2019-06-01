import { Router, ActivatedRoute } from '@angular/router';
import { Input, Component, OnInit } from '@angular/core';
import { Structure } from '../../model/structure'
@Component({
  selector: 'structure-view',
  templateUrl: './list-structure.component.html',
  styleUrls: ['./list-structure.component.styl'],
})
export class ListStructureComponent implements OnInit {
  @Input() directories: Array<Structure>;
  @Input() userList: Array<Structure>;
  expanded: boolean;
  checked: boolean;
  constructor(private _route: ActivatedRoute,
    private _router: Router, ) {
    this.expanded = false
    this.checked = false
  }

  containsObject(id, list) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === id) {
        return true;
      }
    }
    return false;
  }

  ngOnInit() {
  }
  
  toggle(dir: Structure) {
    dir.expanded = !dir.expanded;
    if (dir.nodeLevel == 1) {
      let param = {
        structureName : dir.name,
        type : dir.type,
      }
      this._router.navigate(
        ['/main', {
          outlets: {
            center: ['setting-assign-content', param],
          }
        }],
        { relativeTo: this._route });
    }
  }
}