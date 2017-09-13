
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';




import { PageAddMarkerPage } from '../pages/page-add-marker/page-add-marker';
import { PageClickMarkerPage } from '../pages/page-click-marker/page-click-marker';
import { PageGps } from '../pages/page-gps/page-gps';
import { PageRectangle } from '../pages/page-rectangle/page-rectangle';
import { PagePavlovPage } from '../pages/page-pavlov/page-pavlov';
import { PageGmapAutocomplete } from '../pages/page-search/page-search';
import { PageGmapAll } from '../pages/page-gmap-autocomplete/page-gmap-autocomplete';
import { PageCordova } from  '../pages/page-cordova/page-cordova';
import { PageDiagnostic } from  '../pages/page-diagnostic/page-diagnostic';
import { PageFirebase } from '../pages/page-firebase/page-firebase';

//declare var google: any;
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = PageGmapAutocomplete;

  pages: Array<{title: string, component: any}>;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      
    })

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Page Add Marker', component: PageAddMarkerPage },
      { title: 'Page Click Marker', component: PageClickMarkerPage },
      { title: 'Page Gps', component: PageGps },
      { title: 'Page Rectangle', component: PageRectangle },
      { title: 'Page Gmap Autocomplete', component: PageGmapAutocomplete },  
      { title: 'Page Gmap AutoAll', component: PageGmapAll },
      { title: 'Page Gmap Pavlov', component: PagePavlovPage } , 
      { title: 'Page Gmap Cordova', component: PageCordova }, 
      { title: 'Page Gmap Diagnostic', component: PageDiagnostic },
      { title: 'Page Firebase', component: PageFirebase } 
    ];

  }


  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
 
}
