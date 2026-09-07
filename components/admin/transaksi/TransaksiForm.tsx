"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
    Loader2,
    TrendingUp,
    TrendingDown,
    Wallet,
    Calendar,
    Coins,
    AlertCircle,
    FileText,
} from "lucide-react"

import { cn } from "@/lib/utils"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createTransaksi, updateTransaksi } from "@/actions/transaksi"

const formSchema = z.object({
    idKas: z.string().min(1, "Akun kas wajib dipilih"),
    jenisTransaksi: z.enum(["PEMASUKAN", "PENGELUARAN"], {
        message: "Jenis transaksi wajib dipilih",
    }),
    nominal: z.coerce.number().positive("Nominal harus lebih dari 0"),
    tanggal: z.string().min(1, "Tanggal transaksi wajib diisi"),
    keterangan: z.string().optional().nullable(),
})

type FormValues = z.infer<typeof formSchema>

export interface KasOption {
    value: string
    label: string
    saldoTerkini: number
}

interface TransaksiFormProps {
    initialData?: {
        id: string
        idKas: string
        jenisTransaksi: "PEMASUKAN" | "PENGELUARAN"
        nominal: number
        keterangan: string | null
        createdAt: Date | string
    } | null
    kasOptions: KasOption[]
}

function formatRupiah(amount: number): string {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

export function TransaksiForm({ initialData, kasOptions }: TransaksiFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = React.useTransition()

    const defaultDateStr = React.useMemo(() => {
        if (initialData?.createdAt) {
            return new Date(initialData.createdAt).toISOString().split("T")[0]
        }
        return new Date().toISOString().split("T")[0]
    }, [initialData])

    const form = useForm<FormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            idKas: initialData?.idKas || (kasOptions.length > 0 ? kasOptions[0].value : ""),
            jenisTransaksi: initialData?.jenisTransaksi || "PEMASUKAN",
            nominal: initialData?.nominal ? initialData.nominal : ("" as unknown as number),
            tanggal: defaultDateStr,
            keterangan: initialData?.keterangan || "",
        },
    })

    const watchedIdKas = form.watch("idKas")
    const watchedJenis = form.watch("jenisTransaksi")
    const watchedNominal = form.watch("nominal")

    const selectedKas = kasOptions.find((k) => k.value === watchedIdKas)
    const isExceedingBalance =
        watchedJenis === "PENGELUARAN" &&
        selectedKas &&
        Number(watchedNominal) > selectedKas.saldoTerkini

    const onSubmit = (values: FormValues) => {
        startTransition(async () => {
            try {
                const payload = {
                    ...values,
                    nominal: Number(values.nominal),
                }

                if (initialData) {
                    const res = await updateTransaksi(initialData.id, payload)
                    if (res.success) {
                        toast.success(res.message)
                        router.push("/admin/transaksi")
                        router.refresh()
                    } else {
                        toast.error(res.message)
                    }
                } else {
                    const res = await createTransaksi(payload)
                    if (res.success) {
                        toast.success(res.message)
                        router.push("/admin/transaksi")
                        router.refresh()
                    } else {
                        toast.error(res.message)
                    }
                }
            } catch {
                toast.error("Terjadi kesalahan pada server saat mencatat transaksi")
            }
        })
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 max-w-2xl mx-auto bg-card p-6 rounded-xl border shadow-sm"
            >
                {/* 1. Pilih Akun Kas */}
                <FormField
                    control={form.control}
                    name="idKas"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center justify-between">
                                <span className="flex items-center gap-1.5">
                                    <Wallet className="w-4 h-4 text-muted-foreground" />
                                    <span>Akun Kas Penyimpanan</span> <span className="text-red-500">*</span>
                                </span>
                                {selectedKas && (
                                    <span className="text-xs text-muted-foreground font-normal">
                                        Saldo saat ini:{" "}
                                        <strong className="text-foreground">
                                            {formatRupiah(selectedKas.saldoTerkini)}
                                        </strong>
                                    </span>
                                )}
                            </FormLabel>
                            <Select
                                disabled={isPending}
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih akun kas..." />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {kasOptions.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            <div className="flex items-center justify-between w-full gap-4">
                                                <span>{opt.label}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    ({formatRupiah(opt.saldoTerkini)})
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                Pilih pos kas atau rekening yang menerima atau mengeluarkan dana.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* 2. Jenis Transaksi Toggle Cards */}
                <FormField
                    control={form.control}
                    name="jenisTransaksi"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel>
                                Jenis Transaksi <span className="text-red-500">*</span>
                            </FormLabel>
                            <div className="grid grid-cols-2 gap-4">
                                {/* Pemasukan Card */}
                                <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => !isPending && field.onChange("PEMASUKAN")}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            field.onChange("PEMASUKAN")
                                        }
                                    }}
                                    className={cn(
                                        "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all cursor-pointer text-center gap-2",
                                        field.value === "PEMASUKAN"
                                            ? "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 shadow-sm"
                                            : "border-border hover:border-emerald-300 hover:bg-muted/40 text-muted-foreground"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "p-2.5 rounded-full transition-colors",
                                            field.value === "PEMASUKAN"
                                                ? "bg-emerald-500 text-white"
                                                : "bg-muted text-muted-foreground"
                                        )}
                                    >
                                        <TrendingUp className="w-5 h-5" />
                                    </div>
                                    <span className="font-semibold text-sm">Pemasukan (+)</span>
                                    <span className="text-[11px] opacity-75">
                                        Persembahan, iuran, donasi
                                    </span>
                                </div>

                                {/* Pengeluaran Card */}
                                <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => !isPending && field.onChange("PENGELUARAN")}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            field.onChange("PENGELUARAN")
                                        }
                                    }}
                                    className={cn(
                                        "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all cursor-pointer text-center gap-2",
                                        field.value === "PENGELUARAN"
                                            ? "border-rose-500 bg-rose-50/60 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 shadow-sm"
                                            : "border-border hover:border-rose-300 hover:bg-muted/40 text-muted-foreground"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "p-2.5 rounded-full transition-colors",
                                            field.value === "PENGELUARAN"
                                                ? "bg-rose-500 text-white"
                                                : "bg-muted text-muted-foreground"
                                        )}
                                    >
                                        <TrendingDown className="w-5 h-5" />
                                    </div>
                                    <span className="font-semibold text-sm">Pengeluaran (-)</span>
                                    <span className="text-[11px] opacity-75">
                                        Konsumsi, alat, biaya acara
                                    </span>
                                </div>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* 3. Nominal & Tanggal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nominal */}
                    <FormField
                        control={form.control}
                        name="nominal"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-1.5">
                                    <Coins className="w-4 h-4 text-muted-foreground" />
                                    <span>Nominal Transaksi (Rp)</span> <span className="text-red-500">*</span>
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
                                <div className="text-xs font-semibold text-primary pt-0.5">
                                    {Number(watchedNominal) > 0 ? formatRupiah(Number(watchedNominal)) : "Rp 0"}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Tanggal Transaksi */}
                    <FormField
                        control={form.control}
                        name="tanggal"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    <span>Tanggal Transaksi</span> <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="date"
                                        disabled={isPending}
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormDescription>Waktu transaksi berlangsung.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Warning: Pengeluaran melebihi saldo kas saat ini */}
                {isExceedingBalance && (
                    <div className="flex items-start gap-3 p-3.5 rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-900/50 text-amber-900 dark:text-amber-200 text-xs">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                        <div>
                            <p className="font-semibold">Peringatan: Pengeluaran melebihi saldo kas!</p>
                            <p className="mt-0.5 opacity-90">
                                Nominal pengeluaran ({formatRupiah(Number(watchedNominal))}) melebihi saldo terkini di akun kas terpilih ({formatRupiah(selectedKas?.saldoTerkini || 0)}). Transaksi tetap dapat disimpan jika merupakan kesepakatan talangan/kasbon.
                            </p>
                        </div>
                    </div>
                )}

                {/* 4. Keterangan */}
                <FormField
                    control={form.control}
                    name="keterangan"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-1.5">
                                <FileText className="w-4 h-4 text-muted-foreground" />
                                <span>Keterangan / Deskripsi</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    disabled={isPending}
                                    placeholder="Contoh: Persembahan Ibadah Padang, Pembelian lilin natal..."
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormDescription>
                                Uraian singkat tujuan atau sumber dana transaksi.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-4 justify-end pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isPending}
                        onClick={() => router.push("/admin/transaksi")}
                    >
                        Batal
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialData ? "Simpan Perubahan" : "Catat Transaksi"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
