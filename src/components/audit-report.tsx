export interface AuditData {
  url: string;
  statusCode: number;
  responseTimeMs: number;
  title: string;
  metaDescription: string;
  h1Count: number;
  imagesMissingAlt: number;
  wordCount: number;
}

function statusColor(status: number) {
  if (status >= 200 && status < 300) return "text-green-600";
  if (status >= 300 && status < 500) return "text-yellow-600";
  return "text-red-600";
}

export default function AuditReport({ data }: { data: AuditData }) {
  return (
    <div className="mt-6 border rounded-xl p-6 grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm text-slate-500">HTTP Status</p>
        <p className={`text-lg font-semibold ${statusColor(data.statusCode)}`}>
          {data.statusCode}
        </p>
      </div>

      <div>
        <p className="text-sm text-slate-500">Response Time</p>
        <p className="text-lg font-semibold">{data.responseTimeMs} ms</p>
      </div>

      <div className="col-span-2">
        <p className="text-sm text-slate-500">Page Title</p>
        <p className="font-medium">{data.title || "—"}</p>
      </div>

      <div className="col-span-2">
        <p className="text-sm text-slate-500">Meta Description</p>
        <p className="font-medium">{data.metaDescription || "—"}</p>
      </div>

      <div>
        <p className="text-sm text-slate-500">H1 Count</p>
        <p className="text-lg font-semibold">{data.h1Count}</p>
      </div>

      <div>
        <p className="text-sm text-slate-500">Images Missing Alt</p>
        <p className="text-lg font-semibold">{data.imagesMissingAlt}</p>
      </div>

      <div className="col-span-2">
        <p className="text-sm text-slate-500">Approx. Word Count</p>
        <p className="text-lg font-semibold">{data.wordCount}</p>
      </div>
    </div>
  );
}