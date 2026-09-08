"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { Loader2, Wallet, Coins } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { createKas, updateKas } from "@/actions/kas"

const formSchema = z.object({
    nama: z.string().min(1, "Nama akun kas wajib diisi"),
    saldo: z.coerce.number().min(0, "Saldo awal tidak boleh negatif"),
})

type KasFormValues = z.infer<typeof formSchema>

interface KasFormProps {
    initialData?: {
        id: string
        nama: string
        saldoAwal?: number
        saldo?: number
    } | null
    onSuccess?: () => void
    onCancel?: () => void
}

export function KasForm({ initialData, onSuccess, onCancel }: KasFormProps) {
    const router = useRouter()
    const [isPending, setIsPending] = React.useState(false)

    const defaultSaldo =
        initialData?.saldoAwal !== undefined
            ? initialData.saldoAwal
            : initialData?.saldo !== undefined
            ? Number(initialData.saldo)
            : ("" as unknown as number)

    const form = useForm<KasFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            nama: initialData?.nama || "",
            saldo: defaultSaldo,
        },
    })

    const watchedSaldo = form.watch("saldo")

    async function onSubmit(values: KasFormValues) {
        setIsPending(true)
        try {
            const payload = {
                nama: values.nama.trim(),
                saldo: Number(values.saldo) || 0,
            }

            let res
            if (initialData) {
                res = await updateKas(initialData.id, payload)
            } else {
                res = await createKas(payload)
            }

            if (res.success) {
                toast.success(res.message)
                router.refresh()
                if (onSuccess) onSuccess()
            } else {
                toast.error(res.message)
            }
        } catch {
            toast.error("Terjadi kesalahan pada server saat menyimpan data kas")
        } finally {
            setIsPending(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {/* Nama Akun Kas */}
                <FormField
                    control={form.control}
                    name="nama"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-1.5">
                                <Wallet className="w-4 h-4 text-muted-foreground" />
                                <span>Nama Akun Kas</span> <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Contoh: Kas Utama, Rekening BRI, Dompet Tunai"
                                    disabled={isPending}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Nama rekening, dompet fisik, atau pos penyimpanan uang PMK MIPA.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Saldo Awal */}
                <FormField
                    control={form.control}
                    name="saldo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-1.5">
                                <Coins className="w-4 h-4 text-muted-foreground" />
                                <span>Saldo Awal (Rp)</span> <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="0"
                                    disabled={isPending}
                                    value={
                                        field.value
                                            ? new Intl.NumberFormat("id-ID").format(Number(field.value))
                                            : ""
                                    }
                                    onChange={(e) => {
                                        const clean = e.target.value.replace(/\D/g, "")
                                        field.onChange(clean === "" ? "" : Number(clean))
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                Nominal saldo awal ketika akun kas ini pertama kali didaftarkan.
                            </FormDescription>
                            {/* Live Format Helper */}
                            <div className="text-xs font-semibold text-primary pt-0.5">
                                {new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                    minimumFractionDigits: 0,
                                }).format(Number(watchedSaldo) || 0)}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-3 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => (onCancel ? onCancel() : router.back())}
                        disabled={isPending}
                    >
                        Batal
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialData ? "Simpan Perubahan" : "Tambah Akun Kas"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
