import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import api from "@/axios/axios-config";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import type { CheckedState } from "@radix-ui/react-checkbox";
import {
    Field,
    FieldLabel,
    FieldContent,
    FieldDescription,
    FieldGroup,
} from "@/components/ui/field";

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
    gender: "male",
    dateOfBirth: "",
    address: {
        street: "",
        city: "",
        state: "",
        pincode: "",
    },
};

export default function CreateUserForm({ onUserCreated }: { onUserCreated?: () => void }) {
    const [form, setForm] = useState(defaultForm);
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        if (name.startsWith("address.")) {
            const addressField = name.split(".")[1];
            setForm((prev) => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value,
                },
            }));
        } else if (type === "checkbox") {
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
                dateOfBirth: form.dateOfBirth ? new Date(form.dateOfBirth).toISOString() : undefined,
                reasonOfLeaving: form.reasonOfLeaving || undefined,
                address: {
                    street: form.address.street,
                    city: form.address.city,
                    state: form.address.state,
                    pincode: form.address.pincode,
                },
            };
            await api.post("/auth/register", payload);
            showSuccessToast("User created successfully");
            setForm(defaultForm);
            if (onUserCreated) onUserCreated();
        } catch (err: any) {
            showErrorToast(err?.response?.data?.message || "Failed to create user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8" id="create-user-form">
            <h2 className="text-xl font-semibold text-white mb-6">User Information</h2>
            <FieldGroup>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field>
                        <FieldLabel htmlFor="name" className="text-slate-300">Name</FieldLabel>
                        <FieldContent>
                            <Input id="name" name="name" value={form.name} onChange={handleChange} required className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500" />
                            <FieldDescription className="text-slate-400">Enter the user's full name</FieldDescription>
                        </FieldContent>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="age" className="text-slate-300">Age</FieldLabel>
                        <FieldContent>
                            <Input id="age" name="age" type="number" value={form.age} onChange={handleChange} required min={0} className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500" />
                            <FieldDescription className="text-slate-400">User's age</FieldDescription>
                        </FieldContent>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="phone" className="text-slate-300">Phone</FieldLabel>
                        <FieldContent>
                            <Input id="phone" name="phone" value={form.phone} onChange={handleChange} required className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500" />
                            <FieldDescription className="text-slate-400">User's phone number</FieldDescription>
                        </FieldContent>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="email" className="text-slate-300">Email</FieldLabel>
                        <FieldContent>
                            <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500" />
                            <FieldDescription className="text-slate-400">User's email address</FieldDescription>
                        </FieldContent>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="password" className="text-slate-300">Password</FieldLabel>
                        <FieldContent>
                            <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} required className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500" />
                            <FieldDescription className="text-slate-400">Set a password for the user</FieldDescription>
                        </FieldContent>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="role" className="text-slate-300">Role</FieldLabel>
                        <FieldContent>
                            <Select value={form.role} onValueChange={(v: string) => handleSelectChange("role", v)}>
                                <SelectTrigger id="role" name="role" className="bg-slate-700 border-slate-600 text-white">
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="consultant">Consultant</SelectItem>
                                </SelectContent>
                            </Select>
                            <FieldDescription className="text-slate-400">Assign a role to the user</FieldDescription>
                        </FieldContent>
                    </Field>
                    <Field>
                        <div className="flex items-center gap-2 mt-2">
                            <Checkbox id="consent" className="h-4 w-4" name="consent" checked={form.consent} onCheckedChange={(v: CheckedState) => handleCheckboxChange("consent", v)} />
                            <Label htmlFor="consent">Consent</Label>
                        </div>
                    </Field>
                    <Field>
                        <div className="flex items-center gap-2 mt-2">
                            <Checkbox id="privacyNoticeAccepted" className="h-4 w-4" name="privacyNoticeAccepted" checked={form.privacyNoticeAccepted} onCheckedChange={(v: CheckedState) => handleCheckboxChange("privacyNoticeAccepted", v)} />
                            <Label htmlFor="privacyNoticeAccepted">Privacy Notice Accepted</Label>
                        </div>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="joiningDate" className="text-slate-300">Joining Date</FieldLabel>
                        <FieldContent>
                            <Input id="joiningDate" name="joiningDate" type="date" value={form.joiningDate} onChange={handleChange} required className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500" />
                            <FieldDescription className="text-slate-400">Date the user joined</FieldDescription>
                        </FieldContent>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="leavingDate" className="text-slate-300">Leaving Date</FieldLabel>
                        <FieldContent>
                            <Input id="leavingDate" name="leavingDate" type="date" value={form.leavingDate} onChange={handleChange} className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500" />
                            <FieldDescription className="text-slate-400">Date the user left (if applicable)</FieldDescription>
                        </FieldContent>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="reasonOfLeaving" className="text-slate-300">Reason of Leaving</FieldLabel>
                        <FieldContent>
                            <Select value={form.reasonOfLeaving} onValueChange={(v: string) => handleSelectChange("reasonOfLeaving", v)}>
                                <SelectTrigger id="reasonOfLeaving" name="reasonOfLeaving" className="bg-slate-700 border-slate-600 text-white">
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
                            <FieldDescription className="text-slate-400">Reason for leaving (if applicable)</FieldDescription>
                        </FieldContent>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="subscriptionType" className="text-slate-300">Subscription Type</FieldLabel>
                        <FieldContent>
                            <Select value={form.subscriptionType} onValueChange={(v: string) => handleSelectChange("subscriptionType", v)}>
                                <SelectTrigger id="subscriptionType" name="subscriptionType" className="bg-slate-700 border-slate-600 text-white">
                                    <SelectValue placeholder="Select subscription" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="basic">Basic</SelectItem>
                                    <SelectItem value="premium">Premium</SelectItem>
                                    <SelectItem value="vip">VIP</SelectItem>
                                </SelectContent>
                            </Select>
                            <FieldDescription className="text-slate-400">User's subscription type</FieldDescription>
                        </FieldContent>
                    </Field>
                    <Field>
                        <div className="flex items-center gap-2 mt-2">
                            <Checkbox id="isHiwoxMember" className="h-4 w-4" name="isHiwoxMember" checked={form.isHiwoxMember} onCheckedChange={(v: CheckedState) => handleCheckboxChange("isHiwoxMember", v)} />
                            <Label htmlFor="isHiwoxMember">Is Hiwox Member</Label>
                        </div>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="subscriptionRenewalDate" className="text-slate-300">Subscription Renewal Date</FieldLabel>
                        <FieldContent>
                            <Input id="subscriptionRenewalDate" name="subscriptionRenewalDate" type="date" value={form.subscriptionRenewalDate} onChange={handleChange} className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500" />
                            <FieldDescription className="text-slate-400">Next renewal date</FieldDescription>
                        </FieldContent>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="gender" className="text-slate-300">Gender</FieldLabel>
                        <FieldContent>
                            <Select value={form.gender} onValueChange={(v: string) => handleSelectChange("gender", v)}>
                                <SelectTrigger id="gender" name="gender" className="bg-slate-700 border-slate-600 text-white">
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <FieldDescription className="text-slate-400">User's gender</FieldDescription>
                        </FieldContent>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="dateOfBirth" className="text-slate-300">Date of Birth</FieldLabel>
                        <FieldContent>
                            <Input id="dateOfBirth" name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} required className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500" />
                            <FieldDescription className="text-slate-400">User's date of birth</FieldDescription>
                        </FieldContent>
                    </Field>
                </div>
                <Field>
                    <FieldLabel className="my-2">Address</FieldLabel>
                    <FieldContent>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                            <Input
                                id="address.street"
                                name="address.street"
                                placeholder="Street"
                                value={form.address.street}
                                onChange={handleChange}
                                required
                                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500"
                            />
                            <Input
                                id="address.city"
                                name="address.city"
                                placeholder="City"
                                value={form.address.city}
                                onChange={handleChange}
                                required
                                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500"
                            />
                            <Input
                                id="address.state"
                                name="address.state"
                                placeholder="State"
                                value={form.address.state}
                                onChange={handleChange}
                                required
                                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500"
                            />
                            <Input
                                id="address.pincode"
                                name="address.pincode"
                                placeholder="Pincode"
                                value={form.address.pincode}
                                onChange={handleChange}
                                required
                                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500"
                            />
                        </div>
                        <FieldDescription className="text-slate-400">Complete address details</FieldDescription>
                    </FieldContent>
                </Field>
            </FieldGroup>
            <div className="flex items-center justify-end gap-4 pt-6">
                <Button
                    type="reset"
                    variant="outline"
                    className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                    onClick={() => setForm(defaultForm)}
                    disabled={loading}
                >
                    Reset
                </Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white" disabled={loading} form="create-user-form">
                    {loading ? "Creating..." : "Create User"}
                </Button>
            </div>
        </form>
    );
}
