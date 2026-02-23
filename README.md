# bocha-search

OpenClaw plugin that adds a `bocha_web_search` tool powered by the [Bocha Search API](https://bochaai.com).

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
