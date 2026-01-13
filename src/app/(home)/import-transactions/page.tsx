import ImportFlowManager from './_components/ImportFlowManager';

export default async function ImportTransactionsPage() {
  // Fetch initial data on the server
  // These promises will run in parallel
 
  return (
    <div className="@container/main px-4 lg:px-6">
      <h1 className="text-3xl font-bold mb-6">
        Import Transactions from Bank Statement
      </h1>

      <ImportFlowManager/>

      <div className="mt-8 p-4 border rounded-md text-sm text-muted-foreground">
        <h3 className="font-semibold mb-2">Accepted Formats: </h3>

        <p>
          Currently, only bank statements in structured PDF format are accepted.
          Please ensure the text in your PDF is selectable and not a scanned
          image. (Max. 5 MB)
        </p>
      </div>
    </div>
  );
}
