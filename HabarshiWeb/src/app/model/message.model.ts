export class Message {
  from: string;
  id: string;
  jid: string;
  marker: string;
  stamp: number;
  text: string;
  time: Date;
  to: string;


  constructor(from: string, id: string, jid: string, stamp: number, text: string, time: Date, to: string, marker?: string) {
    this.from = from;
    this.id = id;
    this.jid = jid;
    this.marker = marker;
    this.stamp = stamp;
    this.text = text;
    this.time = time;
    this.to = to;
  }
}
