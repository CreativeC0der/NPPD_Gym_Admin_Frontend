import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'user' | 'consultant' | 'admin' | 'superadmin';

export interface User {
    userId: string;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
}

export interface UserState {
    user: User | null;
    isLoading: boolean;
}

const initialState: UserState = {
    user: null,
    isLoading: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isLoading = false;
        },
        clearUser: (state) => {
            state.user = null;
            state.isLoading = false;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
    },
});

export const { setUser, clearUser, setLoading } = userSlice.actions;
export default userSlice.reducer;