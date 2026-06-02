import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/20 selection:text-foreground">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-3xl px-6 py-24">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last Updated: June 2, 2026
          </p>
        </div>

        <p className="mb-14 text-[15px] leading-relaxed text-foreground/80">
          By using our URL shortening service, you agree to the following terms:
        </p>

        <div className="space-y-12">
          <section className="relative pl-6 border-l-2 border-primary/30">
            <h2 className="mb-3 text-lg font-semibold text-foreground">1. Acceptable Use</h2>
            <p className="mb-3 text-[15px] leading-relaxed text-muted-foreground">
              You may use the service only for lawful purposes. You must not create or share links that:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-[15px] leading-relaxed text-muted-foreground">
              <li>Contain illegal, harmful, fraudulent, or misleading content</li>
              <li>Distribute malware, viruses, or malicious software</li>
              <li>Infringe on intellectual property rights</li>
              <li>Promote spam, phishing, or unauthorized data collection</li>
            </ul>
          </section>

          <section className="relative pl-6 border-l-2 border-primary/30">
            <h2 className="mb-3 text-lg font-semibold text-foreground">2. Link Management</h2>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              We reserve the right to remove, disable, suspend, or block any shortened link that violates these terms, applicable laws, or poses a security or operational risk to the service.
            </p>
          </section>

          <section className="relative pl-6 border-l-2 border-primary/30">
            <h2 className="mb-3 text-lg font-semibold text-foreground">3. Service Availability</h2>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              We strive to keep the service available and operational, but we do not guarantee uninterrupted access, permanent storage of links, or error-free performance.
            </p>
          </section>

          <section className="relative pl-6 border-l-2 border-primary/30">
            <h2 className="mb-3 text-lg font-semibold text-foreground">4. Limitation of Liability</h2>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              The service is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind. We are not liable for any direct, indirect, incidental, consequential, or special damages arising from your use of the service.
            </p>
          </section>

          <section className="relative pl-6 border-l-2 border-primary/30">
            <h2 className="mb-3 text-lg font-semibold text-foreground">5. Changes to These Terms</h2>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              We may update these Terms of Service at any time. Continued use of the service after changes are posted constitutes acceptance of the revised terms.
            </p>
          </section>

          <section className="relative pl-6 border-l-2 border-primary/30">
            <h2 className="mb-3 text-lg font-semibold text-foreground">6. Payments &amp; Refunds</h2>
            <p className="mb-3 text-[15px] leading-relaxed text-muted-foreground">
              All payments are final. We do not offer refunds, credits, exchanges, or partial refunds after a purchase has been completed. Users are responsible for reviewing their selected plan, subscription details, and billing information before making a payment.
            </p>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              By purchasing any paid plan or service, you acknowledge and agree that no refunds will be provided except where required by applicable law.
            </p>
          </section>

          <section className="relative pl-6 border-l-2 border-primary/30">
            <h2 className="mb-3 text-lg font-semibold text-foreground">7. Contact</h2>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              If you have questions regarding these Terms of Service, please contact us at{" "}
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
            By using the service, you acknowledge that you have read, understood, and agree to these Terms of Service.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
