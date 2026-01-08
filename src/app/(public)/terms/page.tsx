async function getTermsContent() {
  try {
    const raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const trimmed = raw.replace(/\/+$/, '');
    const apiBase = trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;

    const res = await fetch(`${apiBase}/site-content/pages`, { next: { revalidate: 60 } });
    if (!res.ok) return '';
    const data = await res.json();
    return data.termsContent || '';
  } catch (error) {
    console.error('Failed to fetch terms content', error);
    return '';
  }
}

const TermsPage = async () => {
  const termsContent = await getTermsContent();

  const html = (() => {
    if (!termsContent) return '';
    const maybeHtml = /<\s*\w+[^>]*>/i.test(termsContent);
    if (maybeHtml) return termsContent;

    const escaped = termsContent
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    return escaped.replace(/\r\n|\n|\r/g, '<br />');
  })();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Terms &amp; Conditions</h1>
      {html ? (
        <div className="prose lg:prose-xl" dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <p>Content coming soon.</p>
      )}
    </div>
  );
};

export default TermsPage;
