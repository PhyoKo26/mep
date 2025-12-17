import { jwtDecode } from 'jwt-decode';
import { useAuthStore } from 'store';

type JwtPayload = {
  userId?: string;
  // add other fields if needed
};

function useUserId(): string {
  const { token } = useAuthStore();
  if (!token) return '';

  try {
    const jwt = jwtDecode(token);
    return jwt.sub ?? '';
  } catch {
    return '';
  }
}

export default useUserId;
