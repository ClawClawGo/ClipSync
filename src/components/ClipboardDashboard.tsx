"use client";

import { useState, useCallback } from "react";
import { formatDate, getDeviceIcon, truncate } from "@/lib/utils";
import { useRouter } from "next/navigation";

type ClipboardItem = {
  id: number;
  userId: number;
  content: string;
  contentType: string;
  title: string | null;
  tags: string | null;
  isPinned: boolean;
  isFavorite: boolean;
  deviceName: string | null;
  deviceType: string | null;
  syncedAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

type User = {
  id: number;
  name: string;
  email: string;
  apiKey: string;
};

type Props = {
  user: User;
  initialItems: ClipboardItem[];
};

type FilterType = "all" | "pinned" | "favorites" | "text" | "url" | "code";

export default function ClipboardDashboard({ user, initialItems }: Props) {
  const router = useRouter();
  const [items, setItems] = useState<ClipboardItem[]>(initialItems);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [newContent, setNewContent] = useState("");
  const [adding, setAdding] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"clipboard" | "settings">("clipboard");

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      !search ||
      item.content.toLowerCase().includes(search.toLowerCase()) ||
      (item.title && item.title.toLowerCase().includes(search.toLowerCase()));

    const matchesFilter =
      filter === "all" ||
      (filter === "pinned" && item.isPinned) ||
      (filter === "favorites" && item.isFavorite) ||
      item.contentType === filter;

    return matchesSearch && matchesFilter;
  });

  async function addItem() {
    if (!newContent.trim()) return;
    setAdding(true);
    try {
      const res = await fetch("/api/clipboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newContent, deviceType: "web" }),
      });
      const data = await res.json();
      if (res.ok) {
        setItems([data.item, ...items]);
        setNewContent("");
        setShowAddForm(false);
      }
    } finally {
      setAdding(false);
    }
  }

  async function deleteItem(id: number) {
    const res = await fetch(`/api/clipboard/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems(items.filter((i) => i.id !== id));
    }
  }

  async function togglePin(item: ClipboardItem) {
    const res = await fetch(`/api/clipboard/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPinned: !item.isPinned }),
    });
    const data = await res.json();
    if (res.ok) {
      setItems(items.map((i) => (i.id === item.id ? data.item : i)));
    }
  }

  async function toggleFavorite(item: ClipboardItem) {
    const res = await fetch(`/api/clipboard/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFavorite: !item.isFavorite }),
    });
    const data = await res.json();
    if (res.ok) {
      setItems(items.map((i) => (i.id === item.id ? data.item : i)));
    }
  }

  async function copyToClipboard(item: ClipboardItem) {
    try {
      await navigator.clipboard.writeText(item.content);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
      const el = document.createElement("textarea");
      el.value = item.content;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  function getContentTypeColor(type: string) {
    switch (type) {
      case "url": return "text-cyan-400 bg-cyan-950 border-cyan-800";
      case "code": return "text-green-400 bg-green-950 border-green-800";
      default: return "text-neutral-400 bg-neutral-800 border-neutral-700";
    }
  }

  function getContentTypeIcon(type: string) {
    switch (type) {
      case "url": return "🔗";
      case "code": return "💻";
      default: return "📝";
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-neutral-800 px-4 sm:px-6 py-4 flex-shrink-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📋</span>
            <span className="text-lg font-bold">ClipSync</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-neutral-400 text-sm hidden sm:block">
              {user.name}
            </span>
            <button
              onClick={handleLogout}
              className="text-neutral-400 hover:text-white text-sm transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Tab Nav */}
      <div className="border-b border-neutral-800 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex gap-1">
          {(["clipboard", "settings"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-violet-500 text-white"
                  : "border-transparent text-neutral-400 hover:text-white"
              }`}
            >
              {tab === "clipboard" ? "📋 Clipboard" : "⚙️ Settings"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6">
        {activeTab === "clipboard" && (
          <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">🔍</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search clipboard..."
                  className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-violet-500 transition-colors placeholder-neutral-500"
                />
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 justify-center"
              >
                <span>+</span>
                <span>Add Item</span>
              </button>
            </div>

            {/* Add Form */}
            {showAddForm && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3">
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Paste or type content to add to your clipboard..."
                  rows={4}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-violet-500 transition-colors placeholder-neutral-500 resize-none font-mono text-sm"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) addItem();
                    if (e.key === "Escape") setShowAddForm(false);
                  }}
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 text-neutral-400 hover:text-white transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addItem}
                    disabled={adding || !newContent.trim()}
                    className="bg-violet-600 hover:bg-violet-500 disabled:bg-violet-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    {adding ? "Adding..." : "Add (Ctrl+Enter)"}
                  </button>
                </div>
              </div>
            )}

            {/* Filter Tabs */}
            <div className="flex gap-1 overflow-x-auto pb-1">
              {(["all", "pinned", "favorites", "text", "url", "code"] as FilterType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    filter === f
                      ? "bg-violet-600 text-white"
                      : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
                  }`}
                >
                  {f === "all" && "All"}
                  {f === "pinned" && "📌 Pinned"}
                  {f === "favorites" && "⭐ Favorites"}
                  {f === "text" && "📝 Text"}
                  {f === "url" && "🔗 URLs"}
                  {f === "code" && "💻 Code"}
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="text-sm text-neutral-500">
              {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}
              {search && ` matching "${search}"`}
            </div>

            {/* Items List */}
            {filteredItems.length === 0 ? (
              <div className="text-center py-16 text-neutral-500">
                <div className="text-4xl mb-3">📋</div>
                <p className="text-lg font-medium text-neutral-400">No clipboard items yet</p>
                <p className="text-sm mt-1">
                  {search ? "Try a different search term" : "Add items manually or sync from your devices"}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-neutral-900 border rounded-xl p-4 group hover:border-neutral-700 transition-colors ${
                      item.isPinned ? "border-violet-800" : "border-neutral-800"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span
                            className={`text-xs px-2 py-0.5 rounded border font-medium ${getContentTypeColor(item.contentType)}`}
                          >
                            {getContentTypeIcon(item.contentType)} {item.contentType}
                          </span>
                          {item.isPinned && (
                            <span className="text-xs text-violet-400">📌 Pinned</span>
                          )}
                          {item.isFavorite && (
                            <span className="text-xs text-yellow-400">⭐ Favorite</span>
                          )}
                          {item.deviceName && (
                            <span className="text-xs text-neutral-500">
                              {getDeviceIcon(item.deviceType)} {item.deviceName}
                            </span>
                          )}
                          <span className="text-xs text-neutral-600 ml-auto">
                            {formatDate(item.updatedAt)}
                          </span>
                        </div>

                        {item.title && (
                          <p className="text-sm font-medium text-neutral-300 mb-1">{item.title}</p>
                        )}

                        <pre
                          className={`text-sm text-neutral-300 whitespace-pre-wrap break-all leading-relaxed ${
                            item.contentType === "code" ? "font-mono" : "font-sans"
                          }`}
                        >
                          {truncate(item.content, 300)}
                        </pre>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <button
                          onClick={() => copyToClipboard(item)}
                          title="Copy"
                          className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors text-sm"
                        >
                          {copiedId === item.id ? "✅" : "📋"}
                        </button>
                        <button
                          onClick={() => togglePin(item)}
                          title={item.isPinned ? "Unpin" : "Pin"}
                          className={`p-1.5 rounded-lg hover:bg-neutral-800 transition-colors text-sm ${
                            item.isPinned ? "text-violet-400" : "text-neutral-400 hover:text-white"
                          }`}
                        >
                          📌
                        </button>
                        <button
                          onClick={() => toggleFavorite(item)}
                          title={item.isFavorite ? "Unfavorite" : "Favorite"}
                          className={`p-1.5 rounded-lg hover:bg-neutral-800 transition-colors text-sm ${
                            item.isFavorite ? "text-yellow-400" : "text-neutral-400 hover:text-white"
                          }`}
                        >
                          ⭐
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          title="Delete"
                          className="p-1.5 rounded-lg hover:bg-red-950 text-neutral-400 hover:text-red-400 transition-colors text-sm"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h2 className="text-xl font-bold mb-1">Account</h2>
              <p className="text-neutral-400 text-sm">Your account information</p>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
              <div>
                <label className="text-sm text-neutral-400">Name</label>
                <p className="text-white font-medium mt-1">{user.name}</p>
              </div>
              <div>
                <label className="text-sm text-neutral-400">Email</label>
                <p className="text-white font-medium mt-1">{user.email}</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-1">API Key</h2>
              <p className="text-neutral-400 text-sm mb-4">
                Use this key to sync from Linux or Android. Keep it secret!
              </p>
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
                <div>
                  <label className="text-sm text-neutral-400 block mb-2">Your API Key</label>
                  <div className="flex gap-2">
                    <code className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-sm font-mono text-neutral-300 break-all">
                      {showApiKey ? user.apiKey : "•".repeat(32)}
                    </code>
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-400 hover:text-white transition-colors text-sm"
                    >
                      {showApiKey ? "Hide" : "Show"}
                    </button>
                    <button
                      onClick={() => navigator.clipboard.writeText(user.apiKey)}
                      className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-400 hover:text-white transition-colors text-sm"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-1">Linux Integration</h2>
              <p className="text-neutral-400 text-sm mb-4">
                Use these commands to sync your Linux clipboard
              </p>
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
                <div>
                  <label className="text-sm text-neutral-400 block mb-2">Push clipboard content</label>
                  <pre className="bg-neutral-800 rounded-lg p-4 text-sm font-mono text-green-400 overflow-x-auto whitespace-pre-wrap break-all">
{`# Push current clipboard to ClipSync
xclip -o | curl -s -X POST \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d "{\\"content\\": \\"$(xclip -o)\\", \\"deviceType\\": \\"linux\\", \\"deviceName\\": \\"$(hostname)\\"}" \\
  https://YOUR_APP_URL/api/clipboard`}
                  </pre>
                </div>
                <div>
                  <label className="text-sm text-neutral-400 block mb-2">Pull latest item to clipboard</label>
                  <pre className="bg-neutral-800 rounded-lg p-4 text-sm font-mono text-cyan-400 overflow-x-auto whitespace-pre-wrap break-all">
{`# Get latest clipboard item
curl -s -H "x-api-key: YOUR_API_KEY" \\
  "https://YOUR_APP_URL/api/clipboard?limit=1" \\
  | python3 -c "import sys,json; print(json.load(sys.stdin)['items'][0]['content'])" \\
  | xclip -selection clipboard`}
                  </pre>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-1">Android Integration</h2>
              <p className="text-neutral-400 text-sm mb-4">
                Use HTTP Shortcuts or Tasker on Android to sync your clipboard
              </p>
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
                <div>
                  <label className="text-sm text-neutral-400 block mb-2">API Endpoint</label>
                  <code className="block bg-neutral-800 rounded-lg px-4 py-3 text-sm font-mono text-neutral-300">
                    POST /api/clipboard
                  </code>
                </div>
                <div>
                  <label className="text-sm text-neutral-400 block mb-2">Required Header</label>
                  <code className="block bg-neutral-800 rounded-lg px-4 py-3 text-sm font-mono text-neutral-300">
                    x-api-key: YOUR_API_KEY
                  </code>
                </div>
                <div>
                  <label className="text-sm text-neutral-400 block mb-2">Request Body</label>
                  <pre className="bg-neutral-800 rounded-lg p-4 text-sm font-mono text-neutral-300 overflow-x-auto">
{`{
  "content": "text to sync",
  "deviceType": "android",
  "deviceName": "My Phone"
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
