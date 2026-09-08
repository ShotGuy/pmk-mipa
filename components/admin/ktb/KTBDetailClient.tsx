"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
    Users,
    UserPlus,
    Pencil,
    ArrowLeft,
    CheckCircle2,
    Shield,
    Trash2,
    UserCheck,
    UserMinus,
    Check,
    ChevronsUpDown,
    Loader2,
    BookOpenCheck,
} from "lucide-react"
import { StatusKTB, StatusPengontrolan } from "@prisma/client"
import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    addAnggotaToKTB,
    toggleStatusAnggotaKTB,
    removeAnggotaFromKTB,
    getAvailableAnggotaForKTB,
} from "@/actions/ktb"
import { cn } from "@/lib/utils"

interface MemberItem {
    id: string
    isAktif: boolean
    createdAt: Date
    anggota: {
        id: string
        nama: string
        prodi: string | null
        angkatan: number | null
        noHp: string | null
    }
}

interface PengontrolanItem {
    id: string
    tanggal: Date
    bahan: string | null
    status: StatusPengontrolan
    keterangan: string | null
}

interface KTBDetailClientProps {
    ktb: {
        id: string
        nama: string
        angkatan: number
        terbentukDimana: string | null
        status: StatusKTB
        createdAt: Date
        pemimpin: {
            id: string
            nama: string
            prodi: string | null
            angkatan: number | null
        }
        pengurus: {
            id: string
            jabatan: string
            anggota: {
                nama: string
            }
        }
        anggotaKTB: MemberItem[]
        pengontrolan?: PengontrolanItem[]
    }
}

interface CandidateItem {
    value: string
    label: string
    subtitle: string
}

export function KTBDetailClient({ ktb }: KTBDetailClientProps) {
    const router = useRouter()

    // Dialog Tambah Anggota
    const [openAddModal, setOpenAddModal] = React.useState(false)
    const [selectedAnggotaId, setSelectedAnggotaId] = React.useState("")
    const [candidates, setCandidates] = React.useState<CandidateItem[]>([])
    const [isLoadingCandidates, setIsLoadingCandidates] = React.useState(false)
    const [openPicker, setOpenPicker] = React.useState(false)
    const [isSubmittingAdd, setIsSubmittingAdd] = React.useState(false)

    // Dialog Konfirmasi Hapus Anggota
    const [deleteMemberId, setDeleteMemberId] = React.useState<string | null>(null)
    const [isDeletingMember, setIsDeletingMember] = React.useState(false)

    // Load available anggota when modal opens
    const handleOpenAddModal = async () => {
        setOpenAddModal(true)
        setSelectedAnggotaId("")
        setIsLoadingCandidates(true)
        try {
            const list = await getAvailableAnggotaForKTB(ktb.id)
            setCandidates(list)
        } catch {
            toast.error("Gagal memuat daftar calon anggota")
        } finally {
            setIsLoadingCandidates(false)
        }
    }

    const handleAddMember = async () => {
        if (!selectedAnggotaId) {
            toast.error("Pilih anggota terlebih dahulu")
            return
        }

        setIsSubmittingAdd(true)
        try {
            const res = await addAnggotaToKTB(ktb.id, selectedAnggotaId)
            if (res.success) {
                toast.success(res.message)
                setOpenAddModal(false)
                router.refresh()
            } else {
                toast.error(res.message)
            }
        } catch {
            toast.error("Terjadi kesalahan saat menambahkan anggota")
        } finally {
            setIsSubmittingAdd(false)
        }
    }

    const handleToggleStatus = async (idKTBAnggota: string, currentStatus: boolean) => {
        try {
            const res = await toggleStatusAnggotaKTB(idKTBAnggota, !currentStatus)
            if (res.success) {
                toast.success(res.message)
                router.refresh()
            } else {
                toast.error(res.message)
            }
        } catch {
            toast.error("Terjadi kesalahan saat mengubah status")
        }
    }

    const handleRemoveMember = async () => {
        if (!deleteMemberId) return
        setIsDeletingMember(true)
        try {
            const res = await removeAnggotaFromKTB(deleteMemberId)
            if (res.success) {
                toast.success(res.message)
                router.refresh()
            } else {
                toast.error(res.message)
            }
        } catch {
            toast.error("Terjadi kesalahan saat menghapus anggota dari KTB")
        } finally {
            setIsDeletingMember(false)
            setDeleteMemberId(null)
        }
    }

    const activeMembers = ktb.anggotaKTB.filter((m) => m.isAktif)
    const pastMembers = ktb.anggotaKTB.filter((m) => !m.isAktif)

    return (
        <div className="space-y-6">
            {/* Navigasi Balik & Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.push("/admin/ktb")}
                        className="h-9 w-9 shrink-0"
                        title="Kembali ke Daftar KTB"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                                {ktb.nama}
                            </h1>
                            {ktb.status === StatusKTB.AKTIF ? (
                                <Badge
                                    variant="outline"
                                    className="bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                                    AKTIF
                                </Badge>
                            ) : (
                                <Badge
                                    variant="outline"
                                    className="bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-400"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
                                    MERGER
                                </Badge>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Angkatan {ktb.angkatan} • {ktb.terbentukDimana ? `Terbentuk di ${ktb.terbentukDimana}` : "Tempat terbentuk tidak dicatat"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        className="gap-2 h-9 text-xs"
                        onClick={() => router.push(`/admin/pengontrolan/new?ktbId=${ktb.id}`)}
                    >
                        <BookOpenCheck className="w-4 h-4" />
                        <span>Catat Pengontrolan</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 h-9 text-xs"
                        onClick={() => router.push(`/admin/ktb/${ktb.id}/edit`)}
                    >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit Informasi KTB</span>
                    </Button>
                </div>
            </div>

            {/* KARTU PROFIL PENGURUS & PEMIMPIN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border bg-card/60 shadow-xs">
                    <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Pemimpin KTB (PKTB)
                        </CardTitle>
                        <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                            <UserCheck className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-1">
                        <div className="text-base font-bold text-foreground">
                            {ktb.pemimpin.nama}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Prodi: {ktb.pemimpin.prodi || "-"} • Angkatan: {ktb.pemimpin.angkatan || "-"}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border bg-card/60 shadow-xs">
                    <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Badan Pengurus Pendamping
                        </CardTitle>
                        <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                            <Shield className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-1">
                        <div className="text-base font-bold text-foreground">
                            {ktb.pengurus.anggota.nama}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                            Jabatan: {ktb.pengurus.jabatan.replace(/_/g, " ").toLowerCase()}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* BAGIAN KELOLA ANGGOTA KTB */}
            <Card className="border shadow-xs bg-card/60 backdrop-blur-sm">
                <CardHeader className="p-4 sm:p-6 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b">
                    <div>
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            <CardTitle className="text-base sm:text-lg">
                                Anggota yang Dinaungi
                            </CardTitle>
                        </div>
                        <CardDescription className="text-xs mt-1">
                            Kelola siapa saja anggota yang bertumbuh di kelompok {ktb.nama} (Total: {activeMembers.length} Aktif, {pastMembers.length} Riwayat/Merger)
                        </CardDescription>
                    </div>

                    <Button
                        size="sm"
                        className="gap-2 h-9 text-xs"
                        onClick={handleOpenAddModal}
                    >
                        <UserPlus className="w-4 h-4" />
                        <span>Tambah Anggota</span>
                    </Button>
                </CardHeader>

                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[40px]">#</TableHead>
                                <TableHead>Nama Anggota</TableHead>
                                <TableHead>Prodi / Angkatan</TableHead>
                                <TableHead>Status di KTB Ini</TableHead>
                                <TableHead>Terdaftar Sejak</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ktb.anggotaKTB.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground text-sm">
                                        Belum ada anggota yang terdaftar di kelompok KTB ini.
                                        <div className="mt-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-xs gap-1.5"
                                                onClick={handleOpenAddModal}
                                            >
                                                <UserPlus className="w-3.5 h-3.5 text-primary" />
                                                Tambah Anggota Pertama
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                ktb.anggotaKTB.map((item, index) => (
                                    <TableRow key={item.id} className={!item.isAktif ? "opacity-75 bg-muted/20" : ""}>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-semibold text-foreground text-sm">
                                                {item.anggota.nama}
                                            </div>
                                            {item.anggota.noHp && (
                                                <span className="text-[11px] text-muted-foreground">
                                                    HP: {item.anggota.noHp}
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-xs">
                                            {item.anggota.prodi || "-"} {item.anggota.angkatan ? `'${String(item.anggota.angkatan).slice(-2)}` : ""}
                                        </TableCell>
                                        <TableCell>
                                            {item.isAktif ? (
                                                <Badge
                                                    variant="outline"
                                                    className="text-[11px] bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400 gap-1"
                                                >
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                                    Aktif Bertumbuh
                                                </Badge>
                                            ) : (
                                                <Badge
                                                    variant="secondary"
                                                    className="text-[11px] text-muted-foreground gap-1"
                                                >
                                                    <UserMinus className="w-3 h-3" />
                                                    Riwayat / Merger
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {format(new Date(item.createdAt), "dd MMM yyyy", { locale: localeId })}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className={cn(
                                                        "h-8 text-xs gap-1",
                                                        item.isAktif
                                                            ? "text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950"
                                                            : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                                                    )}
                                                    onClick={() => handleToggleStatus(item.id, item.isAktif)}
                                                    title={item.isAktif ? "Tandai sebagai riwayat (misal: merger/pindah)" : "Aktifkan kembali keanggotaan"}
                                                >
                                                    {item.isAktif ? (
                                                        <>
                                                            <UserMinus className="w-3.5 h-3.5" />
                                                            <span>Nonaktifkan</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <UserCheck className="w-3.5 h-3.5" />
                                                            <span>Aktifkan</span>
                                                        </>
                                                    )}
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                                    onClick={() => setDeleteMemberId(item.id)}
                                                    title="Hapus dari Kelompok KTB"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* BAGIAN RIWAYAT PENGONTROLAN KTB */}
            <Card className="border shadow-xs bg-card/60 backdrop-blur-sm">
                <CardHeader className="p-4 sm:p-6 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b">
                    <div>
                        <div className="flex items-center gap-2">
                            <BookOpenCheck className="w-5 h-5 text-primary" />
                            <CardTitle className="text-base sm:text-lg">
                                Riwayat Monitoring & Pengontrolan
                            </CardTitle>
                        </div>
                        <CardDescription className="text-xs mt-1">
                            Catatan berkala evaluasi kesehatan dan bahan firman yang dipelajari kelompok {ktb.nama} (Total: {ktb.pengontrolan?.length || 0} Catatan)
                        </CardDescription>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 h-9 text-xs"
                        onClick={() => router.push(`/admin/pengontrolan/new?ktbId=${ktb.id}`)}
                    >
                        <BookOpenCheck className="w-4 h-4 text-primary" />
                        <span>Catat Pengontrolan Baru</span>
                    </Button>
                </CardHeader>

                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[40px]">#</TableHead>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Kondisi Kelompok</TableHead>
                                <TableHead>Bahan yang Dibahas</TableHead>
                                <TableHead>Catatan Evaluasi</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {!ktb.pengontrolan || ktb.pengontrolan.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-28 text-center text-muted-foreground text-sm">
                                        Belum ada catatan pengontrolan untuk kelompok ini.
                                        <div className="mt-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-xs gap-1.5"
                                                onClick={() => router.push(`/admin/pengontrolan/new?ktbId=${ktb.id}`)}
                                            >
                                                <BookOpenCheck className="w-3.5 h-3.5 text-primary" />
                                                Catat Pengontrolan Pertama
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                ktb.pengontrolan.map((item, index) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell className="text-xs sm:text-sm font-medium">
                                            {format(new Date(item.tanggal), "dd MMM yyyy", { locale: localeId })}
                                        </TableCell>
                                        <TableCell>
                                            {item.status === StatusPengontrolan.AKTIF && (
                                                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300 text-xs">
                                                    AKTIF
                                                </Badge>
                                            )}
                                            {item.status === StatusPengontrolan.MACET && (
                                                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300 text-xs">
                                                    MACET
                                                </Badge>
                                            )}
                                            {item.status === StatusPengontrolan.VAKUM && (
                                                <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-300 text-xs">
                                                    VAKUM
                                                </Badge>
                                            )}
                                            {item.status === StatusPengontrolan.MERGER && (
                                                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300 text-xs">
                                                    MERGER
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-xs sm:text-sm">
                                            {item.bahan || <span className="text-muted-foreground italic">-</span>}
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                                            {item.keterangan || "-"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 text-xs gap-1 text-blue-600 hover:text-blue-700"
                                                onClick={() => router.push(`/admin/pengontrolan/${item.id}`)}
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                                <span>Edit</span>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* MODAL: TAMBAH ANGGOTA KE KTB */}
            <Dialog open={openAddModal} onOpenChange={setOpenAddModal}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <UserPlus className="w-5 h-5 text-primary" />
                            <span>Tambah Anggota ke {ktb.nama}</span>
                        </DialogTitle>
                        <DialogDescription>
                            Pilih anggota dari PMK MIPA yang akan dinaungi dalam kelompok KTB ini.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-3 space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-foreground">
                                Pilih Anggota *
                            </label>

                            {isLoadingCandidates ? (
                                <div className="flex items-center justify-center p-6 border rounded-lg bg-muted/20 text-xs text-muted-foreground gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Memuat daftar anggota...</span>
                                </div>
                            ) : (
                                <Popover open={openPicker} onOpenChange={setOpenPicker}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openPicker}
                                            className={cn(
                                                "w-full justify-between text-left font-normal bg-card h-10",
                                                !selectedAnggotaId && "text-muted-foreground"
                                            )}
                                        >
                                            <span className="truncate">
                                                {selectedAnggotaId
                                                    ? candidates.find((c) => c.value === selectedAnggotaId)?.label
                                                    : "Cari nama anggota..."}
                                            </span>
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                                        <Command>
                                            <CommandInput placeholder="Cari nama anggota PMK..." />
                                            <CommandList>
                                                <CommandEmpty>Tidak ada calon anggota ditemukan.</CommandEmpty>
                                                <CommandGroup>
                                                    {candidates.map((cand) => (
                                                        <CommandItem
                                                            key={cand.value}
                                                            value={`${cand.label} ${cand.subtitle}`}
                                                            onSelect={() => {
                                                                setSelectedAnggotaId(cand.value)
                                                                setOpenPicker(false)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    cand.value === selectedAnggotaId ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            <div className="flex flex-col">
                                                                <span className="font-medium text-sm">{cand.label}</span>
                                                                <span className="text-[11px] text-muted-foreground">
                                                                    {cand.subtitle}
                                                                </span>
                                                            </div>
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            )}
                            <p className="text-[11px] text-muted-foreground">
                                Jika anggota sebelumnya aktif di KTB lain, status di kelompok lamanya akan otomatis ditandai sebagai riwayat (merger/pindah).
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setOpenAddModal(false)}
                            disabled={isSubmittingAdd}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleAddMember}
                            disabled={!selectedAnggotaId || isSubmittingAdd}
                        >
                            {isSubmittingAdd ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                "Tambahkan ke KTB"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ALERT DIALOG: KONFIRMASI HAPUS ANGGOTA DARI KTB */}
            <AlertDialog open={!!deleteMemberId} onOpenChange={(open) => !open && setDeleteMemberId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Keluarkan Anggota dari KTB?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Data riwayat keanggotaan di KTB {ktb.nama} akan dihapus. Jika anggota dipindahkan karena merger, Anda disarankan cukup mengubah statusnya menjadi <strong>Riwayat / Nonaktif</strong> agar histori tetap tersimpan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeletingMember}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleRemoveMember}
                            disabled={isDeletingMember}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isDeletingMember ? "Menghapus..." : "Ya, Hapus Keanggotaan"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
