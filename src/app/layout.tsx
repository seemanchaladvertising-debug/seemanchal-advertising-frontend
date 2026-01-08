import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

async function getSeoSettings() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/site-content/settings`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSeoSettings();

  return {
    title: settings?.seoTitle || 'Seemanchal Advertising',
    description: settings?.seoDescription || 'The #1 platform for billboard and outdoor advertising in Seemanchal.',
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
