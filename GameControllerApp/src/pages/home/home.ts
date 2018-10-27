import { Component } from "@angular/core";
import { NavController, Platform } from "ionic-angular";
import { Socket } from "ng-socket-io";
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  keys: any;
  joystick:any
  connected: boolean;
  constructor(public navCtrl: NavController, private socket: Socket,private screen:ScreenOrientation,private platform:Platform) {
    this.keys = {
      upKey: { keyCode: 38 },
      downKey: { keyCode: 40 },
      leftKey: { keyCode: 37 },
      rightKey: { keyCode: 39 },
      fireKey: { keyCode: 32 }
    };
    this.connect();
      if(this.platform.is('mobile')){
        // this.screen.lock(this.screen.ORIENTATIONS.LANDSCAPE);  
      }
    }
 
  keyPress(object) {
    console.log("Pressed " + JSON.stringify(object));
    this.socket.emit("press", object);
  }

  connect() {
    console.log("trying connection");
    this.socket.on("connected", () => {
      this.connected = true;
      console.log("connected");
      this.socket.emit("identify", { type: "controller" });
    });
    this.socket.on("message", message => {
      alert(message);
      this.connected = false;
      this.socket.emit("disconnected", "controller");
      this.socket.disconnect();
    });
  }

  keyRelease(object) {
    console.log("Released " + JSON.stringify(object));
    this.socket.connect();
    this.socket.emit("release", object);
  }

  ionViewWillLeave() {
    this.connected = false;
    this.socket.emit("disconnected", "controller");
    this.socket.disconnect();
  }
}
