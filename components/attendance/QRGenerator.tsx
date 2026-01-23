"use client"

import { useState, useEffect } from "react"
import { useQRCode } from "next-qrcode"
import { getUpcomingKegiatan } from "@/actions/attendance"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export function QRGenerator() {
    const { Canvas } = useQRCode()
    const [kegiatanId, setKegiatanId] = useState<string>("")
    const [activities, setActivities] = useState<{ id: string, nama: string }[]>([])
    const [qrValue, setQrValue] = useState<string>("")

    useEffect(() => {
        getUpcomingKegiatan().then(setActivities);
    }, []);

    const handleGenerate = () => {
        if (!kegiatanId) return;
        const timestamp = Date.now();
        const code = `${kegiatanId}-${timestamp}`;
        setQrValue(code);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Generator QR Code</CardTitle>
                <CardDescription>Pilih kegiatan untuk generate QR Presensi.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Pilih Kegiatan</Label>
                    <Select onValueChange={setKegiatanId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih Kegiatan" />
                        </SelectTrigger>
                        <SelectContent>
                            {activities.map((act) => (
                                <SelectItem key={act.id} value={act.id}>
                                    {act.nama}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Button onClick={handleGenerate} disabled={!kegiatanId}>
                    Generate QR
                </Button>

                {qrValue && (
                    <div className="mt-6 flex flex-col items-center p-4 border rounded-lg bg-white w-fit mx-auto">
                        <Canvas
                            text={qrValue}
                            options={{
                                errorCorrectionLevel: 'M',
                                margin: 3,
                                scale: 4,
                                width: 250,
                                color: {
                                    dark: '#000000',
                                    light: '#ffffff',
                                },
                            }}
                        />
                        <p className="mt-2 text-xs text-muted-foreground break-all max-w-[250px] text-center">
                            {qrValue}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
