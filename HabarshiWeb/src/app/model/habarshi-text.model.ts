import * as mime from "mime";

export class HabarshiText {
  public static HABARSHI_HEADER: string = '<HabarshiServiceMessage>'
  file_name: string;
  full_url: string;
  preview_url: string;
  type: string;

  constructor(text: string) {
    const rx = /<file_name>\|<([^>]+)>,<full_url>\|<([^>]+)>(?:,<preview_url>\|<([^>]+)>)?/g;
    const match = rx.exec(text);
    this.file_name = match[1];
    this.full_url = match[2];
    this.type = mime.lookup(this.full_url);
    this.preview_url = match[3];
  }

  getHabarshiMessage() {
    return [`<HabarshiServiceMessage>`,
      `<file_name>|<${this.file_name}>,`,
      `<full_url>|<${this.full_url}>,`,
      `<preview_url>|<${this.preview_url}>`].join();
  }
}
