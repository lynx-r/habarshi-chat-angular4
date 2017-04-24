export class User {
  anonymous: boolean;
  avatar: string;
  color: string;
  descr: string;
  email: string;
  fullname: string;
  hash: string;
  id: number;
  jid: string;
  name: string;
  password: string;
  supervisor: boolean;
  telephony_home: string;
  telephony_mob: string;
  title: string;
  username: string;
  web: string;
  session: string;

  constructor(session: string, username: string) {
    this.session = session;
    this.username = username;
  }
}
