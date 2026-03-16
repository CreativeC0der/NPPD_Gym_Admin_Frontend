import React, { useEffect, useMemo, useRef, useState } from "react";
import api from "@/axios/axios-config";
import WellnessRecordForm from "@/components/WellnessRecordForm";
import { Input } from "@/components/ui/input";
import type User from "@/types/User";
import { cn } from "@/lib/utils";
import { showErrorToast } from "@/utils/toast";

interface UsersApiResponse {
    success: boolean;
    data: User[];
}

const WellnessRecord: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const blurTimeout = useRef<number | undefined>(undefined);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setUsers([]);
            setLoadingUsers(false);
            return;
        }

        const timer = window.setTimeout(async () => {
            try {
                setLoadingUsers(true);
                const url = `/auth/users?role=user&page=1&limit=8&sortBy=createdAt&sortOrder=desc&name=${encodeURIComponent(
                    searchTerm.trim()
                )}`;
                const response = await api.get<UsersApiResponse>(url);
                if (response?.data?.success) {
                    setUsers(response.data.data ?? []);
                } else {
                    setUsers([]);
                }
            } catch (error) {
                console.error("Error searching users:", error);
                showErrorToast("Failed to load users");
                setUsers([]);
            } finally {
                setLoadingUsers(false);
            }
        }, 300);

        return () => window.clearTimeout(timer);
    }, [searchTerm]);

    const dropdownItems = useMemo(() => {
        if (!searchTerm.trim()) return [];
        return users;
    }, [searchTerm, users]);

    const handleSelectUser = (user: User) => {
        setSelectedUser(user);
        setSearchTerm(user?.profile?.fullName ?? user?.name ?? "");
        setDropdownOpen(false);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6">
            <div className="max-w-6xl mx-auto mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Wellness Record</h1>
                    <p className="text-slate-400">Capture member wellness data across domains.</p>
                </div>
            </div>
            <div className="max-w-6xl mx-auto">
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                    <div className="mb-8">
                        <label className="text-sm font-medium text-slate-300">Select Member</label>
                        <div
                            className="relative mt-2"
                            onFocus={() => {
                                if (blurTimeout.current) {
                                    window.clearTimeout(blurTimeout.current);
                                }
                                setDropdownOpen(true);
                            }}
                            onBlur={() => {
                                blurTimeout.current = window.setTimeout(() => {
                                    setDropdownOpen(false);
                                }, 150);
                            }}
                        >
                            <Input
                                type="text"
                                placeholder="Search by name..."
                                value={searchTerm}
                                onChange={(event) => {
                                    setSearchTerm(event.target.value);
                                    setSelectedUser(null);
                                }}
                                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500"
                            />
                            <div
                                className={cn(
                                    "absolute z-20 mt-2 w-full overflow-hidden rounded-lg border border-slate-700 bg-slate-900 shadow-xl transition",
                                    dropdownOpen ? "opacity-100" : "pointer-events-none opacity-0"
                                )}
                            >
                                {loadingUsers ? (
                                    <div className="px-4 py-3 text-sm text-slate-400">Searching...</div>
                                ) : dropdownItems.length === 0 ? (
                                    <div className="px-4 py-3 text-sm text-slate-500">No users found</div>
                                ) : (
                                    <div className="max-h-64 overflow-y-auto py-1">
                                        {dropdownItems.map((user) => (
                                            <button
                                                key={user._id}
                                                type="button"
                                                onMouseDown={(event) => event.preventDefault()}
                                                onClick={() => handleSelectUser(user)}
                                                className="flex w-full flex-col gap-1 px-4 py-2 text-left text-sm text-slate-100 transition hover:bg-slate-800"
                                            >
                                                <span className="font-medium">
                                                    {user?.profile?.fullName ?? user?.name ?? "Unnamed User"}
                                                </span>
                                                <span className="text-xs text-slate-400">{user.email}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        {selectedUser && (
                            <div className="mt-3 rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-slate-200">
                                Selected:{" "}
                                <span className="font-semibold">
                                    {selectedUser?.profile?.fullName ?? selectedUser?.name}
                                </span>{" "}
                                <span className="text-slate-400">({selectedUser.email})</span>
                            </div>
                        )}
                    </div>
                    <WellnessRecordForm userId={selectedUser?._id} />
                </div>
            </div>
        </div>
    );
};

export default WellnessRecord;
