import Link from 'next/link';
import { Shield, Mail, Phone, MapPin, Eye } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  return (
    <footer className="border-t bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground/20">
                <Shield className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold">E Contractor</span>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Kenya&apos;s most trusted platform for vetting, scoring, and tracking construction
              contractors. Building transparency in Kenya&apos;s construction industry.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link href="/contractors" className="hover:text-primary-foreground transition-colors">Find Contractors</Link></li>
              <li><Link href="/clients" className="hover:text-primary-foreground transition-colors">Vet Clients</Link></li>
              <li><Link href="/register" className="hover:text-primary-foreground transition-colors">Register as Contractor</Link></li>
              <li><Link href="/disputes" className="hover:text-primary-foreground transition-colors">Dispute Registry</Link></li>
              <li><Link href="/projects" className="hover:text-primary-foreground transition-colors">Track Projects</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link href="/scoring" className="hover:text-primary-foreground transition-colors">How Scoring Works</Link></li>
              <li><Link href="/verification" className="hover:text-primary-foreground transition-colors">Verification Process</Link></li>
              <li><Link href="/diaspora" className="hover:text-primary-foreground transition-colors">Diaspora Marketplace</Link></li>
              <li><Link href="/mpesa" className="hover:text-primary-foreground transition-colors">M-Pesa Payments</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Westlands, Nairobi, Kenya</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+254 700 123 456</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <span>info@econtractor.co.ke</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-primary-foreground/20" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} E Contractor. All rights reserved.</p>
          <p>Building trust, one project at a time.</p>
        </div>
      </div>
    </footer>
  );
}