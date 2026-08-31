"use client";

import { AppSidebar } from "@/components/admin/AppSidebar";
import { HeaderToolbar } from "@/components/admin/HeaderToolbar";
import { ProtectedAccessGuard } from "@/components/admin/instructor-access";
import { FlickeringGrid } from "@/components/FlickeringGrid";
import { HashScrollHandler } from "@/components/HashScrollHandler";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <ProtectedAccessGuard>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 70)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          {/* Sidebar */}
          <AppSidebar variant="sidebar" />
          <SidebarInset>
            <main className="min-h-screen w-full min-w-0">
              <HashScrollHandler />
              <div className="absolute top-0 left-0 z-0 w-full h-50 mask-[linear-gradient(to_top,transparent_25%,black_95%)]">
                <FlickeringGrid
                  className="absolute top-0 left-0 size-full"
                  squareSize={4}
                  gridGap={6}
                  color="#6B7280"
                  maxOpacity={0.2}
                  flickerChance={0.05}
                />
              </div>
              <div className="relative">
                <HeaderToolbar />
                {children}
              </div>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </ProtectedAccessGuard>
    </QueryClientProvider>
  );
};

export default AdminLayout;
