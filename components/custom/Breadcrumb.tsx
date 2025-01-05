import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbTrxProps {
  name: string;
  alDoileaLink?: string;
  href?: string;
}

export default function BreadcrumbTrx({
  name,
  alDoileaLink,
  href,
}: BreadcrumbTrxProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            className="text-base text-neutral-500 hover:text-primary-500"
            href="/admin"
          >
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        {alDoileaLink ? (
          <BreadcrumbLink
            className="text-base text-neutral-500 hover:text-primary-500"
            href={href}
          >
            {name}
          </BreadcrumbLink>
        ) : (
          <p className="text-base">{name}</p>
        )}
        {alDoileaLink && (
          <>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <p className="text-base">{alDoileaLink}</p>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
