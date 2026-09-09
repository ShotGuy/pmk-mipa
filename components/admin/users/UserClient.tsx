"use client"

import { DataTable } from "@/components/admin/DataTable"
import { columns, UserWithRelation } from "@/app/(protected)/admin/users/columns"

interface UserClientProps {
    data: UserWithRelation[]
}

export function UserClient({ data }: UserClientProps) {
    return (
        <DataTable
            columns={columns}
            data={data}
            searchKey="name"
            facetedFilters={[
                {
                    key: "role",
                    title: "Role",
                    options: [
                        { label: "Admin", value: "ADMIN" },
                        { label: "Ketua", value: "KETUA" },
                        { label: "Sekretaris", value: "SEKRETARIS" },
                        { label: "Bendahara", value: "BENDAHARA" },
                        { label: "Koor KTB", value: "KOORKTB" },
                        { label: "Anggota KTB", value: "ANGGOTAKTB" },
                        { label: "Koor Acara", value: "KOORACARA" },
                        { label: "Anggota Acara", value: "ANGGOTAACARA" },
                        { label: "Koor Doa", value: "KOORDOA" },
                        { label: "Anggota Doa", value: "ANGGOTADOA" },
                    ]
                }
            ]}
        />
    )
}
