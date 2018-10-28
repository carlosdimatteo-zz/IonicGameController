import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";

import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { SocketIoModule, SocketIoConfig } from "ng-socket-io";

import { MyApp } from "./app.component";
import { HomePage } from "../pages/home/home";

const config: SocketIoConfig = { url: "http://192.168.2.4:3001", options: {} };

@NgModule({
  declarations: [MyApp, HomePage],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    SocketIoModule.forRoot(config)
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, HomePage],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ScreenOrientation
  ]
})
export class AppModule {}
