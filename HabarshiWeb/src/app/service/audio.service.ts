import {Injectable} from '@angular/core';
import {Utils} from "../util/util";
import {any} from "codelyzer/util/function";

declare var MediaRecorder: any;

@Injectable()
export class AudioService {

  private audioCtx: AudioContext;
  private chunks = [];

  private constraints = {audio: true};
  private mediaRecorder: any;
  private recording: boolean;

  constructor() {
    navigator.getUserMedia(this.constraints, (stream) => {
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.onstop = (e) => {
        const blob = new Blob(this.chunks, {'type': 'audio/ogg; codecs=opus'});
        this.chunks = [];
        const audioURL = URL.createObjectURL(blob);
        const audio = document.createElement('audio');
        document.body.appendChild(audio);
        audio.setAttribute('controls', '');
        audio.src = audioURL;
        console.log("recorder stopped");
        this.recording = false;
      };
      this.mediaRecorder.ondataavailable = (e) => {
        this.chunks.push(e.data);
      };
    }, Utils.handleError);
  }

  toggle(): Promise<File> {
    if (this.recording) {
      return this.stop();
    } else {
      return this.start();
    }
  }

  start(): Promise<any> {
    this.mediaRecorder.start();
    this.recording = true;
    console.log(this.mediaRecorder.state);
    console.log("recorder started");
    return Promise.resolve(false);
  }

  stop() {
    this.mediaRecorder.stop();
    console.log(this.mediaRecorder.state);
    console.log("recorder started");
    return Promise.resolve(new File([], 'a'));
  }

  public static isSupportRecording(): boolean {
    return !!navigator.mediaDevices;
  }

}
