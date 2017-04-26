import {User} from "./user.model";
export class Roster {
  children: Roster[];
  order: string;
  title: string;
  users: User[];
  uuid: string;
}
