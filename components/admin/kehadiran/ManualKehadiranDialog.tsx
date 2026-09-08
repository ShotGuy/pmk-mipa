"use client"

import { useState } from "react"
import { createManualKehadiran, ManualKehadiranValues } from "@/actions/kehadiran"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { ChevronsUpDown, Check, UserCheck, Sparkles, UserPlus } from "lucide-react"
import { cn } from "@/lib/utils"

interface AnggotaOption {
    id: string
    nama: string
    prodi: string | null
    angkatan: number | null
    isAKTB?: boolean
}

interface ManualKehadiranDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    idKegiatan: string
    kegiatanNama: string
    anggotaOptions: AnggotaOption[]
    onSuccess?: () => void
}

export function ManualKehadiranDialog({
    open,
    onOpenChange,
    idKegiatan,
    kegiatanNama,
    anggotaOptions,
    onSuccess,
}: ManualKehadiranDialogProps) {
    const [tipe, setTipe] = useState<"ANGGOTA" | "PENGUNJUNG">("ANGGOTA")
    const [selectedAnggotaId, setSelectedAnggotaId] = useState<string>("")
    const [openCombobox, setOpenCombobox] = useState(false)
    const [statusAnggota, setStatusAnggota] = useState<"APMK" | "AKTB">("APMK")

    // Pengunjung fields
    const [namaPengunjung, setNamaPengunjung] = useState("")
    const [jenisKelamin, setJenisKelamin] = useState<"L" | "P">("L")
    const [prodi, setProdi] = useState("")
    const [angkatan, setAngkatan] = useState("")
    const [noHp, setNoHp] = useState("")
    const [tauPmkDariMana, setTauPmkDariMana] = useState("")

    const [isPending, setIsPending] = useState(false)

    const selectedAnggota = anggotaOptions.find((a) => a.id === selectedAnggotaId)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (tipe === "ANGGOTA") {
            if (!selectedAnggotaId) {
                toast.error("Pilih Anggota", { description: "Silakan pilih salah satu nama anggota PMK." })
                return
            }

            const payload: ManualKehadiranValues = {
                idKegiatan,
                tipe: "ANGGOTA",
                idAnggota: selectedAnggotaId,
                nama: selectedAnggota?.nama || "",
                status: statusAnggota,
                prodi: selectedAnggota?.prodi || null,
                angkatan: selectedAnggota?.angkatan || null,
            }

            setIsPending(true)
            try {
                const res = await createManualKehadiran(payload)
                if (res.success) {
                    toast.success("Berhasil Disimpan", { description: res.message })
                    onOpenChange(false)
                    resetForm()
                    onSuccess?.()
                } else {
                    toast.error("Gagal Menyimpan", { description: res.message })
                }
            } catch {
                toast.error("Kesalahan Server", { description: "Gagal memproses simpan manual." })
            } finally {
                setIsPending(false)
            }
        } else {
            if (!namaPengunjung.trim()) {
                toast.error("Nama Lengkap Wajib Diisi")
                return
            }

            const payload: ManualKehadiranValues = {
                idKegiatan,
                tipe: "PENGUNJUNG",
                nama: namaPengunjung.trim(),
                status: "NON_APMK",
                prodi: prodi.trim() || null,
                angkatan: angkatan ? parseInt(angkatan, 10) : null,
                noHp: noHp.trim() || null,
                jenisKelamin,
                tauPmkDariMana: tauPmkDariMana.trim() || null,
            }

            setIsPending(true)
            try {
                const res = await createManualKehadiran(payload)
                if (res.success) {
                    toast.success("Berhasil Disimpan", { description: res.message })
                    onOpenChange(false)
                    resetForm()
                    onSuccess?.()
                } else {
                    toast.error("Gagal Menyimpan", { description: res.message })
                }
            } catch {
                toast.error("Kesalahan Server", { description: "Gagal memproses simpan manual." })
            } finally {
                setIsPending(false)
            }
        }
    }

    const resetForm = () => {
        setSelectedAnggotaId("")
        setStatusAnggota("APMK")
        setNamaPengunjung("")
        setJenisKelamin("L")
        setProdi("")
        setAngkatan("")
        setNoHp("")
        setTauPmkDariMana("")
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md p-6">
                <DialogHeader className="pb-2 border-b">
                    <div className="flex items-center gap-2 text-primary">
                        <UserPlus className="w-5 h-5" />
                        <span className="text-xs font-semibold uppercase tracking-wider">
                            Input Manual Presensi
                        </span>
                    </div>
                    <DialogTitle className="text-lg">Catat Kehadiran Kegiatan</DialogTitle>
                    <DialogDescription className="text-xs">
                        Mendata jemaat atau tamu secara manual untuk kegiatan: <strong>{kegiatanNama}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    {/* Tipe Kategori */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Kategori Jemaat</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setTipe("ANGGOTA")}
                                className={cn(
                                    "h-10 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-all",
                                    tipe === "ANGGOTA"
                                        ? "border-primary bg-primary/10 text-primary font-semibold"
                                        : "border-input bg-card text-muted-foreground hover:bg-muted"
                                )}
                            >
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>Anggota PMK</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setTipe("PENGUNJUNG")}
                                className={cn(
                                    "h-10 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-all",
                                    tipe === "PENGUNJUNG"
                                        ? "border-primary bg-primary/10 text-primary font-semibold"
                                        : "border-input bg-card text-muted-foreground hover:bg-muted"
                                )}
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Pengunjung Luar</span>
                            </button>
                        </div>
                    </div>

                    {tipe === "ANGGOTA" ? (
                        /* Input Anggota */
                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium">Pilih Anggota *</Label>
                                <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openCombobox}
                                            className={cn(
                                                "w-full justify-between bg-card text-left font-normal h-10 text-xs",
                                                !selectedAnggotaId && "text-muted-foreground"
                                            )}
                                            disabled={isPending}
                                        >
                                            <span className="truncate">
                                                {selectedAnggota
                                                    ? `${selectedAnggota.nama} (${selectedAnggota.prodi || "-"})`
                                                    : "Cari nama anggota..."}
                                            </span>
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                                        <Command>
                                            <CommandInput placeholder="Ketik nama atau prodi..." />
                                            <CommandList className="max-h-56">
                                                <CommandEmpty>Anggota tidak ditemukan.</CommandEmpty>
                                                <CommandGroup>
                                                    {anggotaOptions.map((a) => (
                                                        <CommandItem
                                                            key={a.id}
                                                            value={`${a.nama} ${a.prodi || ""}`}
                                                            onSelect={() => {
                                                                setSelectedAnggotaId(a.id)
                                                                setStatusAnggota(a.isAKTB ? "AKTB" : "APMK")
                                                                setOpenCombobox(false)
                                                            }}
                                                            className="flex items-center justify-between py-2 text-xs"
                                                        >
                                                            <div>
                                                                <div className="font-medium flex items-center gap-1.5">
                                                                    <span>{a.nama}</span>
                                                                    {a.isAKTB ? (
                                                                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/20">
                                                                            AKTB
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium border border-blue-500/20">
                                                                            APMK
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="text-[10px] text-muted-foreground">
                                                                    {a.prodi || "-"} {a.angkatan ? `• ${a.angkatan}` : ""}
                                                                </div>
                                                            </div>
                                                            {selectedAnggotaId === a.id && (
                                                                <Check className="h-4 w-4 text-primary" />
                                                            )}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium">Status Kehadiran</Label>
                                <Select
                                    value={statusAnggota}
                                    onValueChange={(v) => setStatusAnggota(v as "APMK" | "AKTB")}
                                >
                                    <SelectTrigger className="h-10 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="APMK">APMK (Anggota PMK)</SelectItem>
                                        <SelectItem value="AKTB">AKTB (Anggota KTB)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    ) : (
                        /* Input Pengunjung */
                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="manualNama" className="text-xs font-medium">Nama Tamu *</Label>
                                <Input
                                    id="manualNama"
                                    placeholder="Nama lengkap pengunjung..."
                                    value={namaPengunjung}
                                    onChange={(e) => setNamaPengunjung(e.target.value)}
                                    className="h-10 text-xs"
                                    disabled={isPending}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium">Jenis Kelamin</Label>
                                    <div className="grid grid-cols-2 gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => setJenisKelamin("L")}
                                            className={cn(
                                                "h-9 rounded-md border text-xs font-medium transition-all",
                                                jenisKelamin === "L"
                                                    ? "border-primary bg-primary/10 text-primary font-semibold"
                                                    : "border-input bg-card text-muted-foreground"
                                            )}
                                        >
                                            Laki-laki
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setJenisKelamin("P")}
                                            className={cn(
                                                "h-9 rounded-md border text-xs font-medium transition-all",
                                                jenisKelamin === "P"
                                                    ? "border-primary bg-primary/10 text-primary font-semibold"
                                                    : "border-input bg-card text-muted-foreground"
                                            )}
                                        >
                                            Perempuan
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="manualAngkatan" className="text-xs font-medium">Angkatan</Label>
                                    <Input
                                        id="manualAngkatan"
                                        type="number"
                                        placeholder="2024"
                                        value={angkatan}
                                        onChange={(e) => setAngkatan(e.target.value)}
                                        className="h-9 text-xs"
                                        disabled={isPending}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="manualProdi" className="text-xs font-medium">Program Studi</Label>
                                    <Input
                                        id="manualProdi"
                                        placeholder="Informatika"
                                        value={prodi}
                                        onChange={(e) => setProdi(e.target.value)}
                                        className="h-9 text-xs"
                                        disabled={isPending}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="manualNoHp" className="text-xs font-medium">No. WhatsApp</Label>
                                    <Input
                                        id="manualNoHp"
                                        type="tel"
                                        placeholder="0812..."
                                        value={noHp}
                                        onChange={(e) => setNoHp(e.target.value)}
                                        className="h-9 text-xs"
                                        disabled={isPending}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="manualTauPmk" className="text-xs font-medium">Tau PMK Dari Mana?</Label>
                                <Input
                                    id="manualTauPmk"
                                    placeholder="Teman, Instagram, dll."
                                    value={tauPmkDariMana}
                                    onChange={(e) => setTauPmkDariMana(e.target.value)}
                                    className="h-9 text-xs"
                                    disabled={isPending}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            size="sm"
                            disabled={isPending || (tipe === "ANGGOTA" ? !selectedAnggotaId : !namaPengunjung.trim())}
                        >
                            {isPending ? "Menyimpan..." : "Simpan Presensi"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
