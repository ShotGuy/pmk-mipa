import { AppSidebar } from "@/components/layout/AppSidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";

import { AdminHeader } from "@/components/layout/AdminHeader";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        // In a real app, redirect to login. For now, we'll redirect, but the user said use "user dummy".
        // I assume flow is: User logs in -> Session exists.
        redirect("/login");
    }

    // Ensure role is typed correctly if needed, but session.user.role should be typed from auth.ts
    const user = {
        ...session.user,
        role: session.user.role as Role // Explicit cast if needed/paranoid
    }

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            <AppSidebar user={user} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader user={user} />
                <main className="flex-1 overflow-y-auto w-full">
                    {/* Mobile header compensation if needed is in AppSidebar sheet trigger */}
                    <div className="p-4 md:p-8 pt-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
