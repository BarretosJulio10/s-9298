
interface QRCodeDisplayProps {
  qrCode: string;
}

export function QRCodeDisplay({ qrCode }: QRCodeDisplayProps) {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">QR Code</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Escaneie o QR Code com seu WhatsApp para conectar
      </p>
      <img
        src={qrCode}
        alt="WhatsApp QR Code"
        className="max-w-[300px] border rounded-lg"
      />
    </div>
  );
}
