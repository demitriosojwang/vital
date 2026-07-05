'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScoreRing } from '@/components/score/score-ring';
import {
  Globe, Shield, MapPin, Camera, CreditCard, Star, Phone,
  Search, ArrowRight, Plane, Eye, Lock, CheckCircle2, Building2,
} from 'lucide-react';

const benefits = [
  {
    icon: Eye,
    title: 'Remote Monitoring',
    desc: 'View GPS-verified site photos updated at every milestone. See real progress from anywhere in the world — no need to rely on second-hand reports from relatives or agents.',
  },
  {
    icon: Lock,
    title: 'M-Pesa Escrow Protection',
    desc: 'Your payments are held in escrow and only released when milestones are certified complete. If the contractor fails to deliver, your money is protected.',
  },
  {
    icon: Shield,
    title: 'Pre-Vetted Contractors',
    desc: 'Every listed contractor has verified NCA registration, insurance, tax compliance, and a composite score based on real project reviews. No more gambling with unknown builders.',
  },
  {
    icon: Star,
    title: 'Transparent Scoring',
    desc: 'See how each contractor has performed on past projects. Scores are public and weighted across 5 dimensions — on-time delivery, quality, sub-contractor payment, responsiveness, and disputes.',
  },
  {
    icon: Camera,
    title: 'GPS Photo Verification',
    desc: 'Site progress photos are tagged with GPS coordinates and timestamps. You can verify the photos were actually taken at your project site, not copied from elsewhere.',
  },
  {
    icon: Phone,
    title: 'Dedicated Diaspora Support',
    desc: 'Our support team is available during hours convenient for Kenyans in the UK, US, Europe, and the Middle East. We handle time zone differences so you don\'t have to.',
  },
];

export default function DiasporaPage() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8 space-y-8">
      {/* Hero */}
      <section className="gradient-hero text-primary-foreground rounded-2xl p-8 md:p-12 -mx-4">
        <div className="max-w-2xl space-y-4">
          <Badge className="bg-white/20 text-primary-foreground border-0 gap-1.5">
            <Plane className="h-3.5 w-3.5" /> For Kenyans Abroad
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold">
            Build at Home with
            <span className="text-kenya-gold"> Confidence</span>
          </h1>
          <p className="text-primary-foreground/85 leading-relaxed">
            Whether you&apos;re in London, Dubai, Minneapolis, or Sydney — E Contractor lets you find trusted builders,
            monitor construction remotely, and protect your payments through M-Pesa escrow.
            Stop worrying about your dream home project from thousands of miles away.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/contractors">
              <Button className="bg-kenya-gold hover:bg-kenya-gold/90 text-black font-semibold">
                <Search className="h-4 w-4 mr-2" />Find a Contractor
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                Register Your Company
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Problem/Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-red-200 bg-red-50/50 dark:border-red-900/30">
          <CardContent className="p-5 space-y-2">
            <h3 className="font-semibold text-red-700 dark:text-red-400">The Diaspora Problem</h3>
            <ul className="text-sm text-muted-foreground space-y-1.5">
              <li className="flex gap-2"><span className="text-red-500">&times;</span> Can&apos;t visit the site regularly to check progress</li>
              <li className="flex gap-2"><span className="text-red-500">&times;</span> Don&apos;t know if the contractor is qualified</li>
              <li className="flex gap-2"><span className="text-red-500">&times;</span> Money sent via M-Pesa with no accountability</li>
              <li className="flex gap-2"><span className="text-red-500">&times;</span> Friends and relatives have limited oversight</li>
              <li className="flex gap-2"><span className="text-red-500">&times;</span> Disputes are hard to resolve from abroad</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50/50 dark:border-green-900/30">
          <CardContent className="p-5 space-y-2">
            <h3 className="font-semibold text-green-700 dark:text-green-400">The E Contractor Solution</h3>
            <ul className="text-sm text-muted-foreground space-y-1.5">
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> GPS-verified photo updates at every milestone</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> Verified NCA, insurance, and tax compliance</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> M-Pesa escrow — pay only on certified completion</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> Transparent scoring from real project reviews</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> Dispute resolution with documented evidence</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Benefits Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Built for How You Build from Abroad</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefits.map((b) => (
            <Card key={b.title} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 space-y-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10">
                  <b.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">How Diaspora Building Works on E Contractor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step: '1', title: 'Search & Vet', desc: 'Search contractors by county, NCA category, and score. Review profiles, project history, and verified documents.' },
              { step: '2', title: 'Award & Escrow', desc: 'Award the contract and deposit funds into M-Pesa escrow. Funds are protected until milestones are certified.' },
              { step: '3', title: 'Monitor Progress', desc: 'Receive GPS-verified photos at each milestone. Track progress through the project dashboard from anywhere.' },
              { step: '4', title: 'Certify & Release', desc: 'Review milestone evidence and approve. Escrow funds are released to the contractor upon your certification.' },
            ].map((s) => (
              <div key={s.step} className="text-center space-y-2">
                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mx-auto">
                  {s.step}
                </div>
                <h4 className="font-semibold text-sm">{s.title}</h4>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="text-center py-4">
        <p className="text-muted-foreground mb-4">Ready to start building with confidence?</p>
        <Link href="/contractors"><Button size="lg" className="gap-2">Find a Trusted Contractor <ArrowRight className="h-4 w-4" /></Button></Link>
      </div>
    </div>
  );
}