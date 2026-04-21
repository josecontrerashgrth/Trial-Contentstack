import DOMPurify from "isomorphic-dompurify";
import { CSLPFieldMapping } from "@/lib/types";

interface RichTextProps {
    html: string;
    className?: string;
    cslp?: CSLPFieldMapping;
}

export default function RichText({ html, className, cslp }: RichTextProps) {
    return (
        <div
            {...(cslp ?? {})}
            className={className}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
        />
    );
}
