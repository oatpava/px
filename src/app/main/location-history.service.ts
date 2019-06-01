import { Injectable } from '@angular/core'
import { Location, LocationStrategy, PathLocationStrategy, LocationChangeListener, PlatformLocation } from '@angular/common'

@Injectable()
export class LocationHistory implements LocationStrategy {

    path(includeHash?: boolean) : string{
        console.log("path");
        return ''
    }

    prepareExternalUrl(internal: string): string{
        console.log("prepareExternalUrl");
        return ''
    }

    pushState(state: any, title: string, url: string, queryParams: string) : void{
        console.log("push state called", url);
        //write my own logic here
    }
    
    replaceState(state: any, title: string, url: string, queryParams: string): void{
        console.log("replaceState");
    }

    forward(): void{
        console.log("forward");
    }
    
    back(): void{
        console.log("back");
    }

    onPopState(fn: LocationChangeListener): void{
        console.log("onPopState");
    }

    getBaseHref(): string{
        console.log("getBaseHref");
        return ''
    }
    
}