'use client';

interface DownloadButtonProps {
  invoiceId: string;
  filename: string;
}

export function DownloadButton({ invoiceId, filename }: DownloadButtonProps) {
  return (
    <a
      href={`/api/download-nfe/${invoiceId}?filename=${encodeURIComponent(filename)}`}
      className="text-xs text-blue-600 hover:underline mt-2 inline-block font-medium cursor-pointer bg-transparent border-none"
      target="_blank"
      rel="noopener noreferrer"
    >
      📄 Baixar Nota Fiscal / Boleto
    </a>
  );
}