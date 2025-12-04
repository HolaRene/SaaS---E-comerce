# Instrucciones para Agregar Funcionalidad de Favoritos al ProductoCard

## Cambios Necesarios

### 1. Agregar estado y lógica después de la línea 68

Después de esta línea:

```tsx
const tienda = useQuery(
  api.tiendas.getTiendaPublicaById,
  producto ? { id: producto.tiendaId } : 'skip'
)
```

Agregar:

```tsx
// Obtener usuario actual
const { user: clerkUser } = useUser()
const usuario = useQuery(
  api.users.getUserById,
  clerkUser ? { clerkId: clerkUser.id } : 'skip'
)

// Estado para favoritos
const [isFavorite, setIsFavorite] = useState(false)

// Verificar si el producto es favorito
const esFavorito = useQuery(
  api.favoritos.isProductoFavorito,
  usuario?._id && producto
    ? { usuarioId: usuario._id, productoId: producto._id }
    : 'skip'
)

// Mutations
const agregarFavorito = useMutation(api.favoritos.agregarProductoFavorito)
const eliminarFavorito = useMutation(api.favoritos.eliminarProductoFavorito)

// Sincronizar estado local con el estado de Convex
useEffect(() => {
  if (esFavorito !== undefined) {
    setIsFavorite(esFavorito)
  }
}, [esFavorito])

// Handler para agregar/eliminar de favoritos
const handleToggleFavorite = async () => {
  if (!usuario?._id) {
    toast.error('Debes iniciar sesión para guardar productos')
    return
  }

  if (!producto) return

  try {
    if (isFavorite) {
      await eliminarFavorito({
        usuarioId: usuario._id,
        productoId: producto._id,
      })
      toast.success('Producto eliminado de favoritos')
    } else {
      await agregarFavorito({
        usuarioId: usuario._id,
        productoId: producto._id,
      })
      toast.success('Producto agregado a favoritos')
    }
  } catch (error: any) {
    toast.error(error.message || 'Error al actualizar favoritos')
    console.error(error)
  }
}
```

### 2. Reemplazar el botón "Guardar" (líneas 195-198)

Reemplazar:

```tsx
<Button variant='outline' size='sm' className='flex-1'>
  <Heart className='w-4 h-4 mr-2' />
  Guardar
</Button>
```

Con:

```tsx
<Button
  variant='outline'
  size='sm'
  className='flex-1'
  onClick={handleToggleFavorite}
  disabled={!usuario}
>
  <Heart
    className={cn('w-4 h-4 mr-2', isFavorite && 'fill-red-500 text-red-500')}
  />
  {isFavorite ? 'Guardado' : 'Guardar'}
</Button>
```

## Resultado

- El botón mostrará "Guardado" con un corazón rojo cuando el producto esté en favoritos
- El botón mostrará "Guardar" con un corazón vacío cuando no esté en favoritos
- Al hacer clic, agregará o eliminará el producto de favoritos
- Mostrará notificaciones toast de éxito/error
- Se deshabilitará si el usuario no está logueado
