import type { Metadata } from "next";
import "@/styles/globals.css";
import AntdRegistry from "@/components/AntdRegistry";

export const metadata: Metadata = {
  title: "Max's RobotLife",
  description: "This is a small project for personal learning purposes.",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
