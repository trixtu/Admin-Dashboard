"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { OptionFormData } from "@/types/forms";
import CellAction from "./cell-action";

export const columns = ({
  mutate,
}: {
  mutate: () => void;
}): ColumnDef<OptionFormData>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: true,
    enableHiding: false,
  },

  {
    accessorKey: "value",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-base"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Value Name
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="uppercase">{row.getValue("value")}</div>,
  },

  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    size: 150,
    cell: ({ row }) => {
      const option = row.original;
      return <CellAction data={option} mutate={mutate} />;
    },
  },
];
