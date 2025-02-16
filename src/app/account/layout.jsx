// app/account/layout.tsx
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AccountSidebar } from "@/components/AccountSidebar";

export default function AccountLayout({ children }) {
  return (
      <SidebarProvider>
        <AccountSidebar />
        <main className="flex flex-col ml-20 mt-20 h-screen">
          {children}
        </main>
      </SidebarProvider>
  );
}
