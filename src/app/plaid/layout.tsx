export default function PlaidLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100`}
    >
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">{children}</main>

        <footer className="border-t bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
              <span>🔒 Secure connection with 256-bit encryption</span>
              <span>•</span>
              <span>Powered by Plaid</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
