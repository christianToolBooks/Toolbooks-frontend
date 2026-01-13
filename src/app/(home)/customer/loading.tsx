import { Skeleton } from "@/src/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/src/components/ui/table";

export default function CustomerPageLoader() {
  return (
    <div className="@container/main px-4 lg:px-6">
      {/* Header section */}
      <div className="flex max-md:flex-col gap-10 mb-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" /> {/* Title */}
          <Skeleton className="h-4 w-72" /> {/* Subtitle */}
        </div>
      </div>

      {/* Button & Section Title */}
      <div className="flex justify-between mb-4">
        <Skeleton className="h-6 w-32" /> {/* "Customers List" */}
        <Skeleton className="h-10 w-32 rounded-md" /> {/* Button */}
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {[...Array(6)].map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-5 w-24" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {[...Array(7)].map((_, i) => (
              <TableRow key={i}>
                {[...Array(6)].map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
