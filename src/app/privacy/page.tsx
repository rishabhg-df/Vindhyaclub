
import { Section } from '@/components/shared/Section';

export default function PrivacyPage() {
  return (
    <Section title="Privacy Policy">
      <div className="prose prose-invert mx-auto max-w-4xl text-muted-foreground">
        <p>
          This privacy policy sets out how Vindhya Club uses and protects any
          information that you give Vindhya Club when you use this website.
          Vindhya Club is committed to ensuring that your privacy is protected.
        </p>

        <h2 className="mt-6 font-headline text-2xl font-bold text-primary">
          What we collect
        </h2>
        <p className="mt-4">We may collect the following information:</p>
        <ul className="mt-4 list-disc space-y-2 pl-6">
          <li>Name and job title</li>
          <li>Contact information including email address</li>
          <li>
            Demographic information such as postcode, preferences and interests
          </li>
          <li>
            Other information relevant to customer surveys and/or offers
          </li>
        </ul>

        <h2 className="mt-6 font-headline text-2xl font-bold text-primary">
          Security
        </h2>
        <p className="mt-4">
          We are committed to ensuring that your information is secure. In order
          to prevent unauthorised access or disclosure, we have put in place
          suitable physical, electronic and managerial procedures to safeguard
          and secure the information we collect online.
        </p>

        <h2 className="mt-6 font-headline text-2xl font-bold text-primary">
          How we use cookies
        </h2>
        <p className="mt-4">
          A cookie is a small file which asks permission to be placed on your
          computer's hard drive. Once you agree, the file is added and the
          cookie helps analyse web traffic or lets you know when you visit a
          particular site. Cookies allow web applications to respond to you as
          an individual. The web application can tailor its operations to your
          needs, likes and dislikes by gathering and remembering information
          about your preferences.
        </p>
      </div>
    </Section>
  );
}
