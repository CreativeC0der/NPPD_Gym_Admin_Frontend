import React, { useState } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import api from "@/axios/axios-config";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import type { CheckedState } from "@radix-ui/react-checkbox";

const defaultForm = {
    name: "",
    age: "",
    phone: "",
    email: "",
    password: "",
    role: "user",
    consent: false,
    privacyNoticeAccepted: false,
    joiningDate: "",
    leavingDate: "",
    reasonOfLeaving: "",
    subscriptionType: "basic",
    isHiwoxMember: false,
    subscriptionRenewalDate: "",
};

export default function CreateUserDialog({ onUserCreated }: { onUserCreated?: () => void }) {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(defaultForm);
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            setForm((prev) => ({
                ...prev,
                [name]: (e.target as HTMLInputElement).checked,
            }));
        } else {
            setForm((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleCheckboxChange = (name: string, checked: CheckedState) => {
        setForm((prev) => ({ ...prev, [name]: checked === true }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...form,
                age: form.age ? Number(form.age) : undefined,
                consent: Boolean(form.consent),
                privacyNoticeAccepted: Boolean(form.privacyNoticeAccepted),
                isHiwoxMember: Boolean(form.isHiwoxMember),
                joiningDate: form.joiningDate ? new Date(form.joiningDate).toISOString() : undefined,
                leavingDate: form.leavingDate ? new Date(form.leavingDate).toISOString() : undefined,
                subscriptionRenewalDate: form.subscriptionRenewalDate ? new Date(form.subscriptionRenewalDate).toISOString() : undefined,
            };
            await api.post("/auth/register", payload);
            showSuccessToast("User created successfully");
            setForm(defaultForm);
            setOpen(false);
            if (onUserCreated) onUserCreated();
        } catch (err: any) {
            showErrorToast(err?.response?.data?.message || "Failed to create user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">Create User</Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-950 text-white border border-slate-800 max-w-3xl w-full">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>Create New User</DialogTitle>
                        <DialogDescription>Fill in the details to create a new user.</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name" className="my-2">Name</Label>
                            <Input id="name" name="name" value={form.name} onChange={handleChange} required />
                        </div>
                        <div>
                            <Label htmlFor="age" className="my-2">Age</Label>
                            <Input id="age" name="age" type="number" value={form.age} onChange={handleChange} required min={0} />
                        </div>
                        <div>
                            <Label htmlFor="phone" className="my-2">Phone</Label>
                            <Input id="phone" name="phone" value={form.phone} onChange={handleChange} required />
                        </div>
                        <div>
                            <Label htmlFor="email" className="my-2">Email</Label>
                            <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
                        </div>
                        <div>
                            <Label htmlFor="password" className="my-2">Password</Label>
                            <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} required />
                        </div>
                        <div>
                            <Label htmlFor="role" className="my-2">Role</Label>
                            <Select value={form.role} onValueChange={(v) => handleSelectChange("role", v)}>
                                <SelectTrigger id="role" name="role">
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="consultant">Consultant</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <Checkbox id="consent" className="h-4 w-4" name="consent" checked={form.consent} onCheckedChange={(v) => handleCheckboxChange("consent", v)} />
                            <Label htmlFor="consent">Consent</Label>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <Checkbox id="privacyNoticeAccepted" className="h-4 w-4" name="privacyNoticeAccepted" checked={form.privacyNoticeAccepted} onCheckedChange={(v) => handleCheckboxChange("privacyNoticeAccepted", v)} />
                            <Label htmlFor="privacyNoticeAccepted">Privacy Notice Accepted</Label>
                        </div>
                        <div>
                            <Label htmlFor="joiningDate" className="my-2">Joining Date</Label>
                            <Input id="joiningDate" name="joiningDate" type="date" value={form.joiningDate} onChange={handleChange} required />
                        </div>
                        <div>
                            <Label htmlFor="leavingDate" className="my-2">Leaving Date</Label>
                            <Input id="leavingDate" name="leavingDate" type="date" value={form.leavingDate} onChange={handleChange} />
                        </div>
                        <div>
                            <Label htmlFor="reasonOfLeaving" className="my-2">Reason of Leaving</Label>
                            <Select value={form.reasonOfLeaving} onValueChange={(v) => handleSelectChange("reasonOfLeaving", v)}>
                                <SelectTrigger id="reasonOfLeaving" name="reasonOfLeaving">
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
                        <div>
                            <Label htmlFor="subscriptionType" className="my-2">Subscription Type</Label>
                            <Select value={form.subscriptionType} onValueChange={(v) => handleSelectChange("subscriptionType", v)}>
                                <SelectTrigger id="subscriptionType" name="subscriptionType">
                                    <SelectValue placeholder="Select subscription" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="basic">Basic</SelectItem>
                                    <SelectItem value="premium">Premium</SelectItem>
                                    <SelectItem value="vip">VIP</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <Checkbox id="isHiwoxMember" className="h-4 w-4" name="isHiwoxMember" checked={form.isHiwoxMember} onCheckedChange={(v) => handleCheckboxChange("isHiwoxMember", v)} />
                            <Label htmlFor="isHiwoxMember">Is Hiwox Member</Label>
                        </div>
                        <div>
                            <Label htmlFor="subscriptionRenewalDate" className="my-2">Subscription Renewal Date</Label>
                            <Input id="subscriptionRenewalDate" name="subscriptionRenewalDate" type="date" value={form.subscriptionRenewalDate} onChange={handleChange} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create User"}</Button>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
