"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "@/components/BackOffice/common/Loader";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    setLoading(false);
    // if (!session) {
    //   router.push("/signin");
    // }
    // else {
    //   router.push("/dashboard");
    // }
  }, [session, router]);

  if (loading || status === "loading") {
    return <Loader />;
  }

  return <>{children}</>;
}
