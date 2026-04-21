import { notFound } from "next/navigation";
import { getPage, getPages, isPreview } from "@/lib/contentstack";
import Page from "@/components/Page";
import Preview from "@/components/Preview";

interface SlugPageProps {
    params: Promise<{ slug: string }>;
}

// Pre-render all known page URLs at build time.
// Each `url` field in Contentstack is stored as "/about", "/contact", etc.
// We strip the leading "/" to produce the slug used in the file-system route.
export async function generateStaticParams() {
    const pages = await getPages();
    return pages
        .filter((p) => typeof p.url === "string")
        .map((p) => ({ slug: (p.url as string).replace(/^\//, "") }));
}

export default async function SlugPage({ params }: SlugPageProps) {
    const { slug } = await params;
    const url = `/${slug}`;

    if (isPreview) {
        return <Preview path={url} />;
    }

    const page = await getPage(url);

    if (!page) {
        notFound();
    }

    return <Page page={page} />;
}
