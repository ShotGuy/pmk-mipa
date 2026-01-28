export default function AdminDashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                <p className="text-muted-foreground">Statistik dan ringkasan data PMK MIPA.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-6 rounded-xl border bg-card text-card-foreground shadow">
                    <div className="text-sm font-medium text-muted-foreground">Total Users</div>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">+0 from last month</p>
                </div>
                <div className="p-6 rounded-xl border bg-card text-card-foreground shadow">
                    <div className="text-sm font-medium text-muted-foreground">Total Anggota</div>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">+0 from last month</p>
                </div>
                {/* Placeholders for other stats */}
            </div>

            <div className="p-12 border rounded-lg border-dashed flex items-center justify-center text-muted-foreground">
                Area Grafik Statistik (Akan Datang)
            </div>
        </div>
    );
}
