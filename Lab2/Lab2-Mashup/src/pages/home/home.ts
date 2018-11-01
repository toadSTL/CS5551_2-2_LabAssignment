import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

declare var google;

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  start = 'chicago, il';
  end = 'chicago, il';
  place = '';
  //service;
  //infowindow;
  placeFound = ''
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;

  constructor(public navCtrl: NavController, private geolocation: Geolocation) {

  }

  ionViewDidLoad(){
    this.initMap();
  }
  
  

  initMap() {
    this.geolocation.getCurrentPosition().then((resp) => {
        // resp.coords.latitude
        // resp.coords.longitude
        this.map = new google.maps.Map(this.mapElement.nativeElement, {
            zoom: 8,
            center: {lat: resp.coords.latitude, lng: resp.coords.longitude}
        });
        this.directionsDisplay.setMap(this.map);
    }).catch((error) => {
        console.log('Error getting location', error);
    });
  }

    public getPlace(place) {
        console.log(place);
        
        var request ={
            input: place,
            inputtype: 'textquery',
            fields: ['place_id']
        };
        
        var placeFound = '';
        
        
        //
        var service = new google.maps.places.PlacesService(this.map);
        service.textSearch(request, (results, status) => {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                console.log(results);
                placeFound = results.place_id;
                var req = {
                    placeId: placeFound,
                    fields: ['name', 'rating', 'reviews', 'formatted_phone_number', 'geometry']
                }
                service.getDetails(req, (results, status) => {
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        console.log(results);
                    }
                });
            }
        });
        
        //var infowindow = new google.maps.InfoWindow();
        //.then(_ => {
        //    this.getPlaceDetails(placeFound);
        //});    
    }
    
    //public async callback(results, status) => {
    //        if (status == google.maps.places.PlacesServiceStatus.OK) {
    //            console.log(results);
    //            placeFound = results.place_id;
    //            var req = {
    //                placeId: placeFound,
    //                fields: ['name', 'rating', 'reviews', 'formatted_phone_number', 'geometry']
    //            }
    //            service.getDetails(req, (results, status) => {
    //                if (status == google.maps.places.PlacesServiceStatus.OK) {
    //                    console.log(results);
    //                }
    //            });
    //        }
     //   });
    
    
    public getPlaceDetails(placeID){
            console.log("got here")
            var req = {
                placeId: placeID,
                fields: ['name', 'rating', 'reviews', 'formatted_phone_number', 'geometry']
            }
            var service = new google.maps.places.PlacesService(this.map);
            service.getDetails(req, (results, status) => {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    console.log(results);
                }
            });   
    }
    
    public createMarker(place) {
        new google.maps.Marker({
            position: place.geometry.location,
            map: this.map
        });
    }
    
  
  ngAfterViewInit() {
        let tabs = document.querySelectorAll('.show-tabbar');
        if (tabs !== null) {
            Object.keys(tabs).map((key) => {
                tabs[key].style.display = 'none';
            });
        }
    }
    
    ionViewWillLeave() {
        let tabs = document.querySelectorAll('.show-tabbar');
        if (tabs !== null) {
            Object.keys(tabs).map((key) => {
                tabs[key].style.display = 'flex';
            });

        }
    }

}
