import { getSession } from "@/lib/session";
import { getDataSource } from "@/lib/db";
import { Invoice } from "@/src/entities/Invoice";
import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "user") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { invoiceId } = await params;

  const db = await getDataSource();
  const invoice = await db.getRepository(Invoice).findOne({
    where: { id: invoiceId, user: { id: session.userId } },
  });

  if (!invoice || !invoice.nfe_url) {
    return NextResponse.json({ error: "Invoice or file not found" }, { status: 404 });
  }

  // Extract the key from the URL
  const url = new URL(invoice.nfe_url);
  const key = url.pathname.substring(1);

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
      Key: key,
    });

    const response = await s3Client.send(command);

    if (!response.Body) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const stream = response.Body as ReadableStream;
    const headers = new Headers();
    headers.set('Content-Type', response.ContentType || 'application/pdf');
    headers.set('Content-Disposition', `attachment; filename="${request.nextUrl.searchParams.get('filename') || 'nota-fiscal.pdf'}"`);

    return new NextResponse(stream, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error downloading file:', error);
    return NextResponse.json({ error: "Failed to download file" }, { status: 500 });
  }
}