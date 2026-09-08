"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Check, ChevronsUpDown, Loader2, Calendar, Clock, MapPin, Mic } from "lucide-react"
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
import { createKegiatan, updateKegiatan } from "@/actions/kegiatan"

const formSchema = z.object({
    nama: z.string().min(1, "Nama kegiatan wajib diisi"),
    idJenisKegiatan: z.string().min(1, "Jenis kegiatan wajib dipilih"),
    tanggal: z.string().min(1, "Tanggal kegiatan wajib diisi"),
    waktu: z.string().optional().nullable(),
    lokasi: z.string().optional().nullable(),
    pembicara: z.string().optional().nullable(),
})

type FormValues = z.infer<typeof formSchema>

export interface JenisKegiatanOption {
    value: string
    label: string
}

interface KegiatanFormProps {
    initialData?: {
        id: string
        nama: string
        idJenisKegiatan: string
        tanggal: Date
        waktu: Date | null
        lokasi: string | null
        pembicara: string | null
        jenisKegiatan?: {
            id: string
            nama: string
        }
    } | null
    jenisKegiatanOptions: JenisKegiatanOption[]
}

export function KegiatanForm({ initialData, jenisKegiatanOptions }: KegiatanFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = React.useTransition()
    const [openJenis, setOpenJenis] = React.useState(false)

    const defaultDateStr = React.useMemo(() => {
        if (initialData?.tanggal) {
            return new Date(initialData.tanggal).toISOString().split("T")[0]
        }
        return new Date().toISOString().split("T")[0]
    }, [initialData])

    const defaultTimeStr = React.useMemo(() => {
        if (!initialData?.waktu) return ""
        const d = new Date(initialData.waktu)
        const hours = String(d.getUTCHours()).padStart(2, "0")
        const minutes = String(d.getUTCMinutes()).padStart(2, "0")
        return `${hours}:${minutes}`
    }, [initialData])

    const form = useForm<FormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            nama: initialData?.nama || "",
            idJenisKegiatan: initialData?.idJenisKegiatan || "",
            tanggal: defaultDateStr,
            waktu: defaultTimeStr,
            lokasi: initialData?.lokasi || "",
            pembicara: initialData?.pembicara || "",
        },
    })

    const onSubmit = (values: FormValues) => {
        startTransition(async () => {
            try {
                const payload = {
                    ...values,
                    tanggal: new Date(values.tanggal),
                }

                if (initialData) {
                    const res = await updateKegiatan(initialData.id, payload)
                    if (res.success) {
                        toast.success(res.message)
                        router.push("/admin/kegiatan")
                        router.refresh()
                    } else {
                        toast.error(res.message)
                    }
                } else {
                    const res = await createKegiatan(payload)
                    if (res.success) {
                        toast.success(res.message)
                        router.push("/admin/kegiatan")
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
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 max-w-2xl mx-auto bg-card p-6 rounded-xl border shadow-sm"
            >
                {/* Nama Kegiatan */}
                <FormField
                    control={form.control}
                    name="nama"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Nama Kegiatan <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    disabled={isPending}
                                    placeholder="Contoh: Ibadah Awal Semester, Welcoming Party..."
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>Nama resmi kegiatan atau ibadah PMK MIPA.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Searchable Combobox: Jenis Kegiatan */}
                    <FormField
                        control={form.control}
                        name="idJenisKegiatan"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>
                                    Jenis Kegiatan <span className="text-red-500">*</span>
                                </FormLabel>
                                <Popover open={openJenis} onOpenChange={setOpenJenis}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={openJenis}
                                                className={cn(
                                                    "w-full justify-between font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                                disabled={isPending}
                                            >
                                                {field.value
                                                    ? jenisKegiatanOptions.find((opt) => opt.value === field.value)?.label
                                                    : "Cari jenis kegiatan..."}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[320px] p-0" align="start">
                                        <Command>
                                            <CommandInput placeholder="Ketik jenis kegiatan..." />
                                            <CommandList>
                                                <CommandEmpty>Jenis kegiatan tidak ditemukan.</CommandEmpty>
                                                <CommandGroup heading="Daftar Jenis Kegiatan">
                                                    {jenisKegiatanOptions.map((opt) => (
                                                        <CommandItem
                                                            key={opt.value}
                                                            value={opt.label}
                                                            onSelect={() => {
                                                                form.setValue("idJenisKegiatan", opt.value)
                                                                setOpenJenis(false)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    opt.value === field.value ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            <span>{opt.label}</span>
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormDescription>Kategori program kegiatan.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Tanggal Kegiatan */}
                    <FormField
                        control={form.control}
                        name="tanggal"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    <span>Tanggal Kegiatan</span> <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="date"
                                        disabled={isPending}
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormDescription>Hari pelaksanaan kegiatan.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Waktu Kegiatan */}
                    <FormField
                        control={form.control}
                        name="waktu"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                    <span>Waktu / Jam Mulai</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="time"
                                        disabled={isPending}
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormDescription>Jam mulai kegiatan (opsional).</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Lokasi */}
                    <FormField
                        control={form.control}
                        name="lokasi"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-muted-foreground" />
                                    <span>Lokasi Kegiatan</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isPending}
                                        placeholder="Contoh: Gedung MIPA Lt. 3 / Zoom"
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormDescription>Tempat atau tautan pelaksanaan.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Pembicara */}
                <FormField
                    control={form.control}
                    name="pembicara"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-1.5">
                                <Mic className="w-4 h-4 text-muted-foreground" />
                                <span>Pembicara / Pelayan Firman</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    disabled={isPending}
                                    placeholder="Contoh: Pdt. John Doe, S.Th / Alumni"
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormDescription>Nama pembicara, pelayan firman, atau pemateri (opsional).</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-4 justify-end pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isPending}
                        onClick={() => router.push("/admin/kegiatan")}
                    >
                        Batal
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialData ? "Simpan Perubahan" : "Tambah Kegiatan"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
