import Contact from "../../src/components/contact-us/Contact";
import { buildPageMetadata } from "../../src/lib/seo";

export const metadata = buildPageMetadata("/contact");

export default function ContactPage() {
  return <Contact />;
}
