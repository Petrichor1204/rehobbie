import type { Metadata } from "next";
import "./global.css";

export const metadata: Metadata = {
  title: "Hobby Recovery",
  description: "Rediscover the hobbies you used to love.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
