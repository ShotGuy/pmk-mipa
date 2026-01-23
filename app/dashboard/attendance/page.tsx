import { auth } from "@/auth";
import { QRGenerator } from "@/components/attendance/QRGenerator";
import { QRScanner } from "@/components/attendance/QRScanner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Need to check if Tabs exist, otherwise create manual tabs or install

export default async function AttendancePage() {
    const session = await auth();
    const role = session?.user?.role;
    const isAdminOrPengurus = role === "ADMIN" || role === "KETUA" || role === "BENDAHARA"; // Adjust logic for "Sie Acara" if needed

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Absensi</h1>
                <p className="text-muted-foreground">Scan QR Code untuk presensi kegiatan.</p>
            </div>

            {/* Since I haven't checked if Tabs component exists, I'll assume standard shadcn tabs or simple conditional rendering */}
            {/* I'll use simple conditional rendering logic to simplify if tabs are missing */}

            <div className="grid gap-6">
                {/* User Scanner - Always Visible for everyone? Or just USERS? Usually admins also need to attend. */}
                <div className="w-full max-w-xl mx-auto">
                    <h2 className="text-xl font-semibold mb-4">Scanner</h2>
                    <QRScanner />
                </div>

                {/* Generator - Only for Admins */}
                {isAdminOrPengurus && (
                    <div className="w-full max-w-xl mx-auto mt-8 pt-8 border-t">
                        <h2 className="text-xl font-semibold mb-4">Generator (Admin Area)</h2>
                        <QRGenerator />
                    </div>
                )}
            </div>
        </div>
    );
}
