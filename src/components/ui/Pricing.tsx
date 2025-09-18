'use client';

import { useState } from 'react';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { Check } from 'lucide-react';

const pricingPlans = [
  { name: 'Basic', description: 'For individuals and small teams starting out.', monthlyPrice: 10, yearlyPrice: 100, features: ['Access to core features', '5 projects', 'Basic analytics', 'Email support'], isPopular: false },
  { name: 'Pro', description: 'For growing teams that need more power and support.', monthlyPrice: 25, yearlyPrice: 250, features: ['All features in Basic', 'Unlimited projects', 'Advanced analytics', 'Priority email support', 'Collaboration tools'], isPopular: true },
  { name: 'Enterprise', description: 'For large organizations with custom needs.', monthlyPrice: 75, yearlyPrice: 750, features: ['All features in Pro', 'Dedicated account manager', 'Custom integrations', '24/7 phone support', 'Single Sign-On (SSO)'], isPopular: false },
];

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="container mx-auto max-w-7xl">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="font-sora text-4xl font-bold tracking-tight sm:text-5xl">Our Pricing</h2>
        <p className="mt-4 font-outfit text-lg text-gray-400">Choose the plan that's right for you. Simple, transparent pricing to help you grow.</p>
      </div>
      <div className="mb-12 flex items-center justify-center space-x-4">
        <span className={`font-outfit text-lg ${!isYearly ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
        <Switch checked={isYearly} onCheckedChange={setIsYearly} aria-label="Toggle billing cycle" />
        <span className={`font-outfit text-lg ${isYearly ? 'text-white' : 'text-gray-400'}`}>Yearly</span>
        <span className="ml-2 rounded-full bg-green-500/20 px-3 py-1 text-sm font-semibold text-green-400">2 months FREE!</span>
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        {pricingPlans.map((plan) => (
          <div key={plan.name} className={`relative flex flex-col rounded-2xl border p-8 ${plan.isPopular ? 'border-purple-500 bg-gray-900/50' : 'border-gray-700'}`}>
            {plan.isPopular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-purple-500 px-4 py-1.5 font-sora text-sm font-semibold text-white">Most Popular</div>}
            <h3 className="font-sora text-2xl font-semibold">{plan.name}</h3>
            <p className="mt-2 h-12 font-outfit text-gray-400">{plan.description}</p>
            <div className="mt-6">
              <span className="font-sora text-5xl font-bold">${isYearly ? plan.yearlyPrice / 12 : plan.monthlyPrice}</span>
              <span className="ml-1 font-outfit text-gray-400">/ month</span>
            </div>
            <Button variant={plan.isPopular ? 'default' : 'outline'} className={`mt-8 w-full rounded-full py-6 text-lg font-semibold ${plan.isPopular ? 'bg-purple-600 text-white hover:bg-purple-700' : 'border-gray-500 bg-transparent text-white hover:bg-gray-800'}`}>Get Started</Button>
            <ul className="mt-8 flex-1 space-y-4">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check className="mr-3 h-5 w-5 text-green-500" />
                  <span className="font-outfit text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}