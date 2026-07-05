'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CreditCard, Shield, Search, Star, Building2, Lock, CheckCircle2,
  Phone, FileText, Clock, ArrowRight, AlertCircle, Users, Globe,
} from 'lucide-react';
import Link from 'next/link';

const pricingPlans = [
  {
    name: 'Client Search',
    price: '200',
    unit: 'per search',
    desc: 'Search and view contractor profiles, scores, and verified documents. Each detailed profile view costs KES 200.',
    icon: Search,
    popular: false,
  },
  {
    name: 'Prequalification Report',
    price: '2,500',
    unit: 'per report',
    desc: 'Full prequalification report including score breakdown, verified documents, CRB check, tax compliance, and dispute history. PDF download.',
    icon: FileText,
    popular: true,
  },
  {
    name: 'Premium Listing (Contractor)',
    price: '8,000',
    unit: 'per year',
    desc: 'Enhanced visibility in search results, featured placement, detailed company profile, and priority verification. Stands out with a gold Premium badge.',
    icon: Star,
    popular: false,
  },
  {
    name: 'API Access',
    price: '25,000',
    unit: 'per month',
    desc: 'Programmatic access to contractor scores, verification data, and project histories. For county governments and large developers integrating E Contractor data.',
    icon: Globe,
    popular: false,
  },
];

export default function PaymentsPage() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <CreditCard className="h-7 w-7 text-[#4CAF50]" /> M-Pesa Payments
        </h1>
        <p className="text-muted-foreground mt-1">
          All payments on E Contractor are processed through M-Pesa — the payment method trusted by over 30 million Kenyans.
        </p>
      </div>

      {/* M-Pesa Trust Banner */}
      <Card className="bg-[#4CAF50]/5 border-[#4CAF50]/20">
        <CardContent className="p-5 flex items-start gap-4">
          <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-[#4CAF50]/20 shrink-0">
            <Phone className="h-6 w-6 text-[#4CAF50]" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Pay with M-Pesa</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mt-1">
              E Contractor integrates directly with the Safaricom M-Pesa Daraja API. All transactions
              are encrypted, and you receive instant confirmation via SMS. No card details needed —
              just your M-Pesa PIN.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Plans */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Pricing Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pricingPlans.map((plan) => (
            <Card key={plan.name} className={`relative ${plan.popular ? 'border-[#4CAF50] ring-1 ring-[#4CAF50]/30' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-[#4CAF50] text-white">Most Popular</Badge>
                </div>
              )}
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 flex items-center justify-center rounded-xl ${plan.popular ? 'bg-[#4CAF50]/20' : 'bg-muted'}`}>
                    <plan.icon className={`h-5 w-5 ${plan.popular ? 'text-[#4CAF50]' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold">KES {plan.price}</span>
                      <span className="text-xs text-muted-foreground">/{plan.unit}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{plan.desc}</p>
                <Button
                  className={`w-full ${plan.popular ? 'bg-[#4CAF50] hover:bg-[#43A047] text-white' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  <CreditCard className="h-4 w-4 mr-2" /> Pay with M-Pesa
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Escrow Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lock className="h-5 w-5 text-[#4CAF50]" /> M-Pesa Escrow
          </CardTitle>
          <CardDescription>How milestone-based escrow payments protect both clients and contractors.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { step: '1', title: 'Client Deposits', desc: 'Client pays the full contract amount (or milestone portion) into the E Contractor escrow account via M-Pesa.' },
              { step: '2', title: 'Contractor Delivers', desc: 'Contractor completes work to the milestone specification and submits GPS-verified photos for certification.' },
              { step: '3', title: 'Funds Released', desc: 'Upon client or independent certifier approval, the milestone payment is released from escrow to the contractor via M-Pesa.' },
            ].map((s) => (
              <div key={s.step} className="text-center space-y-2 p-3">
                <div className="h-10 w-10 rounded-full bg-[#4CAF50]/20 text-[#4CAF50] flex items-center justify-center font-bold mx-auto">
                  {s.step}
                </div>
                <h4 className="font-semibold text-sm">{s.title}</h4>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
          <Separator />
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10 text-sm text-blue-800 dark:text-blue-300 flex gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>Escrow is available for projects above KES 500,000. A 1.5% escrow management fee applies.</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Flow */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payment Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { label: '1. Select Service', desc: 'Choose what you want to pay for — search access, prequal report, premium listing, or escrow deposit.' },
              { label: '2. Enter M-Pesa Number', desc: 'Provide your M-Pesa registered phone number (e.g., 0722 123 456).' },
              { label: '3. Confirm on Phone', desc: 'You receive an STK push on your phone. Enter your M-Pesa PIN to authorize.' },
              { label: '4. Instant Confirmation', desc: 'Payment is confirmed in real-time. You receive an SMS from M-Pesa and access is granted immediately.' },
            ].map((step) => (
              <div key={step.label} className="flex gap-3 items-start">
                <div className="h-6 w-6 rounded-full bg-[#4CAF50] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {step.label.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-sm">{step.label.slice(3)}</div>
                  <p className="text-xs text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-center pt-4">
        <Link href="/contractors"><Button className="gap-2">Start Searching Contractors <ArrowRight className="h-4 w-4" /></Button></Link>
      </div>
    </div>
  );
}