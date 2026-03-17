import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.S3_REGION || "us-east-1",
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY!,
        secretAccessKey: process.env.S3_SECRET_KEY!,
    },
    forcePathStyle: true,
});

export async function uploadToS3(
    file: Buffer,
    fileName: string,
    contentType: string
): Promise<string> {
    const key = `uploads/${Date.now()}-${fileName}`;

    await s3Client.send(
        new PutObjectCommand({
            Bucket: process.env.S3_BUCKET!,
            Key: key,
            Body: file,
            ContentType: contentType,
            ACL: "public-read",
        })
    );

    const endpoint = process.env.S3_ENDPOINT!;
    const bucket = process.env.S3_BUCKET!;
    return `${endpoint}/${bucket}/${key}`;
}

export { s3Client };
