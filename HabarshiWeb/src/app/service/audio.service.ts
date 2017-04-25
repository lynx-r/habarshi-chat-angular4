import {EventEmitter, Injectable, Output} from '@angular/core';
import {Utils} from "../util/util";

declare const MediaRecorder: any;

@Injectable()
export class AudioService {

  private chunks = [];
  private constraints = {audio: true};
  private mediaRecorder: any;
  private recording: boolean;
  @Output() blobReady = new EventEmitter<Blob>();

  constructor() {
    navigator.getUserMedia(this.constraints, (stream) => {
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.ondataavailable = (e) => {
        this.blobReady.emit(e.data);
      };
    }, Utils.handleError);
  }

  toggle(): Promise<any> {
    if (this.recording) {
      return this.stop();
    } else {
      return this.start();
    }
  }

  private start(): Promise<any> {
    this.mediaRecorder.start();
    this.recording = true;
    return Promise.resolve(false);
  }

  private stop(): Promise<File> {
    this.mediaRecorder.stop();
    return new Promise((resolve, reject) => {
      this.blobReady.subscribe((blob) => {
        const file = new File([blob], 'audio-' + (new Date).toISOString().replace(/[:.]/g, '-') + '.webm',
          {'type': 'video/webm'});
        this.chunks = [];
        this.recording = false;
        resolve(file);
      }, (error) => {
        Utils.handleError(error);
        reject(null);
      })
    });
  }

  public static isSupportRecording(): boolean {
    return !!navigator.mediaDevices;
  }

}
