"use client"

import { CloudinaryResourcesProps } from "@/app/page";
import { CldImage } from "next-cloudinary";
import React from "react";


export default function ImagesTRxTest({product}:{product:CloudinaryResourcesProps}) {


  return (
    <li
      key={product.public_id}
      className="rounded overflow-hidden bg-white dark:bg-slate-700"
    >
      <div className="relative">
        <CldImage src={product.public_id} width={600} height={600} alt="" crop={"fill"}  sizes="50w"/>
      </div>
    </li>
  );
}
