import { Skeleton } from '@/src/components/ui/skeleton';
import { CardContent } from '@/src/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/src/components/ui/table';

export default function ChartOfAccountsLoading() {
  return (
    <div className="@container/main px-4 lg:px-6">
      <CardContent className="p-1">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="px-10 py-7 rounded-md">
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
          </div>
        </div>

        {/* Main Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2">
            <div className="rounded-lg border shadow-sm bg-gray-50">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-200">
                    {/* Account Name */}
                    <TableHead className="font-semibold text-gray-700">
                      <Skeleton className="h-5 w-32" />
                    </TableHead>
                    {/* Type */}
                    <TableHead className="font-semibold text-gray-700">
                      <Skeleton className="h-5 w-16" />
                    </TableHead>
                    {/* Normal Balance */}
                    <TableHead className="font-semibold text-gray-700">
                      <Skeleton className="h-5 w-28" />
                    </TableHead>
                    {/* Status */}
                    <TableHead className="font-semibold text-gray-700">
                      <Skeleton className="h-5 w-16" />
                    </TableHead>
                    {/* Business Type */}
                    <TableHead className="font-semibold text-gray-700">
                      <Skeleton className="h-5 w-24" />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(13)].map((_, i) => (
                    <TableRow key={i} className="hover:bg-gray-100">
                      <TableCell>
                        <Skeleton className="h-5 w-full max-w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-full max-w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-full max-w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-full max-w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-full max-w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-full max-w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-full max-w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-full max-w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-full max-w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-full max-w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-16 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-full max-w-28" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          <Skeleton className="h-4 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </CardContent>
    </div>
  );
}
