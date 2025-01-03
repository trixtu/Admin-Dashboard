"use client"

import { AppSidebar } from "@/components/custom/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React, { useState } from "react";

export default function SidebarProviderShadcn({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open,setOpen] = useState<boolean>(false);

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <AppSidebar open={open} setOpen={setOpen}/>
      {children}
    </SidebarProvider>
  );
}
