import { PrismaClient, Role } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
    const password = await bcrypt.hash("password123", 10)

    // Upsert Admin User
    const admin = await prisma.user.upsert({
        where: { email: "admin@pmk-mipa.com" }, // Using a dummy email for the admin
        update: {
            password: password,
            role: Role.ADMIN,
            username: "admin"
        },
        create: {
            email: "admin@pmk-mipa.com",
            name: "Super Admin",
            username: "admin",
            password: password,
            role: Role.ADMIN,
        },
    })

    console.log({ admin })
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
