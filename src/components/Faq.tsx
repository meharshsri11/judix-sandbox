const faqs = [
  {
    question: 'What is Judix?',
    answer:
      'Judix is a comprehensive platform designed to streamline legal case management and client communication for law firms of all sizes. Our tools help you stay organized, efficient, and focused on your clients.',
  },
  {
    question: 'Can I change my plan later?',
    answer:
      'Absolutely! You can upgrade or downgrade your plan at any time from your account settings. Changes will be prorated for the current billing cycle.',
  },
  {
    question: 'Is there a free trial available?',
     // This line is now fixed
    answer:
      "Yes, we offer a 14-day free trial on our Pro plan. No credit card is required to get started. You can explore all the features and see if it&apos;s the right fit for your firm.",
  },
  {
    question: 'How is my data secured?',
    answer:
      'We take data security very seriously. All your data is encrypted both in transit and at rest. We use industry-standard security protocols and are fully compliant with data protection regulations.',
  },
];

export default function Faq() {
  return (
    <section id="faq" className="container mx-auto max-w-4xl">
      <div className="mb-12 text-center">
        <h2 className="font-sora text-4xl font-bold tracking-tight sm:text-5xl">
          Frequently Asked Questions
        </h2>
        {/* This line is now fixed */}
        <p className="mt-4 font-outfit text-lg text-muted-foreground">
          Have questions? We have answers. If you can&apos;t find what you&apos;re looking
          for, feel free to contact us.
        </p>
      </div>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="group rounded-lg border border-border bg-slate-900/50 p-6 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer items-center justify-between">
              <h3 className="font-sora text-lg font-medium text-foreground">
                {faq.question}
              </h3>
              <svg
                className="h-6 w-6 transform text-muted-foreground transition-transform duration-300 group-open:rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <p className="mt-4 font-outfit leading-relaxed text-muted-foreground">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}