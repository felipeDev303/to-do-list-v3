export interface User {
  id: string;
  name: string;
}

interface AuthContextProps {
  user: User | null;
  login: (username: string, password: string) => void;
  logout: () => void;
}

const EXPECTED_USER = {};
