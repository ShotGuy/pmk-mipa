"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Layers } from "lucide-react"

interface DashboardDemographicsProps {
    prodiDistribution: Array<{
        prodi: string
        count: number
        percentage: number
    }>
    angkatanDistribution: Array<{
        angkatan: string
        count: number
    }>
    totalAnggota: number
}

const prodiColors: Record<string, string> = {
    Matematika: "bg-blue-600",
    Fisika: "bg-amber-500",
    Kimia: "bg-emerald-600",
    Biologi: "bg-teal-500",
    Farmasi: "bg-rose-500",
    Informatika: "bg-indigo-600",
    "Ilmu Komputer": "bg-indigo-600",
    Statistika: "bg-purple-600",
}

export function DashboardDemographics({
    prodiDistribution,
    angkatanDistribution,
    totalAnggota,
}: DashboardDemographicsProps) {
    return (
        <div className="grid gap-6 lg:grid-cols-3">
            {/* Sebaran Program Studi (2 Cols on lg) */}
            <Card className="lg:col-span-2 shadow-xs border">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-primary" />
                        <CardTitle className="text-base font-bold text-foreground">
                            Distribusi Program Studi
                        </CardTitle>
                    </div>
                    <CardDescription className="text-xs text-muted-foreground">
                        Komposisi jemaat PMK MIPA berdasarkan jurusan kuliah
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3.5 pt-1 pb-5">
                    {prodiDistribution.length === 0 ? (
                        <p className="text-xs text-muted-foreground py-4 text-center">
                            Belum ada data program studi anggota.
                        </p>
                    ) : (
                        prodiDistribution.map((item, idx) => {
                            const barColor = prodiColors[item.prodi] || "bg-primary"

                            return (
                                <div key={idx} className="space-y-1.5">
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${barColor} inline-block`} />
                                            <span className="font-semibold text-foreground">{item.prodi}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <span className="font-medium text-foreground">{item.count} orang</span>
                                            <span>({item.percentage}%)</span>
                                        </div>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="h-2 w-full bg-muted/60 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${barColor} transition-all duration-500`}
                                            style={{ width: `${item.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            )
                        })
                    )}
                </CardContent>
            </Card>

            {/* Sebaran Angkatan Masuk (1 Col on lg) */}
            <Card className="shadow-xs border flex flex-col justify-between">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-sky-600" />
                        <CardTitle className="text-base font-bold text-foreground">
                            Sebaran Angkatan
                        </CardTitle>
                    </div>
                    <CardDescription className="text-xs text-muted-foreground">
                        Persebaran anggota aktif per tahun angkatan
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-1 pb-5">
                    {angkatanDistribution.length === 0 ? (
                        <p className="text-xs text-muted-foreground py-4 text-center">
                            Belum ada data angkatan tercatat.
                        </p>
                    ) : (
                        <div className="space-y-2.5">
                            {angkatanDistribution.map((item, idx) => {
                                const percent =
                                    totalAnggota > 0 ? Math.round((item.count / totalAnggota) * 100) : 0

                                return (
                                    <div
                                        key={idx}
                                        className="p-2.5 rounded-lg border bg-muted/20 flex items-center justify-between gap-3 text-xs"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="font-mono text-xs font-bold px-2 py-0.5 bg-background">
                                                {item.angkatan}
                                            </Badge>
                                            <span className="text-muted-foreground">Angkatan {item.angkatan}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-foreground">{item.count}</span>
                                            <span className="text-[11px] text-muted-foreground">({percent}%)</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
