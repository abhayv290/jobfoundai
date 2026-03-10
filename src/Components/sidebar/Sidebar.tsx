import AppSidebar from "@/components/sidebar/AppSidebar";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SignedIn } from "@/services/clerk/components/AuthButtons";
import Link from "next/link";
import { ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";


export default function SidebarClient({ content, footerButton, children }: { content: ReactNode, footerButton: ReactNode, children: ReactNode }) {
    return (
        <SidebarProvider className="overflow-y-hidden">
            <AppSidebar>
                <Sidebar collapsible="icon" className="overflow-hidden">
                    <SidebarHeader className="flex-row items-center">
                        <SidebarTrigger />
                        <Avatar className='ml-2 rounded-lg size-10 bg-slate-700'>
                            <AvatarImage src={'/logo.png'}></AvatarImage>
                            <AvatarFallback className='uppercase bg-primary text-primary-foreground'>
                                {'JF'}
                            </AvatarFallback>
                        </Avatar>
                        <Link href={'/'} className="text-xl  font-bold text-nowrap">JobFoundAi</Link>
                    </SidebarHeader>
                    <SidebarContent className="no-scrollbar">
                        {content}
                    </SidebarContent>
                    <SidebarFooter>
                        <SignedIn>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    {footerButton}
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SignedIn>
                    </SidebarFooter>
                </Sidebar>
                <main className="flex-1 mt-5">{children}</main>
            </AppSidebar>
        </SidebarProvider>
    )
}