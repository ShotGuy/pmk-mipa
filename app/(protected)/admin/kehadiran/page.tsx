import {
    getKegiatanListForKehadiran,
    getKehadiranByKegiatan,
    getKehadiranMetrics,
} from "@/actions/kehadiran"
import { db } from "@/lib/db"
import { KehadiranClient } from "@/components/admin/kehadiran/KehadiranClient"
import { KehadiranWithRelations } from "./columns"
import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CalendarPlus, CalendarX } from "lucide-react"
import { auth } from "@/auth"

interface KehadiranPageProps {
    searchParams: Promise<{
        kegiatanId?: string
    }>
}

export default async function KehadiranPage({ searchParams }: KehadiranPageProps) {
    const session = await auth()
    const isReadOnly = session?.user?.role === "KETUA"

    const params = await searchParams
    const kegiatanList = await getKegiatanListForKehadiran()

    // Jika belum ada kegiatan sama sekali
    if (kegiatanList.length === 0) {
        return (
            <div className="space-y-6">
                <AdminPageHeader
                    title="Presensi & Kehadiran Ibadah"
                    description="Kelola presensi mandiri QR meja penerima tamu, buka/tutup presensi kegiatan, dan monitoring daftar hadir jemaat."
                />
                <Card className="border-dashed">
                    <CardContent className="py-16 text-center space-y-4">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                            <CalendarX className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold">Belum Ada Kegiatan Ibadah</h3>
                            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                                Buat kegiatan ibadah atau persekutuan terlebih dahulu untuk dapat mengelola presensi kehadiran.
                            </p>
                        </div>
                        <Button asChild>
                            <Link href="/admin/kegiatan/new" className="gap-2">
                                <CalendarPlus className="w-4 h-4" />
                                <span>Tambah Kegiatan Baru</span>
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Tentukan kegiatan yang dipilih (default ke yang pertama/terbaru)
    const selectedKegiatanId =
        params.kegiatanId && kegiatanList.some((k) => k.id === params.kegiatanId)
            ? params.kegiatanId
            : kegiatanList[0].id

    const [kehadiranData, metrics, rawAnggota] = await Promise.all([
        getKehadiranByKegiatan(selectedKegiatanId),
        getKehadiranMetrics(selectedKegiatanId),
        db.anggota.findMany({
            select: {
                id: true,
                nama: true,
                prodi: true,
                angkatan: true,
                anggotaKTB: {
                    where: { isAktif: true, ktb: { status: "AKTIF" } },
                    select: { id: true },
                },
                ktbDipimpin: {
                    where: { status: "AKTIF" },
                    select: { id: true },
                },
            },
            orderBy: { nama: "asc" },
        }),
    ])

    const anggotaOptions = rawAnggota.map((a) => ({
        id: a.id,
        nama: a.nama,
        prodi: a.prodi,
        angkatan: a.angkatan,
        isAKTB: (a.anggotaKTB && a.anggotaKTB.length > 0) || (a.ktbDipimpin && a.ktbDipimpin.length > 0),
    }))

    return (
        <KehadiranClient
            kegiatanList={kegiatanList}
            initialKegiatanId={selectedKegiatanId}
            initialData={kehadiranData as KehadiranWithRelations[]}
            initialMetrics={metrics}
            anggotaOptions={anggotaOptions}
            isReadOnly={isReadOnly}
        />
    )
}
