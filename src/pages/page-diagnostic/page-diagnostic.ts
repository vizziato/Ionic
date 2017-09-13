import { Component } from '@angular/core';
import {NavController, NavParams } from 'ionic-angular';
import { Diagnostic } from '@ionic-native/diagnostic';
/**
 * Generated class for the PageDiagnosticPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */


@Component({
  selector: 'page-page-diagnostic',
  templateUrl: 'page-diagnostic.html',
})
export class PageDiagnostic {

  items=[];

  constructor(public navCtrl: NavController, public navParams: NavParams,private diagnostic: Diagnostic) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PageDiagnosticPage');
    this.nativeDiagnostic();
  }

  nativeDiagnostic(){
    let self = this;
    let successCallback = (isAvailable) => {
       console.log('Is available? ' + isAvailable);
       this.items.push(isAvailable);
       //JSON.stringify(this.diagText)
       };
    let errorCallback = (e) =>{
      console.error(e);
      this.items.push(e);
      //JSON.stringify(this.diagText)
    } 
    
      setInterval(function(){
        self.diagnostic.isCameraAvailable().then(successCallback).catch(errorCallback);
      },2000);
      setInterval(function(){
        self.diagnostic.isBluetoothAvailable().then(successCallback, errorCallback);
      },2000);
      setInterval(function(){
        self.diagnostic.isLocationAvailable().then(successCallback, errorCallback);
      },2000);
     
    }

    itemSelected(item: string) {
      console.log("Selected Item", item);
    }

}
