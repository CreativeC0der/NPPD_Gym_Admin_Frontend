import React, { useEffect, useMemo, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type User from '@/types/User';

export interface EditableUserFields {
    phone: string;
    address: {
        street: string;
        city: string;
        state: string;
        pincode: string;
    };
    subscriptionType: string;
    subscriptionRenewalDate: string;
    isHiwoxMember: boolean;
    leavingDate: string;
    reasonOfLeaving: string;
}

interface EditUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null;
    onSave: (userId: string, values: EditableUserFields) => Promise<void>;
    loading?: boolean;
}

const toDateInputValue = (date?: string) => {
    if (!date) return '';
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return '';
    return parsed.toISOString().split('T')[0];
};

const EditUserDialog: React.FC<EditUserDialogProps> = ({
    open,
    onOpenChange,
    user,
    onSave,
    loading = false,
}) => {
    const initialState = useMemo<EditableUserFields>(() => ({
        phone: user?.profile?.phone ?? user?.phone ?? '',
        address: {
            street: user?.profile?.address?.street ?? '',
            city: user?.profile?.address?.city ?? '',
            state: user?.profile?.address?.state ?? '',
            pincode: user?.profile?.address?.pincode ?? '',
        },
        subscriptionType: user?.profile?.subscriptionType ?? 'basic',
        subscriptionRenewalDate: toDateInputValue(user?.profile?.subscriptionRenewalDate),
        isHiwoxMember: Boolean(user?.profile?.isHiwoxMember),
        leavingDate: toDateInputValue(user?.profile?.leavingDate),
        reasonOfLeaving: user?.profile?.reasonOfLeaving ?? '',
    }), [user]);

    const [form, setForm] = useState<EditableUserFields>(initialState);

    useEffect(() => {
        setForm(initialState);
    }, [initialState]);

    const updateAddress = (key: keyof EditableUserFields['address'], value: string) => {
        setForm((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                [key]: value,
            },
        }));
    };

    const handleSave = async () => {
        if (!user?._id) return;
        await onSave(user._id, form);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>
                        Update only editable membership details. Other user fields are read-only.
                    </DialogDescription>
                </DialogHeader>

                {user ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label className="text-slate-300">Full Name</Label>
                                <Input
                                    value={user?.profile?.fullName ?? user?.name ?? ''}
                                    readOnly
                                    disabled
                                    className="bg-slate-800 border-slate-700 text-slate-300"
                                />
                            </div>
                            <div>
                                <Label className="text-slate-300">Email</Label>
                                <Input
                                    value={user?.profile?.email ?? user?.email ?? ''}
                                    readOnly
                                    disabled
                                    className="bg-slate-800 border-slate-700 text-slate-300"
                                />
                            </div>
                            <div>
                                <Label className="text-slate-300">Role</Label>
                                <Input
                                    value={user?.role ?? ''}
                                    readOnly
                                    disabled
                                    className="bg-slate-800 border-slate-700 text-slate-300"
                                />
                            </div>
                            <div>
                                <Label className="text-slate-300">Joined Date</Label>
                                <Input
                                    value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                                    readOnly
                                    disabled
                                    className="bg-slate-800 border-slate-700 text-slate-300"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="phone" className="text-slate-300">Phone Number</Label>
                                <Input
                                    id="phone"
                                    value={form.phone}
                                    onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                                    className="bg-slate-800 border-slate-700 text-white"
                                />
                            </div>
                            <div>
                                <Label htmlFor="subscriptionType" className="text-slate-300">Subscription Type</Label>
                                <Select
                                    value={form.subscriptionType}
                                    onValueChange={(value) => setForm((prev) => ({ ...prev, subscriptionType: value }))}
                                >
                                    <SelectTrigger id="subscriptionType" className="bg-slate-800 border-slate-700 text-white">
                                        <SelectValue placeholder="Select subscription" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="basic">Basic</SelectItem>
                                        <SelectItem value="super">Super</SelectItem>
                                        <SelectItem value="premium">Premium</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="subscriptionRenewalDate" className="text-slate-300">Renewal Date</Label>
                                <Input
                                    id="subscriptionRenewalDate"
                                    type="date"
                                    value={form.subscriptionRenewalDate}
                                    onChange={(e) => setForm((prev) => ({ ...prev, subscriptionRenewalDate: e.target.value }))}
                                    className="bg-slate-800 border-slate-700 text-white"
                                />
                            </div>
                            <div>
                                <Label htmlFor="leavingDate" className="text-slate-300">Leaving Date</Label>
                                <Input
                                    id="leavingDate"
                                    type="date"
                                    value={form.leavingDate}
                                    onChange={(e) => {
                                        const leavingDate = e.target.value;
                                        setForm((prev) => ({
                                            ...prev,
                                            leavingDate,
                                            reasonOfLeaving: leavingDate ? prev.reasonOfLeaving : '',
                                        }));
                                    }}
                                    className="bg-slate-800 border-slate-700 text-white"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <Label htmlFor="reasonOfLeaving" className="text-slate-300">Reason for Leaving</Label>
                                <Select
                                    value={form.reasonOfLeaving}
                                    onValueChange={(value) => setForm((prev) => ({ ...prev, reasonOfLeaving: value }))}
                                    disabled={!form.leavingDate}
                                >
                                    <SelectTrigger id="reasonOfLeaving" className="bg-slate-800 border-slate-700 text-white">
                                        <SelectValue placeholder="Select reason" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Relocation">Relocation</SelectItem>
                                        <SelectItem value="Financial reasons">Financial reasons</SelectItem>
                                        <SelectItem value="Lack of time">Lack of time</SelectItem>
                                        <SelectItem value="Health issues">Health issues</SelectItem>
                                        <SelectItem value="Dissatisfaction with services">Dissatisfaction with services</SelectItem>
                                        <SelectItem value="Joined another gym">Joined another gym</SelectItem>
                                        <SelectItem value="Personal reasons">Personal reasons</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-slate-300">Address</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    value={form.address.street}
                                    onChange={(e) => updateAddress('street', e.target.value)}
                                    placeholder="Street"
                                    className="bg-slate-800 border-slate-700 text-white"
                                />
                                <Input
                                    value={form.address.city}
                                    onChange={(e) => updateAddress('city', e.target.value)}
                                    placeholder="City"
                                    className="bg-slate-800 border-slate-700 text-white"
                                />
                                <Input
                                    value={form.address.state}
                                    onChange={(e) => updateAddress('state', e.target.value)}
                                    placeholder="State"
                                    className="bg-slate-800 border-slate-700 text-white"
                                />
                                <Input
                                    value={form.address.pincode}
                                    onChange={(e) => updateAddress('pincode', e.target.value)}
                                    placeholder="Pincode"
                                    className="bg-slate-800 border-slate-700 text-white"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 pt-1">
                            <Checkbox
                                id="isHiwoxMember"
                                checked={form.isHiwoxMember}
                                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, isHiwoxMember: checked === true }))}
                            />
                            <Label htmlFor="isHiwoxMember" className="text-slate-300 cursor-pointer">Is HiWox Member</Label>
                        </div>
                    </div>
                ) : (
                    <p className="text-slate-400">No user selected.</p>
                )}

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800"
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={!user || loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditUserDialog;
