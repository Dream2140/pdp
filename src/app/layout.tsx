import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PDP News",
  description: "A simple news application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="bg-white shadow">
          <div className="mx-auto max-w-4xl px-4 py-4">
            <a href="/" className="text-2xl font-bold text-blue-600">
              PDP News
            </a>
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
