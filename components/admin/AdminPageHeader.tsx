import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

interface AdminPageHeaderProps {
    title: string;
    onAdd?: () => void;
    href?: string;
    addLabel?: string;
}

export function AdminPageHeader({ title, onAdd, href, addLabel }: AdminPageHeaderProps) {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold tracking-tight self-start">{title}</h1>

            <div className="self-end">
                {href ? (
                    <Link href={href}>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            {addLabel || "Tambah"}
                        </Button>
                    </Link>
                ) : onAdd ? (
                    <Button onClick={onAdd}>
                        <Plus className="w-4 h-4 mr-2" />
                        {addLabel || "Tambah"}
                    </Button>
                ) : null}
            </div>
        </div>
    );
}
