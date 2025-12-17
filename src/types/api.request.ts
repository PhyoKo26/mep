export interface LoginRequest {
  phone: string;
  fcmToken: string;
  password: string;
}

export interface CreateUserRequest {
  fcmToken?: string | null;
  deviceId?: string | null;
  name: string;
  phone: string;
  otp?: string;
  role?: 'User' | 'Admin';
  birthDate: string;
  status?: 'Single' | 'Married' | 'Pregnant';
  weight?: string;
  township?: string;
  division?: string;
  familyPlan?: 'AvoidPregnant' | 'Conceiving';
  password?: string;
}

export interface VerifyUserRequest {
  phone: string;
}
