import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    try {
        console.log("Attempting to connect to database...")
        const count = await prisma.jenisKegiatan.count()
        console.log(`Connection successful! Found ${count} JenisKegiatan.`)
    } catch (error) {
        console.error("Connection failed:", error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
