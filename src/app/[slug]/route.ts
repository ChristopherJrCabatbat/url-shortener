import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create a Supabase client using your environment variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // 🔒 Service role for full DB access
);

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { slug } = await context.params; // ✅ await the params promise

  try {
    // --- 1️⃣ Fetch the short link from Supabase ---
    const { data, error } = await supabase
      .from("short_links")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Short link not found" }, { status: 404 });
    }

    // --- 2️⃣ Increment click count ---
    await supabase
      .from("short_links")
      .update({ click_count: (data.click_count || 0) + 1 })
      .eq("id", data.id);

    // --- 3️⃣ Redirect to original URL ---
    return NextResponse.redirect(data.original_url);
  } catch (error) {
    console.error("Error fetching short link:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
