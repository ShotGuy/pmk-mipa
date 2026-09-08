"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Check, ChevronsUpDown, Loader2, BookOpen, Church, HeartHandshake, SunMedium, Moon } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { createHPDT, updateHPDT } from "@/actions/hpdt"

const formSchema = z.object({
    idPengurus: z.string().min(1, "Badan Pengurus wajib dipilih"),
    tanggal: z.string().min(1, "Tanggal wajib diisi"),
    isSate: z.boolean().default(false),
    isDoa: z.boolean().default(false),
    isAttendedKTB: z.boolean().default(false),
    isGereja: z.boolean().default(false),
    ayatAlkitab: z.string().optional().nullable(),
    judulBuku: z.string().optional().nullable(),
})

type FormValues = z.infer<typeof formSchema>

interface PengurusOption {
    value: string
    label: string
    nama: string
    jabatan: string
    prodi: string
}

interface HpdtFormProps {
    initialData?: {
        id: string
        idPengurus: string
        tanggal: Date
        isSate: boolean
        isDoa: boolean
        isAttendedKTB: boolean
        isGereja: boolean
        ayatAlkitab: string | null
        judulBuku: string | null
        pengurus?: {
            anggota?: {
                nama: string
            }
        }
    } | null
    pengurusOptions: PengurusOption[]
}

export function HpdtForm({ initialData, pengurusOptions }: HpdtFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = React.useTransition()
    const [openPengurus, setOpenPengurus] = React.useState(false)

    // Today in YYYY-MM-DD format for max date constraint
    const todayStr = React.useMemo(() => {
        const now = new Date()
        return now.toISOString().split("T")[0]
    }, [])

    const defaultDateStr = React.useMemo(() => {
        if (initialData?.tanggal) {
            return new Date(initialData.tanggal).toISOString().split("T")[0]
        }
        return new Date().toISOString().split("T")[0]
    }, [initialData])

    const form = useForm<FormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            idPengurus: initialData?.idPengurus || "",
            tanggal: defaultDateStr,
            isSate: initialData ? initialData.isSate : false,
            isDoa: initialData ? initialData.isDoa : false,
            isAttendedKTB: initialData ? initialData.isAttendedKTB : false,
            isGereja: initialData ? initialData.isGereja : false,
            ayatAlkitab: initialData?.ayatAlkitab || "",
            judulBuku: initialData?.judulBuku || "",
        }
    })

    const onSubmit = (values: FormValues) => {
        startTransition(async () => {
            try {
                const payload = {
                    ...values,
                    tanggal: new Date(values.tanggal),
                }

                if (initialData) {
                    const res = await updateHPDT(initialData.id, payload)
                    if (res.success) {
                        toast.success(res.message)
                        router.push("/admin/hpdt")
                        router.refresh()
                    } else {
                        toast.error(res.message)
                    }
                } else {
                    const res = await createHPDT(payload)
                    if (res.success) {
                        toast.success(res.message)
                        router.push("/admin/hpdt")
                        router.refresh()
                    } else {
                        toast.error(res.message)
                    }
                }
            } catch {
                toast.error("Terjadi kesalahan pada server")
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto bg-card p-6 rounded-xl border shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Searchable Pengurus Combobox */}
                    <FormField
                        control={form.control}
                        name="idPengurus"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>
                                    Pilih Pengurus <span className="text-red-500">*</span>
                                </FormLabel>
                                <Popover open={openPengurus} onOpenChange={setOpenPengurus}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={openPengurus}
                                                className={cn(
                                                    "w-full justify-between font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                                disabled={isPending}
                                            >
                                                {field.value
                                                    ? pengurusOptions.find((opt) => opt.value === field.value)?.label
                                                    : "Cari & pilih pengurus..."}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[380px] p-0" align="start">
                                        <Command>
                                            <CommandInput placeholder="Ketik nama pengurus..." />
                                            <CommandList>
                                                <CommandEmpty>Pengurus tidak ditemukan.</CommandEmpty>
                                                <CommandGroup heading="Daftar Badan Pengurus">
                                                    {pengurusOptions.map((opt) => (
                                                        <CommandItem
                                                            key={opt.value}
                                                            value={opt.label}
                                                            onSelect={() => {
                                                                form.setValue("idPengurus", opt.value)
                                                                setOpenPengurus(false)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    opt.value === field.value ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            <div className="flex flex-col">
                                                                <span className="font-medium">{opt.nama}</span>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {opt.jabatan} {opt.prodi ? `• ${opt.prodi}` : ""}
                                                                </span>
                                                            </div>
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormDescription>Pengurus yang mencatatkan HPDT.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Tanggal (No future dates) */}
                    <FormField
                        control={form.control}
                        name="tanggal"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Tanggal HPDT <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="date"
                                        max={todayStr}
                                        disabled={isPending}
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>Bebas tanggal lampau (masa depan dikunci).</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Kegiatan Rohani Checklist Cards */}
                <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3">Aktivitas Rohani Harian</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Saat Teduh */}
                        <FormField
                            control={form.control}
                            name="isSate"
                            render={({ field }) => (
                                <div
                                    onClick={() => !isPending && field.onChange(!field.value)}
                                    className={cn(
                                        "flex items-center gap-3 p-3.5 rounded-lg border cursor-pointer transition-all select-none",
                                        field.value
                                            ? "border-primary bg-primary/5 text-primary"
                                            : "border-border bg-background hover:bg-muted/50 text-muted-foreground"
                                    )}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                        field.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                    )}>
                                        <SunMedium className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-foreground">Saat Teduh</p>
                                        <p className="text-xs text-muted-foreground">Merenungkan Firman Tuhan</p>
                                    </div>
                                    <div className={cn(
                                        "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                                        field.value ? "bg-primary border-primary text-primary-foreground" : "border-input bg-background"
                                    )}>
                                        {field.value && <Check className="w-3.5 h-3.5" />}
                                    </div>
                                </div>
                            )}
                        />

                        {/* Doa Malam */}
                        <FormField
                            control={form.control}
                            name="isDoa"
                            render={({ field }) => (
                                <div
                                    onClick={() => !isPending && field.onChange(!field.value)}
                                    className={cn(
                                        "flex items-center gap-3 p-3.5 rounded-lg border cursor-pointer transition-all select-none",
                                        field.value
                                            ? "border-primary bg-primary/5 text-primary"
                                            : "border-border bg-background hover:bg-muted/50 text-muted-foreground"
                                    )}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                        field.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                    )}>
                                        <Moon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-foreground">Doa Malam</p>
                                        <p className="text-xs text-muted-foreground">Berdoa & bersyukur</p>
                                    </div>
                                    <div className={cn(
                                        "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                                        field.value ? "bg-primary border-primary text-primary-foreground" : "border-input bg-background"
                                    )}>
                                        {field.value && <Check className="w-3.5 h-3.5" />}
                                    </div>
                                </div>
                            )}
                        />

                        {/* KTB (Seminggu Sekali) */}
                        <FormField
                            control={form.control}
                            name="isAttendedKTB"
                            render={({ field }) => (
                                <div
                                    onClick={() => !isPending && field.onChange(!field.value)}
                                    className={cn(
                                        "flex items-center gap-3 p-3.5 rounded-lg border cursor-pointer transition-all select-none",
                                        field.value
                                            ? "border-primary bg-primary/5 text-primary"
                                            : "border-border bg-background hover:bg-muted/50 text-muted-foreground"
                                    )}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                        field.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                    )}>
                                        <HeartHandshake className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-foreground">Kelompok KTB</p>
                                        <p className="text-xs text-muted-foreground">Mengikuti persekutuan KTB</p>
                                    </div>
                                    <div className={cn(
                                        "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                                        field.value ? "bg-primary border-primary text-primary-foreground" : "border-input bg-background"
                                    )}>
                                        {field.value && <Check className="w-3.5 h-3.5" />}
                                    </div>
                                </div>
                            )}
                        />

                        {/* Ibadah Gereja */}
                        <FormField
                            control={form.control}
                            name="isGereja"
                            render={({ field }) => (
                                <div
                                    onClick={() => !isPending && field.onChange(!field.value)}
                                    className={cn(
                                        "flex items-center gap-3 p-3.5 rounded-lg border cursor-pointer transition-all select-none",
                                        field.value
                                            ? "border-primary bg-primary/5 text-primary"
                                            : "border-border bg-background hover:bg-muted/50 text-muted-foreground"
                                    )}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                        field.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                    )}>
                                        <Church className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-foreground">Ibadah Gereja</p>
                                        <p className="text-xs text-muted-foreground">Ibadah minggu di gereja</p>
                                    </div>
                                    <div className={cn(
                                        "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                                        field.value ? "bg-primary border-primary text-primary-foreground" : "border-input bg-background"
                                    )}>
                                        {field.value && <Check className="w-3.5 h-3.5" />}
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                </div>

                {/* Ayat Alkitab & Buku Rohani */}
                <div className="space-y-4 pt-2 border-t">
                    <FormField
                        control={form.control}
                        name="ayatAlkitab"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-primary" />
                                    Ayat Alkitab yang Dibaca
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isPending}
                                        placeholder="Contoh: Mazmur 23:1-6 atau Filipi 4:6-7"
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormDescription>Catat perikop atau ayat alkitab yang dipelajari hari ini.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="judulBuku"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-primary" />
                                    Judul Buku Rohani (Opsional)
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isPending}
                                        placeholder="Contoh: The Purpose Driven Life - Bab 3"
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormDescription>Buku rohani yang dibaca (kosongkan jika tidak ada).</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex gap-4 justify-end pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isPending}
                        onClick={() => router.push("/admin/hpdt")}
                    >
                        Batal
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialData ? "Simpan Perubahan" : "Catat HPDT"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
