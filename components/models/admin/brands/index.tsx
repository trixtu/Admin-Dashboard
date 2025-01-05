"use client";

import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import React from "react";
import { columns } from "./columns";
import { useAuth } from "@clerk/nextjs";
import useSWR, { Fetcher } from "swr";
import axios from "axios";
import Loading from "@/components/custom/Loading";
import { toast } from "@/hooks/use-toast";

export type Brands = {
  _id: string;
  name: string;
  logo: string;
  brannd: string;
  seo: string;
  status: boolean;
};

export default function Brands() {
  const { getToken } = useAuth();

  // fecthing
  const fetcher: Fetcher<Brands[], string> = async (url) => {
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

  const { data, isLoading, mutate } = useSWR<Brands[]>(
    process.env.NEXT_PUBLIC_API_URL + "/api/admin/brands",
    fetcher
  );

  // Functia deleteMany
  const handleDeleteMany = async (selectedRows: Brands[]) => {
    try {
      // Extrage ID-urile din rândurile selectate
      const idsToDelete = selectedRows.map((row) => row._id);

      if (idsToDelete.length === 0) {
        toast({ variant: "error", description: "No rows selected!" });
        return;
      }

      // Trimite cererea DELETE către backend
      const response = await axios.delete("/api/admin/brands?method=deleteMany", {
        data: { _ids: idsToDelete },
        headers: {
          "Content-Type": "application/json",
        },
      });

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

  // Functia activate many
  const handleActivateMany = async (selectedRows: Brands[]) => {
    try {
      // Extrage ID-urile din rândurile selectate
      const idsToUpdate = selectedRows.map((row) => row._id);

      if (idsToUpdate.length === 0) {
        toast({ variant: "error", description: "No rows selected!" });
        return;
      }

      const response = await axios.put(
        `/api/admin/brands?method=activateMany`,
        {
          data: { _ids: idsToUpdate, status: "publish" },
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
      console.error("Error updated rows:", error);
      toast({ variant: "error", description: "Failed to updated rows!" });
    }
  };

  // Functia deactivate many
  const handleDeactivateMany = async (selectedRows: Brands[]) => {
    try {
      // Extrage ID-urile din rândurile selectate
      const idsToDeactivated = selectedRows.map((row) => row._id);

      if (idsToDeactivated.length === 0) {
        toast({ variant: "error", description: "No rows selected!" });
        return;
      }

      // Trimite cererea DELETE către backend
      const response = await axios.put(
        "/api/admin/brands?method=deactivateMany",
        {
          data: { _ids: idsToDeactivated, status: "draft" },
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
      console.error("Error updated rows:", error);
      toast({ variant: "error", description: "Failed to updated rows!" });
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
          onActivateMany={handleActivateMany}
          onDeactivateMany={handleDeactivateMany}
        />
      </CardContent>
    </Card>
  );
}
