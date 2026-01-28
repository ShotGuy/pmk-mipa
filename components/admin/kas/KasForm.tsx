"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { createKas, updateKas } from "@/actions/kas"

// Explicit Schema Definition
const formSchema = z.object({
    nama: z.string().min(1, "Nama kas wajib diisi"),
    saldo: z.number().min(0, "Saldo tidak boleh negatif"),
})

type KasFormValues = z.infer<typeof formSchema>

interface KasFormProps {
    initialData?: { id: string, nama: string, saldo: number } | null
    onSuccess?: () => void
    onCancel?: () => void
}

export function KasForm({ initialData, onSuccess, onCancel }: KasFormProps) {
    const router = useRouter()
    const [isPending, setIsPending] = useState(false)

    // Ensure default is number
    const defaultSaldo = initialData?.saldo ? Number(initialData.saldo) : 0

    const form = useForm<KasFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nama: initialData?.nama || "",
            saldo: defaultSaldo,
        },
    })

    // Watch values for live preview
    const watchedSaldo = form.watch("saldo")

    async function onSubmit(values: KasFormValues) {
        setIsPending(true)
        try {
            let res
            if (initialData) {
                res = await updateKas(initialData.id, values)
            } else {
                res = await createKas(values)
            }

            if (res.success) {
                toast.success(res.message, { description: "Data kas berhasil disimpan." })
                router.refresh()
                if (onSuccess) onSuccess()
            } else {
                toast.error("Gagal Menyimpan", { description: res.message })
            }
        } catch {
            toast.error("Terjadi Kesalahan", { description: "Sistem mengalami gangguan." })
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="max-w-md">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="nama"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nama Kas</FormLabel>
                                <FormControl>
                                    <Input placeholder="Contoh: Kas Utama, Bank BNI" {...field} disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="saldo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Saldo Awal (Rp)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        disabled={isPending}
                                        {...field}
                                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                    />
                                </FormControl>
                                {/* Live Preview Helper */}
                                <p className="text-sm text-muted-foreground mt-1">
                                    {watchedSaldo ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(Number(watchedSaldo)) : "Rp 0"}
                                </p>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex gap-2">
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {initialData ? "Simpan Perubahan" : "Buat Kas"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onCancel ? onCancel() : router.back()}
                            disabled={isPending}
                        >
                            Batal
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
