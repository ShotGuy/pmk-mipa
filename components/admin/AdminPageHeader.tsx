import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface BreadcrumbItemType {
    label: string
    href?: string
}

interface AdminPageHeaderProps {
    title: string;
    description?: string;
    breadcrumbs?: BreadcrumbItemType[];
    onAdd?: () => void;
    href?: string;
    addLabel?: string;
    isBack?: boolean;
    children?: React.ReactNode;
}

export function AdminPageHeader({ title, description, breadcrumbs, onAdd, href, addLabel, isBack, children }: AdminPageHeaderProps) {
    return (
        <div className="flex flex-col gap-4">
            {breadcrumbs && breadcrumbs.length > 0 && (
                <Breadcrumb>
                    <BreadcrumbList>
                        {breadcrumbs.map((item, index) => {
                            const isLast = index === breadcrumbs.length - 1
                            return (
                                <div key={index} className="contents">
                                    <BreadcrumbItem>
                                        {item.href && !isLast ? (
                                            <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                                        ) : (
                                            <BreadcrumbPage>{item.label}</BreadcrumbPage>
                                        )}
                                    </BreadcrumbItem>
                                    {!isLast && <BreadcrumbSeparator />}
                                </div>
                            )
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            )}

            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight self-start">{title}</h1>
                {description && <p className="text-muted-foreground">{description}</p>}
            </div>

            <div className="self-end flex items-center gap-2.5 flex-wrap">
                {children}
                {href ? (
                    <Link href={href}>
                        <Button variant={isBack ? "outline" : "default"}>
                            {isBack ? <ArrowLeft className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                            {addLabel || "Tambah"}
                        </Button>
                    </Link>
                ) : onAdd ? (
                    <Button onClick={onAdd} variant={isBack ? "outline" : "default"}>
                        {isBack ? <ArrowLeft className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                        {addLabel || "Tambah"}
                    </Button>
                ) : null}
            </div>
        </div>
    );
}
