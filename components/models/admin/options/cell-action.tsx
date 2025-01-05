"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { OptionFormData } from "@/types/forms";
import axios from "axios";
import { List, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";

export default function CellAction({
  data,
  mutate,
}: {
  data: OptionFormData;
  mutate: () => void;
}) {
  const { push } = useRouter();
  const dialogRef = useRef(null);

  const handleDelete = async (_id: string) => {
    try {
      // Trimite cererea DELETE către backend
      const response = await axios.delete(
        "/api/admin/options?method=deleteOne",
        {
          data: { _id: _id },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast({
          variant: "default",
          description: response.data.message,
        });
        // Reîncarcă datele după ștergere (folosind mutate sau altă metodă)
        mutate();
      }
    } catch (error) {
      console.error("Error deleting rows:", error);
      toast({ variant: "error", description: "Something went wrong!" });
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={"outline"}
            size={"icon"}
            onClick={() => push(`/admin/options/${data._id}`)}
          >
            <Pencil className="w-5 h-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Edit</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={"outline"}
            size={"icon"}
            onClick={() => push(`/admin/option-values/list/${data._id}`)}
          >
            <List className="w-5 h-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Option Values</p>
        </TooltipContent>
      </Tooltip>

      <AlertDialog>
        <AlertDialogTrigger ref={dialogRef} asChild>
          <Button variant={"outline"} size={"icon"}>
            <Trash className="w-5 h-5 text-red-500" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-2 text-sm text-gray-600">
              Sigur dorești să ștergi categoria <strong>{data.name}</strong>?
              Această acțiune este ireversibilă.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <button
                onClick={() => handleDelete(data._id as string)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Șterge
              </button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
