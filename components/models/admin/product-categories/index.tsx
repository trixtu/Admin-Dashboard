import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";
import SearchCategories from "./SearchCategories";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Pencil, Plus, Trash } from "lucide-react";
import DropdownMenu from "@/components/custom/DropdownMenu";
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
