import { Suspense } from "react";
import EmailClient from "./email-client";

export default function EmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-(--bg-main)"><div className="text-white">Loading...</div></div>}>
      <EmailClient />
    </Suspense>
  );
}



