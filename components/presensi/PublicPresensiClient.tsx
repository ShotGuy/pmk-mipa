"use client"

import { useState } from "react"
import { submitPresensiAnggota, submitPresensiPengunjung } from "@/actions/kehadiran"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import {
    Calendar,
    Clock,
    MapPin,
    User,
    UserCheck,
    Sparkles,
    CheckCircle2,
    Lock,
    ChevronsUpDown,
    Check,
    Church,
    HeartHandshake,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AnggotaItem {
    id: string
    nama: string
    prodi: string
    angkatan: number | null
    sudahHadir: boolean
}

interface PublicPresensiClientProps {
    kegiatan: {
        id: string
        nama: string
        tanggal: Date
        waktu: Date | null
        lokasi: string | null
        pembicara: string | null
        isPresensiOpen: boolean
        presensiToken: string | null
        jenisKegiatan: { nama: string }
    }
    anggotaList: AnggotaItem[]
}

export function PublicPresensiClient({ kegiatan, anggotaList }: PublicPresensiClientProps) {
    const [activeTab, setActiveTab] = useState<"anggota" | "pengunjung">("anggota")
    const [selectedAnggotaId, setSelectedAnggotaId] = useState<string>("")
    const [openCombobox, setOpenCombobox] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [successData, setSuccessData] = useState<{ nama: string; message: string } | null>(null)

    // Form Pengunjung
    const [namaPengunjung, setNamaPengunjung] = useState("")
    const [jenisKelamin, setJenisKelamin] = useState<"L" | "P">("L")
    const [prodiPengunjung, setProdiPengunjung] = useState("")
    const [angkatanPengunjung, setAngkatanPengunjung] = useState("")
    const [noHpPengunjung, setNoHpPengunjung] = useState("")
    const [tauPmkDariMana, setTauPmkDariMana] = useState("")

    const selectedAnggota = anggotaList.find((a) => a.id === selectedAnggotaId)

    // Formatted date & time
    const tanggalFormatted = new Date(kegiatan.tanggal).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    })

    const waktuFormatted = kegiatan.waktu
        ? new Date(kegiatan.waktu).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }) + " WIB"
        : null

    const handleAnggotaSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!kegiatan.presensiToken) return

        if (!selectedAnggotaId) {
            toast.error("Nama Belum Dipilih", {
                description: "Silakan cari dan pilih nama Anda pada daftar anggota PMK.",
            })
            return
        }

        if (selectedAnggota?.sudahHadir) {
            toast.error("Sudah Terdaftar", {
                description: `${selectedAnggota.nama} sudah tercatat hadir pada kegiatan ini sebelumnya.`,
            })
            return
        }

        setIsSubmitting(true)
        try {
            const res = await submitPresensiAnggota(kegiatan.presensiToken, selectedAnggotaId)
            if (res.success && res.nama) {
                setSuccessData({
                    nama: res.nama,
                    message: res.message || "Presensi Anda berhasil dicatat.",
                })
                toast.success("Presensi Berhasil!", { description: res.message })
            } else {
                toast.error("Gagal Presensi", { description: res.message })
            }
        } catch {
            toast.error("Kesalahan Server", { description: "Gagal memproses presensi, silakan coba lagi." })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handlePengunjungSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!kegiatan.presensiToken) return

        if (!namaPengunjung.trim()) {
            toast.error("Nama Lengkap Wajib Diisi")
            return
        }

        setIsSubmitting(true)
        try {
            const res = await submitPresensiPengunjung(kegiatan.presensiToken, {
                nama: namaPengunjung.trim(),
                jenisKelamin,
                prodi: prodiPengunjung.trim() || undefined,
                angkatan: angkatanPengunjung ? parseInt(angkatanPengunjung, 10) : undefined,
                noHp: noHpPengunjung.trim() || undefined,
                tauPmkDariMana: tauPmkDariMana.trim() || undefined,
            })

            if (res.success && res.nama) {
                setSuccessData({
                    nama: res.nama,
                    message: res.message || "Terima kasih telah hadir!",
                })
                toast.success("Presensi Berhasil!", { description: res.message })
            } else {
                toast.error("Gagal Presensi", { description: res.message })
            }
        } catch {
            toast.error("Kesalahan Server", { description: "Gagal memproses presensi tamu." })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleReset = () => {
        setSuccessData(null)
        setSelectedAnggotaId("")
        setNamaPengunjung("")
        setProdiPengunjung("")
        setAngkatanPengunjung("")
        setNoHpPengunjung("")
        setTauPmkDariMana("")
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-muted/20 py-8 px-4 sm:px-6">
            <div className="max-w-xl mx-auto space-y-6">
                {/* Header Identitas Kegiatan */}
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-1 shadow-sm">
                        <Church className="w-8 h-8" />
                    </div>
                    <div>
                        <Badge variant="outline" className="mb-2 font-medium px-3 py-1 bg-background shadow-xs">
                            {kegiatan.jenisKegiatan.nama}
                        </Badge>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                            {kegiatan.nama}
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            PMK MIPA FST Universitas Nusa Cendana
                        </p>
                    </div>

                    {/* Quick Info Bar */}
                    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs sm:text-sm text-muted-foreground pt-1">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span>{tanggalFormatted}</span>
                        </div>
                        {waktuFormatted && (
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-primary" />
                                <span>{waktuFormatted}</span>
                            </div>
                        )}
                        {kegiatan.lokasi && (
                            <div className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span>{kegiatan.lokasi}</span>
                            </div>
                        )}
                        {kegiatan.pembicara && (
                            <div className="flex items-center gap-1.5">
                                <User className="w-4 h-4 text-primary" />
                                <span>{kegiatan.pembicara}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Kondisi 1: Presensi Sedang Ditutup */}
                {!kegiatan.isPresensiOpen ? (
                    <Card className="border-destructive/30 bg-destructive/5 text-center shadow-md">
                        <CardHeader className="pb-4">
                            <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-2">
                                <Lock className="w-6 h-6" />
                            </div>
                            <CardTitle className="text-lg sm:text-xl text-destructive">
                                Presensi Sedang Ditutup
                            </CardTitle>
                            <CardDescription className="text-foreground/70 max-w-sm mx-auto">
                                Presensi untuk kegiatan ini belum diaktifkan atau telah ditutup oleh panitia / Badan Pengurus.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-xs text-muted-foreground pb-6">
                            Jika Anda hadir pada kegiatan ini dan membutuhkan bantuan presensi, silakan hubungi pengurus atau panitia penerima tamu di lokasi.
                        </CardContent>
                    </Card>
                ) : successData ? (
                    /* Kondisi 2: Sukses Mengisi Presensi */
                    <Card className="border-emerald-500/30 bg-card text-center shadow-lg animate-in fade-in zoom-in-95 duration-300">
                        <CardHeader className="pt-8 pb-4">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
                                <CheckCircle2 className="w-9 h-9 animate-in spin-in-90 duration-300" />
                            </div>
                            <Badge className="w-fit mx-auto bg-emerald-600 hover:bg-emerald-600 text-white font-medium">
                                Presensi Berhasil
                            </Badge>
                            <CardTitle className="text-2xl font-bold mt-2">
                                {successData.nama}
                            </CardTitle>
                            <CardDescription className="text-foreground/80 max-w-sm mx-auto mt-1">
                                {successData.message}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pb-8">
                            <div className="p-4 rounded-xl bg-muted/40 border text-xs sm:text-sm text-muted-foreground flex items-center justify-center gap-2">
                                <HeartHandshake className="w-4 h-4 text-primary shrink-0" />
                                <span>Selamat beribadah bersama kami. Kiranya Tuhan Yesus memberkati!</span>
                            </div>

                            <Button
                                variant="outline"
                                className="w-full h-11"
                                onClick={handleReset}
                            >
                                Isi Presensi Lainnya
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    /* Kondisi 3: Presensi Terbuka & Form Aktif */
                    <Card className="shadow-md border bg-card">
                        <CardHeader className="pb-3 text-center">
                            <CardTitle className="text-xl">Formulir Presensi Mandiri</CardTitle>
                            <CardDescription>
                                Pilih kategori kehadiran Anda di bawah ini:
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Tabs
                                value={activeTab}
                                onValueChange={(v) => setActiveTab(v as "anggota" | "pengunjung")}
                                className="w-full"
                            >
                                <TabsList className="grid w-full grid-cols-2 h-12 p-1 bg-muted/70 rounded-xl">
                                    <TabsTrigger
                                        value="anggota"
                                        className="rounded-lg font-medium text-xs sm:text-sm gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                                    >
                                        <UserCheck className="w-4 h-4" />
                                        <span>Anggota PMK</span>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="pengunjung"
                                        className="rounded-lg font-medium text-xs sm:text-sm gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        <span>Pengunjung / Tamu</span>
                                    </TabsTrigger>
                                </TabsList>

                                {/* TAB 1: ANGGOTA PMK */}
                                <TabsContent value="anggota" className="pt-4 space-y-4">
                                    <form onSubmit={handleAnggotaSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">
                                                Cari Nama Anda di Daftar Anggota *
                                            </Label>
                                            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={openCombobox}
                                                        className={cn(
                                                            "w-full justify-between bg-card text-left font-normal h-12 text-sm",
                                                            !selectedAnggotaId && "text-muted-foreground"
                                                        )}
                                                        disabled={isSubmitting}
                                                    >
                                                        <span className="truncate">
                                                            {selectedAnggota
                                                                ? `${selectedAnggota.nama} (${selectedAnggota.prodi}${selectedAnggota.angkatan ? ` '${selectedAnggota.angkatan.toString().slice(-2)}` : ""})`
                                                                : "Ketik nama lengkap atau prodi..."}
                                                        </span>
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                                                    <Command>
                                                        <CommandInput placeholder="Cari nama, prodi, atau angkatan..." />
                                                        <CommandList className="max-h-64">
                                                            <CommandEmpty>
                                                                <div className="py-4 text-center space-y-1">
                                                                    <p className="text-sm font-medium">Nama tidak ditemukan</p>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        Bukan anggota terdaftar? Silakan gunakan tab <strong>Pengunjung / Tamu</strong>.
                                                                    </p>
                                                                </div>
                                                            </CommandEmpty>
                                                            <CommandGroup>
                                                                {anggotaList.map((a) => (
                                                                    <CommandItem
                                                                        key={a.id}
                                                                        value={`${a.nama} ${a.prodi} ${a.angkatan || ""}`}
                                                                        onSelect={() => {
                                                                            setSelectedAnggotaId(a.id)
                                                                            setOpenCombobox(false)
                                                                        }}
                                                                        className="flex items-center justify-between py-2.5"
                                                                    >
                                                                        <div className="flex flex-col">
                                                                            <span className="font-medium text-sm">{a.nama}</span>
                                                                            <span className="text-xs text-muted-foreground">
                                                                                {a.prodi} {a.angkatan ? `• Angkatan ${a.angkatan}` : ""}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center gap-1.5">
                                                                            {a.sudahHadir && (
                                                                                <Badge variant="outline" className="text-[10px] text-emerald-600 bg-emerald-50 border-emerald-200">
                                                                                    Sudah Hadir
                                                                                </Badge>
                                                                            )}
                                                                            {selectedAnggotaId === a.id && (
                                                                                <Check className="h-4 w-4 text-primary" />
                                                                            )}
                                                                        </div>
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </div>

                                        {selectedAnggota && (
                                            <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 space-y-1 animate-in fade-in-50 duration-200">
                                                <div className="text-xs text-primary font-medium">Anggota Terpilih:</div>
                                                <div className="text-sm font-bold">{selectedAnggota.nama}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    Prodi {selectedAnggota.prodi} {selectedAnggota.angkatan ? `• Angkatan ${selectedAnggota.angkatan}` : ""}
                                                </div>
                                                {selectedAnggota.sudahHadir && (
                                                    <div className="text-xs text-amber-600 font-medium pt-1">
                                                        ⚠️ Nama ini sudah tercatat hadir sebelumnya.
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <Button
                                            type="submit"
                                            className="w-full h-12 text-sm sm:text-base font-semibold shadow-sm"
                                            disabled={isSubmitting || !selectedAnggotaId || selectedAnggota?.sudahHadir}
                                        >
                                            {isSubmitting ? "Menyimpan Kehadiran..." : "Saya Hadir"}
                                        </Button>
                                    </form>
                                </TabsContent>

                                {/* TAB 2: PENGUNJUNG / TAMU BARU */}
                                <TabsContent value="pengunjung" className="pt-4 space-y-4">
                                    <form onSubmit={handlePengunjungSubmit} className="space-y-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="namaPengunjung" className="text-sm font-medium">
                                                Nama Lengkap *
                                            </Label>
                                            <Input
                                                id="namaPengunjung"
                                                placeholder="Contoh: Jonathan Situmorang"
                                                value={namaPengunjung}
                                                onChange={(e) => setNamaPengunjung(e.target.value)}
                                                className="h-11"
                                                disabled={isSubmitting}
                                                required
                                            />
                                        </div>

                                        {/* Jenis Kelamin */}
                                        <div className="space-y-1.5">
                                            <Label className="text-sm font-medium">Jenis Kelamin *</Label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setJenisKelamin("L")}
                                                    className={cn(
                                                        "h-11 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2",
                                                        jenisKelamin === "L"
                                                            ? "border-primary bg-primary/10 text-primary font-semibold shadow-xs"
                                                            : "border-input bg-card text-muted-foreground hover:bg-muted"
                                                    )}
                                                    disabled={isSubmitting}
                                                >
                                                    <span>Laki-laki</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setJenisKelamin("P")}
                                                    className={cn(
                                                        "h-11 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2",
                                                        jenisKelamin === "P"
                                                            ? "border-primary bg-primary/10 text-primary font-semibold shadow-xs"
                                                            : "border-input bg-card text-muted-foreground hover:bg-muted"
                                                    )}
                                                    disabled={isSubmitting}
                                                >
                                                    <span>Perempuan</span>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="prodiPengunjung" className="text-sm font-medium">
                                                    Program Studi / Jurusan
                                                </Label>
                                                <Input
                                                    id="prodiPengunjung"
                                                    placeholder="Contoh: Informatika"
                                                    value={prodiPengunjung}
                                                    onChange={(e) => setProdiPengunjung(e.target.value)}
                                                    className="h-11"
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="angkatanPengunjung" className="text-sm font-medium">
                                                    Angkatan
                                                </Label>
                                                <Input
                                                    id="angkatanPengunjung"
                                                    type="number"
                                                    placeholder="Contoh: 2024"
                                                    value={angkatanPengunjung}
                                                    onChange={(e) => setAngkatanPengunjung(e.target.value)}
                                                    className="h-11"
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="noHpPengunjung" className="text-sm font-medium">
                                                No. WhatsApp (Disarankan)
                                            </Label>
                                            <Input
                                                id="noHpPengunjung"
                                                type="tel"
                                                placeholder="Contoh: 081234567890"
                                                value={noHpPengunjung}
                                                onChange={(e) => setNoHpPengunjung(e.target.value)}
                                                className="h-11"
                                                disabled={isSubmitting}
                                            />
                                            <p className="text-[11px] text-muted-foreground">
                                                Akan digunakan oleh Sie Doa & Pemerhati untuk menyapa dan membagikan informasi kegiatan.
                                            </p>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="tauPmk" className="text-sm font-medium">
                                                Tau Info PMK MIPA Dari Mana?
                                            </Label>
                                            <Input
                                                id="tauPmk"
                                                placeholder="Contoh: Diajak teman sekamar, Instagram PMK, dll."
                                                value={tauPmkDariMana}
                                                onChange={(e) => setTauPmkDariMana(e.target.value)}
                                                className="h-11"
                                                disabled={isSubmitting}
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full h-12 text-sm sm:text-base font-semibold shadow-sm"
                                            disabled={isSubmitting || !namaPengunjung.trim()}
                                        >
                                            {isSubmitting ? "Menyimpan Kehadiran..." : "Kirim Presensi"}
                                        </Button>
                                    </form>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                )}

                {/* Footer Note */}
                <div className="text-center text-xs text-muted-foreground pt-4 pb-8">
                    &copy; {new Date().getFullYear()} Persekutuan Mahasiswa Kristen FST Universitas Nusa Cendana
                </div>
            </div>
        </div>
    )
}
