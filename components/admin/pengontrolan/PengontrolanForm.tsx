"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"
import {
    Calendar as CalendarIcon,
    Check,
    ChevronsUpDown,
    Loader2,
    BookOpenCheck,
    AlertCircle,
    CheckCircle2,
    Clock,
    GitMerge,
} from "lucide-react"
import { toast } from "sonner"
import { StatusPengontrolan } from "@prisma/client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createPengontrolan, updatePengontrolan } from "@/actions/pengontrolan"

const formSchema = z.object({
    idKTB: z.string().min(1, "Pilih kelompok KTB yang dikontrol"),
    tanggal: z.date({ message: "Tanggal pengontrolan wajib diisi" }),
    bahan: z.string().optional().nullable(),
    status: z.nativeEnum(StatusPengontrolan),
    keterangan: z.string().optional().nullable(),
})

type FormValues = z.infer<typeof formSchema>

interface KTBOption {
    value: string
    label: string
    subtitle?: string
    status?: string
}

interface PengontrolanFormProps {
    initialData?: {
        id: string
        idKTB: string
        tanggal: Date
        bahan: string | null
        status: StatusPengontrolan
        keterangan: string | null
    } | null
    ktbOptions: KTBOption[]
    defaultKTBId?: string
}

export function PengontrolanForm({ initialData, ktbOptions, defaultKTBId }: PengontrolanFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = React.useTransition()

    const [openKTB, setOpenKTB] = React.useState(false)
    const [openCalendar, setOpenCalendar] = React.useState(false)

    const isEdit = !!initialData

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            idKTB: initialData?.idKTB || defaultKTBId || "",
            tanggal: initialData?.tanggal ? new Date(initialData.tanggal) : new Date(),
            bahan: initialData?.bahan || "",
            status: initialData?.status || StatusPengontrolan.AKTIF,
            keterangan: initialData?.keterangan || "",
        },
    })

    const onSubmit = (values: FormValues) => {
        startTransition(async () => {
            try {
                if (isEdit && initialData) {
                    const res = await updatePengontrolan(initialData.id, values)
                    if (res.success) {
                        toast.success(res.message)
                        router.push("/admin/pengontrolan")
                        router.refresh()
                    } else {
                        toast.error(res.message)
                    }
                } else {
                    const res = await createPengontrolan(values)
                    if (res.success) {
                        toast.success(res.message)
                        if (defaultKTBId) {
                            router.push(`/admin/ktb/${defaultKTBId}`)
                        } else {
                            router.push("/admin/pengontrolan")
                        }
                        router.refresh()
                    } else {
                        toast.error(res.message)
                    }
                }
            } catch {
                toast.error("Terjadi kesalahan pada sistem saat menyimpan data")
            }
        })
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Card className="border shadow-xs bg-card/60 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex items-center gap-2 text-primary">
                        <BookOpenCheck className="w-5 h-5" />
                        <span className="text-xs font-semibold uppercase tracking-wider">
                            {isEdit ? "Perbarui Pengontrolan" : "Form Jurnal Pengontrolan"}
                        </span>
                    </div>
                    <CardTitle className="text-xl sm:text-2xl">
                        {isEdit ? "Edit Catatan Pengontrolan KTB" : "Catat Pengontrolan KTB"}
                    </CardTitle>
                    <CardDescription>
                        {isEdit
                            ? "Perbarui hasil monitoring mingguan kelompok KTB, materi yang dipelajari, serta evaluasi perkembangan anggota."
                            : "Simpan laporan monitoring mingguan oleh Badan Pengurus pendamping untuk memantau kesehatan dan dinamika kelompok KTB."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Pilihan Kelompok KTB */}
                            <FormField
                                control={form.control}
                                name="idKTB"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Kelompok KTB yang Dikontrol *</FormLabel>
                                        <Popover open={openKTB} onOpenChange={setOpenKTB}>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={openKTB}
                                                        className={cn(
                                                            "w-full justify-between bg-card text-left font-normal h-11",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                        disabled={isPending}
                                                    >
                                                        <span className="truncate">
                                                            {field.value
                                                                ? ktbOptions.find((k) => k.value === field.value)?.label
                                                                : "Pilih kelompok KTB..."}
                                                        </span>
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                                                <Command>
                                                    <CommandInput placeholder="Cari nama KTB, pemimpin, atau angkatan..." />
                                                    <CommandList>
                                                        <CommandEmpty>Kelompok KTB tidak ditemukan.</CommandEmpty>
                                                        <CommandGroup>
                                                            {ktbOptions.map((k) => (
                                                                <CommandItem
                                                                    key={k.value}
                                                                    value={`${k.label} ${k.subtitle || ""}`}
                                                                    onSelect={() => {
                                                                        form.setValue("idKTB", k.value, { shouldValidate: true })
                                                                        setOpenKTB(false)
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4 shrink-0",
                                                                            k.value === field.value ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                    <div className="flex flex-col">
                                                                        <span className="font-medium text-sm text-foreground">
                                                                            {k.label}
                                                                        </span>
                                                                        {k.subtitle && (
                                                                            <span className="text-[11px] text-muted-foreground">
                                                                                {k.subtitle}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormDescription>
                                            Kelompok KTB yang dimonitor pada sesi pengontrolan ini.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Tanggal Pengontrolan */}
                            <FormField
                                control={form.control}
                                name="tanggal"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Tanggal Pengontrolan *</FormLabel>
                                        <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal bg-card h-10",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                        disabled={isPending}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                                                        {field.value ? (
                                                            format(field.value, "EEEE, dd MMMM yyyy", { locale: localeId })
                                                        ) : (
                                                            <span>Pilih tanggal</span>
                                                        )}
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={(date) => {
                                                        if (date) {
                                                            field.onChange(date)
                                                            setOpenCalendar(false)
                                                        }
                                                    }}
                                                    disabled={(date) => date > new Date()}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormDescription>
                                            Waktu pelaksanaan monitoring (maksimal hari ini).
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Status Pengontrolan */}
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel>Status Kondisi KTB *</FormLabel>
                                        <FormControl>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {/* AKTIF */}
                                                <div
                                                    className={cn(
                                                        "flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-all",
                                                        field.value === StatusPengontrolan.AKTIF
                                                            ? "border-emerald-500/80 bg-emerald-50/50 dark:bg-emerald-950/20 ring-1 ring-emerald-500/30 shadow-xs"
                                                            : "border-border hover:bg-accent/50"
                                                    )}
                                                    onClick={() => field.onChange(StatusPengontrolan.AKTIF)}
                                                >
                                                    <div
                                                        className={cn(
                                                            "w-4 h-4 rounded-full border flex items-center justify-center shrink-0",
                                                            field.value === StatusPengontrolan.AKTIF
                                                                ? "border-emerald-600 bg-emerald-600 text-white"
                                                                : "border-muted-foreground/40"
                                                        )}
                                                    >
                                                        {field.value === StatusPengontrolan.AKTIF && (
                                                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-xs flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                            AKTIF
                                                        </span>
                                                        <span className="text-[11px] text-muted-foreground">
                                                            Rutin berkumpul & bertumbuh sehat.
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* MACET */}
                                                <div
                                                    className={cn(
                                                        "flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-all",
                                                        field.value === StatusPengontrolan.MACET
                                                            ? "border-amber-500/80 bg-amber-50/50 dark:bg-amber-950/20 ring-1 ring-amber-500/30 shadow-xs"
                                                            : "border-border hover:bg-accent/50"
                                                    )}
                                                    onClick={() => field.onChange(StatusPengontrolan.MACET)}
                                                >
                                                    <div
                                                        className={cn(
                                                            "w-4 h-4 rounded-full border flex items-center justify-center shrink-0",
                                                            field.value === StatusPengontrolan.MACET
                                                                ? "border-amber-600 bg-amber-600 text-white"
                                                                : "border-muted-foreground/40"
                                                        )}
                                                    >
                                                        {field.value === StatusPengontrolan.MACET && (
                                                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-xs flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
                                                            <AlertCircle className="w-3.5 h-3.5" />
                                                            MACET
                                                        </span>
                                                        <span className="text-[11px] text-muted-foreground">
                                                            Kendala jadwal, kehadiran, atau komitmen.
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* VAKUM */}
                                                <div
                                                    className={cn(
                                                        "flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-all",
                                                        field.value === StatusPengontrolan.VAKUM
                                                            ? "border-rose-500/80 bg-rose-50/50 dark:bg-rose-950/20 ring-1 ring-rose-500/30 shadow-xs"
                                                            : "border-border hover:bg-accent/50"
                                                    )}
                                                    onClick={() => field.onChange(StatusPengontrolan.VAKUM)}
                                                >
                                                    <div
                                                        className={cn(
                                                            "w-4 h-4 rounded-full border flex items-center justify-center shrink-0",
                                                            field.value === StatusPengontrolan.VAKUM
                                                                ? "border-rose-600 bg-rose-600 text-white"
                                                                : "border-muted-foreground/40"
                                                        )}
                                                    >
                                                        {field.value === StatusPengontrolan.VAKUM && (
                                                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-xs flex items-center gap-1.5 text-rose-700 dark:text-rose-300">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            VAKUM
                                                        </span>
                                                        <span className="text-[11px] text-muted-foreground">
                                                            Berhenti sementara dalam jangka waktu tertentu.
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* MERGER */}
                                                <div
                                                    className={cn(
                                                        "flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-all",
                                                        field.value === StatusPengontrolan.MERGER
                                                            ? "border-purple-500/80 bg-purple-50/50 dark:bg-purple-950/20 ring-1 ring-purple-500/30 shadow-xs"
                                                            : "border-border hover:bg-accent/50"
                                                    )}
                                                    onClick={() => field.onChange(StatusPengontrolan.MERGER)}
                                                >
                                                    <div
                                                        className={cn(
                                                            "w-4 h-4 rounded-full border flex items-center justify-center shrink-0",
                                                            field.value === StatusPengontrolan.MERGER
                                                                ? "border-purple-600 bg-purple-600 text-white"
                                                                : "border-muted-foreground/40"
                                                        )}
                                                    >
                                                        {field.value === StatusPengontrolan.MERGER && (
                                                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-xs flex items-center gap-1.5 text-purple-700 dark:text-purple-300">
                                                            <GitMerge className="w-3.5 h-3.5" />
                                                            MERGER
                                                        </span>
                                                        <span className="text-[11px] text-muted-foreground">
                                                            Dilebur/digabungkan dengan kelompok lain.
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Bahan Renungan / Materi */}
                            <FormField
                                control={form.control}
                                name="bahan"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bahan / Materi Renungan yang Dipelajari</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Contoh: Kitab Kejadian 1-3, Buku Dasar Kekristenan Bab 2, dll."
                                                {...field}
                                                value={field.value || ""}
                                                disabled={isPending}
                                                className="bg-card"
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Topik firman Tuhan atau materi pemuridan yang dibahas minggu ini.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Keterangan / Evaluasi & Pokok Doa */}
                            <FormField
                                control={form.control}
                                name="keterangan"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Keterangan & Catatan Evaluasi Monitoring</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Catat dinamika kelompok, kendala yang dihadapi, pokok doa yang disampaikan pemimpin, atau saran pengurus..."
                                                rows={4}
                                                {...field}
                                                value={field.value || ""}
                                                disabled={isPending}
                                                className="bg-card resize-none"
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Catatan kualitatif bagi Badan Pengurus dan pengurus berikutnya.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isPending}
                                    onClick={() => router.back()}
                                >
                                    Batal
                                </Button>
                                <Button type="submit" disabled={isPending} className="min-w-[150px]">
                                    {isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Menyimpan...
                                        </>
                                    ) : isEdit ? (
                                        "Perbarui Catatan"
                                    ) : (
                                        "Simpan Pengontrolan"
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
