"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    createBadanPengurus,
    updateBadanPengurus,
} from "@/actions/badan-pengurus"
import type { BadanPengurus } from "@prisma/client"

export const JABATAN_OPTIONS = [
    { value: "KETUA", label: "Ketua" },
    { value: "SEKRETARIS", label: "Sekretaris" },
    { value: "BENDAHARA", label: "Bendahara" },
    { value: "KOORDINATOR_ACARA", label: "Koordinator Acara" },
    { value: "ANGGOTA_ACARA", label: "Anggota Acara" },
    { value: "KOORDINATOR_KTB", label: "Koordinator KTB" },
    { value: "ANGGOTA_KTB", label: "Anggota KTB" },
    { value: "KOORDINATOR_DOA_DAN_PEMERHATI", label: "Koordinator Doa dan Pemerhati" },
    { value: "ANGGOTA_DOA_DAN_PEMERHATI", label: "Anggota Doa dan Pemerhati" },
] as const;

export const JABATAN_LABELS: Record<string, string> = Object.fromEntries(
    JABATAN_OPTIONS.map(o => [o.value, o.label])
);

const formSchema = z.object({
    idAnggota: z.string().min(1, "Anggota wajib dipilih"),
    jabatan: z.string().min(1, "Jabatan wajib dipilih"),
    masaJabatan: z.string().min(1, "Masa jabatan wajib diisi (contoh: 2024/2025)"),
    status: z.boolean().default(true),
    prodi: z.string().optional().nullable(),
    socialMedia: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

interface AnggotaOption {
    label: string
    value: string
    prodi: string
}

interface BadanPengurusFormProps {
    initialData?: (BadanPengurus & {
        anggota?: {
            id: string
            nama: string
            prodi: string | null
            angkatan: number | null
        }
    }) | null
    anggotaOptions: AnggotaOption[]
}

export function BadanPengurusForm({ initialData, anggotaOptions }: BadanPengurusFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = React.useTransition()
    const [openAnggota, setOpenAnggota] = React.useState(false)

    const form = useForm<FormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            idAnggota: initialData?.idAnggota || "",
            jabatan: initialData?.jabatan || "KETUA",
            masaJabatan: initialData?.masaJabatan || `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
            status: initialData ? initialData.status : true,
            prodi: initialData?.prodi || "",
            socialMedia: initialData?.socialMedia || "",
        }
    })

    const onSubmit = (values: FormValues) => {
        startTransition(async () => {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const payload: any = values;
                if (initialData) {
                    const res = await updateBadanPengurus(initialData.id, payload)
                    if (res.success) {
                        toast.success(res.message)
                        router.push("/admin/badan-pengurus")
                        router.refresh()
                    } else {
                        toast.error(res.message)
                    }
                } else {
                    const res = await createBadanPengurus(payload)
                    if (res.success) {
                        toast.success(res.message)
                        router.push("/admin/badan-pengurus")
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
                    {/* Searchable Anggota Combobox */}
                    <FormField
                        control={form.control}
                        name="idAnggota"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>
                                    Pilih Anggota <span className="text-red-500">*</span>
                                </FormLabel>
                                <Popover open={openAnggota} onOpenChange={setOpenAnggota}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={openAnggota}
                                                className={cn(
                                                    "w-full justify-between font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                                disabled={isPending}
                                            >
                                                {field.value
                                                    ? anggotaOptions.find((opt) => opt.value === field.value)?.label
                                                    : "Cari & pilih anggota..."}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[380px] p-0" align="start">
                                        <Command>
                                            <CommandInput placeholder="Ketik nama anggota..." />
                                            <CommandList>
                                                <CommandEmpty>Anggota tidak ditemukan.</CommandEmpty>
                                                <CommandGroup heading="Daftar Anggota">
                                                    {anggotaOptions.map((opt) => (
                                                        <CommandItem
                                                            key={opt.value}
                                                            value={opt.label}
                                                            onSelect={() => {
                                                                form.setValue("idAnggota", opt.value)
                                                                // Auto fill prodi jika prodi form masih kosong
                                                                if (!form.getValues("prodi") && opt.prodi) {
                                                                    form.setValue("prodi", opt.prodi)
                                                                }
                                                                setOpenAnggota(false)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    opt.value === field.value ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            <div className="flex flex-col">
                                                                <span>{opt.label}</span>
                                                                {opt.prodi && (
                                                                    <span className="text-xs text-muted-foreground">{opt.prodi}</span>
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
                                    Pilih anggota yang akan diangkat sebagai Badan Pengurus.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Jabatan */}
                    <FormField
                        control={form.control}
                        name="jabatan"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Jabatan <span className="text-red-500">*</span>
                                </FormLabel>
                                <Select
                                    disabled={isPending}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih jabatan..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {JABATAN_OPTIONS.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription>Posisi dalam kepengurusan.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Masa Jabatan */}
                    <FormField
                        control={form.control}
                        name="masaJabatan"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Masa Jabatan / Periode <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isPending}
                                        placeholder="Contoh: 2024/2025"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>Tahun periode kepengurusan.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Status Aktif */}
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Status Kepengurusan <span className="text-red-500">*</span>
                                </FormLabel>
                                <Select
                                    disabled={isPending}
                                    onValueChange={(val) => field.onChange(val === "true")}
                                    value={field.value ? "true" : "false"}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="true">Aktif</SelectItem>
                                        <SelectItem value="false">Non-Aktif / Demisioner</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>Status keaktifan pengurus dalam kepengurusan saat ini.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Prodi */}
                    <FormField
                        control={form.control}
                        name="prodi"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Program Studi</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isPending}
                                        placeholder="Contoh: Ilmu Komputer"
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormDescription>Terisi otomatis dari data anggota atau dapat disesuaikan.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Social Media */}
                    <FormField
                        control={form.control}
                        name="socialMedia"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sosial Media</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isPending}
                                        placeholder="Contoh: @instagram atau link profil"
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormDescription>Username Instagram atau URL profil pengurus.</FormDescription>
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
                        onClick={() => router.push("/admin/badan-pengurus")}
                    >
                        Batal
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialData ? "Simpan Perubahan" : "Tambah Badan Pengurus"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
