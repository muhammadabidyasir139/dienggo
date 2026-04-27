import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

let s3ClientInstance: S3Client | null = null;

export function getS3Client(): S3Client {
    if (!s3ClientInstance) {
        s3ClientInstance = new S3Client({
            region: process.env.S3_REGION || "us-east-1",
            endpoint: process.env.S3_ENDPOINT,
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY!,
                secretAccessKey: process.env.S3_SECRET_KEY!,
            },
            forcePathStyle: true,
        });
    }
    return s3ClientInstance;
}

export async function uploadToS3(
    file: Buffer,
    fileName: string,
    contentType: string,
    folder: string = "villa"
): Promise<string> {
    const key = `${folder}/${Date.now()}-${fileName}`;
    
    // Get the client lazily
    const client = getS3Client();

    console.log(`Uploading to S3: Bucket=${process.env.S3_BUCKET}, Key=${key}, ContentType=${contentType}`);
    try {
        await client.send(
            new PutObjectCommand({
                Bucket: process.env.S3_BUCKET!,
                Key: key,
                Body: file,
                ContentType: contentType,
                ACL: "public-read",
            })
        );
        console.log("S3 upload successful");
    } catch (error) {
        console.error("S3 upload failed:", error);
        throw error;
    }

    const endpoint = process.env.S3_ENDPOINT!;
    const bucket = process.env.S3_BUCKET!;
    
    // Convert https://is3.cloudhost.id to is3.cloudhost.id
    const host = endpoint.replace("https://", "").replace("http://", "");
    
    // Return virtual-hosted style URL: https://bucket.host/key
    return `https://${bucket}.${host}/${key}`;
}
