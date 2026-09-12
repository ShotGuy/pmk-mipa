import { PrismaClient, Role } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
    const rawSeedPassword = process.env.SEED_DEFAULT_PASSWORD;
    if (!rawSeedPassword && process.env.NODE_ENV === "production") {
        throw new Error("CRITICAL SECURITY: SEED_DEFAULT_PASSWORD must be set in production before running seed!");
    }
    const defaultPassword = rawSeedPassword || "PmkMipa@Demo2025!";
    const password = await bcrypt.hash(defaultPassword, 10);
    if (!rawSeedPassword) {
        console.warn("⚠️ PERINGATAN: Menggunakan default seed password untuk development. Di lingkungan produksi, set SEED_DEFAULT_PASSWORD.");
    }

    // Seed demo accounts for all roles
    const seedUsers = [
        {
            email: "admin@pmk-mipa.com",
            name: "Super Admin",
            username: "admin",
            role: Role.ADMIN,
        },
        {
            email: "ketua@pmk-mipa.com",
            name: "Ketua PMK",
            username: "ketua",
            role: Role.KETUA,
        },
        {
            email: "bendahara@pmk-mipa.com",
            name: "Bendahara PMK",
            username: "bendahara",
            role: Role.BENDAHARA,
        },
        {
            email: "koorktb@pmk-mipa.com",
            name: "Koordinator KTB",
            username: "koorktb",
            role: Role.KOORKTB,
        },
        {
            email: "anggotaktb@pmk-mipa.com",
            name: "Anggota Bidang KTB",
            username: "anggotaktb",
            role: Role.ANGGOTAKTB,
        },
        {
            email: "kooracara@pmk-mipa.com",
            name: "Koordinator Acara",
            username: "kooracara",
            role: Role.KOORACARA,
        },
        {
            email: "anggotaacara@pmk-mipa.com",
            name: "Anggota Bidang Acara",
            username: "anggotaacara",
            role: Role.ANGGOTAACARA,
        },
        {
            email: "koordoa@pmk-mipa.com",
            name: "Koordinator Doa & Pemerhati",
            username: "koordoa",
            role: Role.KOORDOA,
        },
        {
            email: "anggotadoa@pmk-mipa.com",
            name: "Anggota Bidang Doa",
            username: "anggotadoa",
            role: Role.ANGGOTADOA,
        },
    ]

    for (const u of seedUsers) {
        const user = await prisma.user.upsert({
            where: { email: u.email },
            update: {
                password,
                role: u.role,
                name: u.name,
                username: u.username,
            },
            create: {
                email: u.email,
                name: u.name,
                username: u.username,
                password,
                role: u.role,
            },
        })
        console.log(`Seeded user: ${user.username} (${user.role})`)
    }

    // Hubungkan koorktb dan anggotaktb dengan data Anggota & BadanPengurus
    // 1. Koordinator KTB: Jonathan
    let anggotaKoor = await prisma.anggota.findFirst({
        where: { nama: { contains: "Jonathan", mode: "insensitive" } }
    })
    if (!anggotaKoor) {
        anggotaKoor = await prisma.anggota.create({
            data: {
                nama: "Jonathan Siregar",
                jenisKelamin: "L",
                prodi: "Ilmu Komputer",
                angkatan: 2023,
            }
        })
    }
    let bpKoor = await prisma.badanPengurus.findFirst({
        where: { idAnggota: anggotaKoor.id, jabatan: "KOORDINATOR_KTB" }
    })
    if (!bpKoor) {
        bpKoor = await prisma.badanPengurus.create({
            data: {
                idAnggota: anggotaKoor.id,
                jabatan: "KOORDINATOR_KTB",
                masaJabatan: "2025/2026",
                status: true,
                prodi: "Ilmu Komputer",
            }
        })
    }
    await prisma.user.update({
        where: { email: "koorktb@pmk-mipa.com" },
        data: { idAnggota: anggotaKoor.id, name: "Jonathan Siregar" }
    })

    // 2. Anggota KTB: Mario (Pendamping KTB)
    let anggotaMario = await prisma.anggota.findFirst({
        where: { nama: { contains: "Mario", mode: "insensitive" } }
    })
    if (!anggotaMario) {
        anggotaMario = await prisma.anggota.create({
            data: {
                nama: "Mario Christian",
                jenisKelamin: "L",
                prodi: "Biologi",
                angkatan: 2024,
            }
        })
    }
    let bpMario = await prisma.badanPengurus.findFirst({
        where: { idAnggota: anggotaMario.id, jabatan: "ANGGOTA_KTB" }
    })
    if (!bpMario) {
        bpMario = await prisma.badanPengurus.create({
            data: {
                idAnggota: anggotaMario.id,
                jabatan: "ANGGOTA_KTB",
                masaJabatan: "2025/2026",
                status: true,
                prodi: "Biologi",
            }
        })
    }
    await prisma.user.update({
        where: { email: "anggotaktb@pmk-mipa.com" },
        data: { idAnggota: anggotaMario.id, name: "Mario Christian" }
    })

    // 3. Pastikan ada KTB yang didampingi oleh Mario dan Jonathan untuk keperluan pengujian
    const existingKTBs = await prisma.kTB.findMany({ take: 3 })
    if (existingKTBs.length >= 2) {
        // Assign KTB pertama ke Mario (anggotaktb)
        await prisma.kTB.update({
            where: { id: existingKTBs[0].id },
            data: { idPengurus: bpMario.id }
        })
        console.log(`Assigned KTB "${existingKTBs[0].nama}" to Mario Christian (anggotaktb)`)

        // Assign KTB kedua ke Jonathan (koorktb)
        await prisma.kTB.update({
            where: { id: existingKTBs[1].id },
            data: { idPengurus: bpKoor.id }
        })
        console.log(`Assigned KTB "${existingKTBs[1].nama}" to Jonathan Siregar (koorktb)`)
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
