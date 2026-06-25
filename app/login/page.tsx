'use client';

import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signInError) {
        setError(signInError.message);
      }
    } catch (err) {
      setError('Error al iniciar sesión. Intenta de nuevo.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-display text-blue-600 dark:text-blue-400 tracking-wider mb-2">
            KHABIB MODE
          </h1>
          <p className="text-muted-foreground text-sm tracking-widest">
            Rastreador de entrenamientos MMA
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-card border border-border rounded-lg p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-display text-foreground tracking-wide">
              Inicia sesión
            </h2>
            <p className="text-sm text-muted-foreground">
              Accede con tu cuenta de Google para sincronizar tus datos
            </p>
          </div>

          {error && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3 text-sm text-blue-600 dark:text-blue-400">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-display py-3 px-4 rounded-lg transition-colors duration-200 tracking-wider font-bold"
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión con Google'}
          </button>

          <div className="text-xs text-muted-foreground text-center">
            <p>
              Al iniciar sesión, aceptas nuestros{' '}
              <span className="text-blue-600 dark:text-blue-400">términos de servicio</span>
            </p>
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-12 text-center text-xs text-muted-foreground space-y-2">
          <p>🔒 Tus datos se sincronizarán en todos tus dispositivos</p>
          <p>👥 Cada cuenta de Google tiene sus propios datos separados</p>
        </div>
      </div>
    </div>
  );
}
