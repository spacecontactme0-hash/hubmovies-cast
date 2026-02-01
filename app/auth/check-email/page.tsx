import { redirect } from "next/navigation";

export default function CheckEmailPage() {
  // Redirect old check-email route to the OTP flow
  redirect("/auth/send-otp");
}



