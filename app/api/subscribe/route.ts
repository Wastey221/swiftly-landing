import { NextResponse } from "next/server";

type SubscribeBody = {
  email?: unknown;
};

export async function POST(req: Request) {
  try {
    const body: SubscribeBody | null = await req.json().catch(() => null);
    const emailRaw = body?.email;

    if (typeof emailRaw !== "string" || !emailRaw.trim()) {
      return NextResponse.json(
        { error: "Invalid email" },
        { status: 400 }
      );
    }

    const email = emailRaw.trim();
    const sheetdbUrl = process.env.SHEETDB_URL;

    if (!sheetdbUrl) {
      return NextResponse.json(
        { error: "Server not configured (missing SHEETDB_URL)" },
        { status: 500 }
      );
    }

    // SheetDB expects: { data: [{ email: "user@example.com" }] }
    const res = await fetch(sheetdbUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [{ email }],
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to subscribe" },
        { status: res.status }
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

