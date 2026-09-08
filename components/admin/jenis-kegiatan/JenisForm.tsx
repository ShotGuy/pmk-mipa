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
import { createJenisKegiatan, updateJenisKegiatan } from "@/actions/jenis-kegiatan"

// Schema needs to match Server Action
const formSchema = z.object({
    nama: z.string().min(1, "Nama jenis kegiatan wajib diisi"),
})

interface JenisFormProps {
    initialData?: { id: string, nama: string } | null
    onSuccess?: () => void
    onCancel?: () => void
}

export function JenisForm({ initialData, onSuccess, onCancel }: JenisFormProps) {
    const router = useRouter()
    const [isPending, setIsPending] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            nama: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsPending(true)
        try {
            let res
            if (initialData) {
                res = await updateJenisKegiatan(initialData.id, values)
            } else {
                res = await createJenisKegiatan(values)
            }

            if (res.success) {
                toast.success(res.message, { description: "Data jenis kegiatan berhasil diperbarui." })
                router.refresh()
                if (onSuccess) {
                    onSuccess()
                } else {
                    router.push("/admin/jenis-kegiatan")
                }
            } else {
                toast.error("Gagal Menyimpan", { description: res.message })
            }
        } catch {
            toast.error("Terjadi Kesalahan", { description: "Gagal memproses permintaan." })
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
                                <FormLabel>Nama Jenis Kegiatan</FormLabel>
                                <FormControl>
                                    <Input placeholder="Contoh: Ibadah Raya, Persekutuan Doa" {...field} disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex gap-2">
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {initialData ? "Simpan Perubahan" : "Buat Jenis Kegiatan"}
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
