export interface IUser {
  type: string;
  id: number;
  profile: string;
  name: string | null;
  phone: string;
  password: string | null;
  otp: string;
  role: 'User' | 'Admin';
  is_active: boolean;
  birthDate: string | null;
  status: 'Single' | 'Married';
  weight: string | null;
  Township: string | null;
  Division: string | null;
  familyPlan: 'AvoidPregnant' | 'Conceiving';
  createdAt: string;
  updatedAt: string;
  isNotified: boolean;
}

export interface IPost {
  id: number;
  title: string;
  description: string;
  featured_image: string;
  layout_type: string;
  created_at: string;
  updated_at: string;
  photo_count: number;
}

export interface INotification {
  id: number;
  title: string;
  body: string;
  type: string;
  target_audience: string;
  data: string | null;
  scheduled_at: string | null;
  sent_at: string,
  status: string,
  created_at: string;
  updated_at: string;
  created_by_name: string,
  is_urgent: boolean
}
