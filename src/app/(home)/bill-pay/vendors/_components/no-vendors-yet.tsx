"use client";
import { Button } from "@/src/components/ui/button";
import { Plus, Users } from "lucide-react";
import Link from "next/link";
import { JSX } from "react";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useGetVendors } from "../_hooks/getVendorsHook";

export default function NoVendorsPage() {
const {vendors, loading} = useGetVendors();

//   if (loading) {
//     return (
//       <div className="@container/main px-4 lg:px-6 flex flex-col items-center justify-center h-[80vh]">
//         <div className="flex flex-col items-center justify-center py-16 px-4">
//           <Skeleton className="w-16 h-16 rounded-full mb-6" />
//           <div className="text-center space-y-2 mb-8">
//             <Skeleton className="h-6 w-48 mx-auto" />
//             <Skeleton className="h-4 w-72 mx-auto" />
//           </div>
//           <Skeleton className="h-10 w-40 rounded-lg" />
//         </div>
//       </div>
//     );
//   }

  let title = "";
  let description = "";
  let action: JSX.Element | null = null;

  if (vendors.length === 0) {
    title = "You haven’t created any vendors yet.";
    description =
      "Create your first vendor to be able to generate invoices and start managing your billing.";
    action = (
      <Link href="/bill-pay/vendors/create/select-type">
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create New Vendor
        </Button>
      </Link>
    );
  } 

  return (
    <div className="@container/main px-4 lg:px-6 flex flex-col items-center justify-center h-[80vh]">
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
          <Users className="w-8 h-8 text-muted-foreground" />
        </div>

        <div className="text-center space-y-2 mb-8">
          <h3 className="text-lg font-medium text-foreground">{title}</h3>
          <p className="text-muted-foreground max-w-md">{description}</p>
        </div>

        {action}
      </div>
    </div>
  );
}
