import { _decorator, Component, Node } from "cc";
import { AgoraSDK } from "./agora_sdk";
const { ccclass, property } = _decorator;

@ccclass("AgoraImplementation")
export class AgoraImplementation extends Component {
  start() {
    AgoraSDK.getInstance().createClient();
    console.log("SDK Initialized");
  }

  joinCall() {
    console.log("Join Call");
    AgoraSDK.getInstance().joinCall();
  }

  leaveCall() {
    console.log("Leave Call");
    AgoraSDK.getInstance().leaveCall();
  }
  update(deltaTime: number) {}
}
