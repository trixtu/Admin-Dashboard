"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import React from "react";
import { Brands } from ".";
import { useRouter } from "next/navigation";

interface CellActioProps {
  data: Brands;
}

export default function CellAction({ data }: CellActioProps) {
  const router = useRouter();

  return (
    <>
      <ul className="flex gap-2">
        <li>
          <Button
            variant={"outline"}
            size={"icon"}
            onClick={() => router.push(`/admin/brands/${data._id}`)}
          >
            <Pencil />
          </Button>
        </li>

        <li>
          <Button
            className="text-red-500"
            variant={"outline"}
            size={"icon"}
            onClick={() => router.push(`/admin/brands/${data._id}/delete`)}
          >
            <Trash />
          </Button>
        </li>
      </ul>
    </>
  );
}
