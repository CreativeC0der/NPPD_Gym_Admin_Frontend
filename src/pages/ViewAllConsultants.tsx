import React, { useEffect, useState } from 'react';
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
import {
    Search,
    ShieldCheck,
    MoreVertical,
    Mail,
    Clock,
    Award,
    Users as UsersIcon,
    ExternalLink,
} from 'lucide-react';
import axios from '@/axios/axios-config';
import { showSuccessToast, showErrorToast } from '@/utils/toast';
import Pagination from '@/components/Pagination';

type ConsultantStatus = 'active' | 'pending';
type AvailabilityFilter = 'all' | 'available' | 'busy' | 'unavailable';

interface ConsultantUser {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    consent?: boolean;
    privacyNoticeAccepted?: boolean;
    emailVerified?: boolean;
    phoneVerified?: boolean;
    role: 'consultant';
    createdAt: string;
    updatedAt: string;
}

interface ConsultantDomain {
    _id: string;
    domainId: string;
    domainLabel: string;
    domainIcon?: string;
    domainColor?: string;
    domainGradientColors?: string[];
}

interface ConsultantPricing {
    currency?: string;
    packages?: unknown[];
}

interface ConsultantAvailability {
    status?: string;
    workingDays?: string[];
}

interface Consultant {
    _id: string;
    user: ConsultantUser;
    domain?: ConsultantDomain[];
    specialty?: string;
    description?: string;
    meetingLink?: string;
    yearsOfExperience?: number;
    certifications?: string[];
    badges?: string[];
    modeOfTraining?: 'online' | 'offline' | 'hybrid';
    pricing?: ConsultantPricing;
    availability?: ConsultantAvailability;
    rating?: number;
    reviewsCount?: number;
    isVerified?: boolean;
    createdAt: string;
    updatedAt: string;
}

interface ApiPagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

interface ApiResponse {
    success: boolean;
    data: Consultant[];
    pagination?: ApiPagination;
}

interface ConsultantStats {
    totalConsultants: number;
    activeConsultants: number;
    pendingApproval: number;
    availableConsultants: number;
    verifiedConsultants: number;
}

const PAGE_LIMIT = 10;

const ViewAllConsultants: React.FC = () => {
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [consultants, setConsultants] = useState<Consultant[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | ConsultantStatus>('all');
    const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityFilter>('all');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<ConsultantStats>({
        totalConsultants: 0,
        activeConsultants: 0,
        pendingApproval: 0,
        availableConsultants: 0,
        verifiedConsultants: 0,
    });

    useEffect(() => {
        fetchConsultants(page);
    }, [page]);

    const fetchConsultants = async (pageNum = 1) => {
        try {
            setLoading(true);
            const response = await axios.get<ApiResponse>(
                `/consultants?page=${pageNum}&limit=${PAGE_LIMIT}&sortBy=createdAt&sortOrder=desc`
            );

            if (response?.data?.success) {
                const consultantData = response.data.data ?? [];
                const pagination = response.data.pagination;

                setConsultants(consultantData);
                setTotalPages(Math.max(pagination?.totalPages ?? 1, 1));
                calculateStats(consultantData, pagination?.total ?? consultantData.length);
                return;
            }

            setConsultants([]);
            setTotalPages(1);
            calculateStats([], 0);
        } catch (error) {
            console.error('Error fetching consultants:', error);
            showErrorToast('Failed to load consultants');
            setConsultants([]);
            setTotalPages(1);
            calculateStats([], 0);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (consultantData: Consultant[], totalConsultants: number) => {
        const safeConsultantData = consultantData ?? [];

        setStats({
            totalConsultants,
            activeConsultants: safeConsultantData.filter(
                (consultant) => getConsultantStatus(consultant) === 'active'
            ).length,
            pendingApproval: safeConsultantData.filter(
                (consultant) => getConsultantStatus(consultant) === 'pending'
            ).length,
            availableConsultants: safeConsultantData.filter(
                (consultant) => getAvailabilityKey(consultant?.availability?.status) === 'available'
            ).length,
            verifiedConsultants: safeConsultantData.filter((consultant) => consultant?.isVerified).length,
        });
    };

    const getConsultantStatus = (consultant: Consultant): ConsultantStatus => {
        return consultant?.user?.emailVerified && consultant?.user?.phoneVerified ? 'active' : 'pending';
    };

    const getAvailabilityKey = (status?: string): Exclude<AvailabilityFilter, 'all'> => {
        const normalizedStatus = status?.toLowerCase() ?? '';

        if (normalizedStatus.includes('available')) {
            return 'available';
        }

        if (normalizedStatus.includes('busy')) {
            return 'busy';
        }

        return 'unavailable';
    };

    const getFilteredConsultants = () => {
        let filtered = [...(consultants ?? [])];

        if (searchQuery.trim()) {
            const normalizedQuery = searchQuery.trim().toLowerCase();

            filtered = filtered.filter((consultant) => {
                const domainText = (consultant?.domain ?? [])
                    .map((item) => item?.domainLabel ?? '')
                    .join(' ')
                    .toLowerCase();
                const certificationText = (consultant?.certifications ?? []).join(' ').toLowerCase();

                return [
                    consultant?.user?.name,
                    consultant?.user?.email,
                    consultant?.specialty,
                    consultant?.description,
                    consultant?.modeOfTraining,
                    domainText,
                    certificationText,
                ]
                    .filter(Boolean)
                    .some((value) => value?.toLowerCase().includes(normalizedQuery));
            });
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter((consultant) => getConsultantStatus(consultant) === statusFilter);
        }

        if (availabilityFilter !== 'all') {
            filtered = filtered.filter(
                (consultant) => getAvailabilityKey(consultant?.availability?.status) === availabilityFilter
            );
        }

        return filtered;
    };

    const getInitials = (name: string) => {
        const safeName = name ?? 'Unknown';
        return safeName
            .split(' ')
            .map((part) => part?.[0] ?? '')
            .join('')
            .toUpperCase()
            .slice(0, 2) || 'C';
    };

    const getStatusBadge = (status: ConsultantStatus) => {
        switch (status) {
            case 'active':
                return (
                    <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20">
                        Active
                    </Badge>
                );
            case 'pending':
            default:
                return (
                    <Badge className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20">
                        Pending
                    </Badge>
                );
        }
    };

    const getAvailabilityBadge = (availabilityStatus?: string) => {
        const availabilityKey = getAvailabilityKey(availabilityStatus);
        const label = availabilityStatus?.trim() || 'Unavailable';

        switch (availabilityKey) {
            case 'available':
                return (
                    <Badge className="bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20">
                        {label}
                    </Badge>
                );
            case 'busy':
                return (
                    <Badge className="bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20">
                        {label}
                    </Badge>
                );
            case 'unavailable':
            default:
                return (
                    <Badge className="bg-slate-500/10 text-slate-300 border border-slate-500/20 hover:bg-slate-500/20">
                        {label}
                    </Badge>
                );
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';

        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            });
        } catch (error) {
            return 'N/A';
        }
    };

    const formatTrainingMode = (mode?: Consultant['modeOfTraining']) => {
        if (!mode) return 'Not set';
        return mode.charAt(0).toUpperCase() + mode.slice(1);
    };

    const formatCurrency = (pricing?: ConsultantPricing) => {
        const currency = pricing?.currency ?? 'INR';
        const packageCount = pricing?.packages?.length ?? 0;
        return `${currency} ${packageCount} package${packageCount === 1 ? '' : 's'}`;
    };

    const handleConsultantAction = async (action: string, consultant: Consultant) => {
        if (action === 'Copy Meeting Link' && consultant?.meetingLink) {
            try {
                await navigator.clipboard.writeText(consultant.meetingLink);
                showSuccessToast('Meeting link copied successfully');
                return;
            } catch (error) {
                console.error('Error copying meeting link:', error);
                showErrorToast('Failed to copy meeting link');
                return;
            }
        }

        console.log(`${action} consultant:`, consultant?._id);
        showSuccessToast(`Consultant ${action.toLowerCase()} successfully`);
    };

    const filteredConsultants = getFilteredConsultants();

    return (
        <div className="flex flex-col min-h-screen bg-slate-950 text-white p-6">
            <div className="mb-8 flex justify-between items-start gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Consultant Management</h1>
                    <p className="text-slate-400">
                        Manage consultant profiles, domain expertise, and availability.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="bg-slate-900 border-slate-700 text-white hover:bg-slate-800"
                    >
                        <UsersIcon className="w-4 h-4 mr-2" />
                        Pending Approval ({stats?.pendingApproval ?? 0})
                    </Button>
                    <Button
                        variant="outline"
                        className="bg-slate-900 border-slate-700 text-white hover:bg-slate-800"
                    >
                        <ShieldCheck className="w-4 h-4 mr-2" />
                        Verified ({stats?.verifiedConsultants ?? 0})
                    </Button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                    <Input
                        type="text"
                        placeholder="Search consultants by name, email, specialty or domain..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500"
                    />
                </div>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'all' | ConsultantStatus)}>
                    <SelectTrigger className="w-full md:w-[180px] bg-slate-900 border-slate-700 text-white">
                        <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                        <SelectItem value="all" className="text-white">All Status</SelectItem>
                        <SelectItem value="active" className="text-white">Active</SelectItem>
                        <SelectItem value="pending" className="text-white">Pending</SelectItem>
                    </SelectContent>
                </Select>
                <Select
                    value={availabilityFilter}
                    onValueChange={(value) => setAvailabilityFilter(value as AvailabilityFilter)}
                >
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

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <div className="text-4xl font-bold text-teal-500 mb-2">{stats?.totalConsultants ?? 0}</div>
                    <div className="text-slate-400 text-sm">Total Consultants</div>
                </div>
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <div className="text-4xl font-bold text-green-500 mb-2">{stats?.activeConsultants ?? 0}</div>
                    <div className="text-slate-400 text-sm">Active on This Page</div>
                </div>
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <div className="text-4xl font-bold text-emerald-500 mb-2">{stats?.availableConsultants ?? 0}</div>
                    <div className="text-slate-400 text-sm">Available Now</div>
                </div>
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <div className="text-4xl font-bold text-yellow-500 mb-2">{stats?.pendingApproval ?? 0}</div>
                    <div className="text-slate-400 text-sm">Pending on This Page</div>
                </div>
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <div className="text-4xl font-bold text-blue-500 mb-2">{stats?.verifiedConsultants ?? 0}</div>
                    <div className="text-slate-400 text-sm">Verified on This Page</div>
                </div>
            </div>

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
                            key={consultant?._id}
                            className="bg-slate-900 rounded-lg p-6 border border-slate-800 hover:border-slate-700 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4 flex-1">
                                    <Avatar className="w-16 h-16 bg-teal-700">
                                        <AvatarFallback className="bg-teal-700 text-white text-lg font-semibold">
                                            {getInitials(consultant?.user?.name ?? 'Unknown')}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1">
                                        <div className="flex flex-col gap-3">
                                            <div>
                                                <h3 className="text-xl font-semibold text-white mb-2">
                                                    {consultant?.user?.name ?? 'Unknown Consultant'}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="w-4 h-4" />
                                                        {consultant?.user?.email ?? 'No email'}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4" />
                                                        Joined {formatDate(consultant?.createdAt ?? consultant?.user?.createdAt)}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <ExternalLink className="w-4 h-4" />
                                                        {formatTrainingMode(consultant?.modeOfTraining)}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2">
                                                {getStatusBadge(getConsultantStatus(consultant))}
                                                {getAvailabilityBadge(consultant?.availability?.status)}
                                                {consultant?.isVerified ? (
                                                    <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                        <ShieldCheck className="w-3 h-3 mr-1" />
                                                        Verified
                                                    </Badge>
                                                ) : null}
                                                {consultant?.specialty ? (
                                                    <Badge className="bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                                        <Award className="w-3 h-3 mr-1" />
                                                        {consultant.specialty}
                                                    </Badge>
                                                ) : null}
                                                {(consultant?.domain ?? []).map((domain) => (
                                                    <Badge
                                                        key={domain?._id}
                                                        className="border"
                                                        style={{
                                                            backgroundColor: `${domain?.domainColor ?? '#334155'}1A`,
                                                            borderColor: `${domain?.domainColor ?? '#475569'}33`,
                                                            color: domain?.domainColor ?? '#E2E8F0',
                                                        }}
                                                    >
                                                        <span className="mr-1">{domain?.domainIcon ?? '•'}</span>
                                                        {domain?.domainLabel ?? 'Domain'}
                                                    </Badge>
                                                ))}
                                            </div>

                                            {consultant?.description ? (
                                                <p className="text-sm text-slate-300 leading-6">
                                                    {consultant.description}
                                                </p>
                                            ) : null}

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                                <div>
                                                    <div className="text-2xl font-bold text-white">
                                                        {consultant?.yearsOfExperience ?? '-'}
                                                    </div>
                                                    <div className="text-sm text-slate-400">Years of Experience</div>
                                                </div>
                                                <div>
                                                    <div className="text-2xl font-bold text-white flex items-center gap-2">
                                                        <UsersIcon className="w-5 h-5 text-teal-400" />
                                                        {consultant?.domain?.length ?? 0}
                                                    </div>
                                                    <div className="text-sm text-slate-400">Domains Covered</div>
                                                </div>
                                                <div>
                                                    <div className="text-2xl font-bold text-white">{consultant?.reviewsCount ?? 0}</div>
                                                    <div className="text-sm text-slate-400">Reviews</div>
                                                </div>
                                                <div>
                                                    <div className="text-2xl font-bold text-white flex items-center gap-2">
                                                        <Award className="w-5 h-5 text-yellow-400" />
                                                        {(consultant?.rating ?? 0).toFixed(1)}
                                                    </div>
                                                    <div className="text-sm text-slate-400">Rating</div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm">
                                                <div className="flex flex-wrap items-center gap-4 text-slate-400">
                                                    <span>Pricing: {formatCurrency(consultant?.pricing)}</span>
                                                    <span>
                                                        Certifications: {consultant?.certifications?.length ?? 0}
                                                    </span>
                                                    <span>
                                                        Working Days: {consultant?.availability?.workingDays?.length ?? 0}
                                                    </span>
                                                </div>
                                                {consultant?.meetingLink ? (
                                                    <a
                                                        href={consultant.meetingLink}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                        Open meeting link
                                                    </a>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>

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
                                            onClick={() => handleConsultantAction('View details', consultant)}
                                        >
                                            View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="hover:bg-slate-800"
                                            onClick={() => handleConsultantAction('Edit', consultant)}
                                        >
                                            Edit Consultant
                                        </DropdownMenuItem>
                                        {consultant?.meetingLink ? (
                                            <DropdownMenuItem
                                                className="hover:bg-slate-800"
                                                onClick={() => handleConsultantAction('Copy Meeting Link', consultant)}
                                            >
                                                Copy Meeting Link
                                            </DropdownMenuItem>
                                        ) : null}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && filteredConsultants.length > 0 ? (
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    className="mt-8"
                />
            ) : null}
        </div>
    );
};

export default ViewAllConsultants;
