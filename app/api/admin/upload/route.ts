import { NextResponse } from "next/server";
import { uploadToS3 } from "@/lib/s3";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify admin role
        if (session.user.role !== "admin") {
            return NextResponse.json({ error: "Forbidden: Admin only" }, { status: 403 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");

        // Use S3 if credentials are provided, otherwise fallback to local upload for development
        const useS3 = process.env.S3_ACCESS_KEY && process.env.S3_SECRET_KEY && process.env.S3_BUCKET;

        console.log(`Attempting upload to bucket: ${process.env.S3_BUCKET}`);
        
        if (useS3) {
            const url = await uploadToS3(buffer, safeName, file.type);
            return NextResponse.json({ url });
        } else {
            // ... (local upload logic remain same)
            console.log("S3 credentials missing, using local upload fallback...");
            const uploadDir = path.join(process.cwd(), "public", "villa");

            try {
                await fs.access(uploadDir);
            } catch {
                await fs.mkdir(uploadDir, { recursive: true });
            }

            const fileName = `${Date.now()}-${safeName}`;
            const filePath = path.join(uploadDir, fileName);

            await fs.writeFile(filePath, buffer);

            const url = `/villa/${fileName}`;
            return NextResponse.json({ url });
        }
    } catch (error: any) {
        console.error("DEBUG - Full Upload error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to upload file", details: error.name },
            { status: 500 }
        );
    }
}
