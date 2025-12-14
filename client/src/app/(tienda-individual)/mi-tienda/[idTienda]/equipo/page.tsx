"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Search, Trash2, ShieldCheck, UserPlus, AlertCircle } from "lucide-react";

import { toast } from "sonner";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { api } from "../../../../../../convex/_generated/api";

// Component to list current members
function MemberList({
    members,
    onRemove,
    onRoleChange,
    currentUser
}: {
    members: any[];
    onRemove: (memberId: string) => void;
    onRoleChange: (memberId: string, newRole: string) => void;
    currentUser: any;
}) {
    return (
        <div className="space-y-4">
            {members.map((m) => (
                <div key={m.usuarioId} className="flex items-center justify-between p-4 border rounded-lg bg-card shadow-sm">
                    <div className="flex items-center gap-4">
                        <Avatar>
                            <AvatarImage src={m.imgUrl} />
                            <AvatarFallback>{m.nombre?.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium text-sm md:text-base">{m.nombre} {m.esPropietario && <Badge variant="outline" className="ml-2 text-xs">Propietario</Badge>}</p>
                            <p className="text-sm text-muted-foreground">{m.correo}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {!m.esPropietario ? (
                            <>
                                <Select
                                    defaultValue={m.rol}
                                    onValueChange={(val) => onRoleChange(m.usuarioId, val)}
                                    disabled={currentUser?.rol !== "admin" && !currentUser?.esPropietario}
                                >
                                    <SelectTrigger className="w-[110px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="vendedor">Vendedor</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="asistente">Asistente</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                    onClick={() => onRemove(m.usuarioId)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </>
                        ) : (
                            <Badge className="bg-primary/10 text-primary hover:bg-primary/20">Propietario</Badge>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

// Modal to add a new member
function AddMemberModal({ tiendaId, canAdd }: { tiendaId: Id<"tiendas">; canAdd: boolean }) {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [emailToSearch, setEmailToSearch] = useState("");
    const [rol, setRol] = useState("vendedor");

    // Search user by email
    const searchedUser = useQuery(api.users.getUserByEmail, emailToSearch ? { email: emailToSearch } : "skip");

    // Mutations
    const agregarMiembro = useMutation(api.tiendas.agregarMiembro);

    const handleSearch = () => {
        if (!email) return;
        setEmailToSearch(email);
    };

    const handleAdd = async () => {
        if (!searchedUser) return;
        try {
            await agregarMiembro({
                tiendaId,
                usuarioId: searchedUser._id,
                rol: rol as "admin" | "vendedor" | "asistente"
            });
            toast.success("Miembro agregado exitosamente");
            setOpen(false);
            setEmail("");
            setEmailToSearch("");
            setRol("vendedor");
        } catch (error) {
            toast.error("Error al agregar miembro: " + (error as any).message);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button disabled={!canAdd} className="bg-orange-600 hover:bg-orange-700">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Agregar Miembro
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Agregar Miembro al Equipo</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Email del usuario..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        />
                        <Button variant="secondary" onClick={handleSearch}>
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>

                    {emailToSearch && searchedUser === null && (
                        <div className="text-center p-4 text-muted-foreground flex flex-col items-center">
                            <AlertCircle className="h-8 w-8 mb-2 opacity-50" />
                            <p>Usuario no encontrado</p>
                        </div>
                    )}

                    {searchedUser && (
                        <div className="border rounded-lg p-3 bg-muted/50 flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={searchedUser.imgUrl} />
                                <AvatarFallback>?</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="font-medium">{searchedUser.nombre}</p>
                                <p className="text-xs text-muted-foreground">{searchedUser.correo}</p>
                            </div>
                            <ShieldCheck className="text-green-600 h-5 w-5" />
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Rol Asignado</label>
                        <Select value={rol} onValueChange={setRol}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar rol" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="vendedor">Vendedor</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="asistente">Asistente</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            {rol === 'admin' && "Acceso total a la configuración y gestión."}
                            {rol === 'vendedor' && "Puede vender, ver productos y clientes."}
                            {rol === 'asistente' && "Solo ver productos y clientes."}
                        </p>
                    </div>

                    <Button
                        onClick={handleAdd}
                        disabled={!searchedUser}
                        className="w-full mt-2"
                    >
                        Confirmar e Invitar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default function TeamManagementPage({ params }: { params: Promise<{ idTienda: string }> }) {
    // Unwrap params
    const { idTienda } = React.use(params);
    //   const idTienda = React.use(params).idTienda; // Alternatively if using Next 15+ 

    const tiendaId = idTienda as Id<"tiendas">;

    // Queries
    const report = useQuery(api.tiendas.getMiembrosTienda, { tiendaId });
    const removerMiembro = useMutation(api.tiendas.removerMiembro);
    const actualizarRol = useMutation(api.tiendas.actualizarRolMiembro);

    // States
    const [currentUser] = React.useState({ rol: 'admin', esPropietario: true }); // Mock, should derive from identity

    const handleRemove = async (usuarioId: string) => {
        if (!confirm("¿Estás seguro de remover a este miembro?")) return;
        try {
            await removerMiembro({ tiendaId, usuarioId: usuarioId as Id<"usuarios"> });
            toast.success("Miembro removido");
        } catch (e: any) {
            toast.error(e.message);
        }
    };

    const handleRoleChange = async (usuarioId: string, newRole: string) => {
        try {
            await actualizarRol({
                tiendaId,
                usuarioId: usuarioId as Id<"usuarios">,
                nuevoRol: newRole as "admin" | "vendedor" | "asistente"
            });
            toast.success("Rol actualizado");
        } catch (e: any) {
            toast.error(e.message);
        }
    }

    if (report === undefined) {
        return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;
    }

    if (report === null) {
        return <div>Tienda no encontrada</div>;
    }

    const { miembros, totalMiembros, limiteMaximo, plan, puedeAgregarMas } = report;
    const porcentajeUso = (totalMiembros / limiteMaximo) * 100;

    return (
        <section className="p-6 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Gestión de Equipo</h1>
                    <p className="text-muted-foreground">Administra los permisos y acceso de tus colaboradores.</p>
                </div>
                <AddMemberModal tiendaId={tiendaId} canAdd={puedeAgregarMas} />
            </div>

            {/* Dashboard Plan Section */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="border rounded-xl p-6 bg-gradient-to-br from-white to-slate-50 shadow-sm dark:from-slate-900 dark:to-slate-950">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Plan Actual</h2>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold capitalize">{plan}</span>
                        <Badge variant={plan === 'Gratis' ? 'secondary' : 'default'} className="uppercase text-[10px]">{plan}</Badge>
                    </div>
                    <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                            <span>Miembros</span>
                            <span className="font-medium">{totalMiembros} / {limiteMaximo}</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden dark:bg-slate-800">
                            <div
                                className={`h-full transition-all duration-500 rounded-full ${porcentajeUso > 90 ? 'bg-red-500' : 'bg-green-500'}`}
                                style={{ width: `${Math.min(porcentajeUso, 100)}%` }}
                            />
                        </div>
                        {!puedeAgregarMas && (
                            <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" /> Límite alcanzado
                            </p>
                        )}
                    </div>
                    {plan === 'Gratis' && (
                        <Button variant="outline" className="w-full mt-4 border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700" size="sm">
                            Mejorar Plan
                        </Button>
                    )}
                </div>

                <div className="col-span-1 md:col-span-2 border rounded-xl p-6 bg-card shadow-sm">
                    <h3 className="font-semibold text-lg mb-4">Consejos de Seguridad</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex gap-2">
                            <ShieldCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
                            Solo agrega a personas de tu confianza como administradores.
                        </li>
                        <li className="flex gap-2">
                            <ShieldCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
                            Los vendedores no pueden eliminar la tienda ni cambiar configuraciones críticas.
                        </li>
                        <li className="flex gap-2">
                            <ShieldCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
                            Revisa periódicamente la lista de accesos activos.
                        </li>
                    </ul>
                </div>
            </div>

            {/* Members List */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Miembros del equipo ({totalMiembros})</h2>
                <MemberList
                    members={miembros}
                    onRemove={handleRemove}
                    onRoleChange={handleRoleChange}
                    currentUser={currentUser} // Pass real context if available
                />
            </div>
        </section>
    );
}
