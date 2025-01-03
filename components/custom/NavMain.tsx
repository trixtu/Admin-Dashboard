"use client";

import { ChevronRight, LayoutGrid, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { getToken } = useAuth();

  useEffect(() => {
    const sidebarCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("sidebar_open"))
      ?.split("=")[1];
    setIsOpen(sidebarCookie === "true");
  }, []);

  const toggleSidebar = async () => {
    const token = await getToken();
    await fetch("/api/sidebar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ open: !isOpen }),
    });
    setIsOpen(!isOpen);
  };

  return (
    <>
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => router.push("/admin")}
              className={cn(
                " hover:bg-[#1f7dd2]",
                pathname === "/admin" && "bg-[#1f7dd2]"
              )}
            >
              <LayoutGrid />
              <span className="text-base font-extralight uppercase">Home</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    className={cn(
                      "hover:bg-[#1f7dd2]",
                      pathname === item.url && "bg-[#1f7dd2]"
                    )}
                  >
                    {item.icon && <item.icon onClick={toggleSidebar} />}
                    <span className="text-base font-extralight uppercase">{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub className="">
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <Link
                            href={subItem.url}
                            className={cn(
                              "hover:bg-[#1f7dd2]",
                              pathname === subItem.url && "bg-[#1f7dd2]"
                            )}
                          >
                            <span className="text-[14px] font-extralight uppercase">{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}
