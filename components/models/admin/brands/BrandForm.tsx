"use client";

import React, { useEffect, useState } from "react";

import { z } from "zod";
import axios from "axios";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import useSWRMutation from "swr/mutation";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { slugString } from "@/lib/helpers";
import { useRouter } from "next/navigation";
import { BrandFormData } from "@/types/forms";
import { ToastAction } from "@/components/ui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { brandValidationSchema } from "@/types/schemas";
import Loading from "@/components/custom/Loading";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/custom/ImageUpload";
import { Switch } from "@/components/ui/switch";
import { CustomInput } from "@/components/custom/CustomInput";

export default function BrandForm({ _id }: { _id?: string }) {
  // 1. Set state
  const [isLoading, setLoading] = useState(false);
  const [brand, setData] = useState<BrandFormData>();
  const [seo, setSeo] = useState("");
  const router = useRouter();
  const { getToken, userId } = useAuth();

  // 2. Form method function
  async function postRequest(url: string, { arg }: { arg: BrandFormData }) {
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
          action: (
            <ToastAction altText={`Go to ${data?.data?.name}`}>
              <Link href={`/admin/brands/${data?.data?._id}`}>
                Go to {data.data.name}
              </Link>
            </ToastAction>
          ),
        });
        router.push("/admin/brands");
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

  async function putRequest(url: string, { arg }: { arg: BrandFormData }) {
    const token = await getToken();
    return await axios
      .put(process.env.NEXT_PUBLIC_API_URL + url, arg, {
        params: { _id: brand?._id },
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
        router.push("/admin/brands");
      })
      .catch((err) => {
        console.log(err.message);
      })
      .finally(() => {});
  }
  // 3. Set Form mutation
  const { trigger: create, isMutating: isCreating } = useSWRMutation(
    "/api/admin/brands",
    postRequest /* options */
  );
  const { trigger: update, isMutating: isUpdating } = useSWRMutation(
    "/api/admin/brands",
    putRequest /* options */
  );
  // 4. Define your validation and default values.
  const form = useForm<z.infer<typeof brandValidationSchema>>({
    resolver: zodResolver(brandValidationSchema),
    defaultValues: brand
      ? brand
      : {
          name: "",
          seo: "",
          logo: "https://cdn-icons-png.flaticon.com/128/10446/10446694.png",
          banner: "https://cdn-icons-png.flaticon.com/128/10446/10446694.png",
          status: "draft",
          user_id: userId,
        },
  });

  // 5. Reset form default values if edit
  useEffect(() => {
    const getData = async () => {
      const token = await getToken();
      setLoading(true);
      await axios
        .get(process.env.NEXT_PUBLIC_API_URL + "/api/admin/brands", {
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
  const onSubmit = async (values: z.infer<typeof brandValidationSchema>) => {
    const data = {
      name: values.name,
      seo: values.seo,
      logo: values.logo,
      banner: values.banner,
      status: values.status,
      user_id: userId,
    };
    if (brand) {
      await update(data);
    } else {
      await create(data);
    }
  };

  //  Update seo
  const createSeo = (value: string) => {
    const val = slugString(value);
    form.setValue("seo", val);
    setSeo(val);
  };

  return (
    <>
      {isLoading && <Loading loading={true} />}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-12 lg:gap-x-12">
            <div className="flex flex-col col-span-2">
              <div className="mb-4">
                <h2 className="text-2xl font-medium p-0 ">Add brand</h2>
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
                          Brand name<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <CustomInput
                            onInput={(e) => createSeo(e.currentTarget.value)}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <FormDescription>
                          System identifier:{seo}
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="seo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand SEO-friendly URL</FormLabel>
                        <FormControl>
                          <CustomInput
                            {...field}
                            placeholder="seo-auto-generated"
                            readOnly
                          />
                        </FormControl>
                        <FormMessage />
                        <FormDescription>
                          {process.env.NEXT_PUBLIC_CLIENT_URL + "/" + seo}
                        </FormDescription>
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

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-[1px] border p-3 shadow-sm">
                        <div className="space-y-1">
                          <FormLabel>Brand Status</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value === "publish"}
                            onCheckedChange={(checked) => {
                              const newValue = checked ? "publish" : "draft";
                              field.onChange(newValue); // Actualizează valoarea în formular
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Logo image</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent>
                  <FormField
                    control={form.control}
                    name="logo"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ImageUpload
                            value={field.value}
                            disabled={isCreating}
                            onChange={(url) => {
                              field.onChange(url);
                            }}
                            onRemove={() => field.onChange("")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
