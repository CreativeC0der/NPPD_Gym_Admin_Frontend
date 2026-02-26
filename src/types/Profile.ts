export interface Profile {
    _id: string;
    userId: string;
    fullName: string;
    email: string;
    phone: string;
    bio: string;
    profileImage: string | null;
    dateOfBirth: string;
    aadharNumber: string;
    abhaId: string;
    healthMetrics: {
        weight: string;
        height: string;
        age: string;
        gender: string;
        fitnessGoal: string;
    };
    workPreferences: {
        occupation: string;
        workoutTiming: string;
        availableDays: string[];
        workStressLevel: string;
        sedentaryHours: string;
        workoutLocation: string;
    };
    notifications: {
        workoutReminders: boolean;
        newContent: boolean;
        promotionOffers: boolean;
        appointmentReminders: boolean;
    };
    security: {
        biometricLogin: boolean;
        twoFactorAuth: boolean;
    };
    address: {
        street: string;
        city: string;
        state: string;
        pincode: string;
    };
    logincount: number;
    membershipStatus: string;
    badgeCount: number;
    achievements: string[];
    joiningDate: string;
    leavingDate: string;
    reasonOfLeaving: string;
    subscriptionType: string;
    isHiwoxMember: boolean;
    subscriptionRenewalDate: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}
