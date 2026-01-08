async function getPrivacyContent() {
  try {
    const raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const trimmed = raw.replace(/\/+$/, '');
    const apiBase = trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;

    const res = await fetch(`${apiBase}/site-content/pages`, { next: { revalidate: 60 } });
    if (!res.ok) return '';
    const data = await res.json();
    return data.privacyContent || '';
  } catch (error) {
    console.error('Failed to fetch privacy content', error);
    return '';
  }
}

const PrivacyPage = async () => {
  const privacyContent = await getPrivacyContent();

  const html = (() => {
    if (!privacyContent) return '';
    const maybeHtml = /<\s*\w+[^>]*>/i.test(privacyContent);
    if (maybeHtml) return privacyContent;

    const escaped = privacyContent
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    return escaped.replace(/\r\n|\n|\r/g, '<br />');
  })();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      {html ? (
        <div className="prose lg:prose-xl" dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <p>Content coming soon.</p>
      )}
    </div>
  );
};

export default PrivacyPage;
