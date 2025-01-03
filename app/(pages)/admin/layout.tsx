import React from "react";
import { Header } from "@/components/models/admin/header";
import SidebarProviderShadcn from "@/providers/SidebarProviderShadcn";
import { SidebarInset } from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProviderShadcn>
      <SidebarInset className="w-full bg-[#f3f6f9]">
        <Header />
        {children}
      </SidebarInset>
    </SidebarProviderShadcn>
  );
}
