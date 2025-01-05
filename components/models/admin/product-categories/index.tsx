"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";
import SearchCategories from "./SearchCategories";
import Accordion from "@/components/custom/Accordion";
import { useAuth } from "@clerk/nextjs";
import { TypeCategoryModel } from "@/types/models";
import useSWR, { Fetcher } from "swr";
import axios from "axios";
import Loading from "@/components/custom/Loading";
import { toast } from "@/hooks/use-toast";

export default function ProductCategories() {

  const { getToken } = useAuth();
  // fecthing client
  const fetcher: Fetcher<TypeCategoryModel[], string> = async (url) => {
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

  const { data, isLoading, mutate } = useSWR<TypeCategoryModel[]>(
    process.env.NEXT_PUBLIC_API_URL + "/api/admin/categories",
    fetcher
  );

  const handleDelete = async (_id: string) => {
    try {
      // Trimite cererea DELETE către backend
      const response = await axios.delete(
        "/api/admin/categories?method=deleteOne",
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

  if (isLoading) return <Loading loading={true} />;

  return (
    <Card className="w-full">
      <CardHeader>
        <SearchCategories />
      </CardHeader>
      <Separator />
      <CardContent>
        <Accordion
          data={data ? data : []}
          mutate={mutate}
          onDelete={handleDelete}
        />
       
      </CardContent>
    </Card>
  );
}
