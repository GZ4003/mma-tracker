'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Mail, Edit2, Save, X, Trash2, AlertCircle } from 'lucide-react';

interface UserProfile {
  name?: string;
  totalXP?: number;
  level?: number;
  streak?: number;
  joinedAt?: string;
}

interface AuthUser {
  id: string;
  email?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (!authUser) {
          router.push('/login');
          return;
        }

        setUser(authUser as AuthUser);

        const res = await fetch('/api/user-data');
        if (res.ok) {
          const data = await res.json();
          setProfile((data.profile || {}) as UserProfile);
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError(null);

      const res = await fetch('/api/user-data');
      const data = await res.json();

      const updatedData = {
        ...data,
        profile: {
          ...data.profile,
          name: profile?.name || '',
        },
      };

      const updateRes = await fetch('/api/user-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!updateRes.ok) {
        throw new Error('Error saving profile');
      }

      setIsEditing(false);
    } catch (err) {
      setError('Error al guardar el perfil');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!isDeleting) {
      setIsDeleting(true);
      return;
    }

    try {
      setSaving(true);
      setError(null);

      if (!user?.id) {
        throw new Error('No user found');
      }

      await supabase.auth.admin.deleteUser(user.id);
      await supabase.auth.signOut();
      router.push('/login');
    } catch (err) {
      console.error('Error deleting account:', err);
      setError('Error al eliminar la cuenta. Contacta con soporte.');
      setIsDeleting(false);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-display text-blue-600 dark:text-blue-400 tracking-wider">
          MI PERFIL
        </h1>
        <p className="text-muted-foreground text-sm mt-2">
          Administra tu información personal
        </p>
      </div>

      {error && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex gap-3 text-sm text-blue-600 dark:text-blue-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Email Card */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <div>
            <p className="text-sm text-muted-foreground">Correo electrónico</p>
            <p className="text-lg font-display text-foreground">{user?.email}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Verifica tu correo en Google si necesitas cambiar tu cuenta
        </p>
      </div>

      {/* Profile Edit Card */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-display text-foreground">Información Personal</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg transition-colors text-sm"
            >
              <Edit2 className="w-4 h-4" />
              Editar
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Nombre de peleador</label>
              <input
                type="text"
                value={profile?.name || ''}
                onChange={(e) => setProfile({ ...(profile || {}), name: e.target.value } as UserProfile)}
                placeholder="Tu nombre"
                className="w-full mt-2 px-4 py-2 bg-muted/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium py-2 rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 flex items-center justify-center gap-2 bg-muted hover:bg-muted/80 text-foreground font-medium py-2 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 py-4">
            <div>
              <p className="text-sm text-muted-foreground">Nombre de peleador</p>
              <p className="text-lg font-display text-foreground">{profile?.name || 'No configurado'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Account Info */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-display text-foreground">Información de la Cuenta</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Miembro desde</p>
            <p className="text-sm font-medium text-foreground">
              {profile?.joinedAt ? new Date(profile.joinedAt).toLocaleDateString('es-ES') : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Nivel actual</p>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {profile?.level || 0}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Experiencia total</p>
            <p className="text-sm font-medium text-foreground">{profile?.totalXP || 0} XP</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Racha actual</p>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {profile?.streak || 0} días
            </p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-card border border-blue-500/20 rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-display text-blue-600 dark:text-blue-400">Zona de Peligro</h2>
        <p className="text-sm text-muted-foreground">
          Eliminar tu cuenta es permanente y no se puede deshacer. Se borrarán todos tus datos.
        </p>

        {!isDeleting ? (
          <button
            onClick={() => setIsDeleting(true)}
            className="w-full flex items-center justify-center gap-2 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-600 dark:text-blue-400 font-medium py-3 rounded-lg transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            Eliminar mi cuenta
          </button>
        ) : (
          <div className="space-y-3 p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
            <p className="text-sm font-medium text-foreground">¿Estás seguro?</p>
            <p className="text-xs text-muted-foreground">
              Esta acción eliminará permanentemente tu cuenta y todos tus datos. Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={saving}
                className="flex-1 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-700/50 text-white font-medium py-2 rounded-lg transition-colors text-sm"
              >
                {saving ? 'Eliminando...' : 'Sí, eliminar para siempre'}
              </button>
              <button
                onClick={() => setIsDeleting(false)}
                className="flex-1 bg-muted hover:bg-muted/80 text-foreground font-medium py-2 rounded-lg transition-colors text-sm"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
