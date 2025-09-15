import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import localfont from "next/font/local"
import "./globals.css";

const manRope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const satoshi = localfont({
  src: "./fonts/Satoshi-Variable.woff2",
  variable: "--font-satoshi"
})

export const metadata: Metadata = {
  title: "Research | JudiX",
  description: "Research platform for legal professionals",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manRope.variable} ${satoshi.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
