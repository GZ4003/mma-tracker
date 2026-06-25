# Resumen: Migración a Supabase Auth + Datos Persistentes

## ¿Qué cambió?

### Persistencia de datos
- **Antes:** localStorage (solo en ese dispositivo)
- **Después:** Supabase Database + JSONB (sincronizado en todos los dispositivos)

### Autenticación
- **Antes:** Sin autenticación (cualquiera podía ver/editar datos de cualquiera)
- **Después:** Google OAuth via Supabase (cada usuario solo ve sus datos)

---

## Archivos creados

```
lib/supabase/
  ├── client.ts          # Cliente para componentes client-side
  ├── server.ts          # Cliente para Server Components
  └── middleware.ts      # Lógica de middleware para proteger rutas

middleware.ts            # Next.js middleware (raíz del proyecto)

app/auth/
  └── callback/
      └── route.ts       # Callback de Google OAuth

app/login/
  └── page.tsx           # Página de login con botón de Google

app/api/user-data/
  └── route.ts           # API endpoints para leer/escribir datos en Supabase

SETUP_SUPABASE.md        # Instrucciones de configuración
.env.local.example       # Template de variables de entorno
```

---

## Archivos modificados

### `hooks/useGoatMode.ts`
**Cambios:** 2 funciones (`readFromStorage` y `writeToStorage`)
- De: localStorage calls
- A: API fetch calls (`/api/user-data`)
- El resto del hook NO cambió (toda la lógica de XP, achievements, challenges sigue igual)

---

## Packages instalados

```bash
npm install @supabase/supabase-js @supabase/ssr
```

---

## Flujo de datos

### Setup inicial
```
Usuario → /login → Google OAuth → /auth/callback → Supabase crea sesión → /
```

### Cada vez que el usuario abre la app
```
Middleware → Valida sesión de Supabase → Si no existe, redirige a /login
```

### Cuando el usuario registra un entrenamiento
```
useGoatMode → logSession() → setData() → useEffect → writeToStorage()
↓
fetch POST /api/user-data
↓
API route valida sesión → Inserta/actualiza en Supabase → RLS previene acceso a otros usuarios
```

### Cuando el usuario abre en otro dispositivo con su Gmail
```
Mismo usuario → Misma sesión de Google → Misma sesión de Supabase → GET /api/user-data → Mismo blob JSON
```

---

## Garantías de seguridad

1. **Middleware** protege todas las rutas excepto `/login` y `/auth/callback`
2. **Supabase RLS (Row Level Security)** garantiza que cada usuario solo accede a sus propios datos — incluso si hay un bug en el código, la base de datos lo bloquea
3. **HTTP-only cookies** para sesiones (no roban fácilmente via XSS)
4. **PKCE flow** para Google OAuth (más seguro que implicit flow)

---

## Variables de entorno requeridas

Crear `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Ver `SETUP_SUPABASE.md` para instrucciones completas.

---

## Testing

1. ✅ Compilación: `npm run build` (debe pasar sin errores)
2. ✅ Login: `npm run dev` → `http://localhost:3000` → debe redirigir a `/login`
3. ✅ Google OAuth: Click en botón → Google redirects → callback → dashboard
4. ✅ Datos persistentes: Registra entrenamiento → Recarga la página → datos persisten
5. ✅ Cross-device: Login en otro browser con misma Gmail → mismos datos
6. ✅ Datos separados: Login con otra Gmail → pantalla de setup limpia

---

## Lo que NO cambió

- Toda la lógica de XP, niveles, achievements, challenges, ranks (`lib/*.ts`)
- Toda la estructura de tipos (`types/index.ts`)
- Componentes UI (componentes, estilos, etc.)
- El almacenamiento de datos sigue siendo un JSON blob (mismo formato que antes)
- localStorage local sigue intacto (no se limpia automáticamente)

---

## Próximos pasos opcionales

1. **Importar datos locales:** Script para migrar localStorage → Supabase al login
2. **Perfiles públicos:** Página para ver rankings de usuarios (con opt-in)
3. **Amigos:** Agregar funcionalidad de "retar a un amigo"
4. **Estadísticas globales:** Ver rankings globales por disciplina

---

## Rollback (si algo sale mal)

Si necesitas volver a localStorage temporalmente:

1. Revert `hooks/useGoatMode.ts` a la versión anterior
2. Elimina los archivos nuevos de Supabase
3. Desinstala: `npm uninstall @supabase/supabase-js @supabase/ssr`

Los datos locales en localStorage siguen ahí.
