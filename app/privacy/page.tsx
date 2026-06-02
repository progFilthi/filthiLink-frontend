import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/20 selection:text-foreground">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-3xl px-6 py-24">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last Updated: June 2, 2026
          </p>
        </div>

        <p className="mb-14 text-[15px] leading-relaxed text-foreground/80">
          This Privacy Policy explains how we collect, use, and protect information when you use our URL shortening service.
        </p>

        <div className="space-y-12">
          <section className="relative pl-6 border-l-2 border-primary/30">
            <h2 className="mb-3 text-lg font-semibold text-foreground">1. Information We Collect</h2>
            <p className="mb-3 text-[15px] leading-relaxed text-muted-foreground">
              We may collect:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-[15px] leading-relaxed text-muted-foreground">
              <li>Email address (when you create an account or contact us)</li>
              <li>Account information you provide</li>
              <li>Shortened links and related metadata</li>
              <li>IP address, browser type, and device information</li>
              <li>Usage and analytics data related to the service</li>
              <li>Payment information processed by third-party payment providers</li>
            </ul>
          </section>

          <section className="relative pl-6 border-l-2 border-primary/30">
            <h2 className="mb-3 text-lg font-semibold text-foreground">2. How We Use Information</h2>
            <p className="mb-3 text-[15px] leading-relaxed text-muted-foreground">
              We use collected information to:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-[15px] leading-relaxed text-muted-foreground">
              <li>Provide and maintain the service</li>
              <li>Manage user accounts and subscriptions</li>
              <li>Process payments</li>
              <li>Improve performance and security</li>
              <li>Prevent fraud, abuse, and unauthorized activity</li>
              <li>Respond to support requests</li>
            </ul>
          </section>

          <section className="relative pl-6 border-l-2 border-primary/30">
            <h2 className="mb-3 text-lg font-semibold text-foreground">3. Data Sharing</h2>
            <p className="mb-3 text-[15px] leading-relaxed text-muted-foreground">
              We do not sell your personal information.
            </p>
            <p className="mb-3 text-[15px] leading-relaxed text-muted-foreground">
              We may share information with trusted third-party providers that help us operate the service, such as hosting, analytics, authentication, and payment processing providers.
            </p>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              We may also disclose information when required by law or to protect the security and integrity of the service.
            </p>
          </section>

          <section className="relative pl-6 border-l-2 border-primary/30">
            <h2 className="mb-3 text-lg font-semibold text-foreground">4. Data Security</h2>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              We take reasonable measures to protect your information from unauthorized access, loss, misuse, or disclosure. However, no method of electronic storage or transmission is completely secure.
            </p>
          </section>

          <section className="relative pl-6 border-l-2 border-primary/30">
            <h2 className="mb-3 text-lg font-semibold text-foreground">5. Data Retention</h2>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              We retain information for as long as necessary to provide the service, comply with legal obligations, resolve disputes, and enforce our agreements.
            </p>
          </section>

          <section className="relative pl-6 border-l-2 border-primary/30">
            <h2 className="mb-3 text-lg font-semibold text-foreground">6. Third-Party Services</h2>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              Our service may rely on third-party providers for payment processing, hosting, analytics, and other functionality. Their handling of your information is governed by their own privacy policies.
            </p>
          </section>

          <section className="relative pl-6 border-l-2 border-primary/30">
            <h2 className="mb-3 text-lg font-semibold text-foreground">7. Your Rights</h2>
            <p className="mb-3 text-[15px] leading-relaxed text-muted-foreground">
              Depending on your location, you may have rights to access, correct, update, or request deletion of your personal information.
            </p>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              To make such a request, contact us using the information below.
            </p>
          </section>

          <section className="relative pl-6 border-l-2 border-primary/30">
            <h2 className="mb-3 text-lg font-semibold text-foreground">8. Changes to This Privacy Policy</h2>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              We may update this Privacy Policy from time to time. Continued use of the service after changes are posted constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="relative pl-6 border-l-2 border-primary/30">
            <h2 className="mb-3 text-lg font-semibold text-foreground">9. Contact</h2>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              If you have questions about this Privacy Policy or your data, contact us at{" "}
              <a
                href="mailto:gamerfilthi@gmail.com"
                className="font-medium text-foreground underline underline-offset-2 transition-colors hover:text-primary"
              >
                gamerfilthi@gmail.com
              </a>.
            </p>
          </section>
        </div>

        <div className="mt-16 rounded-xl border bg-card p-6">
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            By using the service, you acknowledge that you have read, understood, and agree to this Privacy Policy.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
