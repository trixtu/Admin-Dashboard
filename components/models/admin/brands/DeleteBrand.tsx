import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Container from "@/components/custom/Container";
import { Separator } from "@/components/ui/separator";
import Row from "@/components/custom/Row";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

export const DeleteBrand = ({ _id }: { _id: string }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onDelete = async () => {
    try {
      setLoading(true);
      // Trimite cererea DELETE către backend
      const response = await axios.delete(
        "/api/admin/brands?method=deleteOne",
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
        router.push("/admin/brands");
      }
    } catch (error) {
      console.error("Error deleting brand:", error);
      toast({ variant: "error", description: "Failed to delete brand!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Are you absolutely sure?</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent>
            This action cannot be undone. This will permanently update your
            data.
          </CardContent>
          <CardFooter className="gap-4 justify-end">
            <Button
              type="button"
              disabled={loading}
              variant={"secondary"}
              onClick={() => router.push("/admin/brands")}
            >
              No, Cancel
            </Button>
            <Button
              className="text-white"
              disabled={loading}
              variant={"destructive"}
              onClick={onDelete}
            >
              Yes, Continue
            </Button>
          </CardFooter>
        </Card>
      </Row>
    </Container>
  );
};
