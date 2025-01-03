import "./globals.css";
import Providers from "@/providers";
import React from "react";
import { montserrat } from "./fonts";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning={false}>
      <body className={`flex flex-col min-h-screen ${montserrat.className}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
