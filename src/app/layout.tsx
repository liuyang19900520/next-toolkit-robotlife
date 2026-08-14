import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: "Max's RobotLife",
  description: 'Personal showcase of projects and tools.',
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
      <body className="antialiased">{children}</body>
    </html>
  );
}
