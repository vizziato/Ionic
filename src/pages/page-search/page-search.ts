import { Component,ViewChild,Input, ElementRef,EventEmitter  } from '@angular/core';
import { NavController, ModalController} from 'ionic-angular';
import { ModalAutocompleteItems } from '../modal-autocomplete-items/modal-autocomplete-items';
import { Geolocation } from '@ionic-native/geolocation';


declare var google:any;

@Component({
    selector: 'page-page-search',
    templateUrl: 'page-search.html'
})
export class PageGmapAutocomplete {
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



    constructor(public navCtrl: NavController,private geolocation: Geolocation,public modalCtrl: ModalController) { 
       
          
    }
    ngDoCheck()
    {
        console.log('ngDoCheck');
        
    }

    ngAfterViewInit() {
        console.log('AfterViewInit');
       
        
        
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



          this.geocoder = new google.maps.Geocoder;
         
         
         
        }, (err) => {
          console.log(err);
        });
    }
   
     
    


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
