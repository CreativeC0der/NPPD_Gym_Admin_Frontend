import * as React from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {
    ChevronRight,
    Crown,
    Search,
    CheckCircle2,
    Activity,
    LayoutGrid,
    Dumbbell,
    Building2,
    PlusSquare,
    BarChart3,
    Users,
    UserCog,
    BarChart4,
    Brain,
    FileText,
    Settings
} from "lucide-react"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { BreadcrumbData, BreadcrumbItem } from "./Layout"
import { useAppSelector } from "@/hooks/hooks"

// Navigation data
const data = {
    systemStatus: [
        { title: "API", status: "45ms", icon: CheckCircle2, isHealthy: true },
        { title: "Database", status: "12 conn", icon: CheckCircle2, isHealthy: true },
        { title: "ML Pipeline", status: "3 jobs", icon: Activity, isHealthy: true },
    ],
    navMain: [
        {
            title: "Platform Overview",
            url: "/dashboard",
            icon: LayoutGrid,
        },
        {
            title: "Gym Management",
            url: "#",
            icon: Dumbbell,
            badge: "24",
            items: [
                {
                    title: "All Gyms",
                    url: "/gyms/all",
                    icon: Building2,
                },
                {
                    title: "Create Gym",
                    url: "/gyms/create",
                    icon: PlusSquare,
                },
                {
                    title: "Gym Analytics",
                    url: "#",
                    icon: BarChart3,
                },
            ],
        },
        {
            title: "User Management",
            url: "#",
            icon: Users,
            badge: "1.2k",
            items: [
                {
                    title: "All Users",
                    url: "/users/all",
                    icon: Users,
                },
            ],
        },
        {
            title: "Consultant Management",
            url: "#",
            icon: UserCog,
            badge: "47",
            items: [
                {
                    title: "All Consultants",
                    url: "/consultants/all",
                    icon: UserCog,
                },
            ],
        },
        {
            title: "Platform Analytics",
            url: "#",
            icon: BarChart4,
        },
        {
            title: "ML & Data Oversight",
            url: "#",
            icon: Brain,
            badge: "3",
        },
        {
            title: "Export & Reporting",
            url: "#",
            icon: FileText,
        },
        {
            title: "System Tools",
            url: "#",
            icon: Settings,
            badge: "2",
        },
    ],
}

// Recursive function to search through nested navigation items
function findRouteInNavigation(
    items: any[],
    pathname: string,
    breadcrumbTrail: BreadcrumbItem[] = []
): BreadcrumbItem[] | null {
    for (const item of items) {
        const currentTrail = [...breadcrumbTrail, { title: item.title, url: item.url }];

        // Check if this is the matching route
        if (item.url === pathname && item.url !== '#') {
            return currentTrail;
        }

        // Recursively check nested items
        if (item.items && item.items.length > 0) {
            const found = findRouteInNavigation(item.items, pathname, currentTrail);
            if (found) {
                return found;
            }
        }
    }

    return null;
}

// Function to get breadcrumb data from route - Single source of truth
// Supports unlimited nesting levels
export function getBreadcrumbFromRoute(pathname: string): BreadcrumbData {
    // Search through navigation data to find matching route
    const breadcrumbTrail = findRouteInNavigation(data.navMain, pathname);

    if (breadcrumbTrail) {
        return { items: breadcrumbTrail };
    }

    // Default fallback
    return {
        items: [{ title: 'Platform Overview', url: '/dashboard' }]
    };
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    onNavigate?: (breadcrumb: BreadcrumbData) => void;
}

export function AppSidebar({ onNavigate, ...props }: AppSidebarProps) {
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useAppSelector((state) => state.user)

    const isActive = (url: string) => {
        if (url === "#") return false
        return location.pathname === url
    }

    const handleNavigate = (url: string) => {
        if (url !== "#") {
            navigate(url)
            // Update breadcrumb when navigating - uses getBreadcrumbFromRoute as single source of truth
            if (onNavigate) {
                const breadcrumbData = getBreadcrumbFromRoute(url);
                onNavigate(breadcrumbData);
            }
        }
    }

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'admin':
                return '👑';
            case 'superadmin':
                return '⚡';
            case 'consultant':
                return '🩺';
            case 'user':
                return '👤';
            default:
                return '👤';
        }
    };

    const getRoleDisplayName = (role: string) => {
        switch (role) {
            case 'admin':
                return 'Executive Admin';
            case 'superadmin':
                return 'Super Admin';
            case 'consultant':
                return 'Consultant';
            case 'user':
                return 'User';
            default:
                return 'User';
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-blue-900 text-blue-300 border border-blue-700';
            case 'superadmin':
                return 'bg-purple-900 text-purple-300 border border-purple-700';
            case 'consultant':
                return 'bg-green-900 text-green-300 border border-green-700';
            case 'user':
                return 'bg-slate-700 text-slate-300 border border-slate-600';
            default:
                return 'bg-slate-700 text-slate-300 border border-slate-600';
        }
    };

    return (
        <Sidebar {...props} className="border-r border-slate-700 bg-slate-800">
            <SidebarHeader className="border-b border-slate-700 p-2 space-y-2">
                {/* Header with Logo and Title */}
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500">
                        <Crown className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-sm font-semibold text-white">HealthHub Admin</h1>
                        <p className="text-xs text-slate-400">Control Center</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
                    <Input
                        placeholder="Search admin functions..."
                        className="pl-7 py-1 h-7 text-xs bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>
            </SidebarHeader>

            <SidebarContent className="px-2 py-2">
                {/* System Status Section */}
                <SidebarGroup className="mb-2">
                    <SidebarGroupLabel className="px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        System Status
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {data.systemStatus.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <div className="flex items-center justify-between px-2 py-1.5 text-xs">
                                        <div className="flex items-center gap-1.5">
                                            <item.icon className={`h-3 w-3 ${item.isHealthy ? 'text-green-500' : 'text-blue-400'}`} />
                                            <span className="text-white">{item.title}</span>
                                        </div>
                                        <span className="text-slate-400 text-[10px]">{item.status}</span>
                                    </div>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Navigation Menu */}
                <SidebarGroup>
                    <SidebarMenu className="space-y-1">
                        {data.navMain.map((item) => (
                            item.items ? (
                                <Collapsible
                                    key={item.title}
                                    defaultOpen={item.items.some(subItem => isActive(subItem.url))}
                                    className="group/collapsible"
                                >
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton
                                                className={`w-full justify-between px-6 py-6 text-white hover:bg-purple-600 rounded-lg transition-colors ${item.items.some(subItem => isActive(subItem.url)) ? "bg-purple-950" : ""}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <item.icon className="h-5 w-5" />
                                                    <span className="font-medium">{item.title}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {item.badge && (
                                                        <Badge variant="secondary" className="bg-purple-500 text-white hover:bg-purple-500 rounded-full px-2">
                                                            {item.badge}
                                                        </Badge>
                                                    )}
                                                    <ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                                                </div>
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarGroupContent className="pl-4 mt-1">
                                                <SidebarMenu className="space-y-1">
                                                    {item.items.map((subItem) => (
                                                        <SidebarMenuItem key={subItem.title}>
                                                            <SidebarMenuButton
                                                                onClick={() => handleNavigate(subItem.url)}
                                                                className={`px-4 py-2.5 rounded-lg cursor-pointer ${isActive(subItem.url)
                                                                    ? "bg-purple-500 text-white"
                                                                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                                                                    }`}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <subItem.icon className="h-4 w-4" />
                                                                    <span>{subItem.title}</span>
                                                                </div>
                                                            </SidebarMenuButton>
                                                        </SidebarMenuItem>
                                                    ))}
                                                </SidebarMenu>
                                            </SidebarGroupContent>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                            ) : (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        onClick={() => handleNavigate(item.url)}
                                        className={`px-4 py-6 rounded-lg transition-colors cursor-pointer ${isActive(item.url)
                                            ? "bg-purple-500 text-white"
                                            : "text-white hover:bg-slate-700"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <div className="flex items-center gap-3">
                                                <item.icon className="h-5 w-5" />
                                                <span className="font-medium">{item.title}</span>
                                            </div>
                                            {item.badge && (
                                                <Badge variant="secondary" className="bg-slate-700 text-slate-300 hover:bg-slate-700 rounded-full px-2">
                                                    {item.badge}
                                                </Badge>
                                            )}
                                        </div>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            {/* Profile Footer */}
            {user && (
                <SidebarFooter className="border-t border-slate-700 p-4">
                    <div className="space-y-3">
                        {/* User Info */}
                        <div className="flex items-center space-x-3">
                            <div className="text-2xl">
                                {getRoleIcon(user.role)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                                <p className="text-xs text-slate-400 truncate">{user.email}</p>
                            </div>
                        </div>

                        {/* Role Badge */}
                        <div className="flex items-center justify-between">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                {getRoleIcon(user.role)} {getRoleDisplayName(user.role)}
                            </span>
                        </div>

                        {/* User Details */}
                        <div className="space-y-1.5 text-xs">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">ID:</span>
                                <span className="text-white font-mono">{user.userId}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Phone:</span>
                                <span className="text-white">{user.phone}</span>
                            </div>
                        </div>
                    </div>
                </SidebarFooter>
            )}

            <SidebarRail />
        </Sidebar>
    )
}
