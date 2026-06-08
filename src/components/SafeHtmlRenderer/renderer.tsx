import DOMPurify from "dompurify";

function SafeHtmlRenderer({ html }) {
  const cleanHtml = DOMPurify.sanitize(html);

  return (
    <div
      className="text-muted-foreground [&>h1]:text-2xl [&>h2]:text-xl"
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}

export default SafeHtmlRenderer;
