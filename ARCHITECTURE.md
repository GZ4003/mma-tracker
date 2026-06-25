# Arquitectura: Supabase Auth + Datos Persistentes

## Diagrama general

```
┌─────────────────────────────────────────────────────────────────┐
│                         NAVEGADOR                               │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           Next.js 14 App (TypeScript)                    │  │
│  │                                                           │  │
│  │  Rutas protegidas:                                       │  │
│  │  • / (dashboard)                                         │  │
│  │  • /log/training, /log/meal                             │  │
│  │  • /progress, /challenges, /achievements, /history      │  │
│  │                                                           │  │
│  │  Rutas públicas:                                        │  │
│  │  • /login (página de login)                            │  │
│  │  • /auth/callback (callback de Google)                 │  │
│  │                                                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  State Management:                                              │
│  • useGoatMode hook → Supabase API (no localStorage)           │
│  • setState triggers useEffect → POST /api/user-data          │
│  • Datos en formato JSONB (mismo que antes)                   │
│                                                                  │
└──────────────┬─────────────────────────────────────────────────┘
               │
        ┌──────┴──────────────────┬────────────────┬──────────────┐
        │                         │                │              │
    ┌───▼────────┐        ┌──────▼────┐    ┌─────▼────────┐   ┌─▼──────────┐
    │ middleware │        │ /api/     │    │ /auth/       │   │ /login     │
    │ .ts        │        │ user-data │    │ callback     │   │ page       │
    │            │        │           │    │              │   │            │
    │ Valida     │        │ GET: Lee  │    │ Intercambia  │   │ Botón      │
    │ sesión     │        │ datos     │    │ código por   │   │ "Google    │
    │ en cada    │        │           │    │ sesión       │   │ OAuth"     │
    │ request    │        │ POST:     │    │              │   │            │
    │            │        │ guarda    │    │ Sets cookies │   │ Redirige a │
    │ Redirige   │        │ datos     │    │ HTTP-only    │   │ Google     │
    │ a /login   │        │           │    │              │   │            │
    │ si no auth │        │ Valida    │    │ Redirige a / │   └────────────┘
    │            │        │ auth      │    │              │
    └────────────┘        └──────┬────┘    └──────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
            ┌───────▼──────────┐    ┌────────▼──────────┐
            │ Supabase Client  │    │ Supabase Server   │
            │ (Browser)        │    │ (Server-side)     │
            │                  │    │                   │
            │ createBrowserCli │    │ createServerClie  │
            │ ent()            │    │ nt()              │
            │                  │    │                   │
            │ Para OAuth login │    │ Para leer/guardar │
            │                  │    │ datos de usuario  │
            └────────┬─────────┘    └─────────┬─────────┘
                     │                        │
                     └────────────┬───────────┘
                                  │
                     ┌────────────▼───────────┐
                     │   SUPABASE PROJECT    │
                     │                        │
                     │ ┌────────────────────┐ │
                     │ │  auth.users        │ │
                     │ │                    │ │
                     │ │ • id (UUID)        │ │
                     │ │ • email (Google)   │ │
                     │ │ • last_sign_in     │ │
                     │ │ • app_metadata     │ │
                     │ │                    │ │
                     │ │ Sesiones:         │ │
                     │ │ • HTTP-only cookie │ │
                     │ │ • PKCE flow        │ │
                     │ │ • Auto-refresh     │ │
                     │ └────────────────────┘ │
                     │                        │
                     │ ┌────────────────────┐ │
                     │ │  user_data         │ │
                     │ │  (Private)         │ │
                     │ │                    │ │
                     │ │ user_id │ data    │ │
                     │ │ (PK)    │ (JSONB)│ │
                     │ │─────────┼────────│ │
                     │ │ uuid-1  │ {      │ │
                     │ │         │  prof..│ │
                     │ │         │  sess..│ │
                     │ │         │  ach...│ │
                     │ │         │ }      │ │
                     │ │         │        │ │
                     │ │ uuid-2  │ {      │ │
                     │ │         │  prof..│ │
                     │ │         │  ...   │ │
                     │ │         │ }      │ │
                     │ │                    │ │
                     │ │ RLS Policy:       │ │
                     │ │ auth.uid()=user_id │ │
                     │ └────────────────────┘ │
                     │                        │
                     └────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │ Google OAuth    │
                    │ (Google Cloud)  │
                    │                 │
                    │ Client ID       │
                    │ Client Secret   │
                    │ Redirect URI    │
                    └─────────────────┘
```

## Flujo de autenticación

```
USUARIO ABRE NAVEGADOR
  │
  ▼
┌───────────────────────────────────────┐
│ middleware.ts valida sesión            │
└───────────────────────────────────────┘
  │
  ├─ ¿Hay cookie de sesión Supabase?
  │
  ├─ NO → ¿Está en /login o /auth/*?
  │  │
  │  ├─ SÍ → Continuar
  │  │
  │  └─ NO → Redirigir a /login
  │
  └─ SÍ → Validar sesión, continuar
     │
     └─ Si expiró, Supabase auto-refresh
        (gracias a @supabase/ssr)
```

## Flujo de login

```
Usuario entra a /login
  │
  ▼
┌───────────────────────────────────────┐
│ Click botón "Iniciar sesión con Google"│
│ app/login/page.tsx                     │
└───────────────────────────────────────┘
  │
  ▼
┌───────────────────────────────────────┐
│ supabase.auth.signInWithOAuth({        │
│   provider: 'google'                   │
│   redirectTo: '.../auth/callback'      │
│ })                                      │
└───────────────────────────────────────┘
  │
  ▼
┌───────────────────────────────────────┐
│ Google OAuth flow                      │
│ Usuario autoriza app                   │
│ Google redirige a /auth/callback?code= │
└───────────────────────────────────────┘
  │
  ▼
┌───────────────────────────────────────┐
│ app/auth/callback/route.ts             │
│ Recibe código de autorización          │
└───────────────────────────────────────┘
  │
  ▼
┌───────────────────────────────────────┐
│ supabase.auth.exchangeCodeForSession() │
│ • Intercambia código por sesión        │
│ • Crea/actualiza usuario en auth.users │
│ • Sets HTTP-only cookie                │
└───────────────────────────────────────┘
  │
  ▼
┌───────────────────────────────────────┐
│ Redirige a / (dashboard)               │
└───────────────────────────────────────┘
  │
  ▼
┌───────────────────────────────────────┐
│ useGoatMode carga datos                │
│ GET /api/user-data                     │
│ → Busca en user_data table por user_id │
└───────────────────────────────────────┘
  │
  ├─ Datos encontrados
  │  │
  │  └─ Mostrar dashboard con datos
  │
  └─ No hay datos (primera vez)
     │
     └─ Mostrar SetupScreen
```

## Flujo de persistencia de datos

```
Usuario acción (registra entrenamiento)
  │
  ▼
┌──────────────────────┐
│ useGoatMode.logSession()
│ → setData(...)        │
└──────────────────────┘
  │
  ▼
┌──────────────────────┐
│ useEffect detecta    │
│ cambio en data       │
└──────────────────────┘
  │
  ▼
┌──────────────────────┐
│ writeToStorage()     │
│ → fetch POST         │
│    /api/user-data    │
└──────────────────────┘
  │
  ▼
┌──────────────────────┐
│ app/api/user-data    │
│ POST handler         │
└──────────────────────┘
  │
  ▼
┌──────────────────────┐
│ Valida auth.getUser()│
│ Obtiene user_id     │
└──────────────────────┘
  │
  ▼
┌──────────────────────┐
│ supabase.upsert()    │
│ user_data table      │
│ {                    │
│   user_id: ...,      │
│   data: {...},       │
│   updated_at: now    │
│ }                    │
└──────────────────────┘
  │
  ▼
┌──────────────────────┐
│ Supabase RLS Policy  │
│ Verifica:            │
│ auth.uid() = user_id │
└──────────────────────┘
  │
  ├─ Validación correcta
  │  │
  │  └─ Guardar en BD ✓
  │
  └─ Validación falla
     │
     └─ Error 403 (Forbidden)
```

## Diagrama de seguridad

```
┌─────────────────────────────────────────────┐
│ CAPA 1: Middleware (Next.js)                │
│ ┌───────────────────────────────────────┐   │
│ │ Protege rutas en cliente/servidor     │   │
│ │ • Redirige a /login si no autenticado │   │
│ │ • Refesca sesión automáticamente     │   │
│ └───────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│ CAPA 2: API Routes (Next.js + Supabase)    │
│ ┌───────────────────────────────────────┐   │
│ │ /api/user-data valida:                │   │
│ │ • auth.getUser() == existe             │   │
│ │ • fetch solo user_data para ese user   │   │
│ │ • devuelve 401 si no autenticado       │   │
│ └───────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│ CAPA 3: RLS (Row Level Security - SQL)     │
│ ┌───────────────────────────────────────┐   │
│ │ Base de datos bloquea queries que:    │   │
│ │ • No cumplan: auth.uid() = user_id    │   │
│ │ • Intentan ver datos ajenos            │   │
│ │ • Intentan modificar datos ajenos      │   │
│ └───────────────────────────────────────┘   │
└─────────────────────────────────────────────┘

Incluso si hay un bug en el código (CAPA 1 o 2),
la base de datos (CAPA 3) lo bloquea a nivel de SQL.
```

## Tipos de datos

```typescript
// types/index.ts (no cambió)
interface GoatModeData {
  profile: Profile
  sessions: Session[]
  challenges: Challenge[]
  achievements: Achievement[]
  version: number
}

// Se guarda como JSONB en Supabase:
user_data table:
  user_id (UUID)   → "abc-123-def..."
  data (JSONB)     → { profile: {...}, sessions: [...], ... }
  updated_at       → "2026-06-24T20:30:00Z"
```

## Flujo end-to-end: Registrar entrenamiento

```
┌─────────────────────────────────────────────────────────┐
│ 1. Usuario entra a /log/training                        │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│ 2. Rellena formulario + Click "Registrar"              │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│ 3. useGoatMode.logSession()                             │
│    • Calcula XP (mismo código que antes)               │
│    • Detects nivel up                                   │
│    • Detecta achievement unlock                        │
│    • setData() con nuevo estado                        │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│ 4. useEffect en useGoatMode (isLoaded)                 │
│    • Detecta que 'data' cambió                         │
│    • Llama writeToStorage(data)                        │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│ 5. fetch POST /api/user-data                            │
│    • Body: JSON blob completo (GoatModeData)           │
│    • Headers: Content-Type: application/json           │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│ 6. API Route: POST /api/user-data                      │
│    • Obtiene user via supabase.auth.getUser()          │
│    • Retorna 401 si no autenticado                     │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│ 7. supabase.upsert(user_data)                           │
│    {                                                    │
│      user_id: user.id,                                 │
│      data: payload,                                    │
│      updated_at: now                                   │
│    }                                                    │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│ 8. RLS Policy verifica                                  │
│    • ¿auth.uid() == user_id?                           │
│    • SÍ → INSERT/UPDATE                                │
│    • NO → 403 Forbidden                                │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│ 9. Respuesta 200 OK al navegador                       │
│    • Datos guardados en Supabase                       │
│    • Usuario ve confirmación (LevelUpModal, etc.)      │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│ 10. Usuario abre en otro dispositivo                   │
│     • GET /api/user-data                               │
│     • Mismo user_id → mismos datos                    │
│     • ✓ Sincronizado                                   │
└─────────────────────────────────────────────────────────┘
```

---

## Comparación: localStorage vs Supabase

| Aspecto | localStorage | Supabase |
|---------|--------------|----------|
| **Storage** | Browser local | Cloud (PostgreSQL) |
| **Sincronización** | ❌ No (por dispositivo) | ✅ Sí (por usuario) |
| **Autenticación** | ❌ No | ✅ Google OAuth + Sesiones |
| **Seguridad** | ❌ Cualquiera puede ver/editar | ✅ RLS por usuario |
| **Datos en múltiples devices** | ❌ No | ✅ Sí |
| **Diferente usuario misma comp** | ❌ Se ve todo | ✅ Datos aislados |
| **Capacidad** | ~10MB | 500MB (free tier) |
| **Disponibilidad** | Solo offline | Online/Offline ready |
| **Privacidad** | Local (mejor para datos muy sensibles) | Cloud (sujeto a privacidad Supabase) |

---

## Performance

- **Latency:** ~50-200ms por request (dependiendo de ubicación + internet)
- **Almacenamiento:** Un JSON blob por usuario (actualizado atómicamente)
- **Escalabilidad:** Supabase free tier: suficiente para ~100K usuarios activos
- **Caching:** Session cookies → no re-authenticate constantemente

---

## Migración futura (opcional)

Si alguna vez necesitas cambiar a otra solución:

```
localStorage
  ↓ (Import script - opcional)
Supabase (actual)
  ↓ (Si necesitaras cambiar)
Firebase Realtime DB
  ↓
MongoDB
  ↓
Tu propia API + PostgreSQL
  ↓
...
```

El almacenamiento sigue siendo el mismo JSON blob → fácil portabilidad.
