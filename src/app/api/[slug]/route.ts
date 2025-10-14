import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> } // 👈 params is now a Promise
) {
  const { slug } = await context.params; // ✅ properly await the Promise

  // --- Connect to Supabase ---
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/short_links?slug=eq.${slug}`,
    {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
      cache: "no-store",
    }
  );

  const data = await res.json();

  if (!data || data.length === 0) {
    return NextResponse.json({ error: "Short link not found" }, { status: 404 });
  }

  const link = data[0];

  // --- Increment click count ---
  await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/short_links?slug=eq.${slug}`,
    {
      method: "PATCH",
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ click_count: link.click_count + 1 }),
    }
  );

  // --- Redirect to the original URL ---
  return NextResponse.redirect(link.original_url, 302);
}
