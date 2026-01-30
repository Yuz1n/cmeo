import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { NodeHttpHandler } from "@aws-sdk/node-http-handler";
import { Agent as HttpsAgent } from "https";

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
  requestHandler: new NodeHttpHandler({
    httpsAgent: new HttpsAgent({ minVersion: 'TLSv1.2' }),
  }),
});

export async function uploadToR2(file: File, userId: string, fileName: string): Promise<string> {
  const buffer = await file.arrayBuffer();

  const day = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const key = `${userId}/${day}/${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
    Key: key,
    Body: Buffer.from(buffer),
    ContentType: file.type,
  });

  await s3Client.send(command);

  // Retorna a URL pública do arquivo
  return `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`;
}