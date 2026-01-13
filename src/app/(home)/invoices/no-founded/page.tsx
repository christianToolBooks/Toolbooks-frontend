"use client";
import { Button } from "@/src/components/ui/button";
import { Plus, Users } from "lucide-react";
import Link from "next/link";

export default function NoCustomersPage() {
  return (
    <div className="@container/main px-4 lg:px-6 flex flex-col items-center justify-center h-[80vh]">
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
          <Users className="w-8 h-8 text-muted-foreground" />
        </div>

        <div className="text-center space-y-2 mb-8">
          <h3 className="text-lg font-medium text-foreground">
            You haven&#39;t created any customers yet.
          </h3>
          <p className="text-muted-foreground max-w-md">
            Create your first customer to be able to generate invoices and start
            managing your billing.
          </p>
        </div>

        <Link href="/customer/create/select-type">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create New Customer
          </Button>
        </Link>
      </div>
    </div>
  );
}
