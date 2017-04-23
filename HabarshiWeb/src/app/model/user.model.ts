export class User {
  session: string;
  username: string;

  constructor(session: string, username: string) {
    this.session = session;
    this.username = username;
  }
}
