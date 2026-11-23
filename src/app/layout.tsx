import type { Metadata, Viewport } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "CivicTrace RTI | Track your application", description: "A clear, transparent way to track Right to Information applications." };
export const viewport: Viewport = { themeColor: "#090D16", width: "device-width", initialScale: 1 };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
