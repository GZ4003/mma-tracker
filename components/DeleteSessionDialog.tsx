"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import type { Session } from "@/types";

interface DeleteSessionDialogProps {
  session: Session | null;
  onClose: () => void;
  onConfirm: (sessionId: string) => void;
}

export default function DeleteSessionDialog({
  session,
  onClose,
  onConfirm,
}: DeleteSessionDialogProps) {
  const handleConfirm = () => {
    if (!session) return;
    onConfirm(session.id);
    onClose();
  };

  return (
    <AlertDialog open={!!session} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar esta sesión?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleConfirm}
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
