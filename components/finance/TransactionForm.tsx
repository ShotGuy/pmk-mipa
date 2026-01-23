"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { JenisTransaksi } from "@prisma/client"
import { createTransaction } from "@/actions/finance"
import { toast } from "sonner" // Ensure sonner is installed/configured

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

import { TransactionSchema } from "@/lib/schemas"
const formSchema = TransactionSchema;

export function TransactionForm() {
    const [isPending, startTransition] = useTransition()

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors }
    } = useForm<z.infer<typeof formSchema>>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            jenisTransaksi: "PEMASUKAN",
            nominal: 0,
            keterangan: ""
        }
    })

    // eslint-disable-next-line react-hooks/incompatible-library
    const jenis = watch("jenisTransaksi")

    function onSubmit(values: z.infer<typeof formSchema>) {
        startTransition(async () => {
            const result = await createTransaction(values);
            if ("error" in result) {
                toast.error(result.error);
            } else {
                toast.success(result.success);
                reset();
            }
        });
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Catat Transaksi</CardTitle>
                <CardDescription>Masukkan data pemasukan atau pengeluaran kas.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="jenis">Jenis Transaksi</Label>
                        <Select
                            onValueChange={(val) => setValue("jenisTransaksi", val as JenisTransaksi)}
                            defaultValue={jenis}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Jenis" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PEMASUKAN">Pemasukan</SelectItem>
                                <SelectItem value="PENGELUARAN">Pengeluaran</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.jenisTransaksi && <p className="text-sm text-red-500">{errors.jenisTransaksi.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nominal">Nominal (Rp)</Label>
                        <Input
                            id="nominal"
                            type="number"
                            placeholder="0"
                            {...register("nominal")}
                        />
                        {errors.nominal && <p className="text-sm text-red-500">{errors.nominal.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="keterangan">Keterangan</Label>
                        <Input
                            id="keterangan"
                            placeholder="Contoh: Iuran Anggota, Beli Konsumsi..."
                            {...register("keterangan")}
                        />
                        {errors.keterangan && <p className="text-sm text-red-500">{errors.keterangan.message}</p>}
                    </div>

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? "Menyimpan..." : "Simpan Transaksi"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
