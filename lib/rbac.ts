import { auth } from "@/auth"
import { Role } from "@prisma/client"

export interface AuthSession {
    user: {
        id?: string
        name?: string | null
        email?: string | null
        role: Role
        idAnggota?: string
    }
}

/**
 * Memvalidasi apakah user memiliki sesi aktif.
 * Mengembalikan objek user yang terautentikasi atau pesan kesalahan.
 */
export async function requireAuth(): Promise<
    | { success: true; session: AuthSession; user: AuthSession["user"] }
    | { success: false; message: string }
> {
    const session = await auth()
    if (!session || !session.user) {
        return {
            success: false,
            message: "Sesi tidak valid atau telah kedaluwarsa. Silakan login kembali.",
        }
    }
    return {
        success: true,
        session: session as AuthSession,
        user: session.user as AuthSession["user"],
    }
}

/**
 * Memvalidasi apakah user yang login memiliki role yang sesuai dengan daftar role yang diizinkan.
 * Jika tidak berwenang, mengembalikan pesan penolakan akses.
 */
export async function requireRole(allowedRoles: Role[]): Promise<
    | { success: true; session: AuthSession; user: AuthSession["user"] }
    | { success: false; message: string }
> {
    const authResult = await requireAuth()
    if (!authResult.success) {
        return authResult
    }

    const { user, session } = authResult
    if (!allowedRoles.includes(user.role)) {
        return {
            success: false,
            message: "Akses ditolak: Akun Anda tidak memiliki wewenang untuk melakukan tindakan ini.",
        }
    }

    return { success: true, session, user }
}
