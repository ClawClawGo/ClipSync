export function detectContentType(content: string): "url" | "code" | "text" {
  // Check if URL
  try {
    new URL(content);
    if (content.startsWith("http://") || content.startsWith("https://")) {
      return "url";
    }
  } catch {
    // Not a URL
  }

  // Check if code (has common code patterns)
  const codePatterns = [
    /^(import|export|const|let|var|function|class|def|fn|pub|use)\s/m,
    /[{};]\s*$/m,
    /^\s*(\/\/|#|\/\*|\*)/m,
    /<[a-zA-Z][^>]*>/,
  ];
  if (codePatterns.some((p) => p.test(content))) {
    return "code";
  }

  return "text";
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
}

export function formatDate(date: Date | null | undefined): string {
  if (!date) return "Unknown";
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

export function getDeviceIcon(deviceType: string | null): string {
  switch (deviceType) {
    case "android":
      return "📱";
    case "linux":
      return "🐧";
    case "web":
      return "🌐";
    default:
      return "💻";
  }
}
