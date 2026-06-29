'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Shield, Search, Star, Clock, CheckCircle2, AlertTriangle,
  Users, MapPin, TrendingUp, Smartphone, Lock, Globe,
  ArrowRight, Building2, FileCheck, Scale, Eye
} from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'NCA & Document Verification',
    description: 'Real-time verification of NCA licences, insurance certificates, KRA tax compliance, and CRB status. Our document vault keeps everything auditable and up-to-date.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: Star,
    title: '5-Dimension Composite Scoring',
    description: 'Every contractor is scored across on-time delivery, quality/workmanship, sub-contractor payment, responsiveness, and dispute history — weighted into a single trusted score.',
    color: 'text-chart-2',
    bg: 'bg-chart-2/10',
  },
  {
    icon: Scale,
    title: 'Dispute & Blacklist Registry',
    description: 'Anonymous whistleblower protection, formal dispute filing, and a transparent blacklist registry. Hold contractors accountable with documented evidence trails.',
    color: 'text-chart-3',
    bg: 'bg-chart-3/10',
  },
  {
    icon: MapPin,
    title: 'GPS Photo Verification',
    description: 'Site progress photos with embedded GPS coordinates and timestamps. Verify actual project progress with tamper-proof geolocation data.',
    color: 'text-chart-4',
    bg: 'bg-chart-4/10',
  },
  {
    icon: Smartphone,
    title: 'M-Pesa Integrated Payments',
    description: 'Pay-per-search, premium subscriptions, and escrow payments — all through M-Pesa. The payment method Kenyans trust, built into every transaction.',
    color: 'text-chart-5',
    bg: 'bg-chart-5/10',
  },
  {
    icon: Globe,
    title: 'Diaspora Marketplace',
    description: 'Kenyans abroad can find and vet contractors for projects back home. Monitor construction remotely with photo updates, milestone tracking, and escrow protection.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
];

const stats = [
  { label: 'Verified Contractors', value: '847', icon: Building2 },
  { label: 'Projects Tracked', value: '3,200+', icon: FileCheck },
  { label: 'Reviews Submitted', value: '12,500+', icon: Star },
  { label: 'Counties Covered', value: '42', icon: MapPin },
];

const scoreDimensions = [
  { label: 'On-Time Delivery', weight: '25%', icon: Clock, desc: 'Track record of meeting project deadlines' },
  { label: 'Quality / Workmanship', weight: '25%', icon: CheckCircle2, desc: 'Quality of finished work and materials used' },
  { label: 'Sub-Contractor Payment', weight: '20%', icon: Users, desc: 'Timely payment to sub-contractors and suppliers' },
  { label: 'Responsiveness', weight: '15%', icon: Eye, desc: 'Communication speed and issue resolution' },
  { label: 'Dispute History', weight: '15%', icon: AlertTriangle, desc: 'Number and severity of disputes filed' },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative gradient-hero text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge className="bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 border-0 px-4 py-1.5 text-sm">
              <Shield className="h-3.5 w-3.5 mr-1.5" />
              Trusted by County Governments & Developers Across Kenya
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-balance">
              Find, Vet & Score
              <span className="block text-kenya-gold">Construction Contractors</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/85 max-w-2xl mx-auto leading-relaxed">
              Kenya&apos;s only transparent contractor tracking platform with composite scoring
              across 5 dimensions. Stop guessing — start building with verified, scored contractors.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Link href="/contractors">
                <Button size="lg" className="bg-kenya-gold hover:bg-kenya-gold/90 text-black font-semibold px-8 text-base">
                  <Search className="h-5 w-5 mr-2" />
                  Find a Contractor
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-8 text-base">
                  Register Your Company
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Stats Bar */}
      <section className="border-b bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Scoring Works */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-4">
              <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
              Transparent Scoring
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              One Score. Five Dimensions. Full Transparency.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Every contractor on E Contractor gets a composite score (0-100) built from verified
              project reviews. No hidden algorithms — every dimension and its weight is public.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {scoreDimensions.map((dim) => (
              <Card key={dim.label} className="border-2 hover:border-primary/30 transition-colors">
                <CardContent className="p-5 flex gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                    <dim.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm">{dim.label}</h3>
                      <Badge variant="secondary" className="text-[11px] px-1.5 py-0">{dim.weight}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{dim.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Card className="border-2 border-dashed border-primary/20 bg-primary/5">
              <CardContent className="p-5 flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">= Composite Score</div>
                  <p className="text-xs text-muted-foreground">Weighted average across all 5 dimensions</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-4">
              <Lock className="h-3.5 w-3.5 mr-1.5" />
              Platform Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Trust a Contractor
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              From document verification to GPS-verified site photos, every tool is designed
              to bring transparency to Kenya&apos;s construction industry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature) => (
              <Card key={feature.title} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg} shrink-0`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Who Is It For */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for Kenya&apos;s Construction Ecosystem
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: 'County Governments',
                desc: 'Prequalify contractors for public works with verified data. Track county-funded projects, ensure value for taxpayers, and maintain a roster of vetted contractors for rapid deployment.',
                icon: Building2,
              },
              {
                title: 'Property Developers',
                desc: 'Stop losing money on unreliable contractors. Access composite scores, dispute histories, and verified credentials before awarding contracts. Protect your investment.',
                icon: TrendingUp,
              },
              {
                title: 'Kenyan Diaspora',
                desc: 'Building at home from abroad? Find trusted contractors, monitor progress via GPS-verified photos, and protect payments through M-Pesa escrow. Build with confidence.',
                icon: Globe,
              },
            ].map((item) => (
              <Card key={item.title} className="text-center">
                <CardContent className="p-8 space-y-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mx-auto">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Build with Confidence?
          </h2>
          <p className="text-primary-foreground/85 text-lg mb-8 max-w-xl mx-auto">
            Join hundreds of clients and contractors already using E Contractor to bring transparency to Kenya&apos;s construction industry.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contractors">
              <Button size="lg" className="bg-kenya-gold hover:bg-kenya-gold/90 text-black font-semibold px-8">
                <Search className="h-5 w-5 mr-2" />
                Search Contractors
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-8">
                Register Your Company
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}