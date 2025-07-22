import { ArrowLeft, Eye, Lock, Server,Shield } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to PDF Debugger
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
          </div>

          <p className="text-muted-foreground text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <div className="grid gap-8">
            <section className="border rounded-lg p-6 bg-card">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="h-6 w-6 text-green-600" />
                <h2 className="text-2xl font-semibold m-0">
                  Your Privacy is Protected
                </h2>
              </div>
              <p className="text-lg mb-4">
                PDF Debugger is designed with privacy as a core principle. We
                believe your documents should remain private and secure.
              </p>
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="font-semibold text-green-800 dark:text-green-200 m-0">
                  🔒 Your PDF files never leave your device. Everything is
                  processed locally in your browser.
                </p>
              </div>
            </section>

            <section className="border rounded-lg p-6 bg-card">
              <div className="flex items-center gap-3 mb-4">
                <Server className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-semibold m-0">No File Uploads</h2>
              </div>
              <ul className="space-y-2">
                <li>
                  ✅ All PDF processing happens in your browser using
                  WebAssembly
                </li>
                <li>✅ No files are uploaded to our servers</li>
                <li>✅ No file content is transmitted over the internet</li>
                <li>✅ Your documents remain completely private</li>
              </ul>
            </section>

            <section className="border rounded-lg p-6 bg-card">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="h-6 w-6 text-orange-600" />
                <h2 className="text-2xl font-semibold m-0">
                  Analytics & Tracking
                </h2>
              </div>
              <p>
                We use PostHog analytics to understand how our tool is used and
                improve the user experience:
              </p>
              <ul className="space-y-2 mt-4">
                <li>
                  <strong>What we collect:</strong> Page views, button clicks,
                  and general usage patterns
                </li>
                <li>
                  <strong>What we DON'T collect:</strong> PDF content, file
                  names, or any document data
                </li>
                <li>
                  <strong>Session recordings:</strong> PostHog may record user
                  sessions for UX improvements
                </li>
                <li>
                  <strong>Your choice:</strong> You can disable analytics by
                  using browser privacy tools
                </li>
              </ul>
            </section>

            <section className="border rounded-lg p-6 bg-card">
              <h2 className="text-2xl font-semibold mb-4">Technical Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Local Processing</h3>
                  <p>
                    PDF Debugger uses Mozilla's PDF.js library compiled to
                    WebAssembly to parse PDF files entirely within your browser.
                    This means:
                  </p>
                  <ul>
                    <li>No server-side processing</li>
                    <li>No network requests for file analysis</li>
                    <li>Complete offline functionality</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Data Storage</h3>
                  <p>The only data stored locally includes:</p>
                  <ul>
                    <li>Theme preference (light/dark mode)</li>
                    <li>Basic application settings</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="border rounded-lg p-6 bg-card">
              <h2 className="text-2xl font-semibold mb-4">Contact</h2>
              <p>
                If you have questions about this privacy policy or PDF Debugger,
                you can contact the developer:
              </p>
              <ul className="mt-4">
                <li>
                  <strong>Email:</strong>{" "}
                  <a href="mailto:hyzyla@gmail.com">hyzyla@gmail.com</a>
                </li>
                <li>
                  <strong>Telegram:</strong>{" "}
                  <a
                    href="https://t.me/hyzyla"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @hyzyla
                  </a>
                </li>
                <li>
                  <strong>GitHub:</strong>{" "}
                  <a
                    href="https://github.com/hyzyla/pdf-debugger"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    pdf-debugger
                  </a>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
