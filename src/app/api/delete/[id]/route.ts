import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const { error } = await supabaseAdmin.from("short_urls").delete().eq("id", id);

  if (error) {
    console.error("Error deleting link:", error);
    return NextResponse.json({ error: "Failed to delete link" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
