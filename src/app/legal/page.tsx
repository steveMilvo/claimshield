export default function LegalPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-12 prose prose-sm">
      <h1 className="text-3xl font-semibold tracking-tight">Legal</h1>
      <p className="mt-3 text-ink-muted">
        ClaimShield is operated by MilvoTech Pty Ltd (Mildura, VIC, Australia).
        ClaimShield provides information and document preparation services. It
        does not provide legal advice and is not a law firm. Use of ClaimShield
        does not create a lawyer-client relationship.
      </p>
      <h2 className="mt-8 text-xl font-semibold">Data handling</h2>
      <p className="mt-2 text-ink-muted">
        Policies and claim documents are processed in memory and are not
        persisted as raw documents on our servers. Anonymised outcomes (insurer,
        denial type, appeal strategy, result) are retained to improve the
        product.
      </p>
      <h2 className="mt-8 text-xl font-semibold">Contact</h2>
      <p className="mt-2 text-ink-muted">info@milvotech.com</p>
    </article>
  );
}
