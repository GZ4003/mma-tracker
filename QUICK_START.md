# Quick Start: Desde cero a producción

## Paso 1: Supabase (5 minutos)

```bash
# Ve a supabase.com → Sign up → Crea proyecto
# Copiar desde Settings → API:
NEXT_PUBLIC_SUPABASE_URL=paste_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_key_here

# Ve a SQL Editor → copia y ejecuta esto:
CREATE TABLE user_data (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own data"
  ON user_data FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

## Paso 2: Google OAuth (3 minutos)

```bash
# Supabase → Authentication → Providers → Google → Enable

# Google Cloud Console → Credentials → Create OAuth Client ID
# Authorized Redirect URIs:
https://your-project.supabase.co/auth/v1/callback

# Copiar Client ID y Secret → Supabase → Google Provider → Save
```

## Paso 3: Proyecto local (1 minuto)

```bash
# Crear .env.local con las credenciales:
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
EOF

# Instalar dependencias (ya instaladas si seguiste antes)
npm install @supabase/supabase-js @supabase/ssr

# Probar
npm run dev
# Abre http://localhost:3000 → Login con Google → ✓
```

## Paso 4: Deploy en Vercel (2 minutos)

```bash
# En Vercel dashboard → Project Settings → Environment Variables
# Agregar:
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# En Google Cloud → Credentials → OAuth Client → Authorized redirect URIs
# Agregar:
https://tu-app.vercel.app/auth/callback

# Push y deploy automáticamente
git push origin main
```

---

## Testing checklist

- [ ] `npm run build` pasa sin errores
- [ ] `npm run dev` → redirige a `/login`
- [ ] Login con Google funciona
- [ ] Registra un entrenamiento → datos aparecen en Supabase
- [ ] Recarga página → datos persisten
- [ ] Abre en incógnito con misma Gmail → mismos datos
- [ ] Login con otra Gmail → datos nuevos/separados
- [ ] Deploy en Vercel funciona
- [ ] Login en Vercel con Google funciona
- [ ] Datos persisten en móvil con misma Gmail

---

## Arquitectura visual

```
┌─────────────────────────────────────────────────────┐
│                   NAVEGADOR                          │
│  ┌────────────────────────────────────────────────┐ │
│  │         Next.js App (App Router)               │ │
│  │                                                 │ │
│  │  /login        →  Botón "Google OAuth"         │ │
│  │  /              →  Dashboard                    │ │
│  │  /log/training  →  Registrar entrenamiento    │ │
│  │  ...            →  Resto de la app            │ │
│  └────────────────────────────────────────────────┘ │
│                         │                           │
│                   fetch API calls                   │
│                         │                           │
└─────────────────────────┼───────────────────────────┘
                          │
        ┌─────────────────┴─────────────────┐
        │                                    │
   ┌────▼──────────┐            ┌──────────▼────────┐
   │ /api/user-data│ (GET/POST) │  MIDDLEWARE.ts    │
   │ (route.ts)    │            │ (proteger rutas)  │
   │               │            │                   │
   │ Lee/escribe   │            │ Valida sesión     │
   │ datos en DB   │            │ Redirige si no    │
   └────┬──────────┘            │ autenticado       │
        │                       │                   │
        │                       └──────────────────┬─
        │                                          │
        │    ┌──────────────────────────────────┐  │
        │    │      SUPABASE                     │  │
        │    │  ┌────────────────────────────┐  │  │
        │    │  │  auth.users (Google OAuth) │  │  │
        │    │  │                            │  │  │
        │    │  │ • Email                    │  │  │
        │    │  │ • ID único (uuid)          │  │  │
        │    │  │ • Sesión HTTP-only cookie  │  │  │
        │    │  └────────────────────────────┘  │  │
        │    │                                   │  │
        │    │  ┌────────────────────────────┐  │  │
        │    │  │  user_data table (JSONB)   │  │  │
        │    │  │                            │  │  │
        │    │  │ user_id | data (JSON blob)│  │  │
        │    │  │  uuid   | { profile,      │  │  │
        │    │  │         |   sessions,     │  │  │
        │    │  │         |   achievements} │  │  │
        │    │  │                            │  │  │
        │    │  │ RLS: cada usuario solo     │  │  │
        │    │  │      ve sus propios datos  │  │  │
        │    │  └────────────────────────────┘  │  │
        │    └────────────────────────────────┘  │  │
        │                                        │  │
        └────────────────────────────────────────┘  │
                                                    │
                    Google OAuth
                         │
         ┌───────────────┴───────────────┐
         │                               │
    ┌────▼──────────┐          ┌────────▼────────┐
    │ Google Cloud  │          │ /auth/callback  │
    │ Console       │          │ (route.ts)      │
    │               │          │                 │
    │ Client ID     │          │ Recibe código   │
    │ Client Secret │          │ Intercambia por │
    │               │          │ sesión Supabase │
    └───────────────┘          └─────────────────┘
```

---

## Seguridad por capas

```
┌─────────────────────────────────────────────────────────┐
│ 1. Middleware (Next.js)                                 │
│    └─ Redirige a /login si no hay sesión                │
├─────────────────────────────────────────────────────────┤
│ 2. Supabase Auth (Session)                              │
│    └─ Valida que el usuario está autenticado            │
├─────────────────────────────────────────────────────────┤
│ 3. Row Level Security (Base de datos)                   │
│    └─ Bloquea acceso a datos de otros usuarios          │
└─────────────────────────────────────────────────────────┘

Incluso si hay un bug en el código, la base de datos no permite
acceso a datos que no son propios (RLS lo bloquea a nivel de query).
```

---

## Diferencia clave: localStorage vs Supabase

### localStorage (ANTES)
```
Tu computadora:  localStorage → data_tuyos
Tu teléfono:     localStorage → (vacío, datos nuevos)
Amigo:           localStorage → (ve tus datos si usa la misma comp)
```

### Supabase (DESPUÉS)
```
Tu cuenta Google:  user_data table → row con user_id=tu_id → data_tuyos
Tu teléfono:       user_data table → row con user_id=tu_id → data_tuyos (sincronizado)
Amigo Gmail:       user_data table → row con user_id=su_id → data_suyos (separado, garantizado por RLS)
```

---

## Troubleshooting rápido

| Error | Causa | Solución |
|-------|-------|----------|
| "Unauthorized" login | Credenciales mal configuradas | Verifica NEXT_PUBLIC_SUPABASE_* en .env.local |
| "Invalid credentials" Google | Google Client ID/Secret incorrecto | Recopia desde Google Cloud Console |
| Datos no se guardan | RLS policy no existe | Ejecuta SQL de Paso 1 en Supabase |
| No redirige a /login | Middleware no activado | Verifica que middleware.ts existe en raíz |
| Funciona en dev, no en prod | Env vars no en Vercel | Configura variables en Vercel dashboard |

