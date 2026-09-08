import { notFound } from "next/navigation"
import { getPublicKegiatanByToken, getAnggotaListForPresensi } from "@/actions/kehadiran"
import { PublicPresensiClient } from "@/components/presensi/PublicPresensiClient"

interface PresensiPageProps {
    params: Promise<{
        token: string
    }>
}

export async function generateMetadata({ params }: PresensiPageProps) {
    const { token } = await params
    const kegiatan = await getPublicKegiatanByToken(token)

    if (!kegiatan) {
        return {
            title: "Presensi Tidak Ditemukan | PMK MIPA",
        }
    }

    return {
        title: `Presensi: ${kegiatan.nama} | PMK MIPA`,
        description: `Presensi mandiri kehadiran kegiatan ${kegiatan.nama} PMK MIPA FST Universitas Nusa Cendana.`,
    }
}

export default async function PresensiPublicPage({ params }: PresensiPageProps) {
    const { token } = await params
    const kegiatan = await getPublicKegiatanByToken(token)

    if (!kegiatan) {
        notFound()
    }

    const anggotaList = await getAnggotaListForPresensi(kegiatan.id)

    return (
        <PublicPresensiClient
            kegiatan={kegiatan}
            anggotaList={anggotaList}
        />
    )
}
