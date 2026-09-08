import { PrismaClient, Role } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
    const password = await bcrypt.hash("password123", 10)

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
