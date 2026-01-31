export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-8 text-4xl font-bold text-emerald-500">Helm</div>
      {children}
    </div>
  );
}
