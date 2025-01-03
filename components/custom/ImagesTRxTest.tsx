"use client"

import { CloudinaryResourcesProps } from "@/app/page";
import { CldImage } from "next-cloudinary";
import React from "react";
import { getCldImageUrl } from 'next-cloudinary';


export default function ImagesTRxTest({product}:{product:CloudinaryResourcesProps}) {
  const src = product.version+'/'+product.public_id
  const url = getCldImageUrl({
    width: product.width,
    height: product.height,
    src: product.public_id
  });


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
