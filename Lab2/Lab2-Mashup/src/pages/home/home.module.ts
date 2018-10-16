import { NgModule } from '@angular/core';
import { HomePage} from './home';
import { IonicPageModule } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

@NgModule({
    declarations: [HomePage],
    imports: [IonicPageModule.forChild(HomePage)],
    entryComponents: [HomePage],
    providers: [
        Geolocation
    ]
})
export class HomePageModule { }