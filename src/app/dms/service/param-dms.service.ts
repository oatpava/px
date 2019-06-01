import { Injectable } from '@angular/core'
import { Message, TreeNode } from 'primeng/primeng'
//import { SarabanContentAuth} from '../model/sarabanContentAuth.model'
import { LevelBar } from '../model/level-bar.model'
import { Level } from '../model/level.model'

@Injectable()
export class ParamDmsService {

    levelBar: LevelBar = new LevelBar() 
    level: Level = new Level()

    setLevelBar(data: LevelBar) {
        this.levelBar = data
    }

    getLevelBar() {
        return this.levelBar
    }

    setLevel(data: any) {
        this.level = data
    }

    getLevel() {
        return this.level
    }

}