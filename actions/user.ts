"use server"

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { hash } from "bcryptjs";
import { Role } from "@prisma/client";

const UserSchema = z.object({
    name: z.string().min(1, "Nama wajib diisi"),
    username: z.string().min(1, "Username wajib diisi"),
    email: z.string().email("Email tidak valid"),
    password: z.string().optional(), // Optional in schema, validated dynamically
    role: z.nativeEnum(Role),
    idAnggota: z.string().optional().nullable(),
});

export const getEligibleAnggotaForDropdown = async () => {
    try {
        // Fetch active Badan Pengurus options
        // We link User -> Anggota directly, but we only want to show Anggota who are Active BP
        const bpList = await db.badanPengurus.findMany({
            where: { status: true },
            include: {
                anggota: {
                    select: { id: true, nama: true, angkatan: true }
                }
            }
        });

        // Format: [Nama] - [Angkatan]
        const options = bpList.map(bp => ({
            label: `${bp.anggota.nama} - ${bp.anggota.angkatan || 'N/A'}`,
            value: bp.anggota.id,
            description: bp.prodi || undefined
        }));

        return options;
    } catch {
        return [];
    }
};

export const getAllUsers = async () => {
    try {
        const users = await db.user.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                anggota: {
                    select: { nama: true, angkatan: true }
                }
            }
        });
        return { success: true, data: users };
    } catch {
        return { success: false, message: "Gagal mengambil data user" };
    }
};

export const getUser = async (id: string) => {
    try {
        const user = await db.user.findUnique({
            where: { id },
        });
        return { success: true, data: user };
    } catch {
        return { success: false, message: "Gagal mengambil data user" };
    }
};

export const createUser = async (values: z.infer<typeof UserSchema>) => {
    const validatedFields = UserSchema.safeParse(values);

    if (!validatedFields.success) {
        return { success: false, message: "Input tidak valid" };
    }

    const { name, username, email, password, role, idAnggota } = validatedFields.data;

    if (!password || password.length < 6) {
        return { success: false, message: "Password wajib diisi (min 6 karakter)" };
    }

    try {
        const hashedPassword = await hash(password, 10);

        await db.user.create({
            data: {
                name,
                username,
                email,
                password: hashedPassword,
                role,
                idAnggota: idAnggota || null,
            }
        });

        revalidatePath("/admin/users");
        return { success: true, message: "User berhasil dibuat" };
    } catch (error) {
        console.error("Error creating user:", error);
        return { success: false, message: "Gagal membuat user (Email mungkin sudah terdaftar)" };
    }
};

export const updateUser = async (id: string, values: z.infer<typeof UserSchema>) => {
    const validatedFields = UserSchema.safeParse(values);

    if (!validatedFields.success) {
        return { success: false, message: "Input tidak valid" };
    }

    const { name, username, email, password, role, idAnggota } = validatedFields.data;

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updateData: Record<string, any> = {
            name,
            username,
            email,
            role,
            idAnggota: idAnggota || null,
        };

        // Only update password if provided
        if (password && password.length >= 6) {
            updateData.password = await hash(password, 10);
        }

        await db.user.update({
            where: { id },
            data: updateData
        });

        revalidatePath("/admin/users");
        return { success: true, message: "User berhasil diperbarui" };
    } catch (error) {
        console.error("Error updating user:", error);
        return { success: false, message: "Gagal memperbarui user" };
    }
};

export const deleteUser = async (id: string) => {
    try {
        await db.user.delete({
            where: { id }
        });

        revalidatePath("/admin/users");
        return { success: true, message: "User berhasil dihapus" };
    } catch {
        return { success: false, message: "Gagal menghapus user" };
    }
};
