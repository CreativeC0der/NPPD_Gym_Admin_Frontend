export default interface User {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    age?: number;
    aadharNumber?: string;
    abhaId?: string;
    consent?: boolean;
    privacyNoticeAccepted?: boolean;
    emailVerified?: boolean;
    phoneVerified?: boolean;
    oauthProvider?: string;
    role: 'user' | 'admin' | 'superadmin' | 'consultant';
    status?: 'active' | 'pending' | 'banned';
    gym?: {
        _id: string;
        name: string;
    };
    createdAt: string;
    updatedAt: string;
    lastActive?: string;
    // Stats
    sessions?: number;
    healthScore?: number;
    engagement?: number;
    rating?: number;
    profile?: import('@/types/Profile').Profile;
}