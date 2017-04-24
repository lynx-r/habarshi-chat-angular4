import * as mime from "mime";

export class HabarshiText {
  public static HABARSHI_HEADER: string = '<HabarshiServiceMessage>'
  file_name: string;
  full_url: string;
  preview_url: string;
  type: string;


  constructor(file_name: string, full_url: string, preview_url: string) {
    this.file_name = file_name;
    this.full_url = full_url;
    this.preview_url = preview_url;
    this.type = mime.lookup(full_url);
  }

  static fromText(text: string) {
    const rx = /<file_name>\|<([^>]+)>,<full_url>\|<([^>]+)>(?:,<preview_url>\|<([^>]+)>)?/g;
    const match = rx.exec(text);
    const file_name = match[1];
    const full_url = match[2];
    const preview_url = match[3];
    return new this(file_name, full_url, preview_url)
  }

  toString() {
    return `<HabarshiServiceMessage><file_name>|<${this.file_name}>,<full_url>|<${this.full_url}>,<preview_url>|<${this.preview_url}>`;
  }
}
