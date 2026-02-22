export default function register(api) {
  const config = api.config?.plugins?.entries?.["bocha-search"]?.config ?? {};
  const apiKey = config.apiKey || process.env.BOCHA_API_KEY;

  if (!apiKey) {
    api.logger?.warn?.("bocha-search: no API key configured, skipping");
    return;
  }

  api.registerTool({
    name: "bocha_web_search",
    description:
      "Search the web using Bocha Search API. Returns titles, URLs, snippets and summaries. Use this when you need real-time internet information.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query",
        },
        count: {
          type: "number",
          description: "Number of results (1-20, default 5)",
        },
        freshness: {
          type: "string",
          description:
            "Time filter: oneDay, oneWeek, oneMonth, oneYear, or date range like 2024-01-01..2024-12-31",
        },
        summary: {
          type: "boolean",
          description: "Include AI summaries in results (default true)",
        },
      },
      required: ["query"],
    },
    async execute(_id, params) {
      const body = {
        query: params.query,
        count: params.count ?? 5,
        summary: params.summary ?? true,
      };
      if (params.freshness) body.freshness = params.freshness;

      const res = await fetch("https://api.bochaai.com/v1/web-search", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errText = await res.text();
        return {
          content: [
            { type: "text", text: `Bocha search error (${res.status}): ${errText}` },
          ],
        };
      }

      const json = await res.json();
      const data = json?.data ?? json;
      const pages = data?.webPages?.value ?? [];

      if (pages.length === 0) {
        return {
          content: [{ type: "text", text: "No results found." }],
        };
      }

      const lines = pages.map((p, i) => {
        const parts = [`### ${i + 1}. ${p.name || "Untitled"}`, `URL: ${p.url}`];
        if (p.snippet) parts.push(p.snippet);
        if (p.summary) parts.push(`Summary: ${p.summary}`);
        if (p.datePublished) parts.push(`Published: ${p.datePublished}`);
        return parts.join("\n");
      });

      const text = `Found ${pages.length} results for "${params.query}":\n\n${lines.join("\n\n")}`;
      return { content: [{ type: "text", text }] };
    },
  });

  api.logger?.info?.("bocha-search: registered bocha_web_search tool");
}
