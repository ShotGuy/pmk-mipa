"use server"

import { db } from "@/lib/db"
import { Role } from "@prisma/client"

export const getUserByEmail = async (email: string) => {
    try {
        const user = await db.user.findUnique({ where: { email } })
        return user
    } catch {
        return null
    }
}

export const getUserById = async (id: string) => {
    try {
        const user = await db.user.findUnique({ where: { id } })
        return user
    } catch {
        return null
    }
}

// Example admin action to change role
export const updateUserRole = async (userId: string, role: Role) => {
    try {
        await db.user.update({
            where: { id: userId },
            data: { role }
        })
        return { success: "Role updated" }
    } catch {
        return { error: "Failed to update role" }
    }
}
