"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { id as idLocale } from "date-fns/locale"
import { CalendarIcon, Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
import { createAnggota, updateAnggota } from "@/actions/anggota"
import { Anggota } from "@prisma/client"

const formSchema = z.object({
    nama: z.string().min(1, "Nama wajib diisi"),
    jenisKelamin: z.string().min(1, "Pilih jenis kelamin"),
    tanggalLahir: z.date().optional().nullable(),
    noHp: z.string().optional().nullable(),
    prodi: z.string().optional().nullable(),
    angkatan: z.preprocess(
        (val) => (val === "" || val === undefined || val === null ? null : Number(val)),
        z.number().nullable().optional()
    ),
    idKTB: z.string().optional().nullable()
})

interface AnggotaFormProps {
    initialData?: (Anggota & { idKTB?: string | null }) | null
    ktbOptions: { label: string; value: string }[]
}

export function AnggotaForm({ initialData, ktbOptions }: AnggotaFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = React.useTransition()
    const [openKTB, setOpenKTB] = React.useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            nama: initialData?.nama || "",
            jenisKelamin: initialData?.jenisKelamin || "",
            tanggalLahir: initialData?.tanggalLahir ? new Date(initialData.tanggalLahir) : undefined,
            noHp: initialData?.noHp || "",
            prodi: initialData?.prodi || "",
            angkatan: initialData?.angkatan || undefined,
            idKTB: initialData?.idKTB || "",
        },
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        startTransition(() => {
            const action = initialData
                ? updateAnggota(initialData.id, values)
                : createAnggota(values)

            action.then((data) => {
                if (data.success) {
                    toast.success(data.message)
                    router.push("/admin/anggota")
                    router.refresh()
                } else {
                    toast.error(data.message)
                }
            }).catch(() => {
                toast.error("Terjadi Kesalahan", { description: "Gagal menyimpan data." })
            })
        })
    }

    return (

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto bg-card text-card-foreground p-6 rounded-xl border shadow-sm">


                <FormField
                    control={form.control}
                    name="nama"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nama Lengkap <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                                <Input disabled={isPending} placeholder="Masukan nama lengkap" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="jenisKelamin"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Jenis Kelamin <span className="text-red-500">*</span></FormLabel>
                                <Select disabled={isPending} onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Jenis Kelamin" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="L">Laki-laki</SelectItem>
                                        <SelectItem value="P">Perempuan</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="tanggalLahir"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Tanggal Lahir</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal h-10",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                                disabled={isPending}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP", { locale: idLocale })
                                                ) : (
                                                    <span>Pilih tanggal</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value || undefined}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                            captionLayout="dropdown-buttons"
                                            fromYear={1990}
                                            toYear={2030}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="noHp"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>No HP</FormLabel>
                                <FormControl>
                                    <Input disabled={isPending} placeholder="08xxxxxxxxxx" {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="prodi"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Program Studi</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending} placeholder="Informatika" {...field} value={field.value || ""} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="angkatan"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Angkatan</FormLabel>
                                    <FormControl>
                                        <Input type="number" disabled={isPending} placeholder="2023" {...field} value={field.value ?? ""} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="idKTB"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Kelompok Tumbuh Bersama (KTB)</FormLabel>
                                <Popover open={openKTB} onOpenChange={setOpenKTB}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={openKTB}
                                                className={cn(
                                                    "w-full justify-between h-10 font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                                disabled={isPending}
                                            >
                                                {field.value
                                                    ? ktbOptions.find((ktb) => ktb.value === field.value)?.label
                                                    : "Pilih KTB..."}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[400px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Cari nama pemimpin..." />
                                            <CommandList>
                                                <CommandEmpty>Tidak ditemukan KTB.</CommandEmpty>
                                                <CommandGroup>
                                                    {ktbOptions.map((ktb) => (
                                                        <CommandItem
                                                            value={ktb.label} // Search by label (Name)
                                                            key={ktb.value}
                                                            onSelect={() => {
                                                                form.setValue("idKTB", ktb.value)
                                                                setOpenKTB(false)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    ktb.value === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            {ktb.label}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                </div>

                <div className="flex gap-4 justify-end pt-4">
                    <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>
                        Batal
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialData ? "Simpan Perubahan" : "Buat Anggota"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
