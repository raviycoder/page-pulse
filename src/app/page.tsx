import AuditForm from "@/components/audit-form";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">Page Pulse</h1>
      <p className="text-slate-500 mb-8 text-center max-w-md">
        Audit the basic SEO and page-health signals of any public URL.
      </p>
      <AuditForm />
      <p className="text-xs text-slate-400 mt-6">
        Only public HTTP/HTTPS pages can be audited.
      </p>
      <footer className="mt-16 border-t pt-6 text-center text-sm text-slate-500 w-full">
        <a
          href="https://digitalheroesco.com"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          Built for Digital Heroes Training Task
        </a>
      </footer>{" "}
    </main>
  );
}
