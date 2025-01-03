import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";
import SearchCategories from "./SearchCategories";
import Accordion from "@/components/custom/DropdownMenu";

export default function ProductCategories() {
  return (
    <Card className="w-full">
      <CardHeader>
        <SearchCategories />
      </CardHeader>
      <Separator />
      <CardContent>
        <Accordion />
      </CardContent>
    </Card>
  );
}
