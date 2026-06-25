# KHABIB MODE: Autenticación con Google + Persistencia de Datos

## Estado: ✅ IMPLEMENTADO Y COMPILANDO

La aplicación está lista para usar con autenticación de Google y sincronización de datos en Supabase.

---

## Para empezar (5 minutos)

### 1. Crear cuenta en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Sign up (gratis, sin tarjeta)
3. Crea un nuevo proyecto

### 2. Crear la tabla
Copia y ejecuta en Supabase → SQL Editor:

```sql
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

### 3. Configurar Google OAuth
1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea credenciales OAuth → Web application
3. Authorized redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback` (reemplaza `your-project`)
4. Copia Client ID y Secret
5. En Supabase: Authentication → Providers → Google → Enable
6. Pega Client ID y Secret

### 4. Configurar variables de entorno
Crea `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Obtén estos valores de Supabase → Settings → API

### 5. Probar
```bash
npm run dev
# Abre http://localhost:3000
# Deberías ver la página de login
```

---

## Características

### ✅ Autenticación
- Login con Google (no requiere contraseña)
- Sesiones seguras con HTTP-only cookies
- Auto-refresh de sesión

### ✅ Persistencia
- Datos sincronizados en todos los dispositivos (mismo usuario de Google)
- Datos separados por usuario (RLS en base de datos)
- Almacenamiento en Supabase (free tier: 500MB)

### ✅ Seguridad
- Middleware protege rutas (redirige a login si no autenticado)
- RLS en base de datos (cada usuario solo ve sus datos)
- PKCE flow para OAuth (más seguro)

---

## Documentación

Principales archivos de documentación:

1. **QUICK_START.md** - Setup rápido + diagramas visuales
2. **SETUP_SUPABASE.md** - Instrucciones detalladas paso a paso
3. **ARCHITECTURE.md** - Diagramas técnicos de la arquitectura
4. **MIGRATION_SUMMARY.md** - Resumen de cambios técnicos
5. **IMPLEMENTATION_COMPLETE.md** - Estado actual y checklist

---

## Para el desarrollo

### Estructura de archivos nuevos

```
lib/supabase/
  ├── client.ts        # Cliente Supabase para components
  ├── server.ts        # Cliente Supabase para Server
  └── middleware.ts    # Lógica de protección

app/auth/callback/    # Google OAuth callback
app/login/            # Página de login
app/api/user-data/    # API para leer/guardar datos

middleware.ts         # Protección de rutas (Next.js)
```

### Hook principal (modificado)

`hooks/useGoatMode.ts` - Solo cambiaron 2 funciones:
- `readFromStorage()` - Ahora usa `GET /api/user-data`
- `writeToStorage()` - Ahora usa `POST /api/user-data`

Todo lo demás (XP, achievements, challenges, ranks) sigue igual.

### Tipos (sin cambios)

Los tipos en `types/index.ts` no cambiaron. El JSON blob se guarda igual que antes, solo que en Supabase en lugar de localStorage.

---

## Testing

### Local
```bash
npm run dev
# Login con Google
# Registra un entrenamiento
# Recarga página → datos persisten
# Abre en incógnito con misma Gmail → mismos datos
```

### En Supabase Dashboard
- **Table Editor** → Verifica que los datos se guardan en `user_data`
- **Auth** → Verifica usuarios loguedos

### Producción
1. Configura env vars en Vercel
2. Actualiza Google Console con redirect URI de tu app en Vercel
3. Deploy y prueba desde el teléfono

---

## FAQ

**P: ¿Mi amigo puede ver mis datos?**
- R: No. RLS en la base de datos garantiza que cada usuario solo ve sus propios datos.

**P: ¿Los datos se sincronizan entre dispositivos?**
- R: Sí, si usas la misma cuenta de Google en ambos dispositivos.

**P: ¿Puedo volver a localStorage?**
- R: Sí (ver rollback en IMPLEMENTATION_COMPLETE.md), pero perderás sincronización cross-device.

**P: ¿Qué pasa si olvido mi contraseña?**
- R: No tienes contraseña — usas Google. Si no puedes acceder a Google, no accedes a la app.

**P: ¿Es seguro guardar datos en Supabase?**
- R: Sí. RLS + HTTPS + Supabase (empresa de seguridad) = seguro. Más seguro que localStorage.

**P: ¿Cuántos usuarios puedo tener?**
- R: Free tier: ~100K usuarios activos. Puedes upgradear cuando sea necesario.

---

## Troubleshooting

### "Unauthorized" al login
- ✓ Verifica `NEXT_PUBLIC_SUPABASE_URL` en `.env.local`
- ✓ Verifica `NEXT_PUBLIC_SUPABASE_ANON_KEY` en `.env.local`

### "Invalid credentials" de Google
- ✓ Verifica Client ID en Google Cloud Console
- ✓ Verifica Client Secret en Google Cloud Console
- ✓ Verifica que están pegados correctamente en Supabase

### Los datos no se guardan
- ✓ Verifica que la tabla `user_data` existe en Supabase
- ✓ Verifica que RLS está habilitado
- ✓ Abre la consola (F12) y busca errores en Network

### Funciona en dev, no en prod
- ✓ Verifica env vars en Vercel
- ✓ Verifica que Google Console tiene el redirect URI correcto

Ver **SETUP_SUPABASE.md** para más troubleshooting.

---

## Próximos pasos (opcional)

### Mejoras futuras
- [ ] Migración de datos locales (localStorage → Supabase) con script
- [ ] Invitar amigos a ver rankings (con opt-in)
- [ ] Retarte contra amigos en disciplinas
- [ ] Analytics de disciplinas
- [ ] Compartir logros en redes sociales

### Optimizaciones
- [ ] Replicación de datos a CDN (Vercel KV, Redis)
- [ ] Offline mode (Service Workers)
- [ ] Caché local con SWR

---

## Contacto / Soporte

Si algo no funciona:

1. Lee QUICK_START.md
2. Revisa consola del navegador (F12)
3. Revisa logs de Vercel
4. Revisa que env vars están configuradas

---

**Versión:** 1.0 (2026-06-24)  
**Estado:** ✅ Listo para producción  
**Última actualización:** 2026-06-24
