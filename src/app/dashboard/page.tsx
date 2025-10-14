import { supabaseAdmin } from "@/lib/supabaseAdmin";
import DashboardTable from "./DashboardTable";

export const dynamic = "force-dynamic"; // ensures it always fetches latest data

export default async function DashboardPage() {
  const { data: links, error } = await supabaseAdmin
    .from("short_urls")
    .select("id, slug, target_url, click_count, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching links:", error);
    return <p className="p-8 text-red-500">Failed to load links.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      {links && links.length > 0 ? (
        <DashboardTable links={links} />
      ) : (
        <p className="text-gray-600">No links yet.</p>
      )}
    </div>
  );
}
