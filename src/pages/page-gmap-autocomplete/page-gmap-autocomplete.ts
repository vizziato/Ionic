import { Component,ViewChild,Input, ElementRef,EventEmitter  } from '@angular/core';
import { NavController, ModalController} from 'ionic-angular';
import { ModalAutocompleteItems } from '../modal-autocomplete-items/modal-autocomplete-items';
import { Geolocation } from '@ionic-native/geolocation';
//import { Observable } from 'rxjs';


declare var google:any;

@Component({
    selector: 'page-page-gmap-autocomplete',
    templateUrl: 'page-gmap-autocomplete.html'
})
export class PageGmapAll {
//export class PageGmapAutocomplete implements OnInit {
        @ViewChild('map') mapElement: ElementRef; // Added

    address:any = {
        place: '',
        set: false,
    };

    placesService:any;
    map: any; // Added
    geocoder: any; // Added
    markers = [];
    types=[];
    placedetails: any;
    public click: number = 0;
    rectangle:any;
    bounds:any;
    infoWindow:any;
    infoWindowRect:any;

    @Input() string;mapevents: string;
    showHide:boolean;


    constructor(public navCtrl: NavController,private geolocation: Geolocation,public modalCtrl: ModalController) { 
        this.mapevents= 'panrectangle';
        this.showHide = false;
       
          
    }
    ngDoCheck()
    {
        console.log('ngDoCheck');
        
    }

    ngAfterViewInit() {
        console.log('AfterViewInit');
       
        
        
    }
    ngAfterContentInit(){
        console.log('ngAfterContentInit');
        //this.infoWindowRect.close(this.map);
        //this.showNewRect();
       
    }

    ngAfterContentChecked(){
        console.log('ngAfterContentChecked');
        let that = this;
        let content= '';
        try {
            //this.addInfoWindow(this.markers[1], content)
            //this.rectangle.addListener('bounds_changed', this.showNewRect())
                
            console.log('markers',this.markers[1]);
            console.log('types',this.types[1]);

            

            if(this.mapevents== 'clickmarker'){
                google.maps.event.addListener(this.map, 'click', function(event) {
                    console.log('maps events lat+log', event.latLng.lat(),event.latLng.lng());
                    console.log('maps events event', event);
                    console.log('maps events  pixel', event.pixel);
                    console.log('maps events  placeId', event.placeId);
                    
                    that.placeMarker(event.latLng);

                    this.showHide = false;
                    
                                
                
                });
            }
            else if(this.mapevents== 'addmarker'){
                this.showHide = true;
            }
            else{
                this.showHide = false;
                
            
            }
            
        } catch (error) {
            console.log('view dont ready');
        }

    }
    
    ngAfterViewChecked() {
        // viewChild is set after the view has been initialized
        console.log('mapevents',this.mapevents);
        console.log('AfterViewChecked');
       
       
      }
     
    onPropChangeClick(e) { 
        if(this.mapevents== 'addmarker' || this.mapevents == 'clickmarker')
            {
                console.log("changed value click", e); 
                console.log("changed value click layerX,layerY", e.layerX,e.layerY); 
            
            }
       
    }
    onPropChangeSwipe(e) { 
       
        console.error("changed value swipe", e);
        //console.info('getBounds() swipe',this.rectangle.getBounds());
        //this.showNewRect(); 
        
    }
    onPropChangePan(e) {    
        
        if(this.mapevents== 'panrectangle'){
            console.log("changed value pan", e); 
            console.info("changed value pan velocity", e.velocity);
            this.infoWindowRect.close(this.map);
            this.rectangle.getBounds();
            console.info('getBounds() pan',this.rectangle.getBounds());
            this.showNewRect();
            
        }
        
    }

    
    
    getGeo()
    {
      this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
       alert(JSON.stringify(resp));
      }).catch((error) => {
       alert('Error getting location'+JSON.stringify(error));
      });
    }

    ionViewDidLoad() { // Added this function to loadMap
        this.loadMap();
        this.initPlacedetails();
        
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
                                /*
                                try {
                                    // Add an event listener on the rectangle.
                                    //this.rectangle.addListener('bounds_changed', this.showNewRect()); 
                                    google.maps.event.addListener(this.map, 'idle', function(){
                                        //alert("just pop twice!")}
                                        console.log('idle');
                                        //that.showNewRect();
                                        try {
                                            that.showNewRect();
                                        } catch (error) {
                                            console.error('rect error');
                                        }
                                        //this.rectangle.addListener('bounds_changed', this.showNewRect()); 
                                    });
                                } catch (error) {
                                    console.error('rect error');
                                }*/
           
          
          


          this.geocoder = new google.maps.Geocoder;
         
         
         
        }, (err) => {
          console.log(err);
        });
    }
   
     
    addMarker() { // To Add Marker
        let marker = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: this.map.getCenter(),
          draggable:true,
          title:"Drag me!"
        });
        let content = "<h3>My New Location!</h3><h5>by Anish youtube - Please subscribe</h5>";
        //this.addInfoWindow(marker, content);
        //this.getGeo();
        console.log('latitude: '+marker.position.lat(), 'longitude: '+marker.position.lng());
        console.log(marker);

        //this.geocodeLatLng(this.geocoder, this.map, this.addInfoWindow);
        /*let latLng = new google.maps.LatLng(marker.position.lat(), marker.position.lng());        
        let geocode = new google.maps.Geocoder({
            location: latLng,
        })


        console.log('geocode', geocode);*/
        let latLng = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
        let infoWindow = new google.maps.InfoWindow(); 
        let that = this;
        this.geocoder.geocode({'location': latLng}, function(results, status) {
            if (status === 'OK') {
              if (results[1]) {
                //this.map.setZoom(11);
                console.log('status ok');
                console.log('status ok',results[1].place_id);
                that.getPlaceDetail(results[1].place_id);
                //that.geocodeLatLng();
                /*let marker = new google.maps.Marker({
                    map: this.map,
                    animation: google.maps.Animation.DROP,
                    //position: this.map.getCenter(),
                    draggable:true,
                    title:"Drag me!"
                  });*/
                let content = '<p>Marker Location:' + marker.getPosition() + ' adresse: ' + results[1].formatted_address + '</p>';
                infoWindow.setContent(content);
                infoWindow.open(that.map,marker);
                //let content = '<p>Marker Location:' + marker.getPosition() + '</p>';
                
                /*let infoWindow = new google.maps.InfoWindow({
                    content: '<p>Marker Location:' + results[1].formatted_address+ '</p>',
                    map: that.map
                    });
                infoWindow.open();*/
                //this.addInfoWindow(marker, content);
              } else {
                alert('No results found');
              }
            } else {
              alert('Geocoder failed due to: ' + status);
            }
          });

        
    }

    geocodeLatLng(){
        console.log('t es bon toi');
    }

    showNewRect() {
        let ne = this.rectangle.getBounds().getNorthEast();
        let sw = this.rectangle.getBounds().getSouthWest();
        this.infoWindowRect = new google.maps.InfoWindow(); 
   
        let contentString = '<b>Rectangle moved.</b><br>' +
            'New north-east corner: ' + ne.lat() + ', ' + ne.lng() + '<br>' +
            'New south-west corner: ' + sw.lat() + ', ' + sw.lng() ;
    
        // Set the info window's content and position.

        /*let content = '<p>Marker Location:' + marker.getPosition() + ' adresse: ' + results[1].formatted_address + '</p>';
        infoWindow.setContent(content);
        infoWindow.open(that.map,marker);*/

        this.infoWindowRect.setContent(contentString);
        this.infoWindowRect.setPosition(ne);
    
        this.infoWindowRect.open(this.map);
        //this.addInfoWindow(contentString,ne);
    
    
        console.log('define rec');
      }
    /**
     * FIRST VERSION SUBSTITUED BY ionViewDidLoad()
     */
    /*

    */


    showModal() {
        // reset 
        this.reset();
        // show modal|
        let modal = this.modalCtrl.create(ModalAutocompleteItems);
        modal.onDidDismiss(data => {
            console.log('page > modal dismissed > data > ', data);
            if(data){
                this.address.place = data.description;
                // get details
                this.getPlaceDetail(data.place_id);
            }                
        })
        modal.present();
    }


    addInfoWindow(marker, content) {
        let infoWindow = new google.maps.InfoWindow({
        content: content
        });
        let infoWindowPos = new google.maps.InfoWindow({
        content: '<p>Marker Location:' + marker.getPosition() + '</p>'
        });
        /*google.maps.event.addListener(marker, 'click', () => {
        infoWindowPos.open(this.map, marker);
        });*/
       
    }

    addInfoWindow2(content) {
        let infoWindow = new google.maps.InfoWindow({
        content: content
        });
       
    }

    placeMarker(location) {
        
        let marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: location,
            draggable:true,
            title:"Drag me!"
          });
          //this.getGeo();
          console.log('latitude: '+marker.position.lat(), 'longitude: '+marker.position.lng());
       
        let infoWindow = new google.maps.InfoWindow({
          content: '<p>Marker Location:' + marker.getPosition() + '</p>'
          //content :'<p>Marker Location:' + marker.getPosition() + ' adresse: ' + results[1].formatted_address + '</p>';
        });

        infoWindow.open(this.map, marker);
       
       
      }



    /*
    fevents(e){
        console.log(e);
        this.rectangle.addListener('swipe', this.showNewRect())
        //this.showNewRect();
    }*/

    private reset() {
        this.initPlacedetails();
        this.address.place = '';
        this.address.set = false;
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
                self.createMapMarker(place);
                //console.log('returnmarker',self.createMapMarker(place));
               
                /*var subscription = self.createMapMarker(place).marker.subscribe(response =>{
                        console.log('response subsrcide', response)
                    }
                )*/
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
    /******* FIRST VERSION */
    /*SUBSTITUED BY LOADMAP()
    private initMap() {
        var point = {lat: 46.585674, lng: 6.601230}; 
        let divMap = (<HTMLInputElement>document.getElementById('map'));
        this.map = new google.maps.Map(divMap, {
            center: point,
            zoom: 15,
            disableDefaultUI: true,
            draggable: false,
            zoomControl: true
        });
    }**
    /*////////&*//////////////////////
    /*getMessage(marker): Observable<any> {
        return marker.asObservable();
    }*/
   

    private createMapMarker(place:any){
        var placeLoc = place.geometry.location;
        ///var marker: Observable<any>;
        var marker = new google.maps.Marker({
          map: this.map,
          position: placeLoc,
          draggable:true
        });    
        this.markers.push(marker);

        console.log('getplace',marker);

        let content = "";
        this.addInfoWindow(marker, content);
        //this.getGeo();
        //console.log('latitude: '+marker.sposition.lat(), 'longitude: '+marker.position.lng());
        //console.log('marker created ', marker);
        /*this.getMessage(marker).subscribe(response =>{
            console.log('rsponse',response);
        })*/

        

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
