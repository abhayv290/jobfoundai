import AppSidebar from "@/components/AppSidebar";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SidebarUserButton from "@/features/users/components/SidebarUserButton";
import { SignedOut, SignedIn } from "@/services/clerk/components/AuthButtons";

import { LogInIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <SidebarProvider className="overflow-y-hidden">
      <AppSidebar>
        <Sidebar collapsible="icon" className="overflow-hidden">
          <SidebarHeader className="flex-row items-center">
            <SidebarTrigger />
            <span className="text-xl ml-2 font-bold text-nowrap">JobFoundAi</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SignedOut>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href={'/sign-in'}>
                      <LogInIcon />
                      <span>Login</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SignedOut>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SignedIn>
                  <SidebarUserButton />
                </SignedIn>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 mt-5">Hello there</main>
      </AppSidebar>
    </SidebarProvider>
  )
}