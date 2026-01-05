"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TrustOverridePage from "@/app/components/admin/trust-override-page";

export default function AdminTalentTrustPage() {
  const params = useParams();
  const talentId = params.id as string;

  return <TrustOverridePage userId={talentId} userRole="TALENT" />;
}

