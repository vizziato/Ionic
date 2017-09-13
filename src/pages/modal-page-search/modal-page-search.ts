import { Component, OnInit } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';


declare var google: any;

@Component({
    selector: 'page-modal-page-search',
    templateUrl: 'modal-page-search.html'
})
export class ModalAutocompleteItems{

    autocompleteItems: any;
    autocomplete: any;
    acService:any;
    placesService: any;

    constructor(public viewCtrl: ViewController,private geolocation: Geolocation,) { 
        this.acService = new google.maps.places.AutocompleteService(); 
       
        this.autocompleteItems = [];
        this.autocomplete = {
            query: ''
        };  
        console.log('construct  modal items.ts')  
    }

   


    ///////////////////////////////////////////////

    /*
    ionViewCanEnter() { // Added this function to loadMap { // Added this function to loadMap
    //this.acService = new google.maps.places.AutocompleteService();  
    this.autocompleteItems = [];
    this.autocomplete = {
        query: ''
    }; 
    console.log('ionViewDidLoad() 2  modal items.ts')      

    }*/

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

    ngOnInit() {
        this.acService = new google.maps.places.AutocompleteService();        
        this.autocompleteItems = [];
        this.autocomplete = {
            query: ''
        };        
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    chooseItem(item: any) {
        console.log('modal > chooseItem > item > ', item);
        this.viewCtrl.dismiss(item);
    }

    

    updateSearch() {
        console.log('modal > updateSearch');
        if (this.autocomplete.query == '') {
            this.autocompleteItems = [];
            return;
        }
        let self = this;
        let config = { 
            types:  ['geocode'], // other types available in the API: 'establishment', 'regions', and 'cities'
            input: this.autocomplete.query, 
            componentRestrictions: { country: 'CH' } 
        }
        this.acService.getPlacePredictions(config, function (predictions, status) {
            console.log('modal > getPlacePredictions > status > ', status);
            self.autocompleteItems = [];            
            predictions.forEach(function (prediction) {              
                self.autocompleteItems.push(prediction);
            });
        });
    }

}

