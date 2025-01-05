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
import { toast } from "@/hooks/use-toast";
import { OptionFormData } from "@/types/forms";
import axios from "axios";
import { Trash } from "lucide-react";
import React, { useRef } from "react";

export default function CellAction({
  data,
  mutate,
}: {
  data: OptionFormData;
  mutate: () => void;
}) {
  const dialogRef = useRef(null);

  const handleDelete = async (_id: string) => {
    try {
      // Trimite cererea DELETE către backend
      const response = await axios.delete(
        "/api/admin/option-values?method=deleteOne",
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
