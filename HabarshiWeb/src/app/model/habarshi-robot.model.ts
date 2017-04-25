import * as mime from "mime";

export class HabarshiRobot {
  action: string;
  actor: string;
  object: string;


  constructor(action: string, actor: string, object: string) {
    this.action = action;
    this.actor = actor;
    this.object = object;
  }

  static fromText(text: string) {
    const rx = /<action>\|<([^>]+)>,[\n\s]*<actor>\|<([^>]+)>,[\n\s]*<object>\|<([^>]+)>/g;
    const match = rx.exec(text);
    const file_name = match[1];
    const full_url = match[2];
    const preview_url = match[3];
    return new this(file_name, full_url, preview_url)
  }

  toString() {
    return `<HabarshiServiceMessage><action>|<${this.action}>,<actor>|<${this.actor}>,<object>|<${this.object}>`;
  }
}
