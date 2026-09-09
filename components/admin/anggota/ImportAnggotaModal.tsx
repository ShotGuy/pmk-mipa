"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import * as XLSX from "xlsx"
import {
    FileSpreadsheet,
    Upload,
    Download,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Check,
    FileUp,
    Info,
} from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { importAnggotaBulk, RawAnggotaRow, ImportAnggotaResult } from "@/actions/anggota"
import { cn } from "@/lib/utils"
import { parseIndonesianTTL } from "@/lib/date-parser"

interface ParsedPreviewRow {
    nama: string
    jenisKelamin: string
    tanggalLahir: string
    prodi: string
    angkatan: string | number
    noHp: string
}

export function ImportAnggotaModal() {
    const router = useRouter()
    const [open, setOpen] = React.useState(false)
    const [isPending, startTransition] = React.useTransition()

    const [file, setFile] = React.useState<File | null>(null)
    const [previewRows, setPreviewRows] = React.useState<ParsedPreviewRow[]>([])
    const [allParsedRows, setAllParsedRows] = React.useState<RawAnggotaRow[]>([])
    const [skipDuplicates, setSkipDuplicates] = React.useState(true)
    const [importResult, setImportResult] = React.useState<ImportAnggotaResult | null>(null)
    const [isDragging, setIsDragging] = React.useState(false)

    const fileInputRef = React.useRef<HTMLInputElement>(null)

    // Reset state saat modal ditutup
    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            setFile(null)
            setPreviewRows([])
            setAllParsedRows([])
            setImportResult(null)
        }
        setOpen(newOpen)
    }

    // 1. Download Template Excel
    const handleDownloadTemplate = () => {
        const templateData = [
            {
                "Nama Lengkap*": "Jonathan Siregar",
                "Jenis Kelamin (L/P)*": "L",
                "TTL / Tanggal Lahir (Opsional)": "Ndeuama, 18 Mei 2005",
                "Program Studi": "Ilmu Komputer",
                "Angkatan": 2023,
                "No HP / WhatsApp": "081234567890",
            },
            {
                "Nama Lengkap*": "Debora Simanjuntak",
                "Jenis Kelamin (L/P)*": "P",
                "TTL / Tanggal Lahir (Opsional)": "Kupang, 06 Spetember 2005",
                "Program Studi": "Matematika",
                "Angkatan": 2024,
                "No HP / WhatsApp": "082198765432",
            },
            {
                "Nama Lengkap*": "Mario Christian",
                "Jenis Kelamin (L/P)*": "L",
                "TTL / Tanggal Lahir (Opsional)": "",
                "Program Studi": "Fisika",
                "Angkatan": 2022,
                "No HP / WhatsApp": "",
            },
        ]

        const worksheet = XLSX.utils.json_to_sheet(templateData)
        // Set column widths
        worksheet["!cols"] = [
            { wch: 25 }, // Nama
            { wch: 22 }, // JK
            { wch: 32 }, // TTL / Tanggal Lahir
            { wch: 22 }, // Prodi
            { wch: 12 }, // Angkatan
            { wch: 20 }, // No HP
        ]

        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Template Anggota")
        XLSX.writeFile(workbook, "Template_Import_Anggota_PMK.xlsx")
        toast.success("Template Excel berhasil diunduh")
    }

    // 2. Parse File Excel / CSV
    const processFile = async (uploadedFile: File) => {
        setFile(uploadedFile)
        setImportResult(null)

        try {
            const buffer = await uploadedFile.arrayBuffer()
            const data = new Uint8Array(buffer)
            const workbook = XLSX.read(data, { type: "array", cellDates: true })

            if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
                toast.error("File Excel tidak memiliki sheet yang valid")
                return
            }

            const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
            const rawData: Array<Record<string, unknown>> = XLSX.utils.sheet_to_json(firstSheet, { defval: "" })

            if (rawData.length === 0) {
                toast.error("File Excel kosong atau tidak memiliki baris data")
                return
            }

            // Fungsi pencocokan nama header fleksibel
            const findValue = (row: Record<string, unknown>, regex: RegExp): unknown => {
                const matchedKey = Object.keys(row).find((k) => regex.test(k.trim()))
                return matchedKey !== undefined ? row[matchedKey] : ""
            }

            const parsedList: RawAnggotaRow[] = []
            const previewList: ParsedPreviewRow[] = []

            for (const row of rawData) {
                const namaVal = findValue(row, /^(nama|nama\s*lengkap|name|full\s*name)$/i) || findValue(row, /nama/i)
                const jkVal = findValue(row, /^(jenis\s*kelamin|jk|gender|sex)$/i) || findValue(row, /kelamin/i)
                const tglLahirVal =
                    findValue(row, /^(ttl|t\.t\.l|tempat.*lahir|tanggal\s*lahir|tgl\s*lahir|tgl_lahir|birth.*date|dob|tgl)$/i) ||
                    findValue(row, /ttl|lahir/i)
                const prodiVal = findValue(row, /^(prodi|program\s*studi|jurusan|departemen)$/i) || findValue(row, /prodi/i)
                const angkatanVal = findValue(row, /^(angkatan|tahun|stambuk|tahun\s*masuk)$/i) || findValue(row, /angkatan/i)
                const noHpVal = findValue(row, /^(no\s*hp|nohp|nomor\s*hp|wa|whatsapp|no\s*telp|telepon|phone)$/i) || findValue(row, /hp|wa/i)

                const nama = String(namaVal || "").trim()
                const jk = String(jkVal || "").trim()
                const prodi = String(prodiVal || "").trim()
                const angkatan = String(angkatanVal || "").trim()
                const noHp = String(noHpVal || "").trim()
                const parsedTgl = parseIndonesianTTL(tglLahirVal)

                // Lewati baris kosong total
                if (!nama && !jk && !prodi && !angkatan && !noHp && !parsedTgl.date) continue

                parsedList.push({
                    nama,
                    jenisKelamin: jk || null,
                    tanggalLahir: parsedTgl.date,
                    prodi: prodi || null,
                    angkatan: angkatan || null,
                    noHp: noHp || null,
                })

                if (previewList.length < 5) {
                    previewList.push({
                        nama: nama || "-",
                        jenisKelamin: jk || "-",
                        tanggalLahir: parsedTgl.displayStr,
                        prodi: prodi || "-",
                        angkatan: angkatan || "-",
                        noHp: noHp || "-",
                    })
                }
            }

            setAllParsedRows(parsedList)
            setPreviewRows(previewList)
            toast.success(`Berhasil membaca ${parsedList.length} baris dari file Excel.`)
        } catch (error) {
            console.error("Error parsing file:", error)
            toast.error("Gagal membaca file Excel. Pastikan format file .xlsx, .xls, atau .csv.")
        }
    }

    // Handle Drag & Drop
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFile = e.dataTransfer.files[0]
            processFile(droppedFile)
        }
    }

    // 3. Eksekusi Import ke Server Action
    const handleExecuteImport = () => {
        if (allParsedRows.length === 0) {
            toast.error("Pilih file Excel terlebih dahulu")
            return
        }

        startTransition(async () => {
            const res = await importAnggotaBulk(allParsedRows, { skipDuplicates })
            setImportResult(res)

            if (res.success) {
                toast.success(res.message)
                router.refresh()
            } else {
                toast.error(res.message)
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 border-emerald-600/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>Import Excel</span>
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                        <span>Import Data Anggota (APMK)</span>
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        Unggah file Excel (.xlsx / .xls) atau CSV untuk memasukkan ratusan hingga ribuan data jemaat sekaligus.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto pr-1 space-y-5 my-2">
                    {/* Header Info & Download Template Banner */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border bg-muted/40 text-xs">
                        <div className="flex items-start gap-2.5">
                            <Info className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
                            <div className="space-y-0.5">
                                <p className="font-semibold text-foreground">Gunakan Template yang Sesuai</p>
                                <p className="text-muted-foreground text-[11px]">
                                    Format kolom: Nama Lengkap*, Jenis Kelamin (L/P)*, TTL / Tanggal Lahir (opsional), Prodi, Angkatan, No HP.
                                </p>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleDownloadTemplate}
                            className="h-8 text-xs gap-1.5 shrink-0 hover:border-emerald-600"
                        >
                            <Download className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Unduh Template</span>
                        </Button>
                    </div>

                    {/* Drag & Drop File Zone */}
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                            "border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2.5",
                            isDragging
                                ? "border-emerald-500 bg-emerald-500/10 scale-[0.99]"
                                : file
                                ? "border-emerald-500/50 bg-emerald-50/40 dark:bg-emerald-950/20"
                                : "border-border hover:border-muted-foreground/50 hover:bg-muted/30"
                        )}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".xlsx, .xls, .csv"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    processFile(e.target.files[0])
                                }
                            }}
                        />

                        {file ? (
                            <div className="flex flex-col items-center gap-2">
                                <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                                    <FileUp className="w-6 h-6" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="font-semibold text-sm text-foreground">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {(file.size / 1024).toFixed(1)} KB • Terdeteksi{" "}
                                        <strong className="text-foreground">{allParsedRows.length}</strong> baris data
                                    </p>
                                </div>
                                <span className="text-[11px] text-emerald-600 font-medium">
                                    Klik atau seret file lain untuk mengganti
                                </span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <div className="p-3 rounded-full bg-muted text-muted-foreground">
                                    <Upload className="w-6 h-6" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-sm font-semibold text-foreground">
                                        Tarik & lepas file Excel di sini
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Mendukung format .xlsx, .xls, atau .csv
                                    </p>
                                </div>
                                <Button type="button" variant="secondary" size="sm" className="h-7 text-xs mt-1">
                                    Pilih dari Komputer
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Preview 5 Baris Pertama */}
                    {previewRows.length > 0 && (
                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                    <span>Pratinjau Data (5 dari {allParsedRows.length} baris)</span>
                                </span>
                                <Badge variant="secondary" className="text-[11px] font-normal">
                                    Kolom TTL otomatis diekstrak tanggalnya
                                </Badge>
                            </div>

                            <div className="rounded-xl border overflow-hidden bg-card/60">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50 text-[11px]">
                                            <TableHead className="h-8 font-semibold">Nama</TableHead>
                                            <TableHead className="h-8 font-semibold text-center w-14">JK</TableHead>
                                            <TableHead className="h-8 font-semibold">Tgl Lahir</TableHead>
                                            <TableHead className="h-8 font-semibold">Prodi</TableHead>
                                            <TableHead className="h-8 font-semibold text-center w-16">Angkatan</TableHead>
                                            <TableHead className="h-8 font-semibold">No HP</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {previewRows.map((row, idx) => (
                                            <TableRow key={idx} className="text-xs">
                                                <TableCell className="font-medium">{row.nama}</TableCell>
                                                <TableCell className="text-center font-mono">
                                                    <span className="px-1.5 py-0.5 rounded bg-muted">
                                                        {row.jenisKelamin}
                                                    </span>
                                                </TableCell>
                                                <TableCell>{row.tanggalLahir !== "-" ? row.tanggalLahir : <span className="text-muted-foreground italic">-</span>}</TableCell>
                                                <TableCell>{row.prodi || <span className="text-muted-foreground italic">-</span>}</TableCell>
                                                <TableCell className="text-center">
                                                    {row.angkatan || <span className="text-muted-foreground italic">-</span>}
                                                </TableCell>
                                                <TableCell>{row.noHp || <span className="text-muted-foreground italic">-</span>}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}

                    {/* Options (Skip Duplicates) */}
                    {allParsedRows.length > 0 && (
                        <label className="flex items-start gap-3 p-3 rounded-xl border bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors">
                            <input
                                type="checkbox"
                                checked={skipDuplicates}
                                onChange={(e) => setSkipDuplicates(e.target.checked)}
                                className="mt-0.5 rounded border-muted-foreground/50 text-emerald-600 focus:ring-emerald-500"
                            />
                            <div className="flex flex-col text-xs">
                                <span className="font-medium text-foreground">
                                    Lewati data duplikat otomatis
                                </span>
                                <span className="text-muted-foreground text-[11px]">
                                    Jika ada anggota dengan kombinasi nama dan angkatan yang sudah tercatat di database, data tersebut tidak akan dimasukkan kembali.
                                </span>
                            </div>
                        </label>
                    )}

                    {/* Laporan Hasil Import */}
                    {importResult && (
                        <div
                            className={cn(
                                "p-4 rounded-xl border text-xs space-y-2",
                                importResult.success
                                    ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
                                    : "bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200"
                            )}
                        >
                            <div className="flex items-center gap-2 font-semibold">
                                {importResult.success ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                ) : (
                                    <AlertCircle className="w-4 h-4 text-rose-600" />
                                )}
                                <span>{importResult.message}</span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 pt-1">
                                <div className="p-2 rounded-lg bg-background/60 border text-center">
                                    <span className="text-muted-foreground block text-[10px]">Data Masuk</span>
                                    <span className="font-bold text-sm text-emerald-600">
                                        {importResult.insertedCount}
                                    </span>
                                </div>
                                <div className="p-2 rounded-lg bg-background/60 border text-center">
                                    <span className="text-muted-foreground block text-[10px]">Duplikat Dilewati</span>
                                    <span className="font-bold text-sm text-amber-600">
                                        {importResult.duplicateCount}
                                    </span>
                                </div>
                                <div className="p-2 rounded-lg bg-background/60 border text-center">
                                    <span className="text-muted-foreground block text-[10px]">Baris Kosong/Invalid</span>
                                    <span className="font-bold text-sm text-muted-foreground">
                                        {importResult.skippedCount}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t">
                    {importResult && importResult.success ? (
                        <Button
                            type="button"
                            onClick={() => handleOpenChange(false)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto"
                        >
                            <Check className="w-4 h-4 mr-1.5" />
                            <span>Selesai & Tutup</span>
                        </Button>
                    ) : (
                        <div className="flex items-center justify-between w-full">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenChange(false)}
                                disabled={isPending}
                            >
                                Batal
                            </Button>

                            <Button
                                type="button"
                                onClick={handleExecuteImport}
                                disabled={isPending || allParsedRows.length === 0}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Memproses {allParsedRows.length} data...</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4" />
                                        <span>
                                            Mulai Import {allParsedRows.length > 0 ? `(${allParsedRows.length} Data)` : ""}
                                        </span>
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
