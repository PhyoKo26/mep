export interface LoginRequest {
  email: string;
  fcmToken?: string | null;
  password: string;
}

export interface CreateUserRequest {
  fcmToken?: string | null;
  deviceId?: string | null;
  name: string;
  phone?: string;
  otp?: string;
  township?: string;
  division?: string;
  email?: string;
  password?: string;
}

export interface VerifyUserRequest {
  phone: string;
}
export interface BookQueryParams {
  list_id?: number;
  id?: number;
  search?: string;
  limit: number;
};
