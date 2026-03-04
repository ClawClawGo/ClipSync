import Link from "next/link";
import { getUserFromSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getUserFromSession();
  if (user) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      {/* Nav */}
      <nav className="border-b border-neutral-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📋</span>
            <span className="text-xl font-bold text-white">ClipSync</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-neutral-400 hover:text-white transition-colors px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-violet-950 border border-violet-800 text-violet-300 text-sm px-4 py-2 rounded-full mb-8">
          <span>✨</span>
          <span>Cross-platform clipboard sync</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Your clipboard,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
            everywhere
          </span>
        </h1>
        <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-10">
          Copy on Linux, paste on Android. ClipSync keeps your clipboard in sync across all your
          devices with end-to-end cloud sync.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="bg-violet-600 hover:bg-violet-500 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors"
          >
            Start for free →
          </Link>
          <Link
            href="/docs"
            className="border border-neutral-700 hover:border-neutral-500 text-neutral-300 hover:text-white px-8 py-4 rounded-xl text-lg transition-colors"
          >
            View API docs
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "🔄",
              title: "Real-time Sync",
              desc: "Clipboard items sync instantly across all your devices via our cloud API.",
            },
            {
              icon: "🐧",
              title: "Linux Native",
              desc: "Use our REST API or CLI tool to integrate with your Linux clipboard daemon.",
            },
            {
              icon: "📱",
              title: "Android Ready",
              desc: "Access your clipboard history from Android using our API key authentication.",
            },
            {
              icon: "🔍",
              title: "Smart Search",
              desc: "Search through your entire clipboard history instantly. Find anything fast.",
            },
            {
              icon: "📌",
              title: "Pin & Favorite",
              desc: "Pin important snippets to the top. Mark favorites for quick access.",
            },
            {
              icon: "🔑",
              title: "API Key Auth",
              desc: "Secure API key authentication for programmatic access from any device.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-neutral-700 transition-colors"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* API Preview */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-2">Simple REST API</h2>
          <p className="text-neutral-400 mb-6">
            Integrate ClipSync into your Linux workflow or Android app with our clean REST API.
          </p>
          <div className="bg-neutral-950 rounded-xl p-6 font-mono text-sm overflow-x-auto">
            <div className="text-neutral-500 mb-1"># Push to clipboard</div>
            <div className="text-green-400 mb-4">
              curl -X POST https://your-app.com/api/clipboard \<br />
              &nbsp;&nbsp;-H &quot;x-api-key: YOUR_API_KEY&quot; \<br />
              &nbsp;&nbsp;-d &apos;&#123;&quot;content&quot;: &quot;Hello from Linux!&quot;, &quot;deviceType&quot;: &quot;linux&quot;&#125;&apos;
            </div>
            <div className="text-neutral-500 mb-1"># Pull latest items</div>
            <div className="text-cyan-400">
              curl https://your-app.com/api/clipboard \<br />
              &nbsp;&nbsp;-H &quot;x-api-key: YOUR_API_KEY&quot;
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to sync your clipboard?</h2>
        <p className="text-neutral-400 mb-8">Free to use. No credit card required.</p>
        <Link
          href="/register"
          className="bg-violet-600 hover:bg-violet-500 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors inline-block"
        >
          Create your account →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800 px-6 py-8 text-center text-neutral-500 text-sm">
        <p>ClipSync — Cross-platform clipboard manager with cloud sync</p>
      </footer>
    </main>
  );
}
