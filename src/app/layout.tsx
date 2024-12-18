import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ThemeProvider } from "@/providers/theme-provider";
import { SidebarProvider } from "@/providers/sidebar-provider";
import Header from "@/components/header/Header";
import Sidebar from "@/components/sidebar/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Travel Website",
  description: "Your complete travel solution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SidebarProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <Header />
              <div className="flex">
                <Sidebar />
                <main className="flex-1 w-0">
                  {children}
                </main>
              </div>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}