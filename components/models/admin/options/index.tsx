"use client";

import Loading from "@/components/custom/Loading";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { OptionFormData } from "@/types/forms";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import React from "react";
import useSWR, { Fetcher } from "swr";
import { columns } from "./column";
import { toast } from "@/hooks/use-toast";

export default function Options() {
  const { getToken } = useAuth();

  // fecthing
  const fetcher: Fetcher<OptionFormData[], string> = async (url) => {
    const token = await getToken();
    return await axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data.data)
      .catch((err) => console.log(err))
      .finally(() => {});
  };

  const { data, isLoading, mutate } = useSWR<OptionFormData[]>(
    process.env.NEXT_PUBLIC_API_URL + "/api/admin/options",
    fetcher
  );

  // Functia deleteMany
  const handleDeleteMany = async (selectedRows: OptionFormData[]) => {
    try {
      // Extrage ID-urile din rândurile selectate
      const idsToDelete = selectedRows.map((row) => row._id);

      if (idsToDelete.length === 0) {
        toast({ variant: "error", description: "No rows selected!" });
        return;
      }

      // Trimite cererea DELETE către backend
      const response = await axios.delete(
        "/api/admin/options?method=deleteMany",
        {
          data: { _ids: idsToDelete },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast({
          variant: "default",
          description: response.data.message + " " + response.data.count,
        });
        // Reîncarcă datele după ștergere (folosind mutate sau altă metodă)
        mutate();
      }
    } catch (error) {
      console.error("Error deleting rows:", error);
      toast({ variant: "error", description: "Failed to delete rows!" });
    }
  };

  if (isLoading) return <Loading loading={true} />;

  return (
    <Card className="w-full">
      <CardContent>
        <DataTable
          searchKey="name"
          columns={columns({ mutate })}
          data={data ? data : []}
          onDeleteMany={handleDeleteMany}
        />
      </CardContent>
    </Card>
  );
}
