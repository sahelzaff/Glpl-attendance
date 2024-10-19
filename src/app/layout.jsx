'use client';
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/Navbar";
import Providers from "./providers";
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <QueryClientProvider client={queryClient}>
          <Providers>
            <Navbar />
            {children}
          </Providers>
        </QueryClientProvider>
      </body>
    </html>
  );
}
