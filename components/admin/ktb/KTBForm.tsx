"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm, Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown, Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { StatusKTB } from "@prisma/client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createKTB, updateKTB } from "@/actions/ktb"

const formSchema = z.object({
    nama: z.string().min(1, "Nama KTB wajib diisi"),
    angkatan: z.coerce.number().int().min(2000, "Angkatan tidak valid"),
    terbentukDimana: z.string().optional().nullable(),
    idPemimpin: z.string().min(1, "Pilih pemimpin KTB"),
    idPengurus: z.string().min(1, "Pilih pengurus pendamping"),
    status: z.nativeEnum(StatusKTB),
})

type KTBFormValues = z.infer<typeof formSchema>

interface OptionItem {
    value: string
    label: string
}

interface KTBFormProps {
    initialData?: {
        id: string
        nama: string
        angkatan: number
        terbentukDimana?: string | null
        idPemimpin: string
        idPengurus: string
        status: StatusKTB
    } | null
    pemimpinOptions: OptionItem[]
    pengurusOptions: OptionItem[]
}

export function KTBForm({ initialData, pemimpinOptions, pengurusOptions }: KTBFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = React.useTransition()

    const [openPemimpin, setOpenPemimpin] = React.useState(false)
    const [openPengurus, setOpenPengurus] = React.useState(false)

    const isEdit = !!initialData

    const form = useForm<KTBFormValues>({
        resolver: zodResolver(formSchema) as Resolver<KTBFormValues>,
        defaultValues: {
            nama: initialData?.nama || "",
            angkatan: initialData?.angkatan || new Date().getFullYear(),
            terbentukDimana: initialData?.terbentukDimana || "",
            idPemimpin: initialData?.idPemimpin || "",
            idPengurus: initialData?.idPengurus || "",
            status: initialData?.status || StatusKTB.AKTIF,
        },
    })

    const onSubmit = (values: KTBFormValues) => {
        startTransition(async () => {
            try {
                if (isEdit && initialData) {
                    const res = await updateKTB(initialData.id, values)
                    if (res.success) {
                        toast.success(res.message)
                        router.push("/admin/ktb")
                        router.refresh()
                    } else {
                        toast.error(res.message)
                    }
                } else {
                    const res = await createKTB(values)
                    if (res.success) {
                        toast.success(res.message)
                        if (res.id) {
                            router.push(`/admin/ktb/${res.id}`)
                        } else {
                            router.push("/admin/ktb")
                        }
                        router.refresh()
                    } else {
                        toast.error(res.message)
                    }
                }
            } catch {
                toast.error("Terjadi kesalahan pada sistem")
            }
        })
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Card className="border shadow-xs bg-card/60 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex items-center gap-2 text-primary">
                        <Sparkles className="w-5 h-5" />
                        <span className="text-xs font-semibold uppercase tracking-wider">
                            {isEdit ? "Perbarui KTB" : "Data Master KTB"}
                        </span>
                    </div>
                    <CardTitle className="text-xl sm:text-2xl">
                        {isEdit ? "Edit Kelompok Tumbuh Bersama" : "Tambah Kelompok Tumbuh Bersama"}
                    </CardTitle>
                    <CardDescription>
                        {isEdit
                            ? "Perbarui informasi kelompok KTB, pemimpin, pendamping, maupun status kelompok."
                            : "Daftarkan kelompok KTB baru untuk menaungi proses pemuridan dan pertumbuhan rohani anggota."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Nama KTB */}
                            <FormField
                                control={form.control}
                                name="nama"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nama Kelompok KTB *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Contoh: KTB Paulus, KTB Filipi 1, KTB Agape"
                                                {...field}
                                                disabled={isPending}
                                                className="bg-card"
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Nama pengenal kelompok KTB agar mudah diidentifikasi.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Tahun Angkatan */}
                                <FormField
                                    control={form.control}
                                    name="angkatan"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tahun Angkatan *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="2024"
                                                    {...field}
                                                    disabled={isPending}
                                                    className="bg-card"
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Angkatan penerimaan / pembentukan KTB.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Tempat Terbentuk */}
                                <FormField
                                    control={form.control}
                                    name="terbentukDimana"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tempat / Momen Terbentuk</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Contoh: Retreat Maba, Kampus, Persekutuan"
                                                    {...field}
                                                    value={field.value || ""}
                                                    disabled={isPending}
                                                    className="bg-card"
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Momen saat kelompok KTB ini pertama dibentuk.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Pemimpin KTB (PKTB) - Searchable Combobox */}
                            <FormField
                                control={form.control}
                                name="idPemimpin"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Pemimpin KTB (PKTB) *</FormLabel>
                                        <Popover open={openPemimpin} onOpenChange={setOpenPemimpin}>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={openPemimpin}
                                                        className={cn(
                                                            "w-full justify-between bg-card text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                        disabled={isPending}
                                                    >
                                                        {field.value
                                                            ? pemimpinOptions.find((p) => p.value === field.value)?.label
                                                            : "Pilih Anggota sebagai Pemimpin KTB..."}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                                                <Command>
                                                    <CommandInput placeholder="Cari nama anggota pemimpin..." />
                                                    <CommandList>
                                                        <CommandEmpty>Anggota tidak ditemukan.</CommandEmpty>
                                                        <CommandGroup>
                                                            {pemimpinOptions.map((opt) => (
                                                                <CommandItem
                                                                    key={opt.value}
                                                                    value={opt.label}
                                                                    onSelect={() => {
                                                                        form.setValue("idPemimpin", opt.value, { shouldValidate: true })
                                                                        setOpenPemimpin(false)
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            opt.value === field.value ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                    {opt.label}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormDescription>
                                            Anggota senior yang dipercayakan memimpin kelompok KTB ini.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Badan Pengurus (Pendamping Monitoring) - Searchable Combobox */}
                            <FormField
                                control={form.control}
                                name="idPengurus"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Badan Pengurus Pendamping *</FormLabel>
                                        <Popover open={openPengurus} onOpenChange={setOpenPengurus}>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={openPengurus}
                                                        className={cn(
                                                            "w-full justify-between bg-card text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                        disabled={isPending}
                                                    >
                                                        {field.value
                                                            ? pengurusOptions.find((p) => p.value === field.value)?.label
                                                            : "Pilih Badan Pengurus pendamping..."}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                                                <Command>
                                                    <CommandInput placeholder="Cari nama pengurus atau jabatan..." />
                                                    <CommandList>
                                                        <CommandEmpty>Badan Pengurus tidak ditemukan.</CommandEmpty>
                                                        <CommandGroup>
                                                            {pengurusOptions.map((opt) => (
                                                                <CommandItem
                                                                    key={opt.value}
                                                                    value={opt.label}
                                                                    onSelect={() => {
                                                                        form.setValue("idPengurus", opt.value, { shouldValidate: true })
                                                                        setOpenPengurus(false)
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            opt.value === field.value ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                    {opt.label}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormDescription>
                                            Pengurus (misal: Bidang KTB) yang memantau & memonitor perkembangan kelompok.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Status KTB */}
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel>Status Kelompok KTB *</FormLabel>
                                        <FormControl>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div
                                                    className={cn(
                                                        "flex items-center space-x-3 p-3.5 rounded-xl border cursor-pointer transition-all",
                                                        field.value === StatusKTB.AKTIF
                                                            ? "border-emerald-500/80 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-950 dark:text-emerald-100 ring-1 ring-emerald-500/30 shadow-xs"
                                                            : "border-border hover:bg-accent/50"
                                                    )}
                                                    onClick={() => field.onChange(StatusKTB.AKTIF)}
                                                >
                                                    <div
                                                        className={cn(
                                                            "w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors",
                                                            field.value === StatusKTB.AKTIF
                                                                ? "border-emerald-600 bg-emerald-600 text-white"
                                                                : "border-muted-foreground/40"
                                                        )}
                                                    >
                                                        {field.value === StatusKTB.AKTIF && (
                                                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-sm flex items-center gap-1.5">
                                                            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                                                            AKTIF
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            Kelompok sedang berjalan aktif bersama anggota.
                                                        </span>
                                                    </div>
                                                </div>

                                                <div
                                                    className={cn(
                                                        "flex items-center space-x-3 p-3.5 rounded-xl border cursor-pointer transition-all",
                                                        field.value === StatusKTB.MERGER
                                                            ? "border-amber-500/80 bg-amber-50/50 dark:bg-amber-950/20 text-amber-950 dark:text-amber-100 ring-1 ring-amber-500/30 shadow-xs"
                                                            : "border-border hover:bg-accent/50"
                                                    )}
                                                    onClick={() => field.onChange(StatusKTB.MERGER)}
                                                >
                                                    <div
                                                        className={cn(
                                                            "w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors",
                                                            field.value === StatusKTB.MERGER
                                                                ? "border-amber-600 bg-amber-600 text-white"
                                                                : "border-muted-foreground/40"
                                                        )}
                                                    >
                                                        {field.value === StatusKTB.MERGER && (
                                                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-sm flex items-center gap-1.5">
                                                            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                                                            MERGER
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            Kelompok telah dilebur / dipindahkan ke kelompok lain.
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Buttons */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isPending}
                                    onClick={() => router.back()}
                                >
                                    Batal
                                </Button>
                                <Button type="submit" disabled={isPending} className="min-w-[140px]">
                                    {isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Menyimpan...
                                        </>
                                    ) : isEdit ? (
                                        "Perbarui KTB"
                                    ) : (
                                        "Simpan & Lanjutkan"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
