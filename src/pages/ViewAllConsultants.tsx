import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, UserPlus, Ban, MoreVertical, Mail, Phone, Clock, Award, Users as UsersIcon } from 'lucide-react';
import axios from '@/axios/axios-config';
import { showSuccessToast, showErrorToast } from '@/utils/toast';

interface Consultant {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    age?: number;
    consent?: boolean;
    privacyNoticeAccepted?: boolean;
    emailVerified?: boolean;
    phoneVerified?: boolean;
    role: 'consultant';
    status?: 'active' | 'pending' | 'banned';
    specialization?: string;
    experience?: number;
    gym?: {
        _id: string;
        name: string;
    };
    createdAt: string;
    updatedAt: string;
    lastActive?: string;
    // Stats
    clients?: number;
    sessionsCompleted?: number;
    rating?: number;
    availability?: 'available' | 'busy' | 'unavailable';
}

interface ApiResponse {
    success: boolean;
    data: Consultant[];
    pagination: {
        total: number;
        page: string;
        limit: string;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

interface ConsultantStats {
    totalConsultants: number;
    activeConsultants: number;
    pendingApproval: number;
    availableConsultants: number;
    bannedConsultants: number;
}

const ViewAllConsultants: React.FC = () => {
    const [consultants, setConsultants] = useState<Consultant[]>([]);
    const [filteredConsultants, setFilteredConsultants] = useState<Consultant[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [availabilityFilter, setAvailabilityFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<ConsultantStats>({
        totalConsultants: 0,
        activeConsultants: 0,
        pendingApproval: 0,
        availableConsultants: 0,
        bannedConsultants: 0,
    });

    useEffect(() => {
        fetchConsultants();
    }, []);

    useEffect(() => {
        filterConsultants();
    }, [searchQuery, statusFilter, availabilityFilter, consultants]);

    const fetchConsultants = async () => {
        try {
            setLoading(true);
            // Fetch consultant data from API
            const response = await axios.get<ApiResponse>('/auth/users?role=consultant&page=1&limit=100&sortBy=createdAt&sortOrder=desc');

            if (response?.data?.success) {
                const consultantData = response.data.data ?? [];

                // Add consultant-specific stats and fields
                const consultantsWithStats: Consultant[] = consultantData.map((consultant: Consultant) => ({
                    ...consultant,
                    // Determine status based on email/phone verification
                    status: (consultant?.emailVerified && consultant?.phoneVerified ? 'active' :
                        (!consultant?.emailVerified || !consultant?.phoneVerified) ? 'pending' : 'active') as 'active' | 'pending' | 'banned',
                    // Add mock consultant-specific stats
                    clients: Math.floor(Math.random() * 50) + 5,
                    sessionsCompleted: Math.floor(Math.random() * 200) + 10,
                    rating: Number((Math.random() * 1 + 4).toFixed(1)),
                    availability: ['available', 'busy', 'unavailable'][Math.floor(Math.random() * 3)] as 'available' | 'busy' | 'unavailable',
                    specialization: ['Nutrition', 'Fitness', 'Physiotherapy', 'Mental Health', 'Weight Loss', 'Sports Medicine'][Math.floor(Math.random() * 6)],
                    experience: Math.floor(Math.random() * 15) + 1,
                    // Add last active time (mock)
                    lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
                }));

                setConsultants(consultantsWithStats);
                calculateStats(consultantsWithStats);
            }
        } catch (error) {
            console.error('Error fetching consultants:', error);
            showErrorToast('Failed to load consultants');
            setConsultants([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (consultantData: Consultant[]) => {
        const safeConsultantData = consultantData ?? [];
        setStats({
            totalConsultants: safeConsultantData.length,
            activeConsultants: safeConsultantData.filter(c => c?.status === 'active').length,
            pendingApproval: safeConsultantData.filter(c => c?.status === 'pending').length,
            availableConsultants: safeConsultantData.filter(c => c?.availability === 'available').length,
            bannedConsultants: safeConsultantData.filter(c => c?.status === 'banned').length,
        });
    };

    const filterConsultants = () => {
        let filtered = [...(consultants ?? [])];

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(
                (consultant) =>
                    consultant?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    consultant?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    consultant?.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter((consultant) => consultant?.status === statusFilter);
        }

        // Apply availability filter
        if (availabilityFilter !== 'all') {
            filtered = filtered.filter((consultant) => consultant?.availability === availabilityFilter);
        }

        setFilteredConsultants(filtered);
    };

    const getInitials = (name: string) => {
        const safeName = name ?? 'Unknown';
        return safeName
            .split(' ')
            .map(n => n?.[0] ?? '')
            .join('')
            .toUpperCase()
            .slice(0, 2) || 'C';
    };

    const getStatusBadge = (status: string) => {
        const safeStatus = status ?? 'active';
        switch (safeStatus) {
            case 'active':
                return (
                    <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20">
                        Active
                    </Badge>
                );
            case 'pending':
                return (
                    <Badge className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20">
                        Pending
                    </Badge>
                );
            case 'banned':
                return (
                    <Badge className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20">
                        Banned
                    </Badge>
                );
            default:
                return (
                    <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20">
                        Active
                    </Badge>
                );
        }
    };

    const getAvailabilityBadge = (availability: string) => {
        const safeAvailability = availability ?? 'available';
        switch (safeAvailability) {
            case 'available':
                return (
                    <Badge className="bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20">
                        Available
                    </Badge>
                );
            case 'busy':
                return (
                    <Badge className="bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20">
                        Busy
                    </Badge>
                );
            case 'unavailable':
                return (
                    <Badge className="bg-gray-500/10 text-gray-400 border border-gray-500/20 hover:bg-gray-500/20">
                        Unavailable
                    </Badge>
                );
            default:
                return (
                    <Badge className="bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20">
                        Available
                    </Badge>
                );
        }
    };

    const formatTimeAgo = (dateString: string) => {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffInMs = now.getTime() - date.getTime();
            const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

            if (diffInDays === 0) {
                const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
                if (diffInHours === 0) {
                    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
                    return `${diffInMinutes}m ago`;
                }
                return `${diffInHours}h ago`;
            }
            return `${diffInDays}d ago`;
        } catch (error) {
            return 'N/A';
        }
    };

    const handleConsultantAction = (action: string, consultantId: string) => {
        console.log(`${action} consultant:`, consultantId);
        showSuccessToast(`Consultant ${action} successfully`);
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-950 text-white p-6">
            {/* Header */}
            <div className="mb-8 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Consultant Management</h1>
                    <p className="text-slate-400">Manage consultants, their specializations, and availability</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="bg-slate-900 border-slate-700 text-white hover:bg-slate-800"
                    >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Pending Approval ({stats?.pendingApproval ?? 0})
                    </Button>
                    <Button
                        variant="outline"
                        className="bg-slate-900 border-slate-700 text-white hover:bg-slate-800"
                    >
                        <Ban className="w-4 h-4 mr-2" />
                        Banned ({stats?.bannedConsultants ?? 0})
                    </Button>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                    <Input
                        type="text"
                        placeholder="Search consultants by name, email or specialization..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[180px] bg-slate-900 border-slate-700 text-white">
                        <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                        <SelectItem value="all" className="text-white">All Status</SelectItem>
                        <SelectItem value="active" className="text-white">Active</SelectItem>
                        <SelectItem value="pending" className="text-white">Pending</SelectItem>
                        <SelectItem value="banned" className="text-white">Banned</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                    <SelectTrigger className="w-full md:w-[180px] bg-slate-900 border-slate-700 text-white">
                        <SelectValue placeholder="All Availability" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                        <SelectItem value="all" className="text-white">All Availability</SelectItem>
                        <SelectItem value="available" className="text-white">Available</SelectItem>
                        <SelectItem value="busy" className="text-white">Busy</SelectItem>
                        <SelectItem value="unavailable" className="text-white">Unavailable</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <div className="text-4xl font-bold text-teal-500 mb-2">{stats?.totalConsultants ?? 0}</div>
                    <div className="text-slate-400 text-sm">Total Consultants</div>
                </div>
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <div className="text-4xl font-bold text-green-500 mb-2">{stats?.activeConsultants ?? 0}</div>
                    <div className="text-slate-400 text-sm">Active</div>
                </div>
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <div className="text-4xl font-bold text-emerald-500 mb-2">{stats?.availableConsultants ?? 0}</div>
                    <div className="text-slate-400 text-sm">Available Now</div>
                </div>
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <div className="text-4xl font-bold text-yellow-500 mb-2">{stats?.pendingApproval ?? 0}</div>
                    <div className="text-slate-400 text-sm">Pending</div>
                </div>
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <div className="text-4xl font-bold text-red-500 mb-2">{stats?.bannedConsultants ?? 0}</div>
                    <div className="text-slate-400 text-sm">Banned</div>
                </div>
            </div>

            {/* Consultant Cards */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="text-slate-400">Loading consultants...</div>
                </div>
            ) : filteredConsultants.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                    <div className="text-slate-400">No consultants found</div>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredConsultants.map((consultant) => (
                        <div
                            key={consultant?._id ?? Math.random()}
                            className="bg-slate-900 rounded-lg p-6 border border-slate-800 hover:border-slate-700 transition-colors"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4 flex-1">
                                    {/* Avatar */}
                                    <Avatar className="w-16 h-16 bg-teal-700">
                                        <AvatarFallback className="bg-teal-700 text-white text-lg font-semibold">
                                            {getInitials(consultant?.name ?? 'Unknown')}
                                        </AvatarFallback>
                                    </Avatar>

                                    {/* Consultant Info */}
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-white mb-2">{consultant?.name ?? 'Unknown Consultant'}</h3>
                                        <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-slate-400">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4" />
                                                {consultant?.email ?? 'No email'}
                                            </div>
                                            {consultant?.phone && (
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4" />
                                                    {consultant.phone}
                                                </div>
                                            )}
                                            {consultant?.lastActive && (
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4" />
                                                    {formatTimeAgo(consultant.lastActive)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2 mb-4">
                                            {getStatusBadge(consultant?.status ?? 'active')}
                                            {getAvailabilityBadge(consultant?.availability ?? 'available')}
                                            {consultant?.specialization && (
                                                <Badge className="bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                                    <Award className="w-3 h-3 mr-1" />
                                                    {consultant.specialization}
                                                </Badge>
                                            )}
                                            {consultant?.experience && (
                                                <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                    {consultant.experience} yrs exp
                                                </Badge>
                                            )}
                                            {consultant?.gym?.name && (
                                                <Badge className="bg-slate-800 text-slate-300 border-slate-700">
                                                    {consultant.gym.name}
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Stats */}
                                        <div className="grid grid-cols-3 gap-6">
                                            <div>
                                                <div className="text-2xl font-bold text-white flex items-center gap-2">
                                                    <UsersIcon className="w-5 h-5 text-teal-400" />
                                                    {consultant?.clients ?? 0}
                                                </div>
                                                <div className="text-sm text-slate-400">Active Clients</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-white">{consultant?.sessionsCompleted ?? 0}</div>
                                                <div className="text-sm text-slate-400">Sessions Completed</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-white flex items-center gap-2">
                                                    <Award className="w-5 h-5 text-yellow-400" />
                                                    {consultant?.rating ?? 0}
                                                </div>
                                                <div className="text-sm text-slate-400">Rating</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions Menu */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-slate-400 hover:text-white hover:bg-slate-800"
                                        >
                                            <MoreVertical className="w-5 h-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="bg-slate-900 border-slate-700 text-white">
                                        <DropdownMenuItem
                                            className="hover:bg-slate-800"
                                            onClick={() => handleConsultantAction('View', consultant?._id ?? '')}
                                        >
                                            View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="hover:bg-slate-800"
                                            onClick={() => handleConsultantAction('Edit', consultant?._id ?? '')}
                                        >
                                            Edit Consultant
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="hover:bg-slate-800"
                                            onClick={() => handleConsultantAction('View Schedule', consultant?._id ?? '')}
                                        >
                                            View Schedule
                                        </DropdownMenuItem>
                                        {consultant?.status === 'pending' && (
                                            <DropdownMenuItem
                                                className="hover:bg-slate-800"
                                                onClick={() => handleConsultantAction('Approve', consultant?._id ?? '')}
                                            >
                                                Approve Consultant
                                            </DropdownMenuItem>
                                        )}
                                        {consultant?.status !== 'banned' && (
                                            <DropdownMenuItem
                                                className="hover:bg-slate-800 text-red-400"
                                                onClick={() => handleConsultantAction('Ban', consultant?._id ?? '')}
                                            >
                                                Ban Consultant
                                            </DropdownMenuItem>
                                        )}
                                        {consultant?.status === 'banned' && (
                                            <DropdownMenuItem
                                                className="hover:bg-slate-800 text-green-400"
                                                onClick={() => handleConsultantAction('Unban', consultant?._id ?? '')}
                                            >
                                                Unban Consultant
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ViewAllConsultants;
