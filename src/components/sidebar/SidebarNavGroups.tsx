'use client'
import Link from "next/link";
import { SidebarGroup, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar"
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut } from "@/services/clerk/components/AuthButtons";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";



interface Items {
    href: string;
    label: string;
    icon: ReactNode
    authStatus?: 'signedIn' | 'signedOut';
}
interface NavProps {
    items: Items[];
    className?: string;
}
export const SidebarNavGroups: React.FC<NavProps> = ({ items, className }) => {
    const path = usePathname();
    return (
        <SidebarGroup className={cn(className)}>
            {items.map(item => {
                const html = (
                    <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={path === item.href}>
                            <Link href={item.href} className="text-lg">
                                <span >
                                    {item.icon}
                                </span>
                                <span>{item.label}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                )
                if (item.authStatus === 'signedIn') {
                    return <SignedIn key={item.href}>
                        {html}
                    </SignedIn>
                }
                if (item.authStatus === 'signedOut') {
                    return <SignedOut key={item.href}>
                        {html}
                    </SignedOut>
                }
                return html;
            })}
        </SidebarGroup>
    )
}