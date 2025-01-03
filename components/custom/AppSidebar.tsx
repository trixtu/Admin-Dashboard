"use client";

import React, { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { siderbarData } from "@/constant";
import { NavMain } from "./NavMain";
import { NavSettings } from "./NavSettings";
import { AlignJustify, AlignLeft } from "lucide-react";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export function AppSidebar({ open, setOpen, ...props }: AppSidebarProps) {
  const [isActive, setIsActive] = useState<boolean>(false);

  const handleMouseLeave = () => {
    if (!isActive) {
      setOpen(false);
    }
  };

  return (
    <Sidebar
      className="shadow-sm"
      collapsible="icon"
      variant="sidebar"
      {...props}
      style={{ color: "#fff" }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={handleMouseLeave}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size={"lg"}>
              {!open && (
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <AlignJustify className="size-4" />
                </div>
              )}

              <div className="grid flex-1 text-left leading-tight">
                <div className="truncate text-[20px] flex">
                  <h5 className="uppercase">
                    Trix<strong className="text-primary-400">tu</strong>
                  </h5>
                </div>
              </div>
              {open && (
                <div
                  className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground hover:bg-[#1f7dd2]"
                  onClick={() => {
                    setIsActive(!isActive);
                  }}
                >
                  {isActive ? (
                    <AlignLeft className="size-6" />
                  ) : (
                    <AlignJustify className="size-6" />
                  )}
                </div>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={siderbarData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavSettings items={siderbarData.footerMenu} />
      </SidebarFooter>
    </Sidebar>
  );
}
