import { NextResponse } from "next/server";
// A real app would look up by scanId directly in Redis, but we use history API for now

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const scanId = searchParams.get("scanId");
    const format = searchParams.get("format") || "json";

    if (!scanId) return NextResponse.json({ error: "scanId required" }, { status: 400 });

    // For the sake of the demo API, we'll return a mock response format
    // Real implementation would fetch the exact scan report by ID from Redis
    
    if (format === "csv") {
        const csvContent = `id,severity,category,title\n${scanId},info,architecture,Export test`;
        return new NextResponse(csvContent, {
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": `attachment; filename="archscope-export-${scanId}.csv"`,
            }
        });
    }

    return NextResponse.json({ scanId, format, status: "exported" });
}
