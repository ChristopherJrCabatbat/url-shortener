import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function RedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch short link
  const { data, error } = await supabaseAdmin
    .from("short_urls")
    .select("target_url, click_count")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
        <h1 className="text-2xl font-semibold mb-2">404 - Link not found</h1>
        <p className="text-gray-600">This short link doesn’t exist or has expired.</p>
      </div>
    );
  }

  // Increment click count asynchronously
  supabaseAdmin
    .from("short_urls")
    .update({ click_count: (data.click_count || 0) + 1 })
    .eq("slug", slug);

  // Redirect user
  redirect(data.target_url);
}
