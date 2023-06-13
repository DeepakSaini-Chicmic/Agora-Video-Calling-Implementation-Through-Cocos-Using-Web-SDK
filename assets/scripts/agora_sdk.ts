import AgoraRTC from "agora-rtc-sdk-ng";

let options = {
  // Pass your App ID here.
  appId: "dc671a57cfca4c7f8bf7425bb2d22ee6",
  // Set the channel name.
  channel: "TestingChannel",
  // Pass your temp token here.
  token:
    "007eJxTYFgWmBX2vN8s9vLT38asN88etiya9Mbx7eQA5i93ZhYvW7dBgSEl2czcMNHUPDktOdEk2TzNIinN3MTINCnJKMXIKDXV7OvP9pSGQEaGq1bVzIwMEAji8zGEpBaXZOalO2ck5uWl5jAwAADeDyeo",
  // Set the user ID.
  uid: 152,
};

let channelParameters = {
  // A variable to hold a local audio track.
  localAudioTrack: null,
  // A variable to hold a remote audio track.
  remoteAudioTrack: null,
  // A variable to hold the remote user id.
  remoteUid: null,
};

export class AgoraSDK {
  private static _instance: any = null;

  agoraEngine: any = null;

  static getInstance(): AgoraSDK {
    if (!AgoraSDK._instance) {
      AgoraSDK._instance = new AgoraSDK();
    }
    return AgoraSDK._instance;
  }

  createClient() {
    this.agoraEngine = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    console.log("Agora Engine", this.agoraEngine);
    this.agoraEngine.on("user-published", async (user: any, mediaType: any) => {
      await this.agoraEngine.subscribe(user, mediaType);
      console.log("subscribe Successful", user, mediaType);

      if (mediaType == "audio") {
        channelParameters.remoteUid = user.uid;
        // Get the RemoteAudioTrack object from the AgoraRTCRemoteUser object.
        channelParameters.remoteAudioTrack = user.audioTrack;
        // Play the remote audio track.
        channelParameters.remoteAudioTrack.play();
        console.log("Remote User Connected : ", user);
      }
    });

    this.agoraEngine.on("user-unpublished", (user: any) => {
      console.log(user.uid + "has left the channel");
      console.log("Remote user has left the channel");
    });
  }

  async joinCall() {
    await this.agoraEngine.join(
      options.appId,
      options.channel,
      options.token,
      options.uid
    );
    console.log("AgorA Engine", this.agoraEngine);

    console.log("Joined channel: " + options.channel);
    // Create a local audio track from the microphone audio.
    channelParameters.localAudioTrack =
      await AgoraRTC.createMicrophoneAudioTrack();
    // Publish the local audio track in the channel.
    await this.agoraEngine.publish(channelParameters.localAudioTrack);
    console.log("Publish success!");
  }

  async leaveCall() {
    // Destroy the local audio track.
    channelParameters.localAudioTrack.close();
    // Leave the channel
    await this.agoraEngine.leave();
    console.log("You left the channel");
    // Refresh the page for reuse
    window.location.reload();
  }
}
