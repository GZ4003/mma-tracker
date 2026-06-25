# Setup: Autenticación con Google + Sincronización de datos

Este documento explica cómo configurar la autenticación y persistencia de datos en Supabase.

## 1. Crear un proyecto en Supabase (5 minutos)

1. Ve a [supabase.com](https://supabase.com)
2. Haz clic en "Sign up" (gratis, sin tarjeta de crédito requerida)
3. Crea una organización y un nuevo proyecto
   - Name: `goat-mode` (o el que prefieras)
   - Database password: Guárdalo en un lugar seguro
   - Region: Elige la más cercana a ti
4. Espera a que se cree el proyecto (1-2 minutos)

## 2. Crear la tabla en Supabase

1. En el dashboard, ve a **SQL Editor** (icono de SQL en la barra lateral)
2. Haz clic en **+ New query**
3. Copia y pega este código:

```sql
CREATE TABLE user_data (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own data"
  ON user_data FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

4. Haz clic en **Run** (o Cmd+Enter)
5. Deberías ver "Success"

## 3. Configurar Google OAuth

1. Ve a **Authentication → Providers** en el sidebar
2. Busca **Google** y haz clic en él
3. Haz clic en **Enable**

Ahora necesitas credenciales de Google:

### Obtener credenciales de Google

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a **APIs & Services → Credentials**
4. Haz clic en **+ Create Credentials → OAuth 2.0 Client ID**
5. Elige **Web application**
6. En **Authorized redirect URIs**, agrega:
   - `https://your-project.supabase.co/auth/v1/callback`
   - Reemplaza `your-project` con el nombre de tu proyecto Supabase
7. Copia el **Client ID** y **Client Secret**

### Pegar en Supabase

1. Vuelve a Supabase → **Authentication → Providers → Google**
2. Pega el **Client ID** y **Client Secret** que copiaste
3. Haz clic en **Save**

## 4. Obtener las variables de entorno

1. Ve a **Settings → API** en Supabase
2. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 5. Configurar el proyecto local

1. Crea un archivo `.env.local` en la raíz:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

2. Reemplaza los valores con los que copiaste de Supabase

## 6. Probar localmente

```bash
npm run dev
```

- Abre `http://localhost:3000`
- Deberías ver la página de login
- Haz clic en **"Iniciar sesión con Google"**
- Después de autenticarte, deberías ver el dashboard
- Intenta registrar un entrenamiento
- Ve a Supabase → **Table Editor → user_data** y deberías ver tus datos almacenados

## 7. Deploy en Vercel

1. Push tu código a GitHub
2. En Vercel, configura las variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Actualiza la URL de redirect de Google en Google Cloud Console:
   - Agrega `https://tu-app.vercel.app/auth/callback`

## Verificación final

✅ Login con Google en desarrollo  
✅ Login con Google en producción  
✅ Datos se guardan en Supabase  
✅ Datos persisten en diferentes dispositivos (mismo usuario de Google)  
✅ Diferentes usuarios de Google ven datos separados  

---

## Troubleshooting

**"Unauthorized" al intentar login**
- Verifica que `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` están correctamente configurados

**"Invalid credentials" de Google**
- Verifica que el Client ID y Client Secret están correctamente pegados en Supabase
- Verifica que las Authorized redirect URIs incluyen `https://your-project.supabase.co/auth/v1/callback`

**Los datos no se guardan**
- Verifica en Supabase → **Table Editor** que existe la tabla `user_data`
- Verifica que Row Level Security está habilitado
- Revisa la consola del navegador (F12) para ver errores

**"Datos de usuario se mezclan"**
- Esto no debería pasar — Row Level Security en la base de datos lo previene
- Si sucede, revisa que el RLS policy está correctamente aplicado

---

## Notas

- Los datos existentes en localStorage local **NO se importan automáticamente**. Puedes hacerlo manualmente después si lo necesitas.
- Supabase free tier incluye: 500MB de almacenamiento, auth ilimitada, suficiente para uso personal
- Las sesiones se guardan en cookies HTTP-only y se refrescan automáticamente
- Los datos se sincronizan automáticamente entre dispositivos si usas la misma cuenta de Google
