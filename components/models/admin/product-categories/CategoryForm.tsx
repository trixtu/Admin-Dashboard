"use client";

import Loading from "@/components/custom/Loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/hooks/use-toast";
import { slugString } from "@/lib/helpers";
import { CategoryFormData } from "@/types/forms";
import { categoryValidationSchema } from "@/types/schemas";
import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";
import { z } from "zod";
import { CustomInput } from "@/components/custom/CustomInput";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useSWR, { Fetcher } from "swr";
import { TypeCategoryModel } from "@/types/models";
import {
  CustomSelect,
  CustomSelectContent,
  CustomSelectItem,
  CustomSelectTrigger,
} from "@/components/custom/CustomSelect";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function CategoryForm({ _id }: { _id?: string }) {
  // 1. Set state
  const [isLoading, setLoading] = useState(false);
  const [category, setData] = useState<CategoryFormData>();
  const [openCategory, setOpenCategory] = React.useState(false);
  const [openSubCategory, setOpenSubCategory] = React.useState(false);
  const [openBrand, setOpenBrand] = React.useState(false);

  const router = useRouter();
  const { getToken, userId } = useAuth();

  // fecthing categories
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

  const categories = useSWR<TypeCategoryModel[]>(
    process.env.NEXT_PUBLIC_API_URL + "/api/admin/categories",
    fetcher
  );

  // 2. Form method
  async function postRequest(url: string, { arg }: { arg: CategoryFormData }) {
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
            <ToastAction altText={`Go to ${data.data.name}`}>
              <Link href={`/admin/categories/${data.data._id}`}>
                Go to {data.data.name}
              </Link>
            </ToastAction>
          ),
        });
      })
      .catch((err) => {
        console.log(err.message);
      })
      .finally(() => {
        router.refresh();
      });
  }
  async function putRequest(url: string, { arg }: { arg: CategoryFormData }) {
    const token = await getToken();
    return await axios
      .put(process.env.NEXT_PUBLIC_API_URL + url, arg, {
        params: { _id: category?._id },
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
            <ToastAction altText={`Go to ${data.data.name}`}>
              <Link href={`/admin/categories`}>Go to List</Link>
            </ToastAction>
          ),
        });
      })
      .catch((err) => {
        console.log(err.message);
      })
      .finally(() => {});
  }

  // 3. Set Form mutation
  const { trigger: create, isMutating: isCreating } = useSWRMutation(
    "/api/admin/categories",
    postRequest /* options */
  );
  const { trigger: update, isMutating: isUpdating } = useSWRMutation(
    "/api/admin/categories",
    putRequest /* options */
  );

  // 4. Define your validation and default values.
  const form = useForm<z.infer<typeof categoryValidationSchema>>({
    resolver: zodResolver(categoryValidationSchema),
    defaultValues: category
      ? category
      : {
          name: "",
          description: "",
          slug: "",
          image: "https://cdn-icons-png.flaticon.com/128/10446/10446694.png",
          status: "draft",
        },
  });

  // 5. Reset form default values if edit
  useEffect(() => {
    const getData = async () => {
      const token = await getToken();
      setLoading(true);
      await axios
        .get(process.env.NEXT_PUBLIC_API_URL + "/api/admin/categories", {
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
    _id && getData();
  }, [form.reset]);

  // 6. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof categoryValidationSchema>) => {
    const data = {
      name: values.name,
      slug: values.slug,
      description: values.description,
      image: values.image,
      parentId: values.parentId,
      status: values.status,
      user_id: userId,
    };
    if (category) {
      await update(data);
    } else {
      await create(data);
    }
  };

  // 7. Update slug
  const createSlug = (value: string) => {
    const val = slugString(value);
    form.setValue("slug", val);
  };

  return (
    <>
      {isLoading && <Loading loading={true} />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-12 lg:gap-x-12">
            <div className="flex flex-col col-span-2">
              <div className="mb-4">
                <h2 className="text-2xl font-medium p-0 ">Add Category</h2>
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
                            onInput={(e) => createSlug(e.currentTarget.value)}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          slug<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <CustomInput
                            className="font-bold"
                            readOnly
                            placeholder="slug-auto-generated"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This is auto generated for you!
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <CustomInput
                            isTextarea
                            cols={140}
                            rows={5}
                            placeholder="Put your description here."
                            {...field}
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

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-[1px] border p-3 shadow-sm">
                        <div className="space-y-1">
                          <FormLabel>Category Status</FormLabel>
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

                  <Fragment>
                    <Separator className="my-6" />
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Category</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  disabled={categories.data ? false : true}
                                  className={cn(
                                    "w-sm md:w-md lg:w-lg justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? categories.data?.find(
                                        (category) =>
                                          category.name === field.value
                                      )?.name
                                    : "Select language"}
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <div className="w-full">
                              <PopoverContent className="w-sm md:w-md lg:w-lg p-0 bg-white">
                                <Command>
                                  <CommandInput
                                    placeholder="Search framework..."
                                    className="h-9"
                                  />
                                  <CommandList>
                                    <CommandEmpty>
                                      No framework found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {categories.data &&
                                        categories.data.map((category: any) => (
                                          <CommandItem
                                            value={category.name}
                                            key={category._id}
                                            onSelect={() => {
                                              form.setValue(
                                                "category",
                                                category.name
                                              );
                                            }}
                                          >
                                            {category.name}
                                            <Check
                                              className={cn(
                                                "ml-auto",
                                                category.name === field.value
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                            />
                                          </CommandItem>
                                        ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </div>
                          </Popover>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Fragment>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}