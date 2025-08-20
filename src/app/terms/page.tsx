
import { Section } from '@/components/shared/Section';

export default function TermsPage() {
  return (
    <Section title="Terms & Conditions">
      <div className="prose prose-invert mx-auto max-w-4xl text-muted-foreground">
        <p>
          Welcome to Vindhya Club. If you continue to browse and use this
          website, you are agreeing to comply with and be bound by the following
          terms and conditions of use, which together with our privacy policy
          govern Vindhya Club's relationship with you in relation to this
          website.
        </p>

        <h2 className="mt-6 font-headline text-2xl font-bold text-primary">
          1. The use of this website is subject to the following terms of use:
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-6">
          <li>
            The content of the pages of this website is for your general
            information and use only. It is subject to change without notice.
          </li>
          <li>
            This website uses cookies to monitor browsing preferences. If you do
            allow cookies to be used, the following personal information may be
            stored by us for use by third parties.
          </li>
          <li>
            Neither we nor any third parties provide any warranty or guarantee
            as to the accuracy, timeliness, performance, completeness or
            suitability of the information and materials found or offered on
            this website for any particular purpose. You acknowledge that such
            information and materials may contain inaccuracies or errors and we
            expressly exclude liability for any such inaccuracies or errors to
            the fullest extent permitted by law.
          </li>
        </ul>

        <h2 className="mt-6 font-headline text-2xl font-bold text-primary">
          2. Disclaimer
        </h2>
        <p className="mt-4">
          Your use of any information or materials on this website is entirely
          at your own risk, for which we shall not be liable. It shall be your
          own responsibility to ensure that any products, services or
          information available through this website meet your specific
          requirements.
        </p>
      </div>
    </Section>
  );
}
