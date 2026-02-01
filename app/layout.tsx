import "./globals.css";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import { Providers } from "@/app/providers";
import { DM_Sans, Libre_Baskerville } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"

const bodyFont = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
  display: "swap",
});

const headingFont = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-heading",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${bodyFont.variable} ${headingFont.variable} antialiased`}
      >
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            {/* Spacer to push content below fixed header - matches header height exactly */}
            <div className="h-[64px] sm:h-[72px] flex-shrink-0" aria-hidden="true" />
            <main className="flex-1 w-full">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
