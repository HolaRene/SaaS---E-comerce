import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function UserTableSkeleton() {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-12">
                            <Skeleton className="h-4 w-4" />
                        </TableHead>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead>Tiendas</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Último Acceso</TableHead>
                        <TableHead className="w-12"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                <Skeleton className="h-4 w-4" />
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-48" />
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-5 w-24" />
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-1">
                                    <Skeleton className="h-5 w-20" />
                                    <Skeleton className="h-5 w-20" />
                                </div>
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-4 w-16" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-4 w-20" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-8 w-8" />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
