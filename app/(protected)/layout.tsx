import { AppSidebar } from "@/components/layout/AppSidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        // In a real app, redirect to login. For now, we'll redirect, but the user said use "user dummy".
        // I assume flow is: User logs in -> Session exists.
        // If no session, redirect to home or login.
        redirect("/api/auth/signin");
    }

    // Ensure role is typed correctly if needed, but session.user.role should be typed from auth.ts
    const user = {
        ...session.user,
        role: session.user.role as Role // Explicit cast if needed/paranoid
    }

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <AppSidebar user={user} />
            <main className="flex-1 overflow-y-auto max-h-screen w-full">
                {/* Mobile header compensation if needed is in AppSidebar sheet trigger */}
                <div className="p-4 md:p-8 pt-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
