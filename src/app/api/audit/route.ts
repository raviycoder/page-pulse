import { NextRequest } from "next/server";
import { validateUrl } from "@/lib/validation";
import { parseHtml } from "@/lib/audit";

export async function POST(req: NextRequest) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return Response.json(
      {
        success: false,
        error: {
          code: "invalid_body",
          message: "Request body must be valid JSON.",
        },
      },
      { status: 400 },
    );
  }

  const target = (body as { url: unknown })?.url;
  const validation = validateUrl(target);

  if (!validation.valid) {
    return Response.json(
      {
        success: false,
        error: { code: "invalid_url", message: validation.error },
      },
      { status: 400 },
    );
  }

  const url = validation.url;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const startTime = performance.now();

    const response = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "PagePulse/1.0" },
    });

    const responseTimeMs = Math.round(performance.now() - startTime);
    const contentType = response.headers.get("content-type") ?? "";

    if (!contentType.includes("text/html")) {
      return Response.json(
        {
          success: false,
          error: {
            code: "non_html_response",
            message: "This URL did not return an HTML page.",
          },
        },
        { status: 422 },
      );
    }

    const html = await response.text();
    const report = parseHtml(html);

    return Response.json({
      success: true,
      data: {
        url,
        statusCode: response.status,
        responseTimeMs,
        ...report,
      },
    });
  } catch (error) {
    const isAbort = error instanceof Error && error.name === "AbortError";

    return Response.json(
      {
        success: false,
        error: isAbort
          ? {
              code: "fetch_timeout",
              message: "The website took too long to respond.",
            }
          : {
              code: "fetch_failed",
              message: "Could not reach the provided URL",
            },
      },
      { status: isAbort ? 408 : 502 },
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
