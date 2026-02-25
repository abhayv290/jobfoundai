import AppSidebar from "@/components/AppSidebar";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SidebarUserButton from "@/features/users/components/SidebarUserButton";
import { SignedOut } from "@clerk/nextjs";
import { LogInIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <SidebarProvider className="overflow-y-hidden">
      <AppSidebar>
        <Sidebar collapsible="icon" className="overflow-hidden ">
          <SidebarHeader className="flex-row items-center">
            <SidebarTrigger />
            <span className="text-xl font-bold text-nowrap">JobFoundAi</span>
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
                <SidebarUserButton />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
      </AppSidebar>
      <main>Hello there</main>
    </SidebarProvider>
  )
}