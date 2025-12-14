"use client";

import { DataTable } from "@/components/data-table";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { useImap } from "@/context/imap-context";
import { BACKEND_URL } from "@/lib/utils";
import { IconMail, IconAlertTriangle } from "@tabler/icons-react";
import { act, useEffect, useState } from "react";

export default function EmailList({ folder }: any) {
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { activeAccount, isLoading } = useImap();

  useEffect(() => {
    if (!activeAccount || !activeAccount.email || !activeAccount.password) return;
    const fetchEmails = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/emails/${folder}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // "Authorization": `Bearer ${token}`,
            "X-Email": `${activeAccount.email}`,
            "X-Password": `${activeAccount.password}`
          },
          credentials: "include"
        });

        if (!response.ok) {
          console.warn("API failed, using empty list or handle error");
          setEmails([]);
        } else {
          const data = await response.json();
          setEmails(data);
        }

      } catch (err: any) {
        console.error("Error fetching emails:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [activeAccount]);

  if (loading) {
    return (
      <SidebarInset>
        <div className="flex flex-col flex-1 h-screen w-full items-center justify-center bg-zinc-950">
          <div className="relative flex flex-col items-center gap-6">
            <div className="relative h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl shadow-indigo-500/30 animate-pulse flex">
              <IconMail className="h-8 w-8 text-white" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-semibold text-zinc-100 tracking-tight">Syncing Mailbox</h3>
              <p className="text-sm text-zinc-500">Retrieving your latest conversations...</p>
            </div>
          </div>
        </div>
      </SidebarInset>
    );
  }

  if (error) {
    return (
      <SidebarInset>
        <div className="flex h-screen w-full items-center justify-center bg-zinc-950">
          <div className="flex max-w-md flex-col items-center gap-4 rounded-xl border border-red-900/50 bg-red-950/10 p-8 text-center">
            <div className="rounded-full bg-red-900/20 p-3 text-red-500">
              <IconAlertTriangle className="size-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-400">Connection Error</h3>
              <p className="text-sm text-red-500/80 mt-1">{error}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-xs font-medium text-zinc-400 underline hover:text-zinc-100"
            >
              Try Again
            </button>
          </div>
        </div>
      </SidebarInset>
    );
  }

  return (
    <SidebarInset className="bg-zinc-950">
      <div className="flex flex-col flex-1 w-full min-h-screen">
        <SiteHeader />
        <main className="flex flex-1 flex-col w-full px-4 py-6 md:px-8">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Inbox</h1>
              <p className="text-zinc-400 text-sm mt-1">Manage your incoming messages and alerts.</p>
            </div>
          </div>

          <div className="flex flex-col flex-1 w-full gap-6 rounded-xl border border-zinc-800 bg-zinc-900/20 p-1 shadow-inner">
            <DataTable data={emails} folder={folder} />
          </div>
        </main>
      </div>
    </SidebarInset>
  );
}
