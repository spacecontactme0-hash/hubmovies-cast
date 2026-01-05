"use client";

import { useParams } from "next/navigation";
import TrustOverridePage from "@/app/components/admin/trust-override-page";

export default function AdminDirectorTrustPage() {
  const params = useParams();
  const directorId = params.id as string;

  return <TrustOverridePage userId={directorId} userRole="DIRECTOR" />;
}

