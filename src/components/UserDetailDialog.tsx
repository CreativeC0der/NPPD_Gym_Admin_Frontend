import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type User from "../types/User";

interface UserDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null;
    getInitials: (name: string) => string;
    getStatusBadge: (status: string) => React.ReactNode;
}

const UserDetailDialog: React.FC<UserDetailDialogProps> = ({
    open,
    onOpenChange,
    user,
    getInitials,
    getStatusBadge,
}) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-xl">
            <DialogHeader>
                <DialogTitle>User Details</DialogTitle>
                <DialogDescription>
                    Detailed information for the selected user.
                </DialogDescription>
            </DialogHeader>
            {user ? (
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16 bg-slate-700">
                            <AvatarFallback className="bg-slate-700 text-white text-lg font-semibold">
                                {getInitials(user?.profile?.fullName ?? user?.name ?? 'Unknown')}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-xl font-semibold">{user?.profile?.fullName ?? user?.name ?? 'Unknown User'}</h3>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                {getStatusBadge(user?.emailVerified && user?.phoneVerified ? 'active' : (!user?.emailVerified || !user?.phoneVerified) ? 'pending' : 'active')}
                                <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                    User
                                </Badge>
                                {user?.profile?.membershipStatus && (
                                    <Badge className="bg-slate-800 text-slate-300 border-slate-700">
                                        {user.profile.membershipStatus.charAt(0).toUpperCase() + user.profile.membershipStatus.slice(1)}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-semibold">Email:</span> {user?.profile?.email ?? user?.email ?? 'No email'}
                        </div>
                        <div>
                            <span className="font-semibold">Phone:</span> {user?.profile?.phone ?? user?.phone ?? '-'}
                        </div>
                        <div>
                            <span className="font-semibold">Joined:</span> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                        </div>
                        <div>
                            <span className="font-semibold">Subscription:</span> {user?.profile?.subscriptionType ?? '-'}
                        </div>
                        <div>
                            <span className="font-semibold">Age:</span> {user?.profile?.healthMetrics?.age ?? user?.age ?? '-'}
                        </div>
                        <div>
                            <span className="font-semibold">Gender:</span> {user?.profile?.healthMetrics?.gender ?? '-'}
                        </div>
                        <div>
                            <span className="font-semibold">Fitness Goal:</span> {user?.profile?.healthMetrics?.fitnessGoal?.replace('_', ' ') ?? '-'}
                        </div>
                        <div>
                            <span className="font-semibold">Status:</span> {user?.status ?? '-'}
                        </div>
                    </div>
                    <DialogClose asChild>
                        <Button className="mt-4 w-full" variant="secondary">Close</Button>
                    </DialogClose>
                </div>
            ) : (
                <div>No user selected.</div>
            )}
        </DialogContent>
    </Dialog>
);

export default UserDetailDialog;
