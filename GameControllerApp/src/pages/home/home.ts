import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { Socket } from "ng-socket-io";
@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  keys: any;
  connected: boolean;
  constructor(public navCtrl: NavController, private socket: Socket) {
    this.keys = {
      upKey: { keyCode: 38 },
      downKey: { keyCode: 40 },
      leftKey: { keyCode: 37 },
      rightKey: { keyCode: 39 },
      fireKey: { keyCode: 32 }
    };
    this.connect();
  }

  keyPress(object) {
    console.log("Pressed " + JSON.stringify(object));
    this.socket.connect();
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
