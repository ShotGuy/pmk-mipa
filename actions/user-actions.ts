"use server"

import { db } from "@/lib/db"
import { Role } from "@prisma/client"
import { requireRole } from "@/lib/rbac"

export const getUserByEmail = async (email: string) => {
    const authCheck = await requireRole([Role.ADMIN])
    if (!authCheck.success) return null

    try {
        const user = await db.user.findUnique({ where: { email } })
        return user
    } catch {
        return null
    }
}

export const getUserById = async (id: string) => {
    const authCheck = await requireRole([Role.ADMIN])
    if (!authCheck.success) return null

    try {
        const user = await db.user.findUnique({ where: { id } })
        return user
    } catch {
        return null
    }
}

// Admin action to change role
export const updateUserRole = async (userId: string, role: Role) => {
    const authCheck = await requireRole([Role.ADMIN])
    if (!authCheck.success) {
        return { error: authCheck.message }
    }

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
