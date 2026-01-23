"use client"

import { useEffect, useState } from "react"
import { Html5QrcodeScanner } from "html5-qrcode"
import { recordAttendance } from "@/actions/attendance"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function QRScanner() {
    const [scanResult, setScanResult] = useState<string | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)

    async function handleAttendance(code: string) {
        setIsProcessing(true);
        toast.info("Memproses presensi...");

        const res = await recordAttendance(code);

        if (res.error) {
            toast.error(res.error);
            setScanResult(null); // Allow retry
        } else {
            toast.success(res.success);
            // Keep successful result displayed or reset after delay?
            // Let's keep it displayed so user knows it worked.
        }
        setIsProcessing(false);
    }

    useEffect(() => {
        // Only init scanner if not processing to avoid double scans
        if (scanResult) return;

        const scanner = new Html5QrcodeScanner(
            "reader",
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                rememberLastUsedCamera: true,
                aspectRatio: 1.0
            },
        /* verbose= */ false
        );

        function onScanSuccess(decodedText: string) {
            // Stop scanning temporarily
            scanner.clear();
            setScanResult(decodedText);

            handleAttendance(decodedText);
        }

        function onScanFailure() {
            // gentle failure
        }

        scanner.render(onScanSuccess, onScanFailure);

        return () => {
            scanner.clear().catch(console.error);
        }
    }, [scanResult]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Scan QR Code</CardTitle>
                <CardDescription>Arahkan kamera ke QR Code kegiatan.</CardDescription>
            </CardHeader>
            <CardContent>
                {!scanResult ? (
                    <div id="reader" className="w-full max-w-[400px] mx-auto overflow-hidden rounded-lg"></div>
                ) : (
                    <div className="text-center py-10 space-y-4">
                        <p className="text-green-600 font-bold text-lg">Scan Berhasil!</p>
                        <p className="text-muted-foreground text-sm break-all">{scanResult}</p>
                        <button
                            onClick={() => setScanResult(null)}
                            className="text-sm text-primary underline"
                            disabled={isProcessing}
                        >
                            {isProcessing ? "Memproses..." : "Scan Lagi"}
                        </button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
