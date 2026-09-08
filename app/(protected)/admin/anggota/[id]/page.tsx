import { AnggotaForm } from "@/components/admin/anggota/AnggotaForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getAnggota, getKTBOptions } from "@/actions/anggota";
import { notFound } from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Fix for Next.js 15: params is a Promise
interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditAnggotaPage({ params }: PageProps) {
    const { id } = await params;
    const { success, data: anggota } = await getAnggota(id);
    const ktbOptions = await getKTBOptions();

    if (!success || !anggota) {
        notFound();
    }

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
                        <BreadcrumbPage>Edit</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <AdminPageHeader
                title="Edit Anggota"
                href="/admin/anggota"
                addLabel="Kembali"
                isBack
            />
            <AnggotaForm initialData={anggota} ktbOptions={ktbOptions} />
        </div>
    );
}
