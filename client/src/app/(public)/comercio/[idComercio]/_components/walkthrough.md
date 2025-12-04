# Implementación de Botón de Seguir y Sheet de Compartir

## Resumen

Se implementó exitosamente la funcionalidad de seguir/dejar de seguir tiendas y compartir enlaces en la página de perfil público de tienda ([perfilPublico.tsx]).

## Cambios Realizados

### 1. Imports Agregados

Se agregaron las siguientes dependencias:

- **Autenticación**: `useUser` de `@clerk/nextjs`
- **Convex**: `useMutation` para mutaciones
- **React**: `useEffect` para sincronización de estado
- **UI Components**: `Sheet`, `SheetContent`, `SheetHeader`, `SheetTitle`, `SheetTrigger` de Shadcn
- **Utilidades**: `Input`, `cn`, `toast` de sonner
- **Iconos**: `ClipboardCopy`, `Check` de lucide-react

### 2. Autenticación y Estado

```tsx
// Obtener usuario de Clerk
const { user: clerkUser } = useUser()

// Obtener usuario de Convex
const usuario = useQuery(
  api.users.getUserById,
  clerkUser ? { clerkId: clerkUser.id } : 'skip'
)

// Verificar si la tienda es favorita
const esFavorita = useQuery(
  api.favoritos.isTiendaFavorita,
  usuario?._id ? { usuarioId: usuario._id, tiendaId: id } : 'skip'
)
```

**Flujo de autenticación:**

1. `useUser()` obtiene el usuario de Clerk
2. `getUserById` query convierte `clerkId` → `usuario._id` de Convex
3. `isTiendaFavorita` query verifica el estado actual
4. Estado local se sincroniza automáticamente con `useEffect`

### 3. Mutations Implementadas

```tsx
const agregarFavorito = useMutation(api.favoritos.agregarTiendaFavorita)
const eliminarFavorito = useMutation(api.favoritos.eliminarTiendaFavorita)
```

### 4. Botón de Seguir

**Características:**

- ✅ Verde "Seguir" cuando no está siguiendo
- ✅ Azul "Siguiendo" cuando está siguiendo
- ✅ Ícono Heart que se rellena al seguir
- ✅ Deshabilitado si no hay usuario autenticado
- ✅ Toast notifications con sonner
- ✅ Transiciones suaves

**Código:**

```tsx
<Button
  onClick={handleToggleFollow}
  variant={isFollowing ? 'default' : 'outline'}
  className={cn(
    'gap-2 transition-all',
    isFollowing
      ? 'bg-blue-500 hover:bg-blue-600 text-white'
      : 'bg-green-500 hover:bg-green-600 text-white'
  )}
  disabled={!usuario}
>
  <Heart className={cn('h-4 w-4', isFollowing && 'fill-current')} />
  {isFollowing ? 'Siguiendo' : 'Seguir'}
</Button>
```

### 5. Sheet de Compartir

**Características:**

- ✅ Panel deslizante desde abajo (`side="bottom"`)
- ✅ Input de solo lectura con URL de la tienda
- ✅ Botón copiar con feedback visual
- ✅ Ícono cambia de ClipboardCopy a Check al copiar
- ✅ Toast de confirmación
- ✅ Texto descriptivo para el usuario

**Código:**

```tsx
<Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
  <SheetTrigger asChild>
    <Button variant='outline' className='gap-2'>
      <Share2 className='h-4 w-4' />
      Compartir
    </Button>
  </SheetTrigger>
  <SheetContent side='bottom' className='h-auto'>
    <SheetHeader>
      <SheetTitle>Compartir tienda</SheetTitle>
    </SheetHeader>
    <div className='space-y-4 mt-4'>
      <div className='flex items-center gap-2'>
        <Input
          readOnly
          value={`${typeof window !== 'undefined' ? window.location.origin : ''}/comercio/${id}`}
          className='flex-1'
        />
        <Button
          onClick={handleCopyLink}
          variant='secondary'
          size='icon'
          className='shrink-0'
        >
          {copied ? (
            <Check className='h-4 w-4 text-green-600' />
          ) : (
            <ClipboardCopy className='h-4 w-4' />
          )}
        </Button>
      </div>
      <p className='text-sm text-muted-foreground'>
        Comparte este enlace para que otros puedan ver esta tienda
      </p>
    </div>
  </SheetContent>
</Sheet>
```

### 6. Handlers Implementados

#### [handleToggleFollow](file:///c:/Users/DELL/Desktop/SaaS%20-%20Comercio/client/src/app/%28public%29/comercio/%5BidComercio%5D/_components/perfilPublico.tsx#119-137)

- Verifica autenticación antes de proceder
- Llama a la mutación apropiada (agregar/eliminar)
- Muestra toast de éxito o error
- Maneja errores gracefully

#### [handleCopyLink](file:///c:/Users/DELL/Desktop/SaaS%20-%20Comercio/client/src/app/%28public%29/comercio/%5BidComercio%5D/_components/perfilPublico.tsx#138-144)

- Copia URL al portapapeles usando Clipboard API
- Muestra feedback visual temporal (2 segundos)
- Toast de confirmación
- Manejo de errores

## Integración con Convex

### Queries Usadas

1. `api.users.getUserById` - Mapea Clerk ID → Convex user ID
2. `api.favoritos.isTiendaFavorita` - Verifica estado de favorito
3. `api.tiendas.getTiendaById` - Obtiene datos de la tienda
4. `api.productos.getProductosByTienda` - Obtiene productos

### Mutations Usadas

1. `api.favoritos.agregarTiendaFavorita` - Agrega a favoritos
2. `api.favoritos.eliminarTiendaFavorita` - Elimina de favoritos

## Pruebas Recomendadas

### Funcionalidad de Seguir

- [ ] **Sin autenticación:**
  - Botón debe estar deshabilitado
  - Al hacer clic muestra toast "Debes iniciar sesión"

- [ ] **Con autenticación:**
  - Botón habilitado y funcional
  - Click agrega a favoritos → botón cambia a azul "Siguiendo"
  - Click nuevamente elimina de favoritos → botón vuelve a verde "Seguir"
  - Toast de confirmación en ambos casos

- [ ] **Persistencia:**
  - Estado persiste al recargar página
  - Sincronización correcta con Convex

### Funcionalidad de Compartir

- [ ] **Sheet:**
  - Se abre al hacer clic en "Compartir"
  - Muestra URL correcta
  - Se cierra correctamente

- [ ] **Copiar:**
  - Botón copia al portapapeles
  - Ícono cambia a check por 2 segundos
  - Toast de confirmación

### UI/UX

- [ ] Responsive en móvil y desktop
- [ ] Transiciones suaves
- [ ] Colores accesibles
- [ ] Feedback visual claro

## Notas Técnicas

- **Patrón de autenticación**: Basado en [negocio-perfil-page.tsx](file:///c:/Users/DELL/Desktop/SaaS%20-%20Comercio/client/src/components/negocios/negocio-perfil-page.tsx) (líneas 149-198)
- **Sincronización de estado**: `useEffect` sincroniza `esFavorita` query con estado local
- **SSR-safe**: Check de `typeof window !== 'undefined'` para URL
- **Error handling**: Try-catch con toast notifications
- **Optimistic UI**: Estado local se actualiza inmediatamente, sincroniza con servidor

## Archivos Modificados

- [perfilPublico.tsx](<file:///c:/Users/DELL/Desktop/SaaS%20-%20Comercio/client/src/app/(public)/comercio/[idComercio]/_components/perfilPublico.tsx>)

## Próximos Pasos Sugeridos

1. Probar en navegador con usuario autenticado y no autenticado
2. Verificar que las mutaciones de Convex funcionen correctamente
3. Revisar responsive design en diferentes tamaños de pantalla
4. Considerar agregar analytics para tracking de shares y follows
