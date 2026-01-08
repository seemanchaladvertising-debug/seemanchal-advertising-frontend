async function getAboutContent() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/site-content/pages`, { next: { revalidate: 60 } });
    if (!res.ok) return '';
    const data = await res.json();
    return data.aboutContent || '';
  } catch (error) {
    console.error('Failed to fetch about content', error);
    return '';
  }
}

const AboutPage = async () => {
  const aboutContent = await getAboutContent();

  const html = (() => {
    if (!aboutContent) return '';
    const maybeHtml = /<\s*\w+[^>]*>/i.test(aboutContent);
    if (maybeHtml) return aboutContent;

    const escaped = aboutContent
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    return escaped.replace(/\r\n|\n|\r/g, '<br />');
  })();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">About Seemanchal Advertising</h1>
      {html ? (
        <div className="prose lg:prose-xl" dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <p>Content coming soon.</p>
      )}
    </div>
  );
};

export default AboutPage;
