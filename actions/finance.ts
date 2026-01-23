"use server"

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { JenisTransaksi } from "@prisma/client";
import { z } from "zod";

export const TransactionSchema = z.object({
    jenisTransaksi: z.nativeEnum(JenisTransaksi),
    nominal: z.coerce.number().positive("Nominal harus lebih dari 0"),
    keterangan: z.string().min(1, "Keterangan wajib diisi"),
    tanggal: z.date().optional() // schema has createdAt, but maybe we want custom date? Use createdAt for now.
});

export async function createTransaction(data: z.infer<typeof TransactionSchema>) {
    // 1. Get or Create Default Kas (Single Kas System for now)
    let kas = await db.kas.findFirst();
    if (!kas) {
        kas = await db.kas.create({
            data: {
                nama: "Kas Utama",
                saldo: 0
            }
        });
    }

    const { jenisTransaksi, nominal, keterangan } = data;

    // 2. Validate Balance for Pengeluaran
    if (jenisTransaksi === "PENGELUARAN" && Number(kas.saldo) < nominal) {
        return { error: "Saldo kas tidak mencukupi!" };
    }

    try {
        // 3. Atomic Transaction
        await db.$transaction(async (tx) => {
            // Create Transaction Record
            await tx.transaksi.create({
                data: {
                    jenisTransaksi,
                    nominal,
                    keterangan,
                    idKas: kas!.id,
                }
            });

            // Update Kas Balance
            const updateAmount = jenisTransaksi === "PEMASUKAN" ? nominal : -nominal;
            await tx.kas.update({
                where: { id: kas!.id },
                data: {
                    saldo: {
                        increment: updateAmount
                    }
                }
            });
        });

        revalidatePath("/dashboard/finance");
        return { success: "Transaksi berhasil disimpan" };
    } catch (error) {
        console.error("Transaction Error:", error);
        return { error: "Gagal menyimpan transaksi" };
    }
}

export async function getTransactions() {
    return await db.transaksi.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            kas: true
        }
    });
}

export async function getKasBalance() {
    const kas = await db.kas.findFirst();
    return kas?.saldo || 0;
}
