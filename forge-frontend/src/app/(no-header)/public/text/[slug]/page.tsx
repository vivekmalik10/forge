import DynamicTextContainer from "./DynamicTextContainer";

interface Props {
    params: Promise<{ slug: string }>;
  }

export default async function TextPage({ params }: Props) {
    const { slug } = await params;

    const formattedSlug = decodeURIComponent(slug.replace(/-/g, ' '));
    const text = formattedSlug.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return <DynamicTextContainer text={text} />;
}