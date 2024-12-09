"use client";

import "flatpickr/dist/flatpickr.min.css";
import "@/css/poppins.css";
import "@/css/style.css";
import React from "react";
import Providers from "../../../Providers";
import ClientModalWrapper from "@/components/ClientModalWrapper";
import { Toaster } from "react-hot-toast";
import dynamic from "next/dynamic";
import { NextUIProvider } from "@nextui-org/react";
import AuthGuard from "@/components/AuthGuard";

const DashboardWrapper = dynamic(
  () => import("@/components/DashboardWrapper"),
  { ssr: false },
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <AuthGuard>
          <NextUIProvider>
            <ClientModalWrapper>
              <DashboardWrapper>
                <Toaster position="bottom-right" reverseOrder={false} />
                {children}
              </DashboardWrapper>
            </ClientModalWrapper>
          </NextUIProvider>
        </AuthGuard>
      </body>
    </html>
  );
}
