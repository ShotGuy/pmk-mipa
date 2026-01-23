import { z } from "zod";
import { JenisTransaksi } from "@prisma/client";

export const TransactionSchema = z.object({
    jenisTransaksi: z.nativeEnum(JenisTransaksi),
    nominal: z.coerce.number().positive("Nominal harus lebih dari 0"),
    keterangan: z.string().min(1, "Keterangan wajib diisi"),
    tanggal: z.date().optional()
});
