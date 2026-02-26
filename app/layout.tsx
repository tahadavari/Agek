import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agek Kanban",
  description: "MCP-friendly Kanban platform for CLI AI agents"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
