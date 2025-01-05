"use client";

import { CustomInput } from "@/components/custom/CustomInput";
import Loading from "@/components/custom/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { OptionFormData } from "@/types/forms";
import { optionValidationSchema } from "@/types/schemas";
import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";
import { z } from "zod";

export default function OptionForm({ _id }: { _id?: string }) {
  // 1. Set state
  const [isLoading, setLoading] = useState(false);
  const [option, setData] = useState<OptionFormData>();
  const router = useRouter();
  const { getToken, userId } = useAuth();

  // 2. Form method function
  async function postRequest(url: string, { arg }: { arg: OptionFormData }) {
    const token = await getToken();
    return await axios
      .post(process.env.NEXT_PUBLIC_API_URL + url, arg, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data;

        toast({
          variant: "default",
          title: "Well done ✔️",
          description: data.message,
        });
        router.push("/admin/options");
      })
      .catch((err) => {
        console.log(err.message);
        toast({
          variant: "error",
          description: `${err.response?.data?.message}`,
          // description: err.response?.data?.message || "An unexpected error occurred.",
        });
      })
      .finally(() => {
        router.refresh();
      });
  }

  async function putRequest(url: string, { arg }: { arg: OptionFormData }) {
    const token = await getToken();
    return await axios
      .put(process.env.NEXT_PUBLIC_API_URL + url, arg, {
        params: { _id: option?._id },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data;
        toast({
          variant: "default",
          title: "Well done ✔️",
          description: data.message,
        });
        router.push("/admin/options");
      })
      .catch((err) => {
        console.log(err.message);
      })
      .finally(() => {});
  }
  // 3. Set Form mutation
  const { trigger: create, isMutating: isCreating } = useSWRMutation(
    "/api/admin/options",
    postRequest /* options */
  );
  const { trigger: update, isMutating: isUpdating } = useSWRMutation(
    "/api/admin/options",
    putRequest /* options */
  );
  // 4. Define your validation and default values.
  const form = useForm<z.infer<typeof optionValidationSchema>>({
    resolver: zodResolver(optionValidationSchema),
    defaultValues: option
      ? option
      : {
          name: "",
          asFilters: false,
          isColor: false,
          separateImages: false,
          products: [],
          user_id: userId,
        },
  });

  // 5. Reset form default values if edit
  useEffect(() => {
    const getData = async () => {
      const token = await getToken();
      setLoading(true);
      await axios
        .get(process.env.NEXT_PUBLIC_API_URL + "/api/admin/options", {
          params: { _id: _id },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setData(response.data.data);
          form.reset(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    if (_id) getData();
  }, [_id, form, getToken, form.reset]);

  // 6. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof optionValidationSchema>) => {
    const data = {
      name: values.name,
      asFilters: values.asFilters,
      isColor: values.isColor,
      separateImages: values.separateImages,
      products: values.products,
      user_id: userId,
    };
    if (option) {
      await update(data);
    } else {
      await create(data);
    }
  };

  return (
    <>
      {isLoading && <Loading loading={true} />}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-12 lg:gap-x-12">
            <div className="flex flex-col col-span-2">
              <div className="mb-4">
                <h2 className="text-2xl font-medium p-0 ">Add option</h2>
                <span className="text-muted text-sm">
                  Fields with (<span className="text-red-500">*</span>) are
                  required
                </span>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Basic info</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Option name<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <CustomInput
                            {...field}
                            placeholder="Color, Size..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
            <div className="flex flex-col">
              <Card>
                <CardContent className="p-6">
                  <Button
                    className="text-xl capitalize mb-4 w-full"
                    type="submit"
                    size={"lg"}
                    disabled={isCreating || isUpdating || isLoading}
                  >
                    save
                  </Button>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="asFilters"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-[1px] border p-3 shadow-sm">
                          <div className="space-y-1">
                            <FormLabel>
                              Display option values as filters (subcategory
                              listing page)
                            </FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked); // Actualizează valoarea în formular
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="separateImages"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-[1px] border p-3 shadow-sm">
                          <div className="space-y-1">
                            <FormLabel>
                              Option values have separate images
                            </FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked); // Actualizează valoarea în formular
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="isColor"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-[1px] border p-3 shadow-sm">
                          <div className="space-y-1">
                            <FormLabel>Option value is a color</FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked); // Actualizează valoarea în formular
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
