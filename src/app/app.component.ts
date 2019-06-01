import { DomSanitizer } from '@angular/platform-browser'
import { MdIconRegistry } from '@angular/material'
import { Component, ViewContainerRef, trigger, state, animate, transition, style } from '@angular/core'
import { TdLoadingService, ILoadingOptions, LoadingType, LoadingMode } from '@covalent/core'
import { environment } from '../environments/environment'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl','./app.component.scss'],
  animations: [
    trigger('visibleTrigger', [
            state('visible', style({ opacity: '1' })),
            transition('void => *', [style({ opacity: '0' }), animate('400ms 300ms')]),
            transition('* => void', [animate('200ms', style({ opacity: '0' }))])
        ])
  ],
  host: {'[@visibleTrigger]': ''}
})
export class AppComponent {
  constructor(
    private _loadingService: TdLoadingService, 
    viewContainerRef: ViewContainerRef,
    private _iconRegistry: MdIconRegistry,
    private _domSanitizer: DomSanitizer
  ) {
    let options: ILoadingOptions = {
      name: 'main',
      type: LoadingType.Circular,
      mode: LoadingMode.Indeterminate,
    }
    this._loadingService.createOverlayComponent(options, viewContainerRef)
    this._iconRegistry.addSvgIconInNamespace('assets', 'praxticol',
    this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/praxticol.svg'))
    this._iconRegistry.addSvgIconInNamespace('assets', 'icon',
    this._domSanitizer.bypassSecurityTrustResourceUrl('assets/logo/' + environment.appAcronym + '.svg'))
    // this._iconRegistry.addSvgIconInNamespace('assets', 'px-ic-wf',
    // this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/icon-workflow.svg'))
    // this._iconRegistry.addSvgIconInNamespace('assets', 'px-ic-excel',
    // this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/icon-excel.svg'))
    // this._iconRegistry.addSvgIconInNamespace('assets', 'px-ic-powerpoint',
    // this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/icon-powerpoint.svg'))
    // this._iconRegistry.addSvgIconInNamespace('assets', 'px-ic-text',
    // this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/icon-text.svg'))
    // this._iconRegistry.addSvgIconInNamespace('assets', 'px-ic-unknown',
    // this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/icon-unknown.svg'))
    // this._iconRegistry.addSvgIconInNamespace('assets', 'px-ic-word',
    // this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/icon-word.svg'))
  }

  
}
