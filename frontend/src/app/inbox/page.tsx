"use client";

import { DataTable } from "@/components/data-table";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";

export default function Inbox() {
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // optional loading state
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found");
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:8080/api/emails/latest", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        const reversed = [...data].reverse();
        setEmails(reversed);
      } catch (err: any) {
        console.error("Error fetching emails:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <div>
          <Spinner className="size-10 text-blue-500" />
        </div>
        <div>
          <h3>
            Loading Emails...
          </h3>
        </div>

      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <SidebarInset>
      <div className="flex flex-col flex-1 w-full min-h-screen">
        <SiteHeader />
        <main className="flex flex-1 flex-col w-full px-4 py-6">
          <div className="flex flex-col flex-1 w-full gap-6">
            <DataTable data={emails} />
          </div>
        </main>
      </div>
    </SidebarInset>
  );
}
