import { serve } from "bun";
import { IDaCte } from "src/application/modules/interfaces/IDaCte";
import { INfe } from "src/application/modules/interfaces/INfe";
import { JsonToCTE } from "src/application/modules/XMLtoPDF/UseCase/json-to-cte-use-case";
import { JsonToDanfe } from "src/application/modules/XMLtoPDF/UseCase/json-to-danfe-use-case";
import { xmlToJson } from "src/application/modules/XMLtoPDF/UseCase/xml-to-json";

// CORS allowed origins from environment variable
// Use comma/space/newline separated list in ALLOWED_ORIGINS or CORS_ALLOWED_ORIGINS
const defaultAllowedOrigins = new Set<string>([
  "https://lovable.dev",
  "https://nferiza.app.lmsis.com.br",
  "https://id-preview--fe732262-5d89-40d7-8962-a6ba74a3dc36.lovable.app",
]);

const envOriginsRaw = (Bun.env.ALLOWED_ORIGINS || Bun.env.CORS_ALLOWED_ORIGINS || "").trim();
const envOrigins = envOriginsRaw
  ? envOriginsRaw.split(/[\s,]+/).map((s) => s.trim()).filter(Boolean)
  : [] as string[];

const allowedOrigins = envOrigins.length > 0 ? new Set<string>(envOrigins) : defaultAllowedOrigins;

console.log(`Server running at http://localhost:3000`);
console.log(`CORS allowed origins: ${Array.from(allowedOrigins).join(", ")}`);

serve({
  async fetch(req: Request) {
    const url = new URL(req.url);

    // CORS setup (allowedOrigins defined from environment at startup)

    const origin = req.headers.get("origin") || "";
    const isAllowedOrigin = allowedOrigins.has(origin);
    const corsHeaders: HeadersInit = {
      "Vary": "Origin",
      ...(isAllowedOrigin ? { "Access-Control-Allow-Origin": origin } : {}),
      "Access-Control-Allow-Credentials": "true",
    };

    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          ...corsHeaders,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": req.headers.get("access-control-request-headers") || "Content-Type",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    if (url.pathname === "/" && req.method === "POST") {
      try {
        const xml = await req.text();

        // check if body is a text
        if (typeof xml !== "string" || xml.length === 0)
          return new Response("Bad Request", { status: 400, headers: { ...corsHeaders, "content-type": "text/plain" } });

        // check if xml contains "http://www.portalfiscal.inf.br/nfe"
        const isDanfe = xml.includes("http://www.portalfiscal.inf.br/nfe");
        const isDacte = xml.includes("http://www.portalfiscal.inf.br/cte");

        if (!isDanfe && !isDacte)
          return new Response("Invalid XML", { status: 400, headers: { ...corsHeaders, "content-type": "text/plain" } });

        const json = await xmlToJson(xml);

        const pdfBase64 = isDanfe ? await new JsonToDanfe().jsonToPDF(json as INfe) : await new JsonToCTE().jsonToPDF(json as IDaCte);

        return new Response(JSON.stringify({ pdfBase64 }), {
          headers: { "content-type": "application/json", ...corsHeaders },
        });
      } catch (error) {
        console.log(error);

        return new Response(
          error instanceof Error ? JSON.stringify({ error: error.message }) : "Internal Server Error",
          { status: 500, headers: { ...corsHeaders, "content-type": "application/json" } }
        );
      }
    }

    // Return 404 for all other requests
    return new Response("Not Found", { status: 404, headers: { ...corsHeaders, "content-type": "text/plain" } });
  },
});
