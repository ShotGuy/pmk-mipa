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
import { createUser, updateUser } from "@/actions/user"
import { Role, User } from "@prisma/client"

// Schema definition matching server action expectation
const formSchema = z.object({
    name: z.string().min(1, "Nama wajib diisi"),
    username: z.string().min(1, "Username wajib diisi"),
    email: z.string().email("Email tidak valid"),
    password: z.string().optional(),
    role: z.nativeEnum(Role),
    idAnggota: z.string().optional().nullable(),
})

interface UserFormProps {
    initialData?: User | null
    eligibleAnggotaOptions: { label: string; value: string; description?: string }[]
}

export function UserForm({ initialData, eligibleAnggotaOptions }: UserFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = React.useTransition()
    const [openAnggota, setOpenAnggota] = React.useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            name: initialData?.name || "",
            username: initialData?.username || "",
            email: initialData?.email || "",
            password: "", // Always empty for security
            role: initialData?.role || "ANGGOTAKTB",
            idAnggota: initialData?.idAnggota || "",
        },
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        // Client-side validation for Create Mode
        if (!initialData && (!values.password || values.password.length < 6)) {
            form.setError("password", { message: "Password wajib diisi untuk user baru (min 6 karakter)" })
            return
        }

        startTransition(() => {
            const action = initialData
                ? updateUser(initialData.id, values)
                : createUser(values)

            action.then((data) => {
                if (data.success) {
                    toast.success(data.message)
                    router.push("/admin/users")
                    router.refresh()
                } else {
                    toast.error(data.message)
                }
            }).catch(() => {
                toast.error("Terjadi Kesalahan", { description: "Gagal menyimpan data user." })
            })
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto bg-card text-card-foreground p-6 rounded-xl border shadow-sm">

                {/* Nama & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nama Akun <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <Input disabled={isPending} placeholder="Budi Santoso" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <Input disabled={isPending} placeholder="budi@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Username */}
                <div className="grid grid-cols-1">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <Input disabled={isPending} placeholder="budi_santoso" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Password & Role */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password {initialData ? "(Opsional)" : <span className="text-red-500">*</span>}</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        disabled={isPending}
                                        placeholder={initialData ? "Biarkan kosong jika tidak diganti" : "******"}
                                        {...field}
                                    />
                                </FormControl>
                                {initialData && <FormDescription className="text-xs">Isi hanya jika ingin mengganti password.</FormDescription>}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Role (Hak Akses) <span className="text-red-500">*</span></FormLabel>
                                <Select disabled={isPending} onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Role" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="ADMIN">Super Admin</SelectItem>
                                        <SelectItem value="KETUA">Ketua (BP)</SelectItem>
                                        <SelectItem value="SEKRETARIS">Sekretaris (BP)</SelectItem>
                                        <SelectItem value="BENDAHARA">Bendahara (BP)</SelectItem>
                                        <SelectItem value="KOORKTB">Koord. KTB</SelectItem>
                                        <SelectItem value="ANGGOTAKTB">Anggota KTB</SelectItem>
                                        <SelectItem value="KOORACARA">Koord. Acara</SelectItem>
                                        <SelectItem value="ANGGOTAACARA">Anggota Acara</SelectItem>
                                        <SelectItem value="KOORDOA">Koord. Doa</SelectItem>
                                        <SelectItem value="ANGGOTADOA">Anggota Doa</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Link Anggota (Combobox) */}
                <FormField
                    control={form.control}
                    name="idAnggota"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Tautkan Data Anggota (Badan Pengurus) <span className="text-muted-foreground font-normal">(Opsional)</span></FormLabel>
                            <Popover open={openAnggota} onOpenChange={setOpenAnggota}>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openAnggota}
                                            className={cn(
                                                "w-full justify-between h-10 font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                            disabled={isPending}
                                        >
                                            {field.value
                                                ? eligibleAnggotaOptions.find((opt) => opt.value === field.value)?.label
                                                : "Cari Anggota (BP Aktif)..."}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[400px] p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder="Cari nama anggota..." />
                                        <CommandList>
                                            <CommandEmpty>Tidak ditemukan data BP Aktif.</CommandEmpty>
                                            <CommandGroup>
                                                {eligibleAnggotaOptions.map((opt) => (
                                                    <CommandItem
                                                        value={opt.label}
                                                        key={opt.value}
                                                        onSelect={() => {
                                                            form.setValue("idAnggota", opt.value)
                                                            setOpenAnggota(false)
                                                            // Optional: Auto fill Name if empty
                                                            if (!form.getValues("name")) {
                                                                form.setValue("name", opt.label.split(" - ")[0])
                                                            }
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                opt.value === field.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                        <div className="flex flex-col">
                                                            <span>{opt.label}</span>
                                                            {opt.description && <span className="text-xs text-muted-foreground">{opt.description}</span>}
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <FormDescription>
                                Hanya menampilkan Anggota yang terdaftar sebagai Badan Pengurus Aktif.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-4 justify-end pt-4">
                    <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>
                        Batal
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialData ? "Simpan Perubahan" : "Buat User"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
