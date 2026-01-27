import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

export const dynamic = "force-dynamic";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSL === "false" ? false : { rejectUnauthorized: false },
});

export async function GET() {
  try {
    const { rows } = await pool.query(
      "SELECT id, url, created_at AS \"createdAt\" FROM images ORDER BY created_at DESC"
    );
    return NextResponse.json({ images: rows });
  } catch (error) {
    console.error("GET /api/images error", error);
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const url = body?.url?.trim();

    if (!url) {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }

    const { rows } = await pool.query(
      "INSERT INTO images (url) VALUES ($1) RETURNING id, url, created_at AS \"createdAt\"",
      [url]
    );

    return NextResponse.json({ image: rows[0] }, { status: 201 });
  } catch (error) {
    console.error("POST /api/images error", error);
    return NextResponse.json({ error: "Failed to save image" }, { status: 500 });
  }
}
