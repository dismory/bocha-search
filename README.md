# bocha-search

OpenClaw plugin that adds a `bocha_web_search` tool powered by the [Bocha Search API](https://bochaai.com).

## Why not the built-in web_search?

OpenClaw's built-in `web_search` uses Brave Search with a hardcoded API endpoint — no way to set a custom base URL or swap the backend. This is a problem if:

- Brave Search is inaccessible from your network (e.g. China mainland)
- You want to use a different search provider
- You need features Brave doesn't offer (AI summaries, date range filtering, etc.)

This plugin replaces it with Bocha Search, which provides good Chinese-language results and built-in AI summaries.

## Setup

1. Place this folder under `~/.openclaw/extensions/bocha-search/`

2. Add to `~/.openclaw/openclaw.json`:

```json
{
  "plugins": {
    "allow": ["bocha-search"],
    "entries": {
      "bocha-search": {
        "enabled": true,
        "config": {
          "apiKey": "sk-your-bocha-api-key"
        }
      }
    }
  }
}
```

3. (Recommended) Deny the built-in `web_search` tool to force the agent to use Bocha:

```json
{
  "tools": {
    "deny": ["web_search"]
  }
}
```

Without this, both `web_search` (Brave) and `bocha_web_search` will be available and the agent may pick either one.

## Tool Parameters

| Parameter   | Type    | Required | Description                                                                 |
|-------------|---------|----------|-----------------------------------------------------------------------------|
| `query`     | string  | yes      | Search query                                                                |
| `count`     | number  | no       | Number of results, 1-20 (default 5)                                         |
| `freshness` | string  | no       | Time filter: `oneDay`, `oneWeek`, `oneMonth`, `oneYear`, or `YYYY-MM-DD..YYYY-MM-DD` |
| `summary`   | boolean | no       | Include AI summaries (default true)                                         |

## Notes

- New tools only appear in **new sessions**. If the bot is already in a conversation, send `/new` to reset.
- The API key can also be set via `BOCHA_API_KEY` environment variable as a fallback.
