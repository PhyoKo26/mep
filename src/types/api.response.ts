import { IUser } from 'types';
interface BasicResponse {
  status: boolean;
  message: string;
}
export interface LoginResponse extends BasicResponse {
  access_token: string;
  refresh_token: string;
  type: string;
}
export interface VerifyUserResponse extends BasicResponse {
  access_token: string;
  refresh_token: string;
  type: string;
}

export interface GenerateOtpResponse extends BasicResponse {
  trans_id: string;
}
