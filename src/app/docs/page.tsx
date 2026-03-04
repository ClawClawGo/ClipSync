import Link from "next/link";

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <nav className="border-b border-neutral-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">📋</span>
            <span className="text-lg font-bold">ClipSync</span>
          </Link>
          <Link href="/dashboard" className="text-violet-400 hover:text-violet-300 text-sm">
            Dashboard →
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-3">API Documentation</h1>
        <p className="text-neutral-400 text-lg mb-12">
          Integrate ClipSync into your Linux workflow or Android app using our REST API.
        </p>

        {/* Authentication */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-violet-400">Authentication</h2>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
            <p className="text-neutral-300">
              All API requests require an API key passed in the <code className="bg-neutral-800 px-2 py-0.5 rounded text-violet-300">x-api-key</code> header.
              Find your API key in the{" "}
              <Link href="/dashboard" className="text-violet-400 hover:underline">
                Settings tab
              </Link>{" "}
              of your dashboard.
            </p>
            <pre className="bg-neutral-800 rounded-lg p-4 text-sm font-mono text-neutral-300 overflow-x-auto">
{`curl -H "x-api-key: YOUR_API_KEY" https://YOUR_APP_URL/api/clipboard`}
            </pre>
          </div>
        </section>

        {/* Endpoints */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-violet-400">Endpoints</h2>

          <div className="space-y-6">
            {/* GET /api/clipboard */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-neutral-800">
                <span className="bg-green-900 text-green-300 text-xs font-bold px-2 py-1 rounded">GET</span>
                <code className="text-white font-mono">/api/clipboard</code>
                <span className="text-neutral-400 text-sm ml-auto">List clipboard items</span>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-neutral-300 mb-2">Query Parameters</h4>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-neutral-500 text-left">
                        <th className="pb-2 pr-4">Parameter</th>
                        <th className="pb-2 pr-4">Type</th>
                        <th className="pb-2">Description</th>
                      </tr>
                    </thead>
                    <tbody className="text-neutral-300">
                      <tr><td className="py-1 pr-4 font-mono text-violet-300">search</td><td className="pr-4">string</td><td>Filter by content</td></tr>
                      <tr><td className="py-1 pr-4 font-mono text-violet-300">filter</td><td className="pr-4">string</td><td>all | pinned | favorites | text | url | code</td></tr>
                      <tr><td className="py-1 pr-4 font-mono text-violet-300">limit</td><td className="pr-4">number</td><td>Max items (default: 50)</td></tr>
                      <tr><td className="py-1 pr-4 font-mono text-violet-300">since</td><td className="pr-4">ISO date</td><td>Only items updated after this time</td></tr>
                    </tbody>
                  </table>
                </div>
                <pre className="bg-neutral-800 rounded-lg p-4 text-sm font-mono text-cyan-400 overflow-x-auto">
{`curl -H "x-api-key: YOUR_KEY" \\
  "https://YOUR_APP_URL/api/clipboard?limit=10"`}
                </pre>
              </div>
            </div>

            {/* POST /api/clipboard */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-neutral-800">
                <span className="bg-blue-900 text-blue-300 text-xs font-bold px-2 py-1 rounded">POST</span>
                <code className="text-white font-mono">/api/clipboard</code>
                <span className="text-neutral-400 text-sm ml-auto">Add clipboard item</span>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-neutral-300 mb-2">Request Body</h4>
                  <pre className="bg-neutral-800 rounded-lg p-4 text-sm font-mono text-neutral-300 overflow-x-auto">
{`{
  "content": "string (required)",
  "contentType": "text | url | code (auto-detected)",
  "title": "string (optional)",
  "deviceName": "string (optional)",
  "deviceType": "linux | android | web"
}`}
                  </pre>
                </div>
                <pre className="bg-neutral-800 rounded-lg p-4 text-sm font-mono text-cyan-400 overflow-x-auto">
{`curl -X POST \\
  -H "x-api-key: YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"content":"Hello World","deviceType":"linux"}' \\
  https://YOUR_APP_URL/api/clipboard`}
                </pre>
              </div>
            </div>

            {/* DELETE /api/clipboard/[id] */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-neutral-800">
                <span className="bg-red-900 text-red-300 text-xs font-bold px-2 py-1 rounded">DELETE</span>
                <code className="text-white font-mono">/api/clipboard/:id</code>
                <span className="text-neutral-400 text-sm ml-auto">Delete item</span>
              </div>
              <div className="p-6">
                <pre className="bg-neutral-800 rounded-lg p-4 text-sm font-mono text-cyan-400 overflow-x-auto">
{`curl -X DELETE \\
  -H "x-api-key: YOUR_KEY" \\
  https://YOUR_APP_URL/api/clipboard/123`}
                </pre>
              </div>
            </div>

            {/* POST /api/sync */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-neutral-800">
                <span className="bg-blue-900 text-blue-300 text-xs font-bold px-2 py-1 rounded">POST</span>
                <code className="text-white font-mono">/api/sync</code>
                <span className="text-neutral-400 text-sm ml-auto">Bulk sync items</span>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-neutral-400 text-sm">
                  Send multiple items at once and receive items from other devices since your last sync.
                </p>
                <pre className="bg-neutral-800 rounded-lg p-4 text-sm font-mono text-neutral-300 overflow-x-auto">
{`{
  "items": [
    {"content": "item 1", "deviceType": "linux"},
    {"content": "item 2", "deviceType": "linux"}
  ],
  "deviceName": "My Linux PC",
  "deviceType": "linux",
  "lastSyncAt": "2024-01-01T00:00:00Z"
}`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Linux Setup */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-violet-400">Linux Setup</h2>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Auto-sync with xclip (bash script)</h3>
              <pre className="bg-neutral-800 rounded-lg p-4 text-sm font-mono text-green-400 overflow-x-auto whitespace-pre-wrap">
{`#!/bin/bash
# ~/.local/bin/clipsync
API_KEY="YOUR_API_KEY"
BASE_URL="https://YOUR_APP_URL"

case "$1" in
  push)
    CONTENT=$(xclip -o -selection clipboard 2>/dev/null)
    curl -s -X POST "$BASE_URL/api/clipboard" \\
      -H "x-api-key: $API_KEY" \\
      -H "Content-Type: application/json" \\
      -d "{\\"content\\": \\"$CONTENT\\", \\"deviceType\\": \\"linux\\", \\"deviceName\\": \\"$(hostname)\\"}"
    echo "Pushed to ClipSync"
    ;;
  pull)
    CONTENT=$(curl -s -H "x-api-key: $API_KEY" \\
      "$BASE_URL/api/clipboard?limit=1" \\
      | python3 -c "import sys,json; print(json.load(sys.stdin)['items'][0]['content'])")
    echo -n "$CONTENT" | xclip -selection clipboard
    echo "Pulled from ClipSync"
    ;;
esac`}
              </pre>
            </div>
          </div>
        </section>

        {/* Android Setup */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-violet-400">Android Setup</h2>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
            <p className="text-neutral-300">
              Use <strong>HTTP Shortcuts</strong> (free app on Play Store) to create shortcuts that push/pull your clipboard.
            </p>
            <ol className="list-decimal list-inside space-y-2 text-neutral-300 text-sm">
              <li>Install HTTP Shortcuts from Google Play Store</li>
              <li>Create a new shortcut with method POST</li>
              <li>Set URL to <code className="bg-neutral-800 px-1 rounded">https://YOUR_APP_URL/api/clipboard</code></li>
              <li>Add header <code className="bg-neutral-800 px-1 rounded">x-api-key: YOUR_API_KEY</code></li>
              <li>Set body to <code className="bg-neutral-800 px-1 rounded">{`{"content": "{clipboard}", "deviceType": "android"}`}</code></li>
              <li>Add the shortcut to your home screen or share menu</li>
            </ol>
          </div>
        </section>
      </div>
    </main>
  );
}
