import { Component,ViewChild, ElementRef, } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';


declare var google; // Added

@Component({
  selector: 'page-rectangle',
  templateUrl: 'page-rectangle.html'
})
export class PageRectangle {

  @ViewChild('map') mapElement: ElementRef; // Added
  map: any; // Added
  public click: number = 0;
  rectangle:any;
  bounds:any;
  infoWindow:any;
  
  

  constructor(public navCtrl: NavController,public geolocation: Geolocation, public navParams: NavParams) {
    
   
  }

  onPropChangePan(e) {    
    
        console.log("changed value pan", e); 
        console.info("changed value pan velocity", e.velocity);
        //this.infoWindow.close(this.map);
        //this.rectangle.getBounds();
        //console.info('getBounds() pan',this.rectangle.getBounds());
        //console.info('getBounds() pan',this.rectangle.getProjection());
        //this.showNewRect();
    
  }

  ionViewDidLoad() { // Added this function to loadMap
    this.loadMap();
  }


//home.ts File
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

      this.bounds = {
        north: position.coords.latitude+0.1,
        south: position.coords.latitude-0.1,
        east: position.coords.longitude+0.1,
        west: position.coords.longitude-0.1
      };
      this.rectangle = new google.maps.Rectangle({
        bounds: this.bounds,
        editable: true,
        draggable: true
      });

      this.rectangle.setMap(this.map);
      this.showNewRect();
      console.log('load Maps fn ok');

      try {
        
          google.maps.event.addListener(this.rectangle, 'bounds_changed', function(event) {
             console.log('page-rectangle bounds_changes event');
             that.infoWindow.close(that.map);
             that.rectangle.getBounds();
             console.info('getBounds() pan',that.rectangle.getBounds());
             that.showNewRect();
              
          });
        
         
      } catch (error) {
         console.log('listener dont ready');
      }
     
    }, (err) => {
      console.error(err);
    });
  }

  showNewRect() {
    let ne = this.rectangle.getBounds().getNorthEast();
    let sw = this.rectangle.getBounds().getSouthWest();
    this.infoWindow = new google.maps.InfoWindow(); 

    let contentString = '<b>Rectangle moved.</b><br>' +
        'New north-east corner: ' + ne.lat() + ', ' + ne.lng() + '<br>' +
        'New south-west corner: ' + sw.lat() + ', ' + sw.lng() ;

    // Set the info window's content and position.
    this.infoWindow.setContent(contentString);
    this.infoWindow.setPosition(ne);

    this.infoWindow.open(this.map);

     console.log('showNewRect() fn ok');
  }

}
