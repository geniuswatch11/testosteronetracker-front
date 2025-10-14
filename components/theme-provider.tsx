/**
 * DEPRECATED: ThemeProvider component
 * La plataforma ahora solo funciona en modo oscuro (dark mode)
 * Este componente se mantiene por compatibilidad pero no debe ser usado
 */

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
