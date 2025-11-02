import { AppSidebar, getBreadcrumbFromRoute } from "@/components/app-sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

export interface BreadcrumbItem {
    title: string;
    url?: string;
}

export interface BreadcrumbData {
    items: BreadcrumbItem[];
}

const Layout: React.FC = () => {
    const location = useLocation();
    const [breadcrumb, setBreadcrumb] = useState<BreadcrumbData>(() =>
        getBreadcrumbFromRoute(location.pathname)
    );

    // Update breadcrumb based on current route - using navigation data as single source of truth
    React.useEffect(() => {
        const breadcrumbData = getBreadcrumbFromRoute(location.pathname);
        setBreadcrumb(breadcrumbData);
    }, [location.pathname]);

    return (
        <SidebarProvider>
            <AppSidebar onNavigate={setBreadcrumb} />
            <SidebarInset>
                <header className="bg-slate-900 sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b border-slate-700 px-4">
                    <SidebarTrigger className="-ml-1 text-slate-300 hover:text-white" />
                    <Separator orientation="vertical" className="mr-2 h-4 bg-slate-700" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            {breadcrumb.items.map((item, index) => (
                                <React.Fragment key={index}>
                                    {/* Show separator before all items except the first */}
                                    {index > 0 && (
                                        <BreadcrumbSeparator className="hidden md:block text-slate-600" />
                                    )}

                                    <BreadcrumbItem className="hidden md:block">
                                        {/* If it's the last item, render as current page */}
                                        {index === breadcrumb.items.length - 1 ? (
                                            <BreadcrumbPage className="text-white">
                                                {item.title}
                                            </BreadcrumbPage>
                                        ) : (
                                            /* Otherwise render as clickable link */
                                            <BreadcrumbLink
                                                href={item.url || '#'}
                                                className="text-slate-400 hover:text-white"
                                            >
                                                {item.title}
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                </React.Fragment>
                            ))}
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 bg-slate-950">
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default Layout;
