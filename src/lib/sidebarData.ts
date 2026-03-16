import {
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
    Settings,
    CheckCircle2,
} from "lucide-react"
import type { User } from "@/store/slices/UserSlice";


export const getSidebarData = (user: User) => {
    const data = {
        systemStatus: [],
        // { title: "API", status: "45ms", icon: CheckCircle2, isHealthy: true }
        navMain: (user.role === 'coordinator') ? [
            {
                title: "Record Initial Wellness Data",
                url: "/coordinator/wellness-record",
                icon: CheckCircle2,
            }
        ] : [
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
                    ...(user.role === 'superadmin')
                        ? [{
                            title: "Create Gym",
                            url: "/gyms/create",
                            icon: PlusSquare,
                        }]
                        : [],
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
                    {
                        title: "Create User",
                        url: "/user/create",
                        icon: Users,
                    },
                    {
                        title: "Upload Users",
                        url: "/users/upload",
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
                items: [
                    {
                        title: "Revenue Intelligence",
                        url: "/revenue",
                        icon: BarChart3,
                    },
                ],
            },
            ...(user.role === 'superadmin') ?
                [{
                    title: "ML & Data Oversight",
                    url: "#",
                    icon: Brain,
                    badge: "3",
                }] : [],
            ...(user.role === 'superadmin') ?
                [{
                    title: "Export & Reporting",
                    url: "#",
                    icon: FileText,
                }] : [],
            ...(user.role === 'superadmin') ?
                [{
                    title: "System Tools",
                    url: "#",
                    icon: Settings,
                    badge: "2",
                }] : [],
        ]
    }

    return data;
}
