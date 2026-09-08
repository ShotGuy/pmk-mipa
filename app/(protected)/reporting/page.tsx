"use client"

import { useState } from "react"
import { getHPDTReport } from "@/actions/report"
import * as XLSX from "xlsx"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileSpreadsheet } from "lucide-react"

export default function ReportingPage() {
    const [startDate, setStartDate] = useState<string>("")
    const [endDate, setEndDate] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)

    const handleExport = async () => {
        if (!startDate || !endDate) {
            toast.error("Pilih tanggal mulai dan selesai");
            return;
        }

        setIsLoading(true);
        toast.info("Mengambil data...");

        try {
            const data = await getHPDTReport(new Date(startDate), new Date(endDate));

            if (data.length === 0) {
                toast.warning("Tidak ada data pada rentang tanggal tersebut");
                setIsLoading(false);
                return;
            }

            // Create Worksheet
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Laporan HPDT");

            // Download
            XLSX.writeFile(wb, `Laporan_HPDT_${startDate}_${endDate}.xlsx`);
            toast.success("Laporan berhasil diunduh!");
        } catch (error) {
            toast.error("Gagal export laporan");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Reporting</h1>
                <p className="text-muted-foreground">Export laporan data jemaat/anggota.</p>
            </div>

            <Card className="max-w-md">
                <CardHeader>
                    <CardTitle>Export HPDT</CardTitle>
                    <CardDescription>Download rekap HPDT ke format Excel.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Dari Tanggal</Label>
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Sampai Tanggal</Label>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <Button className="w-full" onClick={handleExport} disabled={isLoading}>
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        {isLoading ? "Generating..." : "Export to Excel"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
