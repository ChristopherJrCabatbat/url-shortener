// app/[slug]/page.tsx
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { redirect } from "next/navigation";

export default async function RedirectPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const { data, error } = await supabaseAdmin
    .from("short_urls")
    .select("target_url, click_count")
    .eq("slug", slug)
    .maybeSingle();

  if (!data || error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        Short URL not found.
      </div>
    );
  }

  // Increment click count
  await supabaseAdmin
    .from("short_urls")
    .update({ click_count: (data.click_count || 0) + 1 })
    .eq("slug", slug);

  redirect(data.target_url);
}
