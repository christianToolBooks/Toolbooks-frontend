import { Button } from "@/src/components/ui/button";
import { Edit, Trash2, User } from "lucide-react";
import type { CreateCustomerContactInput } from "@/src/types/customer";
import { memo } from "react";

interface CustomerContactCardViewProps {
  contact: CreateCustomerContactInput;
  onEdit: () => void;
  onDelete: () => void;
  disabled: boolean;
}

function CustomerContactCardView({
  contact,
  onEdit,
  onDelete,
  disabled,
}: CustomerContactCardViewProps) {
  return (
    <div className="p-3 sm:p-4 bg-secondary/30 rounded-lg">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center gap-2">
          <div className="flex gap-2 sm:gap-4 flex-1 min-w-0">
            <User className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
            
            <div className="flex flex-col gap-2 flex-1 min-w-0 lg:hidden">
              <div className="space-y-1">
                <p className="font-medium text-sm break-words">{contact.name || "—"}</p>
                {contact.isPrimary && (
                  <span className="text-xs text-primary font-medium">Primary Contact</span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground break-all">
                {contact.email || "—"}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {contact.phone || "—"}
              </p>
              <div className="flex gap-2 text-xs sm:text-sm text-muted-foreground">
                <span>{contact.role || "—"}</span>
                {contact.role && contact.jobTitle && <span>•</span>}
                <span>{contact.jobTitle || "—"}</span>
              </div>
            </div>

            <div className="hidden lg:grid lg:grid-cols-5 gap-4 flex-1 min-w-0">
              <p className="font-medium text-sm break-words">{contact.name || "—"}</p>
              <p className="text-sm text-muted-foreground break-all">{contact.email || "—"}</p>
              <p className="text-sm text-muted-foreground">{contact.phone || "—"}</p>
              <p className="text-sm text-muted-foreground break-words">{contact.role || "—"}</p>
              <p className="text-sm text-muted-foreground break-words">{contact.jobTitle || "—"}</p>
            </div>
          </div>

          <div className="flex gap-1 sm:gap-2 flex-shrink-0">
            <Button
              onClick={onEdit}
              variant="outline"
              size="icon"
              className="h-8 w-8 sm:h-9 sm:w-9 bg-transparent"
              disabled={disabled}
            >
              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
              onClick={onDelete}
              variant="ghost"
              size="icon"
              className="h-8 w-8 sm:h-9 sm:w-9 text-red-500 hover:text-red-700 hover:bg-red-50"
              disabled={disabled}
            >
              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>

        {contact.isPrimary && (
          <div className="hidden lg:block text-xs text-primary font-medium ml-8">
            Primary Contact
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(CustomerContactCardView);