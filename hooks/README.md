# Hooks - Indirect Data Fetching Pattern

Este directorio contiene todos los hooks personalizados de la aplicación que implementan el patrón **Indirect Data Fetching**.

## ¿Qué es Indirect Data Fetching?

Es un patrón de diseño que separa la lógica de fetching de datos de los componentes de UI, creando una capa de abstracción mediante hooks personalizados. Esto proporciona:

- ✅ **Reutilización**: Los hooks pueden usarse en múltiples componentes
- ✅ **Mantenibilidad**: La lógica de datos está centralizada
- ✅ **Testabilidad**: Los hooks pueden testearse independientemente
- ✅ **Separación de responsabilidades**: UI separada de la lógica de datos
- ✅ **Consistencia**: Manejo uniforme de estados (loading, error, data)

---

## Hooks Disponibles

### 1. `useAuth`

Hook para manejar la autenticación del usuario.

**Retorna:**
```typescript
{
  user: UserProfile | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
  spikeConnected: boolean
  isComplete: boolean
  logout: () => void
  refreshUser: () => Promise<void>
}
```

**Ejemplo de uso:**
```tsx
import { useAuth } from "@/hooks"

export default function ProfilePage() {
  const { user, isLoading, error, logout } = useAuth()

  if (isLoading) return <SimpleLoading />
  if (error) return <ErrorMessage message={error} />
  if (!user) return <LoginPrompt />

  return (
    <div>
      <h1>Welcome {user.first_name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

---

### 2. `useHealthData`

Hook para manejar datos de salud del usuario.

**Opciones:**
```typescript
{
  interval?: number      // Intervalo de tiempo (1=día, 7=semana, 30=mes)
  limit?: number         // Límite de registros
  autoFetch?: boolean    // Fetch automático al montar
}
```

**Retorna:**
```typescript
{
  data: HealthData[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  setInterval: (interval: number) => void
}
```

**Ejemplo de uso:**
```tsx
import { useHealthData } from "@/hooks"

export default function HealthDashboard() {
  const { data, isLoading, error, setInterval } = useHealthData({
    interval: 7,
    limit: 12,
    autoFetch: true,
  })

  if (isLoading) return <SynchronizingLoading />
  if (error) return <ErrorMessage message={error} />

  return (
    <div>
      <IntervalSelector onChange={setInterval} />
      <HealthChart data={data} />
    </div>
  )
}
```

---

### 3. `useAsync`

Hook genérico para manejar cualquier operación asíncrona.

**Retorna:**
```typescript
{
  data: T | null
  isLoading: boolean
  error: string | null
  execute: (...args: Args) => Promise<T | null>
  reset: () => void
}
```

**Ejemplo de uso:**
```tsx
import { useAsync } from "@/hooks"
import { authApi } from "@/lib/api/auth"

export default function LoginForm() {
  const { isLoading, error, execute } = useAsync(authApi.login)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const result = await execute(email, password)
    if (result) {
      router.push("/dashboard")
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <ErrorMessage message={error} />}
      <input type="email" />
      <input type="password" />
      <button disabled={isLoading}>
        {isLoading ? "Loading..." : "Login"}
      </button>
    </form>
  )
}
```

---

### 4. `useSettings`

Hook para manejar configuraciones del usuario.

**Retorna:**
```typescript
{
  isUpdating: boolean
  error: string | null
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>
  updateTheme: (theme: string) => Promise<boolean>
  updateLanguage: (language: string) => Promise<boolean>
}
```

**Ejemplo de uso:**
```tsx
import { useSettings } from "@/hooks"

export default function SettingsPage() {
  const { isUpdating, error, updateTheme, updateLanguage } = useSettings()

  const handleThemeChange = async (theme: string) => {
    const success = await updateTheme(theme)
    if (success) {
      toast.success("Theme updated")
    }
  }

  return (
    <div>
      <ThemeSelector 
        onChange={handleThemeChange} 
        disabled={isUpdating} 
      />
      {error && <ErrorMessage message={error} />}
    </div>
  )
}
```

---

## Patrón de Uso Común

Todos los hooks siguen un patrón consistente:

```tsx
const {
  data,           // Datos obtenidos
  isLoading,      // Estado de carga
  error,          // Error si ocurre
  execute,        // Función para ejecutar la operación
  refetch,        // Función para refrescar datos
} = useHook(options)
```

---

## Ventajas del Patrón

### Antes (Direct Fetching):
```tsx
export default function MyComponent() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const result = await api.getData()
        setData(result)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // ... resto del componente
}
```

### Después (Indirect Fetching):
```tsx
export default function MyComponent() {
  const { data, isLoading, error } = useMyData()

  // ... resto del componente
}
```

---

## Best Practices

1. **Siempre maneja los 3 estados**: loading, error, data
2. **Usa los hooks en el nivel más alto posible** del árbol de componentes
3. **Evita fetching directo en componentes** - usa hooks
4. **Combina hooks** cuando sea necesario
5. **Crea hooks específicos** para casos de uso complejos

---

## Ejemplo Completo

```tsx
import { useAuth, useHealthData } from "@/hooks"
import { SimpleLoading } from "@/components/ui/simple-loading"
import { SynchronizingLoading } from "@/components/ui/synchronizing-loading"

export default function DashboardPage() {
  // Autenticación
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  
  // Datos de salud
  const { 
    data: healthData, 
    isLoading: healthLoading, 
    error,
    setInterval 
  } = useHealthData({ 
    interval: 1, 
    autoFetch: isAuthenticated 
  })

  // Estados de carga
  if (authLoading) return <SimpleLoading />
  if (!isAuthenticated) return <LoginPrompt />
  if (healthLoading) return <SynchronizingLoading />
  if (error) return <ErrorMessage message={error} />

  // UI
  return (
    <div>
      <h1>Welcome {user?.first_name}</h1>
      <IntervalSelector onChange={setInterval} />
      <HealthChart data={healthData} />
    </div>
  )
}
```

---

## Testing

Los hooks pueden testearse fácilmente con `@testing-library/react-hooks`:

```tsx
import { renderHook, waitFor } from "@testing-library/react"
import { useHealthData } from "@/hooks"

test("useHealthData fetches data", async () => {
  const { result } = renderHook(() => useHealthData())
  
  expect(result.current.isLoading).toBe(true)
  
  await waitFor(() => {
    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBeDefined()
  })
})
```
