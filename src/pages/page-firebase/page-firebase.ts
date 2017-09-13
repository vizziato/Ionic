import { Component } from '@angular/core';
import { NavController, NavParams,AlertController,ActionSheetController } from 'ionic-angular';
import { Vibration } from '@ionic-native/vibration';
import { Media, MediaObject } from '@ionic-native/media';
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database";
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import 'firebase/storage';
/**
 * Generated class for the PageFirebasePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */


@Component({
  selector: 'page-page-firebase',
  templateUrl: 'page-firebase.html',
})
export class PageFirebase {
  songs: FirebaseListObservable<any>;
  private currentUser: firebase.User;
  email:string;
  password:string;

  file: MediaObject ;

 
  gsReference;

  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,public af: AngularFireDatabase,private afAuth: AngularFireAuth,public vibration: Vibration,private media: Media)
   {
    this.email = 'gidm700@gmail.com';
    this.password = 'bernarda';
    
    try {
      afAuth.authState.subscribe((user: firebase.User) =>{
        this.currentUser = user;
        if(this.currentUser){
          this.songs = af.list('/songs');
        }
      });
    } catch (error) {
      
    }
     
    
    
    this.gsReference= firebase.storage().refFromURL('gs://pavlov-5c219.appspot.com/alarm.mp3')
   

   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PageFirebasePage');
    let self = this;
    // Get metadata properties
    this.gsReference.getMetadata().then(function(metadata) {
      // Metadata now contains the metadata for 'images/forest.jpg'
      console.log(metadata);
    }).catch(function(error) {
      // Uh-oh, an error occurred!
      console.error(error);
    });

    
    this.gsReference.getDownloadURL().then(function(url) {
      // `url` is the download URL for 'images/stars.jpg'
      console.log('url', url);

      self.file = self.media.create(url);
    
    }).catch(function(error) {
      // Handle any errors
    });
    
  }

  ngAfterContentChecked(){
    console.log('ngAfterContentChecked');
   // console.log(this.test);
   
  }


  login() {
   // this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  // this.afAuth.auth.signInWithPopup(new firebase.auth.EmailAuthProvider());
  //this.afAuth.auth.createUserWithEmailAndPassword
  this.afAuth.auth.signInWithEmailAndPassword(this.email, this.password);
 

  
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  playFile(){
    this.file.play({ numberOfLoops: 2 });
    console.info('play file');
    
  }

  stopFile(){
    this.file.stop();
    console.info('stop file');
    

  }
  downloadFile(){
   
    console.log('SONGS, ', this.songs);
   
   
 
    this.gsReference.getDownloadURL().then(function(url) {
      // `url` is the download URL for 'images/stars.jpg'
      console.log('url', url);
    
      // This can be downloaded directly:
      /*
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = function(event) {
        var blob = xhr.response;
      };
      xhr.open('GET', url);
      xhr.send();*/
    
      // Or inserted into an <img> element:
      // Or inserted into an <img> element:
      //var img = document.getElementById('myimg');
      //img.src = url;
    }).catch(function(error) {
      // Handle any errors
    });
  }

  
  get authenticated(): boolean {
    return this.currentUser !== null;
  }

  signInWithFacebook(): firebase.Promise<any> {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
  }

  signOut(): void {
    this.afAuth.auth.signOut();
  }

  displayName(): string {
    if (this.currentUser !== null) {
      //return this.currentUser.facebook.displayName;
      return this.currentUser.displayName;
    } else {
      return '';
    }
  }



 

  addSong(){
    
    let prompt = this.alertCtrl.create({
      title: 'Song Name',
      message: "Enter a name for this new song you're so keen on adding",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.songs.push(data);
          }
        }
      ]
    });
    prompt.present();
    
  }

  showOptions(songId, songTitle) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'What do you want to do?',
      buttons: [
        {
          text: 'Delete Song',
          role: 'destructive',
          handler: () => {
            this.removeSong(songId);
          }
        },{
          text: 'Update title',
          handler: () => {
            this.updateSong(songId, songTitle);
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  removeSong(songId: string){
    this.songs.remove(songId);
  }

  updateSong(songId, songTitle){
    let prompt = this.alertCtrl.create({
      title: 'Song Name',
      message: "Update the name for this song",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title',
          value: songTitle
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.songs.update(songId, {
              title: data.title
            });
          }
        }
      ]
    });
    prompt.present();
  }

}
