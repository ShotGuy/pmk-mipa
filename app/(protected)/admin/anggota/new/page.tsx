import { AnggotaForm } from "@/components/admin/anggota/AnggotaForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getKTBOptions } from "@/actions/anggota";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default async function CreateAnggotaPage() {
    const ktbOptions = await getKTBOptions();

    return (
        <div className="space-y-6">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/admin/anggota">Anggota</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Tambah</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <AdminPageHeader
                title="Tambah Anggota"
                href="/admin/anggota"
                addLabel="Kembali"
                isBack
            />
            <AnggotaForm ktbOptions={ktbOptions} />
        </div>
    );
}
