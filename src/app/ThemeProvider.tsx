"use client";

import { usePathname } from "next/navigation";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isUpload = pathname.startsWith("/upload");

  return <div className={isUpload ? "" : "dark"}>{children}</div>;
}
