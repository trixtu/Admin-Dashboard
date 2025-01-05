"use client";

import { CustomInput } from "@/components/custom/CustomInput";
import Loading from "@/components/custom/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ColorPicker } from "@/components/ui/color-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { OptionFormData, ValueFormData } from "@/types/forms";
import { valueOptionValidationSchema } from "@/types/schemas";
import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";
import { z } from "zod";

const ValueForm = ({ _id, data }: { _id?: string; data: OptionFormData }) => {
  const idOption = data._id;

  // 1. Set state
  const [isLoading, setLoading] = useState(false);
  const [color, setColor] = useState("#0f0f0f");
  const [value, setData] = useState<ValueFormData>();
  const router = useRouter();
  const { getToken, userId } = useAuth();

  // 2. Form method function
  async function postRequest(url: string, { arg }: { arg: ValueFormData }) {
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
        router.push(`/admin/option-values/list/${idOption}`);
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

  async function putRequest(url: string, { arg }: { arg: ValueFormData }) {
    const token = await getToken();
    return await axios
      .put(process.env.NEXT_PUBLIC_API_URL + url, arg, {
        params: { _id: value?._id },
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
        router.push(`/admin/option-values/list/${data._id}`);
      })
      .catch((err) => {
        console.log(err.message);
      })
      .finally(() => {});
  }
  // 3. Set Form mutation
  const { trigger: create, isMutating: isCreating } = useSWRMutation(
    "/api/admin/option-values",
    postRequest /* options */
  );
  const { trigger: update, isMutating: isUpdating } = useSWRMutation(
    "/api/admin/option-values",
    putRequest /* options */
  );
  // 4. Define your validation and default values.
  const form = useForm<z.infer<typeof valueOptionValidationSchema>>({
    resolver: zodResolver(valueOptionValidationSchema),
    defaultValues: value
      ? value
      : {
          value: "",
          optionId: data._id,
          metadata: {},
          user_id: userId,
        },
  });

  // 5. Reset form default values if edit
  useEffect(() => {
    const getData = async () => {
      const token = await getToken();
      setLoading(true);
      await axios
        .get(process.env.NEXT_PUBLIC_API_URL + "/api/admin/option-values", {
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
  const onSubmit = async (
    values: z.infer<typeof valueOptionValidationSchema>
  ) => {
    const data = {
      value: values.value,
      optionId: values.optionId,
      metadata: {},
      user_id: userId,
    };
    if (value) {
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
                    name="value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Name Value<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <CustomInput
                            {...field}
                            placeholder={data.isColor ? "red, blue" : "M, S, L"}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="optionId"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <CustomInput
                            className="hidden"
                            {...field}
                            placeholder={data.isColor ? "red, blue" : "M, S, L"}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {data.isColor && (
                    <>
                      <Separator />
                      <h5>Select a color</h5>
                      <div className="flex flex-col items-start gap-1 p-2 w-[85px] bg-bgInput">
                        <ColorPicker
                          onChange={(v: string) => {
                            setColor(v);
                          }}
                          value={color}
                        />
                        <p className="text-base">{color}</p>
                      </div>
                    </>
                  )}
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
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

export default ValueForm;
