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
    contentType: string
): Promise<string> {
    const key = `uploads/${Date.now()}-${fileName}`;
    
    // Get the client lazily
    const client = getS3Client();

    await client.send(
        new PutObjectCommand({
            Bucket: process.env.S3_BUCKET!,
            Key: key,
            Body: file,
            ContentType: contentType,
        })
    );

    const endpoint = process.env.S3_ENDPOINT!;
    const bucket = process.env.S3_BUCKET!;
    return `${endpoint}/${bucket}/${key}`;
}
