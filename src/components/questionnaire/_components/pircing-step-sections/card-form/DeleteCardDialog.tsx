import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

interface DeleteCardDialogProps {
  isOpen: boolean;
  isDeleting: boolean;
  cardLast4: string;
  isDefault: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteCardDialog({
  isOpen,
  isDeleting,
  cardLast4,
  isDefault,
  onClose,
  onConfirm,
}: DeleteCardDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Payment Card</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Are you sure you want to delete the card ending in <span className="font-semibold">****{cardLast4}</span>?
            </p>
            {isDefault && (
              <p className="text-chart-1 font-medium">
                This is your default payment method. You&apos;ll need to select a new default card after deletion.
              </p>
            )}
            <p className="text-muted-foreground text-sm">
              This action cannot be undone.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting} className="cursor-pointer active:scale-95 transform transition-all">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isDeleting}
            className="bg-chart-1 hover:bg-chart-2 focus:ring-chart-2 active:scale-95 transform transition-all"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Card"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
