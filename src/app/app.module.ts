import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { PageGps } from '../pages/page-gps/page-gps';
import { PageAddMarkerPage } from '../pages/page-add-marker/page-add-marker';
import { PageClickMarkerPage } from '../pages/page-click-marker/page-click-marker';
import { PageRectangle } from '../pages/page-rectangle/page-rectangle';
import { PagePavlovPage } from '../pages/page-pavlov/page-pavlov';
import { PageGmapAutocomplete } from '../pages/page-search/page-search';
import { PageGmapAll } from '../pages/page-gmap-autocomplete/page-gmap-autocomplete';
import { ModalAutocompleteItems } from  '../pages/modal-autocomplete-items/modal-autocomplete-items';
import { PageCordova } from  '../pages/page-cordova/page-cordova';
import { PageDiagnostic } from  '../pages/page-diagnostic/page-diagnostic';
import { PageFirebase } from  '../pages/page-firebase/page-firebase';

import { FormsModule } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation';
import { Vibration } from '@ionic-native/vibration';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Media, MediaObject } from '@ionic-native/media';
import { EmailComposer } from '@ionic-native/email-composer';
import { File } from '@ionic-native/file';
import { SMS } from '@ionic-native/sms';
import { AngularFireModule } from 'angularfire2';
// for AngularFireDatabase
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
// for AngularFireAuth
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireAuth } from 'angularfire2/auth';


import { MyApp } from './app.component';


var firebaseConfig = {
  apiKey: "AIzaSyD-Nh5xeU1e1xKus_X0DuKTCbMqHzXdmik",
  authDomain: "pavlov-5c219.firebaseapp.com",
  databaseURL: "https://pavlov-5c219.firebaseio.com",
  projectId: "pavlov-5c219",
  storageBucket: "pavlov-5c219.appspot.com",
  messagingSenderId: "970014330181"
};

@NgModule({
  declarations: [
    MyApp,
    PageGps,
    PageRectangle,
    PageGmapAutocomplete,
    PageGmapAll,
    PageAddMarkerPage,
    PageClickMarkerPage,
    PagePavlovPage,
    PageCordova,
    PageDiagnostic,
    PageFirebase,
    ModalAutocompleteItems
  ],
  imports: [
    BrowserModule,
    FormsModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),AngularFireDatabaseModule,AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PageGps,
    PageRectangle,
    PageGmapAutocomplete,
    PageGmapAll,
    PageAddMarkerPage,
    PageClickMarkerPage,
    PagePavlovPage,
    PageCordova,
    PageDiagnostic,
    PageFirebase,
    ModalAutocompleteItems
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    Vibration,
    Diagnostic,
    Media,
    File,
    EmailComposer,
    SMS,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
