import EssayReviewTool from '@/components/essay-review/EssayReviewTool.jsx';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata('/essay-review');

export default function EssayReviewPage() {
  return <EssayReviewTool />;
}
