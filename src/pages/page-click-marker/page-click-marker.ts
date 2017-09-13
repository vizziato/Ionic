import { Component,ViewChild, ElementRef, } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';


declare var google; // Added

/**
 * Generated class for the PageClickMarkerPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */


@Component({
  selector: 'page-page-click-marker',
  templateUrl: 'page-click-marker.html',
})
export class PageClickMarkerPage {

  @ViewChild('map') mapElement: ElementRef; // Added
  map: any; // Added
  infoWindow:any;
  geocoder:any;
  placedetails: any;
  placesService:any;
  markers = [];
  infoWindows =[];
  indexWindow:number;


  address:any = {
    place: '',
    set: false,
  };  

  constructor(public navCtrl: NavController,public geolocation: Geolocation, public navParams: NavParams) {
  }



  ionViewDidLoad() { // Added this function to loadMap
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
          that.getPlaceDetail(results[1].place_id);

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
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      try {
        
          google.maps.event.addListener(this.map, 'click', function(event) {
              console.log('maps events lat+log', event.latLng.lat(),event.latLng.lng());
              console.log('maps events event', event);
              console.log('maps events  pixel', event.pixel);
              console.log('maps events  placeId', event.placeId);
              
              that.placeMarker(event.latLng);
          
          
          });
        
         
      } catch (error) {
         console.log('view dont ready');
      }
     
      this.geocoder = new google.maps.Geocoder;
     
    }, (err) => {
      console.log(err);
    });
  }


  /*ngAfterContentChecked(){
    console.log('ngAfterContentChecked');
   
    

    }*/


    onPropChangeClick(e) { 
 
        console.log("changed value click", e); 
        for (var i = 0; i < this.infoWindows.length; i++) {
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
          }
     
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
    var self = this;
    var request = {
        placeId: place_id
    };
    this.placesService = new google.maps.places.PlacesService(this.map);
    this.placesService.getDetails(request, callback);
    function callback(place, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            console.log('page > getPlaceDetail > place > ', place);
            // set full address
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
            return result;
            
  
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
