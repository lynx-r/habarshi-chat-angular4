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
  uploads: string;
  room: boolean;

  constructor(session: string, username: string, uploads: string, room?: boolean) {
    this.session = session;
    this.username = username;
    this.uploads = uploads;
    this.room = room;
  }
}
