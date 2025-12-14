"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");
  const isHomePage = pathname == "/";

  if (isAuthPage || isHomePage) {
    return <main>{children}</main>;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 flex items-center justify-center bg-background p-6">
          <div className="w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
