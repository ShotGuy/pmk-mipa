"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { deleteUser } from "@/actions/user"
import { toast } from "sonner"
import { Role, User } from "@prisma/client"
import { Badge } from "@/components/ui/badge"

// Extended User type to include Anggota relation
export type UserWithRelation = User & {
    anggota: {
        nama: string
        angkatan: number | null
    } | null
}

export const columns: ColumnDef<UserWithRelation>[] = [
    {
        accessorKey: "name",
        header: "Nama Akun",
        cell: ({ row }) => {
            return (
                <div className="flex flex-col">
                    <span className="font-medium">{row.getValue("name")}</span>
                    {row.original.anggota && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            Linked: {row.original.anggota.nama} ({row.original.anggota.angkatan})
                        </span>
                    )}
                </div>
            )
        }
    },
    {
        accessorKey: "username",
        header: "Username",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
            const role = row.getValue("role") as Role
            let variant: "default" | "secondary" | "destructive" | "outline" = "outline"

            if (role === "ADMIN") variant = "destructive"
            else if (role === "KETUA" || role === "BENDAHARA") variant = "default"
            else variant = "secondary"

            return <Badge variant={variant}>{role}</Badge>
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const user = row.original

            const handleDelete = async () => {
                if (confirm("Apakah Anda yakin ingin menghapus user ini?")) {
                    const res = await deleteUser(user.id)
                    if (res.success) {
                        toast.success(res.message)
                    } else {
                        toast.error(res.message)
                    }
                }
            }

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/users/${user.id}`} className="flex items-center cursor-pointer">
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleDelete} className="text-red-600 cursor-pointer">
                            <Trash className="mr-2 h-4 w-4" /> Hapus
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
