'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft, Shield, Award, FileCheck, CheckCircle2, Clock, Eye,
  AlertTriangle, Upload, Search, Building2, UserCheck, Stamp,
  FolderLock, ArrowRight, CircleDot, BadgeCheck, TrendingUp,
} from 'lucide-react';

const verificationSteps = [
  {
    step: 1,
    title: 'Document Submission',
    description: 'Contractors upload their NCA registration certificate, insurance policy, KRA iTax compliance certificate, CRB clearance report, and — critically — past project completion certificates. Each document is categorized and tracked individually in the secure document vault.',
    icon: Upload,
    details: [
      'NCA Registration Certificate — validates the contractor\'s NCA category and registration status',
      'Public Liability / Contractor All Risk Insurance — confirms active coverage with reputable insurers',
      'KRA iTax Compliance Certificate — proves the contractor is tax compliant with KRA',
      'CRB Clearance Report — checks for adverse credit listings that signal financial risk',
      'Project Completion Certificates — the strongest proof of delivered work, issued by clients upon handover',
      'Certified Engineers & Technicians List — validates the technical workforce capacity',
    ],
  },
  {
    step: 2,
    title: 'Automated Cross-Referencing',
    description: 'Our system automatically cross-references submitted documents against official databases. NCA registration numbers are verified against the National Construction Authority portal. KRA PIN numbers are checked against iTax. CRB status is pulled from licensed credit reference bureaus. Insurance policies are verified with the issuing company.',
    icon: Search,
    details: [
      'NCA number validated against the official NCA registered contractors database',
      'KRA PIN cross-checked with iTax for compliance status and tax standing',
      'Insurance policy verified with the underwriter for active coverage and policy limits',
      'CRB status checked across all licensed credit reference bureaus in Kenya',
    ],
  },
  {
    step: 3,
    title: 'Completion Certificate Verification',
    description: 'This is the most powerful proof layer. When a contractor uploads a completion certificate, we verify it by contacting the issuing client or organization directly. The certificate reference number (e.g., NCG/CC/2024/0156) is matched against the client\'s project records. This confirms that the contractor actually delivered the project and received formal sign-off.',
    icon: Award,
    details: [
      'Certificate reference number is validated against the issuing organization\'s records',
      'Project details on the certificate are cross-checked with our project database',
      'The issuing client is contacted to confirm the certificate is authentic',
      'Verified certificates are flagged with a green "Verified" badge on the contractor\'s profile',
      'Contractors with a high certification rate (certificates uploaded / completed projects) rank higher in search results',
      'Missing certificates for completed projects are flagged as a "Not uploaded" warning — clients can see which projects lack proof',
    ],
    highlight: true,
  },
  {
    step: 4,
    title: 'Manual Review & Approval',
    description: 'Documents that cannot be automatically verified — such as completion certificates from private developers or specialized insurance policies — are flagged for manual review by our verification team. The reviewer may request additional documentation, contact references, or schedule a site visit for physical verification.',
    icon: Eye,
    details: [
      'Manual review queue for documents requiring human judgment',
      'Reference checks with previous clients listed on completion certificates',
      'Site visit requests for high-value projects or first-time registrants',
      'Discrepancy resolution through direct communication with issuing parties',
    ],
  },
  {
    step: 5,
    title: 'Verified Badge & Scoring Impact',
    description: 'Once a contractor passes verification, they receive the green "Verified" badge on their profile. Verified contractors appear higher in search results and enjoy increased client trust. The verification status is reviewed annually and documents approaching expiry trigger automated renewal reminders.',
    icon: BadgeCheck,
    details: [
      'Green "Verified" badge displayed on the contractor\'s profile and in search results',
      'Boosted search ranking for verified contractors',
      'Automated expiry alerts 90, 60, and 30 days before document expiration',
      'Annual re-verification required to maintain verified status',
      'Completion certificates directly influence the contractor\'s credibility indicators shown to clients',
    ],
  },
];

const documentTypes = [
  {
    type: 'NCA Registration Certificate',
    required: true,
    icon: Shield,
    description: 'Validates the contractor is registered with the National Construction Authority and their approved category (NCA1-NCA8). The NCA number is cross-referenced against the official NCA database.',
    verification: 'Automated — NCA database lookup',
  },
  {
    type: 'Insurance Policy',
    required: true,
    icon: FolderLock,
    description: 'Public Liability Insurance or Contractor All Risk Insurance from a licensed Kenyan insurer. Confirms the contractor has financial protection for third-party claims and project risks.',
    verification: 'Automated — Insurer verification',
  },
  {
    type: 'KRA iTax Compliance Certificate',
    required: true,
    icon: Stamp,
    description: 'Issued by the Kenya Revenue Authority, this certificate confirms the contractor has filed all tax returns and has no outstanding tax obligations. Essential for government and county contracts.',
    verification: 'Automated — iTax PIN check',
  },
  {
    type: 'Project Completion Certificates',
    required: false,
    icon: Award,
    description: 'The most impactful proof document. Issued by clients upon successful project handover, these certificates confirm the contractor actually delivered the work. Each certificate includes a reference number, project name, contract value, and the client\'s official stamp or signature.',
    verification: 'Semi-automated — Client cross-reference',
    highlight: true,
  },
  {
    type: 'Certified Engineers List',
    required: false,
    icon: UserCheck,
    description: 'A list of registered professional engineers, technicians, and foremen employed by the contractor. Verified against the Engineers Board of Kenya (EBK) register.',
    verification: 'Manual — EBK register check',
  },
  {
    type: 'Audited Financial Statements',
    required: false,
    icon: FileCheck,
    description: 'The last 2 years of audited financial statements prepared by a licensed CPA firm. These demonstrate financial stability and capacity to handle contracts of a certain value.',
    verification: 'Manual — Review by verification team',
  },
  {
    type: 'CRB Clearance Report',
    required: false,
    icon: CheckCircle2,
    description: 'A credit reference bureau report showing the contractor has no adverse listings. This protects clients from engaging contractors with financial distress that could jeopardize project completion.',
    verification: 'Automated — CRB database check',
  },
];

export default function VerificationPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative gradient-hero text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-primary-foreground/70 hover:text-primary-foreground mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <div className="max-w-3xl">
            <Badge className="bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 border-0 px-4 py-1.5 text-sm mb-4">
              <Shield className="h-3.5 w-3.5 mr-1.5" />
              Trust & Verification
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              How Verification Works
            </h1>
            <p className="text-lg text-primary-foreground/85 max-w-2xl leading-relaxed">
              E Contractor operates a multi-layered verification system that goes beyond basic document checks.
              We use project completion certificates as the strongest proof of a contractor&apos;s track record —
              verified directly with the clients who issued them.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Why Completion Certificates Matter */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-primary/20 bg-primary/5 overflow-hidden">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 shrink-0">
                    <Award className="h-7 w-7 text-primary" />
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-xl md:text-2xl font-bold">
                      Why Completion Certificates Are the Strongest Proof
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      In Kenya&apos;s construction industry, a project completion certificate is the formal document
                      issued by a client (county government, parastatal, or private developer) confirming that a
                      contractor has successfully delivered a project to specification. Unlike NCA registration or
                      insurance — which only prove the contractor <em>exists</em> — completion certificates prove the
                      contractor <em>delivers</em>.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      <div className="p-3 rounded-lg bg-background border">
                        <div className="flex items-center gap-2 mb-1.5">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="font-semibold text-sm">Proves Delivery</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Confirms the contractor completed a real project, not just registered to do business.</p>
                      </div>
                      <div className="p-3 rounded-lg bg-background border">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Building2 className="h-4 w-4 text-blue-600" />
                          <span className="font-semibold text-sm">Client-Backed</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Issued by the actual client, making it independently verifiable and hard to fabricate.</p>
                      </div>
                      <div className="p-3 rounded-lg bg-background border">
                        <div className="flex items-center gap-2 mb-1.5">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-sm">Tracks Growth</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Multiple certificates over time show a contractor&apos;s growing capability and consistent delivery.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 5-Step Verification Process */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-4">
              <CircleDot className="h-3.5 w-3.5 mr-1.5" />
              5-Step Process
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How We Verify Every Contractor</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              From document upload to verified badge — every step is designed to ensure only
              credible, proven contractors make it onto the platform.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {verificationSteps.map((step) => (
              <Card key={step.step} className={step.highlight ? 'border-2 border-primary/30' : ''}>
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl shrink-0 ${step.highlight ? 'bg-primary text-primary-foreground' : 'bg-primary/10'}`}>
                      <step.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-muted-foreground">Step {step.step}</span>
                        {step.highlight && (
                          <Badge className="bg-primary/15 text-primary border-0 text-[10px] px-1.5">Key Feature</Badge>
                        )}
                      </div>
                      <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{step.description}</p>
                      <div className="space-y-1.5">
                        {step.details.map((detail, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-600 mt-0.5 shrink-0" />
                            <span className="text-sm text-muted-foreground">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* Document Types */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-4">
              <FileCheck className="h-3.5 w-3.5 mr-1.5" />
              Document Vault
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Accepted Document Types</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Each document type serves a specific purpose in building a complete trust profile.
              Completion certificates carry the most weight in establishing credibility.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-3">
            {documentTypes.map((doc) => (
              <Card key={doc.type} className={doc.highlight ? 'border-2 border-primary/30' : ''}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${doc.highlight ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      <doc.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold">{doc.type}</h3>
                        {doc.required && <Badge variant="secondary" className="text-[10px] px-1.5">Required</Badge>}
                        {doc.highlight && <Badge className="bg-primary/15 text-primary border-0 text-[10px] px-1.5">Highest Value Proof</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-2">{doc.description}</p>
                      <div className="flex items-center gap-1.5 text-xs">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">Verification: </span>
                        <span className="font-medium">{doc.verification}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How Clients Use Completion Certificates */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-4">
              <Eye className="h-3.5 w-3.5 mr-1.5" />
              For Clients
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How Clients Use Completion Certificates
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              When evaluating a contractor, clients can see at a glance which projects have
              been formally certified and which lack proof.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="text-center">
              <CardContent className="p-6 space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/20 mx-auto">
                  <Award className="h-6 w-6 text-green-700 dark:text-green-400" />
                </div>
                <h3 className="font-bold">Certificate Present</h3>
                <p className="text-sm text-muted-foreground">
                  Projects with a verified completion certificate show a green award icon with the certificate reference number. This is strong proof the contractor delivered the work.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6 space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 dark:bg-yellow-900/20 mx-auto">
                  <AlertTriangle className="h-6 w-6 text-yellow-700 dark:text-yellow-400" />
                </div>
                <h3 className="font-bold">Certificate Missing</h3>
                <p className="text-sm text-muted-foreground">
                  Completed projects without an uploaded certificate show a yellow warning. This doesn&apos;t necessarily mean the project wasn&apos;t completed — the certificate may not have been uploaded yet.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6 space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mx-auto">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold">Certification Rate</h3>
                <p className="text-sm text-muted-foreground">
                  Each contractor profile shows a certification rate — the percentage of completed projects with verified certificates. A high rate indicates strong track record documentation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">
              Ready to Get Verified?
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Upload your documents including past project completion certificates and join
              Kenya&apos;s most trusted contractor network. Verification takes 3-5 business days.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-kenya-gold hover:bg-kenya-gold/90 text-black font-semibold px-8">
                  Register Your Company
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/contractors">
                <Button size="lg" variant="outline" className="px-8">
                  Browse Verified Contractors
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}