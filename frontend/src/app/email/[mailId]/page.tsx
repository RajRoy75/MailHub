"use client";

import { use } from "react";
import { useEffect, useState } from "react";
import DOMPurify from "isomorphic-dompurify";
import { Spinner } from "@/components/ui/spinner";

interface EmailDto {
  subject: string;
  bodyHtml?: string;
}

export default function EmailPage({ params }: { params: Promise<{ mailId: string }> }) {
  const { mailId } = use(params);
  const [email, setEmail] = useState<EmailDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:8080/api/emails/${mailId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          cache: "no-store",
        });

        if (!res.ok) {
          setError(`Failed to fetch email (status ${res.status})`);
          return;
        }

        const data = await res.json();
        setEmail(data);
      } catch (err) {
        setError("Network error while fetching email");
        console.error(err);
      }
    };

    fetchEmail();
  }, [mailId]);

  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!email) return <div className="flex flex-col items-center justify-center gap-4">
    <div>
      <Spinner className="size-10 text-blue-500" />
    </div>
    <div>
      <h3>
        Loading Email...
      </h3>
    </div>

  </div>;

  const sanitizedHtml = DOMPurify.sanitize(email.bodyHtml || "", {
    FORBID_TAGS: ["script", "style"],
    FORBID_ATTR: ["onerror", "onclick"],
  });

  return (
    <div className="emails-wrapper flex flex-col items-center p-6">
      <h1 className="text-xl font-bold mb-4">{email.subject || "No subject"}</h1>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
    </div>
  );
}
