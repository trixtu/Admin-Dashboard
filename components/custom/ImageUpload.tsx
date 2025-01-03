import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import Zoom from "react-medium-image-zoom";

import { ImagePlus, Trash } from "lucide-react";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";

import "react-medium-image-zoom/dist/styles.css";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const onUpload = (result: CloudinaryUploadWidgetResults) => {
    if (
      result.info &&
      typeof result.info === "object" &&
      "secure_url" in result.info
    ) {
      const secure_url = result.info.secure_url;
      onChange(secure_url);
    } else {
      console.error("secure_url is missing from result.info");
    }
  };
  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value && (
          <div className="relative w-[200px] h-[200px] rounded-[1px] overflow-hidden">
            <div className="z-10 absolute top-2 right-2">
              <Button
                className="text-white"
                type="button"
                onClick={() => onRemove("")}
                variant="destructive"
                size="sm"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Zoom>
              <Image
                className="w-auto h-auto object-cover"
                alt="Image"
                fill
                sizes="100"
                src={value}
              />
            </Zoom>
          </div>
        )}
      </div>
      <CldUploadWidget onSuccess={onUpload} uploadPreset="lolela">
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <Button
              type="button"
              disabled={disabled}
              variant="secondary"
              onClick={onClick}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload an Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
