export class ServerStatus {
  comment: string;
  ok: boolean;

  constructor(comment: string, ok: boolean) {
    this.comment = comment;
    this.ok = ok;
  }
}
