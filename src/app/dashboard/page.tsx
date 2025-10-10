// app/dashboard/page.tsx
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Link from "next/link";

export default async function DashboardPage() {
  // Use the existing Supabase admin client
  const supabase = supabaseAdmin;

  // Fetch shortened URLs from the correct table
  const { data: links, error } = await supabase
    .from("short_urls") // ✅ fixed table name
    .select("id, slug, target_url, click_count, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching links:", error);
    return <p className="text-red-500">Failed to load analytics.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      {links && links.length > 0 ? (
        <div className="overflow-x-auto border rounded-lg shadow bg-white">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3">Short URL</th>
                <th className="px-4 py-3">Target URL</th>
                <th className="px-4 py-3">Clicks</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {links.map((link: any) => (
                <tr
                  key={link.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  {/* Short URL */}
                  <td className="px-4 py-3">
                    <Link
                      href={`/${link.slug}`}
                      className="text-blue-600 hover:underline"
                      target="_blank"
                    >
                      {`${
                        process.env.NEXT_PUBLIC_BASE_URL ||
                        "http://localhost:3000"
                      }/${link.slug}`}
                    </Link>
                  </td>

                  {/* Target URL */}
                  <td className="px-4 py-3 max-w-xs truncate">
                    <a
                      href={link.target_url}
                      target="_blank"
                      className="text-gray-700 hover:underline"
                    >
                      {link.target_url}
                    </a>
                  </td>

                  {/* Click count */}
                  <td className="px-4 py-3 text-center font-medium">
                    {link.click_count || 0}
                  </td>

                  {/* Created date */}
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(link.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">No links yet.</p>
      )}
    </div>
  );
}
