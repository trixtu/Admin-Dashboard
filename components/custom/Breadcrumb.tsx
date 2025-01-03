import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface BreadcrumbTrxProps {
  name:string;
}

export default function BreadcrumbTrx({name}:BreadcrumbTrxProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink className="text-base text-neutral-500" href="/admin">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          /
        </BreadcrumbSeparator>
      
          <p className="text-base">{name}</p>
        
      </BreadcrumbList>
    </Breadcrumb>
  );
}
