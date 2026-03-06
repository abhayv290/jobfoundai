import AppSidebar from "@/components/sidebar/AppSidebar";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SignedIn } from "@/services/clerk/components/AuthButtons";
import { ReactNode } from "react";


export default function SidebarClient({ content, footerButton, children }: { content: ReactNode, footerButton: ReactNode, children: ReactNode }) {
    return (
        <SidebarProvider className="overflow-y-hidden">
            <AppSidebar>
                <Sidebar collapsible="icon" className="overflow-hidden">
                    <SidebarHeader className="flex-row items-center">
                        <SidebarTrigger />
                        <span className="text-xl ml-2 font-bold text-nowrap">JobFoundAi</span>
                    </SidebarHeader>
                    <SidebarContent>
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