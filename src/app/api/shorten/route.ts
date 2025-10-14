// app/api/shorten/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { makeSlug } from "@/lib/slug";

interface ShortUrl {
  id: string;
  slug: string;
  target_url: string;
  title?: string | null;
  expires_at?: string | null;
  created_at?: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url: target_url, customSlug, title, expiresAt } = body as {
      url: string;
      customSlug?: string;
      title?: string;
      expiresAt?: string;
    };

    if (!target_url || typeof target_url !== "string") {
      return NextResponse.json({ error: "Missing url" }, { status: 400 });
    }
    if (!/^https?:\/\//i.test(target_url)) {
      return NextResponse.json(
        { error: "Invalid URL (must include http(s)://)" },
        { status: 400 }
      );
    }

    let slug = customSlug?.trim() || makeSlug();
    let attempts = 0;

    while (attempts < 6) {
      const { data, error } = await supabaseAdmin
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
        .maybeSingle<ShortUrl>();

      if (data && !error) {
        return NextResponse.json({
          id: data.id,
          slug,
          shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${slug}`,
        });
      }

      attempts++;
      slug = makeSlug();
    }

    return NextResponse.json(
      { error: "Unable to generate unique slug" },
      { status: 500 }
    );
  } catch (err) {
    console.error("/api/shorten error", err);
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
