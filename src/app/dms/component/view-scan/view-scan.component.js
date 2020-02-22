"use strict";
var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
/*Dynamsoft Code*/
Dynamsoft.WebTwainEnv.Containers = [{ ContainerId: 'dwtcontrolContainer', Width: '300px', Height: '400px' }];
///
Dynamsoft.WebTwainEnv.ProductKey = '2F7499F5E5AFF6512B0D4D1334766AB9CB541BD01C818AA0D52A144D9F693EB7703A059A068F20A18F0605250F73BE94CD70B8B4AB0AD2F6BD96E4694E5017F59945A6A0D25E017AA1D4CB9AD27A39CF1E8E071EB2EF440EBFB5E0E61AAD0F56C394ABBF29900210041AE260205954E38D';
///
Dynamsoft.WebTwainEnv.Trial = false;
///
Dynamsoft.WebTwainEnv.ActiveXInstallWithCAB = false;
///
Dynamsoft.WebTwainEnv.Debug = false;
/*Dynamsoft Code*/
console.log(' --- ViewScanComponent js  --- ')
var ViewScanComponent = (function() {
    function ViewScanComponent() {
        this.webTwain = null;
        this.twainSources = [];
        this.selectedTwainSource = null;
    }
    ViewScanComponent.prototype.AcquireImage = function() {
        var param = {
            IfShowUI: false,
            IfFeederEnabled: true,
            Resolution: 200,
            IfDuplexEnabled: false,
            PixelType: 2
        };
        if (this.selectedTwainSource) {
            if (!this.webTwain.SelectSourceByIndex(this.selectedTwainSource.idx) ||
                !this.webTwain.OpenSource() ||
                !this.webTwain.AcquireImage(param, function() {}, function(errorCode, errorString) {
                    console.dir({ errorCode: errorCode, errorString: errorString });
                })) {
                console.dir({ errorCode: this.webTwain.ErrorCode, errorString: this.webTwain.ErrorString });
            }
        }
    };
    ViewScanComponent.prototype.ngAfterViewInit = function() {
        var _this = this;
        Dynamsoft.WebTwainEnv.Load();
        Dynamsoft.WebTwainEnv.RegisterEvent('OnWebTwainReady', function() {
            console.log("OnWebTwainReady");
            _this.webTwain = Dynamsoft.WebTwainEnv.GetWebTwain('dwtcontrolContainer');
            if (_this.webTwain) {
                for (var i = 0; i < _this.webTwain.SourceCount; i++) {
                    _this.twainSources.push({ idx: i, name: _this.webTwain.GetSourceNameItems(i) });
                }
                _this.webTwain.IfDisableSourceAfterAcquire = true;
                _this.webTwain.SetViewMode(2, 2);
            }
        });
    };
    ViewScanComponent = __decorate([
        core_1.Component({
            selector: 'app-view-scan',
            template: '<select [(ngModel)]="selectedTwainSource" ><option *ngFor="let source of twainSources" [ngValue]="source">{{source.name}}</option></select>' +
                '<button (click)="AcquireImage();">Start Scan</button><div id="dwtcontrolContainer"></div>'
        }),
        __metadata('design:paramtypes', [])
    ], ViewScanComponent);
    return ViewScanComponent;
}());
exports.ViewScanComponent = ViewScanComponent;
//# sourceMappingURL=app.component.js.map