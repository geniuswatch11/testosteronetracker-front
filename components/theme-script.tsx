// Este componente contiene un script que se ejecuta inmediatamente para detectar
// el tema del sistema y aplicarlo antes de que React se hidrate
export function ThemeScript() {
  const codeToRunOnClient = `
(function() {
  function setTheme() {
    try {
      // Obtener el tema guardado en localStorage
      const item = localStorage.getItem('theme');
      const userProfile = localStorage.getItem('user_profile');
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      
      // Determinar qué tema usar
      let theme;
      
      // First check if we have a theme in localStorage from next-themes
      if (item === 'light' || item === 'dark' || item === 'system') {
        theme = item === 'system' ? systemTheme : item;
      } 
      // Then check if we have a theme in the user profile
      else if (userProfile) {
        try {
          const profile = JSON.parse(userProfile);
          if (profile.theme === 'white') {
            theme = 'light';
          } else if (profile.theme === 'dark') {
            theme = 'dark';
          } else {
            theme = systemTheme;
          }
        } catch (e) {
          theme = systemTheme;
        }
      } 
      // Default to system theme
      else {
        theme = systemTheme;
      }
      
      // Aplicar el tema inmediatamente para evitar parpadeo
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      // Si hay algún error, aplicar el tema del sistema
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      if (systemTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }

  // Ejecutar al cargar
  setTheme();
  
  // También ejecutar cuando cambie el tema del sistema
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setTheme);
})();
`

  // Usar dangerouslySetInnerHTML para ejecutar el script inmediatamente
  return <script dangerouslySetInnerHTML={{ __html: codeToRunOnClient }} />
}
