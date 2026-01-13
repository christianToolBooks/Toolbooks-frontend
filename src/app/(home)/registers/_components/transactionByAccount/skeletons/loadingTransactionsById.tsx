import { Select, SelectContent, SelectTrigger } from "@/src/components/ui/select";
import { Skeleton } from "@/src/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";

export default function LoadingTransactionsById() {
  return (
    <div className="@container/main px-4 lg:px-6">
      <div className="mb-6">
        <div className="flex flex-wrap items-end gap-4 p-4 border rounded-lg bg-muted/20">
      <div className="grid gap-1.5">
        <Skeleton className="h-5 w-24" />
      </div>
      
      <div className="grid gap-1.5">
        <Skeleton className="h-5 w-24" />
        <Select>
          <SelectTrigger className="w-[120px]">
            <Skeleton className="h-5 w-24" />
          </SelectTrigger>
          <SelectContent>
            <Skeleton className="h-5 w-24" />
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-1.5">
        <Skeleton className="h-5 w-24" />
        <Select >
          <SelectTrigger className="w-[150px]">
            <Skeleton className="h-5 w-24" />
          </SelectTrigger>
          <SelectContent>
            <Skeleton className="h-5 w-24" />
          </SelectContent>
        </Select>
      </div>
      
    </div>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-5 w-24" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-5 w-32" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-5 w-20" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-5 w-20" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-5 w-20" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-5 w-24" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-5 w-28" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-5 w-16" />
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {[...Array(8)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
