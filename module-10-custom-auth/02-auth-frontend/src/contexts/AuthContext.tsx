import { createContext } from 'react';
import type { Dispatch, SetStateAction } from 'react';

type AuthContexType = {
	user: User | null;
	setUser: Dispatch<SetStateAction<User | null>>;
	authLoading: boolean;
};

export const AuthContext = createContext<AuthContexType | null>(null);
