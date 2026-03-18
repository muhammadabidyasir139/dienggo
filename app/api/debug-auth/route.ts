import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const result = await db
            .select()
            .from(users)
            .where(eq(users.email, "admin@dienggo.com"))
            .limit(1);
            
        return NextResponse.json({ success: true, user: result[0] });
    } catch (e: any) {
        return NextResponse.json({
            success: false,
            message: e.message,
            name: e.name,
            cause: e.cause ? { message: e.cause.message, name: e.cause.name } : null,
            code: e.code,
            stack: e.stack
        });
    }
}
