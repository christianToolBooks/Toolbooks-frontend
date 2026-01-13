
// app/(home)/invoices/new/page.tsx
import { InvoiceForm } from "../_components/InvoiceForm";

export const metadata = {
  title: "New Invoice",
};

export default async function NewInvoicePage() {
  return (
    <>
    <div className="@container/main px-4 lg:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-chart-1 dark:text-gray-100">
          New Invoice
        </h1>

        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Complete the information to generate a new invoice.
        </p>
      </header>

      {/* Renderizamos el Client Component con los datos iniciales */}
      <InvoiceForm/>
    </div>

    </>
  );
}
