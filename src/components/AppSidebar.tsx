
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Dumbbell,
  Apple,
  User,
  LogOut,
  Sparkles,
  Share2,
  Settings2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { AppLogo } from "@/components/AppLogo";
import { signOut } from "@/lib/firebase/auth";
import { useToast } from "@/hooks/use-toast";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useFirebase } from "@/contexts/FirebaseProvider";


const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/log-workout", label: "Log Workout", icon: Dumbbell },
  { href: "/log-meal", label: "Log Meal", icon: Apple },
  { href: "/ai-suggestions", label: "AI Suggestions", icon: Sparkles },
  { href: "/integrations", label: "Integrations", icon: Share2 },
  { href: "/profile", label: "Profile", icon: User },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useFirebase();
  const { state: sidebarState } = useSidebar();


  const handleSignOut = async () => {
    try {
      await signOut();
      toast({ title: "Signed Out", description: "You have been successfully signed out." });
      router.push("/login");
    } catch (error) {
      toast({ title: "Sign Out Failed", description: "Could not sign out. Please try again.", variant: "destructive" });
    }
  };
  
  const isIconOnly = sidebarState === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className={cn("p-4", isIconOnly && "px-2")}>
         <AppLogo className={cn(isIconOnly && "justify-center")} />
      </SidebarHeader>
      <SidebarContent className="flex-grow p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  variant="default"
                  size="default"
                  isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
                  tooltip={{content: item.label}}
                  className="w-full"
                >
                  <item.icon />
                  <span className={cn(isIconOnly && "sr-only")}>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="p-2">
         {user && !isIconOnly && (
          <div className="mb-2 px-2 text-sm text-sidebar-foreground/70 truncate">
            {user.email}
          </div>
        )}
        <SidebarMenuButton variant="ghost" onClick={handleSignOut} className="w-full" tooltip={{content: "Logout"}}>
          <LogOut />
           <span className={cn(isIconOnly && "sr-only")}>Logout</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
