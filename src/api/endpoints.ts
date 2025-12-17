import { create } from 'axios';

export const API_ENDPOINTS = {
  register_token: '/app_api/notifications/register-token',
  get_all_articles: '/app_api/articles',
  get_all_notifications: '/app_api/notifications/lists',
  get_all_payments: '/app_api/payments',
  payment_desc: '/app_api/payment_desc',
  payment_upload: '/app_api/payment_upload',
  request_otp: '/app_api/auth/request-otp',
  verify_otp: '/app_api/auth/verify-otp',
  create_user: '/api/member-requests',
  member_fee: '/app_api/member-fees',
  get_user: '/app_api/auth/profile',
  get_member_by_id: '/app_api/members',
  logout: '/app_api/auth/logout',
  guest_token: '/app_api/guest-token',
  token_request: '/app_api/token-request',
};
