import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import React from "react";
import { Brands } from "..";

interface CellActionStatusProps {
  data: Brands;
  mutate: () => void;
  status: string;
}

export const CellActionStatus: React.FC<CellActionStatusProps> = ({
  data,
  mutate,
  status,
}) => {
  const _id = data._id;

  const handleStatusChange = async (checked: boolean) => {
    const newValue = checked ? "publish" : "draft";

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/brands?method=activateOne`,

        {
          data: { _id: _id, status: newValue },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast({
        variant: "info",
        description: `Brand status updated to ${checked ? "publish" : "draft"}`,
      });
      mutate();
    } catch (error) {
      console.error("Failed to update status", error);
      toast({
        variant: "error",
        description: "Failed to update status",
      });
    }
  };
  return (
    <div className="lowercase">
      <Switch
        checked={status === "publish"}
        onCheckedChange={handleStatusChange}
      />
    </div>
  );
};
