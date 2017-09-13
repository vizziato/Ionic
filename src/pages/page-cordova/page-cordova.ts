import { Component } from '@angular/core';
import { NavController, NavParams,ToastController } from 'ionic-angular';

import { Vibration } from '@ionic-native/vibration';
import { Media, MediaObject } from '@ionic-native/media';
import { SMS } from '@ionic-native/sms';

/**
 * Generated class for the PageCordovaPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */


@Component({
  selector: 'page-page-cordova',
  templateUrl: 'page-cordova.html',
})
export class PageCordova {
   myInterval:any;
   file: MediaObject ;

   phoneNumber:number;
   textMessage:string;
   
  constructor(private toastCtrl:ToastController,public navCtrl: NavController,public vibration: Vibration,private media: Media,public navParams: NavParams,private sms: SMS) {

    //this.nativeAudio.preloadSimple('uniqueId1', 'audio/door.mp3').then(this. onSuccessAudio, this.onErrorAudio);
    //this.file = this.media.create("http://audio.ibeat.org/content/p1rj1s/p1rj1s_-_rockGuitar.mp3");
    this.file = this.media.create("../../assets/audio/alarm.mp3");
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PageCordovaPage');

   
    //this.file.play({ numberOfLoops: 2 })

      //alert('duree ' + this.file.getDuration());
   
   
  }

  ionViewWillLeave() {
    
  }

  switchOn(){
    //this.flashlight.switchOn();
    //let self = this;
    /*alert('this.flashlight.switchOn()')
    this.myInterval = setInterval(function(){
      self.vibration.vibrate(1000);
    },3000);

    console.log('interval',this.myInterval)*/

    //this.media.create("http://audio.ibeat.org/content/p1rj1s/p1rj1s_-_rockGuitar.mp3");
    this.file.play({ numberOfLoops: 2 });
    // Send a text message using default options
    //SMS.send('0763275269', 'Hello world!');
    

      
  }

  sendTextMessage(){
    try {
      console.log(String(this.phoneNumber));
      this.sms.send(String(this.phoneNumber), this.textMessage);
      let toast = this.toastCtrl.create({
        message: 'Message Text sended',
        duration: 3000
      });
      toast.present();
    } catch (error) {
      let toast = this.toastCtrl.create({
        message: 'Message Text Failed',
        duration: 3000
      });
      toast.present();
      
    }
   
   
  }

  switchOff(){
    /*let int = this.myInterval;
    console.log('interval off ',int);
    
    clearInterval(int);
   
    console.log('interval off ',int);
    console.log('interval off ',this.myInterval);
    //this.vibration.vibrate(0);*/

    this.file.stop();
  }

  /*startVideo() {
    let options: StreamingVideoOptions = {
      successCallback: () => { console.log('Finished Video') },
      errorCallback: (e) => { console.log('Error: ', e) },
      orientation: 'portrait'
    };
 
    // http://www.sample-videos.com/
    this.streamingMedia.playVideo('http://www.sample-videos.com/video/mp4/720/big_buck_bunny_720p_30mb.mp4', options);
  }
 
  startAudio() {
    let options: StreamingAudioOptions = {
      successCallback: () => { console.log('Finished Audio') },
      errorCallback: (e) => { console.log('Error: ', e) },
      initFullscreen: false // iOS only!
    };
 
    //http://soundbible.com/2196-Baby-Music-Box.html
    this.streamingMedia.playAudio('http://soundbible.com/grab.php?id=2196&type=mp3', options);

            // watch change in battery status
       

  }
 
  stopAudio() {
    this.streamingMedia.stopAudio();
  }*/

}