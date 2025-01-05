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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-base"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Option Name
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "asFilters",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-base"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Display in filter
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue("asFilters") as boolean;
      return <div className="capitalize">{value ? "yes" : "no"}</div>;
    },
  },
  {
    accessorKey: "isColor",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-base"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Color option
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue("isColor") as boolean;
      return <div className="capitalize">{value ? "yes" : "no"}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    size: 150,
    cell: ({ row }) => {
      const option = row.original;
      return <CellAction data={option} mutate={mutate}/>;
    },
  },
];
