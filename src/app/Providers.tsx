"use client";

import { NextUIProvider } from "@nextui-org/react";
import React from "react";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      {/* <Toaster position="top-right" reverseOrder={false} /> */}
      {children}
    </NextUIProvider>
  );
}
