"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { format, parseISO } from "date-fns";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Pencil, Trash } from "lucide-react";
import Image from "next/image";
import { Products } from ".";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export const columns: ColumnDef<Products>[] = [
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
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      return (
        <Image
          src={
            row.original.image.length > 0
              ? row.original.image
              : "https://res.cloudinary.com/didbxg1f9/image/upload/v1726696994/pgno7dufkcmvuwygtraf.png"
          }
          alt="image"
          width="60"
          height="60"
        />
      );
    },
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
          Name
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "user",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-base"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("user")}</div>,
  },
  {
    accessorKey: "createdOn",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-primary-500 text-base"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created On
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const createdAtValue = row.getValue("createdOn");
      let formattedDate;
      let formattedTime;
      // Asigură-te că valoarea este validă
      if (typeof createdAtValue === "string") {
        // Transformă stringul într-un obiect Date
        const parsedDate = parseISO(createdAtValue);
        formattedDate = format(parsedDate, "dd-MM-yyyy");
        formattedTime = format(parsedDate, "HH:mm");
      } else if (createdAtValue instanceof Date) {
        formattedDate = format(createdAtValue, "dd-MM-yyyy");
      } else {
        formattedDate = "Invalid date";
      }
      return (
        <div className="lowercase">
          {formattedDate} <br />
          {formattedTime}
        </div>
      );
    },
  },
  {
    accessorKey: "approved",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-base"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Approved
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const approved: string = row.getValue("approved");

      return (
        <div className={"capitalize flex"}>
          <p
            className={cn(
              approved === "approved" && "bg-successBg text-successText",
              approved === "pending" && "bg-errorBg text-errorText",
              "px-2"
            )}
          >
            {approved}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-base"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <div className="lowercase">
          <Switch checked={status === true ? true : false} />
        </div>
      );
    },
  },

  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: () => {
      // const product = row.original;

      return (
        <ul className="flex gap-2">
          <li>
            <Button variant={"outline"} size={"icon"}>
              <Pencil />
            </Button>
          </li>

          <li>
            <Button variant={"outline"} size={"icon"}>
              <Trash />
            </Button>
          </li>
        </ul>
      );
    },
  },
];
