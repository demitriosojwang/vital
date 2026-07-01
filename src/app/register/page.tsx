'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft, Building2, Shield, FileText, CheckCircle2, Upload,
  UserPlus, Mail, Phone, MapPin, Globe, Briefcase, Info,
} from 'lucide-react';

const counties = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Kiambu', 'Machakos',
  'Uasin Gishu', 'Kakamega', 'Meru', 'Kilifi', 'Nyeri', 'Mandera',
  'Bungoma', 'Embu', 'Kitui', 'Nyandarua', 'Migori', 'Turkana',
  'Kisii', 'Baringo', 'Homa Bay', 'Kajiado', 'Laikipia', 'Murang\'a',
  'Narok', 'Nyamira', 'Samburu', 'Siaya', 'Taita Taveta', 'Trans Nzoia',
  'Vihiga', 'West Pokot', 'Garissa', 'Isiolo', 'Kwale', 'Lamu',
  'Marsabit', 'Wajir', 'Other',
];

const ncaCategories = ['NCA1', 'NCA2', 'NCA3', 'NCA4', 'NCA5', 'NCA6', 'NCA7', 'NCA8'];

const requiredDocs = [
  { type: 'nca_licence', label: 'NCA Registration Certificate', required: true },
  { type: 'insurance', label: 'Public Liability / Contractor All Risk Insurance', required: true },
  { type: 'tax_compliance', label: 'KRA iTax Compliance Certificate', required: true },
  { type: 'completion_certificate', label: 'Project Completion Certificates (past projects)', required: false, description: 'Upload certificates from previously completed projects issued by clients. These serve as verified proof of your track record and directly boost your credibility score.' },
  { type: 'personnel_list', label: 'Certified Engineers & Technicians List', required: false },
  { type: 'financial_statements', label: 'Audited Financial Statements (2 years)', required: false },
  { type: 'crb_report', label: 'CRB Clearance Report', required: false },
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: '', email: '', phone: '', companyName: '', ncaNumber: '',
    ncaCategory: '', businessPin: '', physicalAddress: '', county: '',
    website: '', description: '',
  });

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = () => { setSubmitted(true); };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg">
        <Card className="text-center">
          <CardContent className="p-8 space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mx-auto">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold">Registration Submitted!</h2>
            <p className="text-muted-foreground">
              Your application for <strong>{form.companyName}</strong> has been received.
              Our verification team will review your documents within 3-5 business days.
            </p>
            <div className="p-4 rounded-lg bg-muted/50 text-sm text-left space-y-2">
              <div className="flex justify-between"><span className="text-muted-foreground">Reference</span><span className="font-mono">EC-{Date.now().toString(36).toUpperCase()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span>{form.email}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">NCA No.</span><span>{form.ncaNumber || 'Pending'}</span></div>
            </div>
            <Link href="/contractors"><Button className="w-full">Browse Contractors</Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-2xl">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Register Your Company</h1>
        <p className="text-muted-foreground">Join Kenya's verified contractor network. Complete 3 steps to get listed.</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-8">
        {['Account', 'Company Details', 'Documents'].map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium shrink-0 ${i + 1 <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              {i + 1 < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </div>
            <span className={`text-sm hidden sm:inline ${i + 1 <= step ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{s}</span>
            {i < 2 && <div className={`flex-1 h-0.5 ${i + 1 < step ? 'bg-primary' : 'bg-muted'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Account */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><UserPlus className="h-5 w-5" /> Account Information</CardTitle>
            <CardDescription>Your personal account details as the primary contact.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <div className="relative">
                <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="name" placeholder="e.g. John Kamau" className="pl-10" value={form.name} onChange={(e) => update('name', e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="john@company.co.ke" className="pl-10" value={form.email} onChange={(e) => update('email', e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="phone" placeholder="e.g. +254 722 123 456" className="pl-10" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
              </div>
            </div>
            <Button className="w-full" onClick={() => setStep(2)} disabled={!form.name || !form.email || !form.phone}>
              Continue to Company Details
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Company Details */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><Building2 className="h-5 w-5" /> Company Details</CardTitle>
            <CardDescription>Information about your construction company and NCA registration.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="companyName" placeholder="e.g. Kamau & Sons Construction Ltd" className="pl-10" value={form.companyName} onChange={(e) => update('companyName', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ncaNumber">NCA Registration Number *</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="ncaNumber" placeholder="NCA/2020/XXXXX" className="pl-10" value={form.ncaNumber} onChange={(e) => update('ncaNumber', e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ncaCategory">NCA Category *</Label>
                <Select value={form.ncaCategory} onValueChange={(v) => update('ncaCategory', v)}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>{ncaCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessPin">KRA Business PIN (optional)</Label>
              <Input id="businessPin" placeholder="e.g. A00XXX123Q" value={form.businessPin} onChange={(e) => update('businessPin', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Physical Address *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="address" placeholder="e.g. Industrial Area, Nairobi" className="pl-10" value={form.physicalAddress} onChange={(e) => update('physicalAddress', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="county">County *</Label>
                <Select value={form.county} onValueChange={(v) => update('county', v)}>
                  <SelectTrigger><SelectValue placeholder="Select county" /></SelectTrigger>
                  <SelectContent>{counties.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website (optional)</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="website" placeholder="https://..." className="pl-10" value={form.website} onChange={(e) => update('website', e.target.value)} />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Company Description</Label>
              <Textarea id="description" placeholder="Describe your company, specializations, and key projects..." rows={3} value={form.description} onChange={(e) => update('description', e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button className="flex-1" onClick={() => setStep(3)} disabled={!form.companyName || !form.ncaNumber || !form.ncaCategory || !form.physicalAddress || !form.county}>
                Continue to Documents
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Documents */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><FileText className="h-5 w-5" /> Upload Documents</CardTitle>
            <CardDescription>Upload verification documents. * = required for verification.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10 flex gap-2 text-sm text-blue-800 dark:text-blue-300">
              <Info className="h-4 w-4 mt-0.5 shrink-0" />
              <span>In this demo, uploads are simulated. In production, documents go through automated + manual verification.</span>
            </div>
            {requiredDocs.map((doc) => (
              <div key={doc.type} className={`flex items-start gap-3 p-3 rounded-lg border ${doc.type === 'completion_certificate' ? 'border-primary/30 bg-primary/5' : ''}`}>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg shrink-0 ${doc.type === 'completion_certificate' ? 'bg-primary/15' : 'bg-muted'}`}>
                  <FileText className={`h-5 w-5 ${doc.type === 'completion_certificate' ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium flex items-center gap-2">
                    {doc.label}
                    {doc.required && <Badge variant="secondary" className="text-[10px] px-1.5">Required</Badge>}
                    {doc.type === 'completion_certificate' && <Badge className="bg-primary/15 text-primary border-0 text-[10px] px-1.5">Proof of Work</Badge>}
                  </div>
                  {'description' in doc && doc.description && (
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{doc.description}</p>
                  )}
                </div>
                <Button variant="outline" size="sm" className="shrink-0 mt-0.5">
                  <Upload className="h-3.5 w-3.5 mr-1" /> Upload
                </Button>
              </div>
            ))}
            <Separator />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button className="flex-1" onClick={handleSubmit}>Submit Registration</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
