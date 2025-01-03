"use client";

import { DeleteBrand } from "@/components/models/admin/brands/DeleteBrand";
import React from "react";

export default function page({ params }: { params: { _id: string } }) {
  const _id = params._id;

  return <DeleteBrand _id={_id} />;
}
