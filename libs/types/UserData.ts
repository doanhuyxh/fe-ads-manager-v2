export default interface UserData {
  _id: string;
  email: string;
  name?: string;
  passwordHash?:string;
  role?: string;
  companyIds: string[];
}