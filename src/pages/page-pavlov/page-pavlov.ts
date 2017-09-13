import { Component,ViewChild, ElementRef,Input } from '@angular/core';
import { AlertController,ActionSheetController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { SMS } from '@ionic-native/sms';
import { Vibration } from '@ionic-native/vibration';
import { Media, MediaObject } from '@ionic-native/media';
import { EmailComposer } from '@ionic-native/email-composer';
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database";
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import 'rxjs/Rx';



/*
import {Observable} from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
//import 'rxjs/add/operator/map';

import 'rxjs/Rx';*/


declare var google; // Added
/**
 * Generated class for the PagePavlovPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */


@Component({
  selector: 'page-page-pavlov',
  templateUrl: 'page-pavlov.html',
})
export class PagePavlovPage {

 
  @ViewChild('map') mapElement: ElementRef; // Added
  map: any; // Added
  infoWindow:any;
  geocoder:any;
  placedetails: any;
  placesService:any;
  markers = [];
  infoWindows =[];
  indexWindow:number;
  typesPlace =[];
  dataTab:any;
  showHide:boolean;
  bounds:any;
  rectangle:any;
  latLng:any;
  placesServiceMcDo:any;

  audioType: string = 'html5';
  sounds: any = [];
  file: MediaObject ;

  songs: FirebaseListObservable<any>;
  private currentUser: firebase.User;
  email:string;
  password:string;

  audioUrl:string;
 
  gsReference;
  

  


  address:any = {
    place: '',
    set: false,
  };  

  constructor(public alertCtrl: AlertController,public actionSheetCtrl: ActionSheetController,public navCtrl: NavController,
    private media: Media,public geolocation: Geolocation,private vibration: Vibration, public navParams: NavParams,
    public af: AngularFireDatabase,private afAuth: AngularFireAuth,private emailComposer: EmailComposer,private sms: SMS)
    {
    this.dataTab= ['adieu','salut','resalut','rrrrreeeesaluttttt'];
    this.showHide = false;

    this.email = 'gidm700@gmail.com';
    this.password = 'bernarda';
    
    afAuth.authState.subscribe((user: firebase.User) =>{
      this.currentUser = user;
      if(this.currentUser){
        this.songs = af.list('/songs');
      }
    });
   
   
    this.gsReference= firebase.storage().refFromURL('gs://pavlov-5c219.appspot.com/alarm.mp3')
    
  }
  onSuccessAudio(){
    console.log('onSuccessAudio() OK');
    alert('ok music');
  }
  onErrorAudio(){
    console.log('onErrorAudio() ERRRORRR');
    alert('no ok music');
  }





  

  handleData(data) {
    let that = this;
    console.log('Here are the usable data', data);
    // Insert Business logic here
    //this.showAlert();
    if (data == 'train_station'){
        console.log('train station trouvée');
        //alert('train station trouvée');
       
        
    }else{
        console.log('train station non trouvée');
    }
  }

  handleComplete() {
    console.log('Complete');
  }

  handleError(error) {
    console.log('error:', error)
    
  }

  extractData(response) {
    console.log('Raw response:', response);
    //console.log('Formatted response:', response.json());
    //const body = response.json();
    //return body || { };
      return response;
   
  }

  showAlert(word) {
    let alert = this.alertCtrl.create({
      title: 'New Place!',
      subTitle: 'This Place is ' + word,
      buttons: ['OK']
    });
    alert.present();
  }

  trainStationCheck(e){
    //check item.user and do stuff
    console.log('trainStationCheck',e);
    console.log('trainStationCheck',e.checked);
    if(e.checked){
      this.typesPlace[0]='train_station'
      //console.log('trainStationCheck indexof',this.typesPlace.indexOf('train_station'));
    }else{
      //delete this.typesPlace[this.typesPlace.indexOf('train_station')];
      this.typesPlace[0] = null;
    }
  }
  restaurantCheck(e){
    //check item.user and do stuff
    console.log('restaurantCheck',e.checked);
    if(e.checked){
      this.typesPlace[1] = 'restaurant';
    }else{
      //delete this.typesPlace[this.typesPlace.indexOf( 'store')]
      this.typesPlace[1] = null;
      
    }
  }

  clothingStoreCheck(e){
    //check item.user and do stuff
    console.log('clothing_store',e.checked);
    if(e.checked){
      this.typesPlace[2] = 'clothing_store';
    }else{
      //delete this.typesPlace[this.typesPlace.indexOf( 'store')]
      this.typesPlace[2] = null;
      
    }
  }
  liquorStoreCheck(e){
    //check item.user and do stuff
    console.log('liquor_store',e.checked);
    if(e.checked){
      this.typesPlace[3] = 'liquor_store';
      this.typesPlace[4] = 'bar';
    }else{
      //delete this.typesPlace[this.typesPlace.indexOf( 'store')]
      this.typesPlace[3] = null;
      this.typesPlace[4] = null;
      
    }
  }

  



  ionViewDidLoad() { //
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
      //self.file.setVolume(1.0);
    
    
    }).catch(function(error) {
      // Handle any errors
    });
    
    this.loadMap();
    this.initPlacedetails();
   
    console.log('ionViewDidLoad PageClickMarkerPage');
       
  }
 
  

  googleInfoWindow(map,infoWindow,infoWindows,marker,markers){
    //infoWindow.open(map,marker);
    //infoWindow.setContent(content);
    infoWindow.open(map,marker);
    markers.push(marker);
    infoWindows.push(infoWindow);

    infoWindow.addListener('closeclick', () =>{
      console.log('closeclick event addede to infoWindow');
      console.log('infoWindow closeclick indexOf',infoWindows.indexOf(infoWindow));
      
    });

  }

  getGeoLntLng(latLng,marker){
    let that = this;
    this.geocoder.geocode({'location': latLng}, function(results, status) {
      if (status === 'OK') {
        if (results[1]) {
          //this.map.setZoom(11);
          console.log('status ok');
          console.log('status ok',results[1].place_id);
          //that.getPlaceDetail(results[1].place_id);
          //that.performSearchCircle(latLng,that.typesPlace) ;

        let infoWindow = new google.maps.InfoWindow({
          //content: '<p>Marker Location:' + marker.getPosition() + '</p>'
           content :'<p>Marker Location:' + marker.getPosition() + ' adresse: ' + results[1].formatted_address + '</p>'
        });
          //infoWindow.open(that.map,marker);
          that.googleInfoWindow(that.map,infoWindow,that.infoWindows,marker,that.markers);
         
        } else {
          alert('No results found');
        }
      } else {
        alert('Geocoder failed due to: ' + status);
      }
    });
  }

  
  loadMap() {
    let that = this;
   
    this.geolocation.getCurrentPosition().then((position) => {
      this.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: this.latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      that.infoWindow = new google.maps.InfoWindow();
      that.placesService = new google.maps.places.PlacesService(this.map);


      this.bounds = {
        north: position.coords.latitude+0.1,
        south: position.coords.latitude-0.1,
        east: position.coords.longitude+0.1,
        west: position.coords.longitude-0.1
      };

      /*this.rectangle = new google.maps.Rectangle({
        bounds: this.bounds,
        editable: true,
        draggable: true
      });

      this.rectangle.setMap(this.map);*/

      
     
      this.geocoder = new google.maps.Geocoder;

      

     
    }, (err) => {
      console.log(err);
    });
  }


   /*////////////////////////////////////////////////////*/
   //VERSION RADAR
   ////////////////////////////////////////////////////////////
   performSearch(location,words){
    var self = this;
    this.placesService.nearbySearch({
      location: location,
      radius: 500,
      //types: ['restaurant','train_station'],
      types: words,
      map:this.map
    },this.callback);
  
  }

 
  
  

   callback(results, status,self) {
   
    let items = [];
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      
      /*results.map(res => {
        
          console.log('result this.data 0', res)
          
            if (res){
              console.log('train station trouvée');
              alert('train station trouvée');
              //self.showAlert('restaurant');
              }else{
                  console.log('train station non trouvée');
              }

        });*/
    
      results.map(function(item) {
         
              self.createMarker(item);
              console.log('item',item);
              items.push(item);
        });

        console.log(items);
        //return items;
     
        /*
      for (var i = 0; i < results.length; i++) {
        let place = results[i];
        let latLng = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());

        //
       
        ///////////////////////////////////////
        
        //console.log('place::::',place);
        //console.log('that.typesPlace[1]::::',that.typesPlace);
        //console.log('place.lenght::::',results.length);
        
        /*console.log('place.name::::',place.name);
        console.log('place.name::::',place.types);
        console.log('place.geometry::::',place.geometry.location.lat());
        console.log('place.geometry::::',place.geometry.location.lng());*/

          /*if(place.types[i] == that.typesPlace[1])
            {
              console.log('place trouvéée ',i);
            }
            else{
              console.log('pas place trouvéée',i);
            }

        //return place.types;

        
      

    }*/
      
         
    }
    //that.myCallback(); //calling callback
    
  }

  createMarker(place) {
    let that = this;
    let placeLoc = place.geometry.location;
    let infoWindow = new google.maps.InfoWindow(); 
    let marker = new google.maps.Marker({
      map: this.map,
      position: place.geometry.location
    });
  
    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.setContent(place.name);
      infoWindow.open(this.map, this);
      that.markers.push(marker);
      that.infoWindows.push(infoWindow);
    });
  }

  // Sets the map on all markers in the array.
setMapOnAll(map,markers) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}


deleteMarker() {
  this.setMapOnAll(null,this.markers);
  console.log('this markers',this.markers);
  this.markers =[];
  this.infoWindows =[];
  this.file.stop();
  /*this.markers[0].addListener('click', function(event) {
    console.log('marker events event', event);
});*/

}

  getGeo()
  {
    this.geolocation.getCurrentPosition().then((resp) => {
      let test;
    //let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
    //let  latLng = {lat: 46.58173559999999, lng: 6.601383100000021};//Garage oberson cheseaux
    let latLng ={lat:46.582285373223236,lng: 6.601439416408539};//McDo cheseaux
    let request = {
      placeId: 'c183fd0200fa1eef75bea38d3c3b47976666d9fb'//id_McDo
    };
    
     //alert(JSON.stringify(resp));
     //this.addMarker(latLng);
     //this.performSearch(latLng,this.typesPlace);
     var self = this;
     //this.performSearch(latLng,this.typesPlace);
     this.placesService.nearbySearch({
       location: latLng,
       //bounds:this.bounds,
       radius: 50,
       //types: ['restaurant','train_station'],
       types: this.typesPlace,
       map:this.map
     },function(results,status){
      
      
      if (status == google.maps.places.PlacesServiceStatus.OK) {
          results.map(function(item) {
              self.createMarker(item);
              console.log('item',item);
              console.log('item',item.types);
              console.log('this.typesPlace',self.typesPlace);
              for (var i = 0; i < self.typesPlace.length; i++) {
                
                  if(item.types[0] == self.typesPlace[i])
                    {
                        self.showAlert(item.types[0])
                      // Vibrate the device for a second
                      // Duration is ignored on iOS.
                      self.vibration.vibrate(1000);
                      self.file.play({ numberOfLoops: 2 });
                      self.file.setVolume(1.0);
                      self.sms.send('0763275269', 'Hello world!');

                    }
                    else{

                    }
              }
                
            });

        }else{
          
        }
      });
  

    }).catch((error) => {
     alert('Error getting location'+JSON.stringify(error));
    });
  }


  addMarker(location) { // To Add Marker
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      icon: {
        url: 'https://developers.google.com/maps/documentation/javascript/images/circle.png',
        anchor: new google.maps.Point(10, 10),
        scaledSize: new google.maps.Size(10, 17)
      },
      position: location,
      draggable:true,
      title:"Drag me!"
    });
    let content = "<h3>My New Location!</h3><h5>by Anish youtube - Please subscribe</h5>";
   
    console.log('latitude: '+marker.position.lat(), 'longitude: '+marker.position.lng());
    console.log(marker);

    
    let latLng = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
    let infoWindow = new google.maps.InfoWindow(); 
    let that = this;
    this.geocoder.geocode({'location': latLng}, function(results, status) {
        if (status === 'OK') {
          if (results[1]) {
            that.getPlaceDetail(results[1].place_id);
           
            let content = '<p>Marker Location:' + marker.getPosition() + ' adresse: ' + results[1].formatted_address + '</p>';
            infoWindow.setContent(content);
            infoWindow.open(that.map,marker);
           
          } else {
            alert('No results found');
          }
        } else {
          alert('Geocoder failed due to: ' + status);
        }
      });

    
}


  



    onPropChangeClick(e) { 
       
       let that = this;
       console.log('this.typesPlace',this.typesPlace);

        /*for (var i = 0; i < this.infoWindows.length; i++) {
          try {
              if(!(this.infoWindows[i].anchor == null)){
                console.log('this.infoWindows',this.infoWindows[i]);
              }
              else{
                console.log('this.infoWindows',this.infoWindows[i] + 'is closed');
                  this.markers[i].setMap(null);
                  delete this.markers[i];
                  delete this.infoWindows[i];
                  this.markers[i].setMap(null);
              
              }

            } catch (error) {
              
            }
          }*/
     
    }


  placeMarker(location) {
    
    let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: location,
        draggable:true,
        title:"Drag me!"
      });
      console.log('latitude: '+marker.position.lat(), 'longitude: '+marker.position.lng());
      this.getGeoLntLng(marker.getPosition(),marker);
      
   
   
  }

  

  private getPlaceDetail(place_id:string):any{
    let result:any;
    let word_search = 'train_station';
    var self = this;
    var request = {
        placeId: place_id
    };
    this.placesService = new google.maps.places.PlacesService(this.map);
    this.placesService.getDetails(request, callback);
    function callback(place, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            console.log('page > getPlaceDetail > place > ', place);
            console.info('place .adress_components',place.address_components);
            console.info('place .name',place.name);
            result=place.types;
            self.placedetails.address = place.formatted_address;
            self.placedetails.lat = place.geometry.location.lat();
            self.placedetails.lng = place.geometry.location.lng();
            for (var i = 0; i < place.address_components.length; i++) {
                let addressType = place.address_components[i].types[0];
                
                let values = {
                    short_name: place.address_components[i]['short_name'],
                    long_name: place.address_components[i]['long_name']
                }
                if(self.placedetails.components[addressType]) {
                    self.placedetails.components[addressType].set = true;
                    self.placedetails.components[addressType].short = place.address_components[i]['short_name'];
                    self.placedetails.components[addressType].long = place.address_components[i]['long_name'];
                }                                     
            }                  
            // set place in map
            self.map.setCenter(place.geometry.location);
            //self.createMapMarker(place);
           
            // populate
            self.address.set = true;
            console.log('page > getPlaceDetail > details > ', self.placedetails);
            console.log('result', result);

            
           
             

            //this.data = self.extractData(result).map(self.handleData).catch(Error);
            //result.map(self.extractData);
          
            result.map(res => {
                  
              console.log('result this.data 0', res)
              
                if (res == word_search){
                  console.log('train station trouvée');
                  //alert('train station trouvée');
                  self.showAlert(word_search);
                  }else{
                      console.log('train station non trouvée');
                  }

            });
 
            
  
        }else{
            console.log('page > getPlaceDetail > status > ', status);
        }
    }
  }
  
  
  private initPlacedetails() {
    this.placedetails = {
        address: '',
        lat: '',
        lng: '',
        components: {
            route: { set: false, short:'', long:'' },                           // calle 
            street_number: { set: false, short:'', long:'' },                   // numero
            sublocality_level_1: { set: false, short:'', long:'' },             // barrio
            locality: { set: false, short:'', long:'' },                        // localidad, ciudad
            administrative_area_level_2: { set: false, short:'', long:'' },     // zona/comuna/partido 
            administrative_area_level_1: { set: false, short:'', long:'' },     // estado/provincia 
            country: { set: false, short:'', long:'' },                         // pais
            postal_code: { set: false, short:'', long:'' },                     // codigo postal
            postal_code_suffix: { set: false, short:'', long:'' },              // codigo postal - sufijo
        }    
    };        
  }    

}
