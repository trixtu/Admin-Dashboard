import { TooltipProvider } from "@/components/ui/tooltip";
import React from "react";

export default function TooltipProviderTrx({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TooltipProvider>{children}</TooltipProvider>;
}
