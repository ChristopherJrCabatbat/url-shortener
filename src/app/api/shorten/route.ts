// app/api/shorten/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { makeSlug } from "@/lib/slug";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url: target_url, customSlug, title, expiresAt } = body;

    // Basic validation
    if (!target_url || typeof target_url !== "string") {
      return NextResponse.json({ error: "Missing url" }, { status: 400 });
    }
    if (!/^https?:\/\//i.test(target_url)) {
      return NextResponse.json(
        { error: "Invalid URL (must include http(s)://)" },
        { status: 400 }
      );
    }

    // slug generation with retry for uniqueness
    let slug = customSlug?.trim() || makeSlug();
    let attempts = 0;

    while (attempts < 6) {
      const insert = await supabaseAdmin
        .from("short_urls")
        .insert([
          {
            slug,
            target_url,
            title: title || null,
            expires_at: expiresAt || null,
          },
        ])
        .select()
        .maybeSingle();

      // if no error and data returned -> success
      // supabaseAdmin returns an object; handle errors conservatively
      // we treat any returned value as success here
      if ((insert as any)?.data) {
        const data = (insert as any).data;
        return NextResponse.json({
          id: data.id,
          slug,
          shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${slug}`,
        });
      }

      // If insert failed due to duplicate slug, generate new one
      attempts++;
      slug = makeSlug();
    }

    return NextResponse.json(
      { error: "Unable to generate unique slug" },
      { status: 500 }
    );
  } catch (err: any) {
    console.error("/api/shorten error", err);
    return NextResponse.json(
      { error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
