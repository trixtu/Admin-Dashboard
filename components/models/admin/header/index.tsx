"use client";

import Container from "@/components/custom/Container";
import Row from "@/components/custom/Row";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import React from "react";

export function Header() {
  const pathname = usePathname();

  // Folosim un switch pentru a verifica calea
  const segment = (() => {
    switch (pathname) {
      case "/admin":
        return "dashboard";
      case "/admin/product-categories":
        return "Product Categories";
      case "/admin/options":
        return "Product Options";
      default:
        return pathname.split("/")[2] || ""; // Extragem al doilea segment sau returnăm un string gol dacă nu există
    }
  })();

  return (
    <header className="h-[60px] bg-white shadow-sm md:px-4 lg:p-0">
      <Container>
        <Row className="justify-between">
          <div className="flex items-center gap-4">
            <h5 className="capitalize font-semibold">{segment}</h5>
          </div>
          <div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </Row>
      </Container>
    </header>
  );
}
