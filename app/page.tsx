import ImagesTRxTest from "@/components/custom/ImagesTRxTest";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dxqrih3zq",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
  secure: true,
});

export interface CloudinaryResourcesProps {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  version: string;
}

export default async function Home() {
  const { resources } = await cloudinary.search
    .expression("tags=bratara")
    .execute();
  
    
  return (
    <main className="container">
      <ul className="grid gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {resources.map((product: CloudinaryResourcesProps) => {
          return (
            <ImagesTRxTest key={product.public_id} product={product} />
            
          );
        })}
      </ul>
    </main>
  );
}
