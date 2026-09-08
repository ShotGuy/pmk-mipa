"use client"

import { useRef, useState, useSyncExternalStore } from "react"
import { useQRCode } from "next-qrcode"
import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Printer, Download, Copy, Check, QrCode, Church, Sparkles } from "lucide-react"

interface StandeeQRDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    kegiatan: {
        id: string
        nama: string
        tanggal: Date
        waktu: Date | null
        lokasi: string | null
        isPresensiOpen: boolean
        presensiToken: string | null
        jenisKegiatanNama: string
    }
}

const emptySubscribe = () => () => {}

export function StandeeQRDialog({ open, onOpenChange, kegiatan }: StandeeQRDialogProps) {
    const { Canvas } = useQRCode()
    const [copied, setCopied] = useState(false)
    const printAreaRef = useRef<HTMLDivElement>(null)

    const origin = useSyncExternalStore(
        emptySubscribe,
        () => window.location.origin,
        () => ""
    )

    const publicUrl = kegiatan.presensiToken && origin ? `${origin}/presensi/${kegiatan.presensiToken}` : ""

    const tanggalFormatted = format(new Date(kegiatan.tanggal), "EEEE, d MMMM yyyy", { locale: localeId })

    const waktuFormatted = kegiatan.waktu
        ? format(new Date(kegiatan.waktu), "HH:mm", { locale: localeId }) + " WIB"
        : null

    const handleCopy = () => {
        if (!publicUrl) return
        navigator.clipboard.writeText(publicUrl)
        setCopied(true)
        toast.success("Link Tersalin ke Clipboard!", {
            description: "Anda dapat membagikan link ini langsung ke grup WhatsApp jemaat.",
        })
        setTimeout(() => setCopied(false), 2500)
    }

    const handlePrint = () => {
        window.print()
    }

    const handleDownload = () => {
        if (!printAreaRef.current) return
        const canvas = printAreaRef.current.querySelector("canvas")
        if (!canvas) {
            toast.error("QR Code belum siap diunduh")
            return
        }

        const pngUrl = canvas.toDataURL("image/png")
        const downloadLink = document.createElement("a")
        downloadLink.href = pngUrl
        downloadLink.download = `QR-Presensi-${kegiatan.nama.replace(/\s+/g, "_")}.png`
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
        toast.success("Gambar QR Berhasil Diunduh!")
    }

    return (
        <>
            {/* Inject Global Print Stylesheet for Clean Standee Output */}
            <style jsx global>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #printable-standee-card,
                    #printable-standee-card * {
                        visibility: visible;
                    }
                    #printable-standee-card {
                        position: fixed;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%, -50%);
                        width: 100%;
                        max-width: 500px;
                        margin: 0;
                        padding: 24px;
                        border: 2px solid #000;
                        border-radius: 16px;
                        box-shadow: none;
                        background: #fff !important;
                        color: #000 !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                }
            `}</style>

            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-md sm:max-w-lg max-h-[92vh] flex flex-col p-0 overflow-hidden bg-card">
                    <DialogHeader className="p-5 sm:p-6 pb-3 border-b bg-muted/30 shrink-0">
                        <div className="flex items-center gap-2 text-primary">
                            <QrCode className="w-5 h-5" />
                            <span className="text-xs font-semibold uppercase tracking-wider">
                                Standee Meja Penerima Tamu
                            </span>
                        </div>
                        <DialogTitle className="text-xl">Cetak / Unduh QR Presensi</DialogTitle>
                        <DialogDescription>
                            Letakkan kartu ini di meja penerima tamu agar jemaat & pengunjung dapat mengisi presensi mandiri.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Printable Standee Card Area with Vertical Scroll if needed */}
                    <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col items-center">
                        <div
                            id="printable-standee-card"
                            ref={printAreaRef}
                            className="w-full max-w-sm border-2 border-primary/20 rounded-2xl p-5 sm:p-6 text-center bg-card shadow-sm space-y-4"
                        >
                            {/* Logo & Header */}
                            <div className="flex flex-col items-center gap-1.5">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                    <Church className="w-6 h-6" />
                                </div>
                                <div className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">
                                    PMK MIPA FST UNIVERSITAS NUSA CENDANA
                                </div>
                                <h2 className="text-lg font-bold text-foreground leading-tight">
                                    {kegiatan.nama}
                                </h2>
                                <Badge variant="secondary" className="text-[10px] px-2.5 py-0.5 mt-0.5">
                                    {kegiatan.jenisKegiatanNama}
                                </Badge>
                            </div>

                            {/* Info Tanggal & Waktu */}
                            <div className="text-xs text-muted-foreground border-y border-dashed py-2 space-y-0.5">
                                <div>{tanggalFormatted}</div>
                                {(waktuFormatted || kegiatan.lokasi) && (
                                    <div className="font-medium text-foreground">
                                        {[waktuFormatted, kegiatan.lokasi].filter(Boolean).join(" • ")}
                                    </div>
                                )}
                            </div>

                            {/* Canvas QR Code */}
                            <div className="py-1 flex flex-col items-center justify-center">
                                <div className="p-3 bg-white rounded-xl border-2 border-gray-100 shadow-inner inline-block">
                                    {publicUrl ? (
                                        <Canvas
                                            text={publicUrl}
                                            options={{
                                                errorCorrectionLevel: "H",
                                                margin: 2,
                                                scale: 5,
                                                width: 190,
                                                color: {
                                                    dark: "#0f172a",
                                                    light: "#ffffff",
                                                },
                                            }}
                                        />
                                    ) : (
                                        <div className="w-[190px] h-[190px] flex items-center justify-center text-xs text-muted-foreground">
                                            Memuat QR...
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Instruksi Tamu */}
                            <div className="space-y-1">
                                <div className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>Selamat Datang!</span>
                                </div>
                                <p className="text-[11px] text-muted-foreground max-w-xs mx-auto leading-relaxed">
                                    Silakan arahkan kamera HP Anda ke QR Code di atas untuk mengisi formulir presensi kehadiran ibadah.
                                </p>
                            </div>

                            {/* Tautan Singkat */}
                            <div className="text-[10px] text-muted-foreground break-all bg-muted/50 p-1.5 rounded border font-mono">
                                {publicUrl}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons Toolbar (Always fixed at bottom) */}
                    <div className="p-4 sm:p-5 border-t bg-muted/20 flex flex-wrap items-center justify-between gap-2 shrink-0 no-print">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCopy}
                            className="gap-1.5 text-xs h-9"
                        >
                            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copied ? "Tersalin" : "Salin Link"}</span>
                        </Button>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDownload}
                                className="gap-1.5 text-xs h-9"
                            >
                                <Download className="w-3.5 h-3.5" />
                                <span>Unduh PNG</span>
                            </Button>
                            <Button
                                size="sm"
                                onClick={handlePrint}
                                className="gap-1.5 text-xs h-9 shadow-sm"
                            >
                                <Printer className="w-3.5 h-3.5" />
                                <span>Cetak Standee</span>
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
