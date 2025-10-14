"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

type LinkData = {
  id: string;
  slug: string;
  target_url: string;
  click_count: number;
  created_at: string;
};

export default function DashboardTable({ links: initialLinks }: { links: LinkData[] }) {
  const [links, setLinks] = useState(initialLinks);

  async function handleCopy(shortUrl: string) {
    await navigator.clipboard.writeText(shortUrl);
    toast.success("Copied to clipboard!");
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this link?")) return;

    // Delete using the public API route instead of admin key
    const res = await fetch(`/api/delete/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Failed to delete link");
      return;
    }

    toast.success("Link deleted!");
    setLinks((prev) => prev.filter((link) => link.id !== id));
  }

  return (
    <div className="overflow-x-auto border rounded-lg shadow bg-white">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="px-4 py-3">Short URL</th>
            <th className="px-4 py-3">Target URL</th>
            <th className="px-4 py-3">Clicks</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {links.map((link) => {
            const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/${link.slug}`;
            return (
              <tr key={link.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <Link href={`/${link.slug}`} className="text-blue-600 hover:underline" target="_blank">
                    {shortUrl}
                  </Link>
                </td>
                <td className="px-4 py-3 max-w-xs truncate">
                  <a href={link.target_url} target="_blank" className="text-gray-700 hover:underline">
                    {link.target_url}
                  </a>
                </td>
                <td className="px-4 py-3 text-center font-medium">{link.click_count || 0}</td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(link.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    onClick={() => handleCopy(shortUrl)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => handleDelete(link.id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
