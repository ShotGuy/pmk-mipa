import { getTransactions, getKasBalance } from "@/actions/finance";
import { TransactionForm } from "@/components/finance/TransactionForm";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/finance/columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function FinancePage() {
    const transactions = await getTransactions();
    const saldo = await getKasBalance();

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Keuangan</h1>
                    <p className="text-muted-foreground">Kelola kas dan transaksi PMK.</p>
                </div>
                <Card className="w-full md:w-auto bg-primary text-primary-foreground min-w-[200px]">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium">Saldo Kas Saat Ini</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">
                            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(Number(saldo))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <TransactionForm />
                </div>
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Riwayat Transaksi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DataTable columns={columns} data={transactions} searchKey="keterangan" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
