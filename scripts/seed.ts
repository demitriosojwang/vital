import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function seed() {
  const users = await Promise.all([
    db.user.create({ data: { email: 'juma@mbeki.co.ke', name: 'Juma Mbeki', phone: '+254722123456', role: 'contractor' } }),
    db.user.create({ data: { email: 'savanna@savanna.co.ke', name: 'Peter Ole Senta', phone: '+254722234567', role: 'contractor' } }),
    db.user.create({ data: { email: 'redstone@redstone.co.ke', name: 'Alice Wanjiku', phone: '+254722345678', role: 'contractor' } }),
    db.user.create({ data: { email: 'meridian@meridian.co.ke', name: 'David Ochieng', phone: '+254722456789', role: 'contractor' } }),
    db.user.create({ data: { email: 'apex@apex.co.ke', name: 'Grace Muthoni', phone: '+254722567890', role: 'contractor' } }),
    db.user.create({ data: { email: 'kiambu@county.go.ke', name: 'Kiambu County Works', phone: '+254720000001', role: 'client' } }),
    db.user.create({ data: { email: 'parks@developers.co.ke', name: 'Unity Homes Ltd', phone: '+254720000002', role: 'client' } }),
    db.user.create({ data: { email: 'nairobi@county.go.ke', name: 'Nairobi County', phone: '+254720000003', role: 'client' } }),
    db.user.create({ data: { email: 'admin@econtractor.co.ke', name: 'E Contractor Admin', role: 'admin' } }),
  ]);

  const contractors = await Promise.all([
    db.contractorProfile.create({ data: { userId: users[0].id, companyName: 'Juma Mbeki Construction Ltd', ncaNumber: 'NCA/2019/04712', ncaCategory: 'NCA6', businessPin: 'A00XYZ123Q', physicalAddress: 'Industrial Area, Nairobi', county: 'Nairobi', description: 'Leading civil works contractor specializing in roads, drainage, and water infrastructure. Over 15 years of experience with county government and NGO-funded projects across Kenya.', isVerified: true, verificationDate: new Date('2024-01-15'), compositeScore: 74, onTimeScore: 68, qualityScore: 81, subPayScore: 72, responsiveScore: 79, disputeScore: 58, totalProjectValue: 48000000, crbStatus: 'Clear', itaxCompliant: true, agpoNumber: 'AGPO/Y/2023/08912', agpoCategory: 'Youth', agpoVerified: true, agpoExpiry: new Date('2026-06-30') } }),
    db.contractorProfile.create({ data: { userId: users[1].id, companyName: 'Savanna Civil Works', ncaNumber: 'NCA/2020/08234', ncaCategory: 'NCA5', businessPin: 'P00QRS456W', physicalAddress: 'Mombasa Road, Nairobi', county: 'Nairobi', description: 'Specialized in road rehabilitation, storm water drainage, and earthworks. Strong track record with World Bank-funded projects and county governments.', isVerified: true, verificationDate: new Date('2024-03-10'), isPremium: true, premiumExpiry: new Date('2026-12-31'), compositeScore: 81, onTimeScore: 85, qualityScore: 82, subPayScore: 78, responsiveScore: 83, disputeScore: 75, totalProjectValue: 92000000, crbStatus: 'Clear', itaxCompliant: true, agpoNumber: 'AGPO/W/2022/15678', agpoCategory: 'Women', agpoVerified: true, agpoExpiry: new Date('2025-12-31') } }),
    db.contractorProfile.create({ data: { userId: users[2].id, companyName: 'Redstone Contractors Ltd', ncaNumber: 'NCA/2021/11056', ncaCategory: 'NCA4', businessPin: 'T00UVX789E', physicalAddress: 'Thika, Kiambu County', county: 'Kiambu', description: 'Residential and commercial building contractor. Focuses on apartment blocks, offices, and retail spaces in the greater Nairobi metropolitan area.', isVerified: true, verificationDate: new Date('2024-06-20'), compositeScore: 55, onTimeScore: 42, qualityScore: 61, subPayScore: 48, responsiveScore: 59, disputeScore: 35, totalProjectValue: 22000000, crbStatus: 'Adverse', itaxCompliant: false } }),
    db.contractorProfile.create({ data: { userId: users[3].id, companyName: 'Meridian Builders', ncaNumber: 'NCA/2018/03198', ncaCategory: 'NCA7', businessPin: 'M00ABC123Z', physicalAddress: 'Westlands, Nairobi', county: 'Nairobi', description: 'One of Kenyas largest building contractors. Specializes in high-rise commercial buildings, institutional facilities, and luxury residential developments. ISO 9001 certified.', isVerified: true, verificationDate: new Date('2023-09-01'), isPremium: true, premiumExpiry: new Date('2026-06-30'), compositeScore: 88, onTimeScore: 90, qualityScore: 92, subPayScore: 85, responsiveScore: 88, disputeScore: 82, totalProjectValue: 340000000, crbStatus: 'Clear', itaxCompliant: true } }),
    db.contractorProfile.create({ data: { userId: users[4].id, companyName: 'Apex Infrastructure', ncaNumber: 'NCA/2022/12567', ncaCategory: 'NCA5', businessPin: 'K00DEF456R', physicalAddress: 'Kisumu, Kisumu County', county: 'Kisumu', description: 'Infrastructure development company focusing on water supply, sanitation, and rural roads in the Lake Victoria basin and Western Kenya region.', isVerified: true, verificationDate: new Date('2024-08-05'), compositeScore: 67, onTimeScore: 62, qualityScore: 71, subPayScore: 65, responsiveScore: 70, disputeScore: 60, totalProjectValue: 35000000, crbStatus: 'Clear', itaxCompliant: true } }),
  ]);

  const clients = await Promise.all([
    db.clientProfile.create({ data: { userId: users[5].id, companyName: 'Kiambu County Government', clientType: 'county', compositeScore: 72 } }),
    db.clientProfile.create({ data: { userId: users[6].id, companyName: 'Unity Homes Ltd', clientType: 'developer', compositeScore: 85 } }),
    db.clientProfile.create({ data: { userId: users[7].id, companyName: 'Nairobi County Government', clientType: 'county', compositeScore: 68 } }),
  ]);

  const projects = await Promise.all([
    db.project.create({ data: { contractorId: contractors[0].id, clientId: clients[0].id, title: 'Kiambu County Roads Rehabilitation', projectType: 'roads', contractValue: 12400000, startDate: new Date('2023-09-01'), endDate: new Date('2024-03-31'), actualEnd: new Date('2024-03-28'), status: 'completed', county: 'Kiambu', description: 'Rehabilitation of 12km of rural roads in Kiambu County including drainage works and culvert installation.' } }),
    db.project.create({ data: { contractorId: contractors[0].id, clientId: clients[1].id, title: 'Parklands Apartment Block (4 floors)', projectType: 'building', contractValue: 18200000, startDate: new Date('2023-02-01'), endDate: new Date('2023-09-30'), actualEnd: new Date('2023-11-10'), status: 'completed', county: 'Nairobi', description: 'Construction of a 4-storey residential apartment block with 24 units in Parklands, Nairobi.' } }),
    db.project.create({ data: { contractorId: contractors[0].id, clientId: clients[2].id, title: 'Thika Road Drainage Works', projectType: 'drainage', contractValue: 6100000, startDate: new Date('2022-08-01'), endDate: new Date('2023-01-31'), actualEnd: new Date('2023-01-30'), status: 'disputed', county: 'Nairobi', description: 'Storm water drainage construction along 3km of Thika Road service lanes.' } }),
    db.project.create({ data: { contractorId: contractors[1].id, clientId: clients[2].id, title: 'Westlands Storm Drain Rehabilitation', projectType: 'drainage', contractValue: 14200000, startDate: new Date('2024-01-15'), endDate: new Date('2024-07-15'), actualEnd: new Date('2024-07-10'), status: 'completed', county: 'Nairobi', description: 'Full rehabilitation of the Westlands storm drain system covering 8.5km of primary and secondary drains.' } }),
    db.project.create({ data: { contractorId: contractors[1].id, clientId: clients[0].id, title: 'Limuru Road Widening Project', projectType: 'roads', contractValue: 28500000, startDate: new Date('2024-03-01'), endDate: new Date('2024-12-31'), status: 'active', county: 'Kiambu', description: 'Dual carriageway widening of 6km section of Limuru Road including pedestrian walkways and street lighting.' } }),
    db.project.create({ data: { contractorId: contractors[2].id, clientId: clients[1].id, title: 'Rongai Residential Complex', projectType: 'building', contractValue: 8500000, startDate: new Date('2024-01-01'), endDate: new Date('2024-06-30'), actualEnd: new Date('2024-09-15'), status: 'completed', county: 'Nairobi', description: '12-unit townhouse development in Ongata Rongai with shared amenities.' } }),
    db.project.create({ data: { contractorId: contractors[3].id, clientId: clients[1].id, title: 'Kilimani Commercial Tower (12 floors)', projectType: 'building', contractValue: 180000000, startDate: new Date('2023-06-01'), endDate: new Date('2025-06-01'), status: 'active', county: 'Nairobi', description: 'Grade A commercial office tower with 12 floors, 2 basement parking levels, and rooftop helipad in Kilimani.' } }),
    db.project.create({ data: { contractorId: contractors[3].id, clientId: clients[2].id, title: 'Nairobi County Health Clinic Network', projectType: 'building', contractValue: 45000000, startDate: new Date('2023-01-15'), endDate: new Date('2024-01-15'), actualEnd: new Date('2024-01-10'), status: 'completed', county: 'Nairobi', description: 'Construction of 5 modular health clinics across Nairobi sub-counties.' } }),
    db.project.create({ data: { contractorId: contractors[4].id, clientId: clients[0].id, title: 'Kisumu Water Supply Extension Phase 2', projectType: 'water', contractValue: 22000000, startDate: new Date('2024-04-01'), endDate: new Date('2025-03-31'), status: 'active', county: 'Kisumu', description: 'Extension of piped water supply to 4,500 households in Kisumu East sub-county.' } }),
  ]);

  await Promise.all([
    db.review.create({ data: { projectId: projects[0].id, contractorId: contractors[0].id, reviewerId: users[5].id, reviewerName: 'Kiambu County Works', onTimeRating: 75, qualityRating: 82, subPayRating: 70, responsiveRating: 78, overallComment: 'Good quality road works. Completed 3 days ahead of schedule. Minor issues with sub-contractor payment delays which were resolved.', status: 'published' } }),
    db.review.create({ data: { projectId: projects[1].id, contractorId: contractors[0].id, reviewerId: users[6].id, reviewerName: 'Unity Homes Ltd', onTimeRating: 55, qualityRating: 85, subPayRating: 68, responsiveRating: 80, overallComment: 'Excellent structural quality and finishings. However, project was delayed by 6 weeks due to material procurement issues. Communication was generally good.', status: 'published' } }),
    db.review.create({ data: { projectId: projects[2].id, contractorId: contractors[0].id, reviewerId: users[7].id, reviewerName: 'Nairobi County', onTimeRating: 65, qualityRating: 72, subPayRating: 75, responsiveRating: 70, overallComment: 'Drainage works completed on time but quality concerns on some sections. Dispute filed regarding specification compliance on secondary drains.', status: 'published' } }),
    db.review.create({ data: { projectId: projects[3].id, contractorId: contractors[1].id, reviewerId: users[7].id, reviewerName: 'Nairobi County', onTimeRating: 88, qualityRating: 84, subPayRating: 80, responsiveRating: 85, overallComment: 'Outstanding execution. Savanna delivered ahead of schedule with excellent quality. Their experience with drainage projects shows. All milestones certified without dispute.', status: 'published' } }),
    db.review.create({ data: { projectId: projects[5].id, contractorId: contractors[2].id, reviewerId: users[6].id, reviewerName: 'Unity Homes Ltd', onTimeRating: 40, qualityRating: 58, subPayRating: 35, responsiveRating: 50, overallComment: 'Project was delayed by nearly 3 months. Quality of finishings was below standard in several units. Sub-contractor payment issues were reported. Would not recommend for future projects.', status: 'published' } }),
    db.review.create({ data: { projectId: projects[7].id, contractorId: contractors[3].id, reviewerId: users[7].id, reviewerName: 'Nairobi County', onTimeRating: 92, qualityRating: 95, subPayRating: 88, responsiveRating: 90, overallComment: 'Meridian delivered all 5 clinics on time and within budget. Quality is exceptional. They managed multiple sub-contractors efficiently. Highly recommended.', status: 'published' } }),
  ]);

  await Promise.all([
    db.contractorDocument.create({ data: { contractorId: contractors[0].id, docType: 'nca_licence', docName: 'NCA Registration Certificate 2024', status: 'verified', expiryDate: new Date('2025-12-31') } }),
    db.contractorDocument.create({ data: { contractorId: contractors[0].id, docType: 'insurance', docName: 'Public Liability Insurance - Jubilee', status: 'verified', expiryDate: new Date('2025-06-30') } }),
    db.contractorDocument.create({ data: { contractorId: contractors[0].id, docType: 'tax_compliance', docName: 'iTax Compliance Certificate 2024', status: 'verified', expiryDate: new Date('2025-12-31') } }),
    db.contractorDocument.create({ data: { contractorId: contractors[0].id, docType: 'personnel_list', docName: 'Certified Engineers & Technicians', status: 'verified' } }),
    db.contractorDocument.create({ data: { contractorId: contractors[1].id, docType: 'nca_licence', docName: 'NCA Registration Certificate 2024', status: 'verified', expiryDate: new Date('2026-03-31') } }),
    db.contractorDocument.create({ data: { contractorId: contractors[1].id, docType: 'insurance', docName: 'Contractor All Risk - UAP', status: 'verified', expiryDate: new Date('2025-09-30') } }),
    db.contractorDocument.create({ data: { contractorId: contractors[2].id, docType: 'nca_licence', docName: 'NCA Registration Certificate 2024', status: 'verified', expiryDate: new Date('2025-06-30') } }),
    db.contractorDocument.create({ data: { contractorId: contractors[2].id, docType: 'insurance', docName: 'Public Liability Insurance - Heritage', status: 'expired', expiryDate: new Date('2024-12-31') } }),
    db.contractorDocument.create({ data: { contractorId: contractors[3].id, docType: 'nca_licence', docName: 'NCA Registration Certificate 2024', status: 'verified', expiryDate: new Date('2025-12-31') } }),
    db.contractorDocument.create({ data: { contractorId: contractors[3].id, docType: 'insurance', docName: 'Contractor All Risk - Britam', status: 'verified', expiryDate: new Date('2025-12-31') } }),
    db.contractorDocument.create({ data: { contractorId: contractors[3].id, docType: 'tax_compliance', docName: 'iTax Compliance Certificate 2024', status: 'verified', expiryDate: new Date('2025-12-31') } }),
    db.contractorDocument.create({ data: { contractorId: contractors[4].id, docType: 'nca_licence', docName: 'NCA Registration Certificate 2024', status: 'verified', expiryDate: new Date('2026-08-31') } }),
  ]);

  await Promise.all([
    db.dispute.create({ data: { contractorId: contractors[0].id, projectId: projects[2].id, clientId: clients[2].id, title: 'Drainage specification non-compliance', description: 'Client alleges that secondary drain sections did not meet the specified concrete grade requirements. Contractor claims specifications were changed verbally during site meetings without formal variation.', status: 'open' } }),
    db.dispute.create({ data: { contractorId: contractors[2].id, projectId: projects[5].id, clientId: clients[1].id, title: 'Project delay and sub-standard finishings', description: 'Client reports 3-month delay and multiple quality defects including cracked tiles, leaking plumbing, and poorly fitted doors across 4 of 12 units.', status: 'under_review' } }),
  ]);

  await Promise.all([
    db.milestone.create({ data: { projectId: projects[4].id, title: 'Site Mobilization & Survey', percentage: 10, dueDate: new Date('2024-04-15'), completedDate: new Date('2024-04-12'), status: 'completed' } }),
    db.milestone.create({ data: { projectId: projects[4].id, title: 'Earthworks & Grading', percentage: 25, dueDate: new Date('2024-06-30'), completedDate: new Date('2024-07-05'), status: 'completed' } }),
    db.milestone.create({ data: { projectId: projects[4].id, title: 'Sub-base & Base Course', percentage: 50, dueDate: new Date('2024-09-30'), status: 'in_progress' } }),
    db.milestone.create({ data: { projectId: projects[4].id, title: 'Paving & Surfacing', percentage: 80, dueDate: new Date('2024-11-30'), status: 'pending' } }),
    db.milestone.create({ data: { projectId: projects[4].id, title: 'Road Furniture & Handover', percentage: 100, dueDate: new Date('2024-12-31'), status: 'pending' } }),
    db.milestone.create({ data: { projectId: projects[6].id, title: 'Foundation & Substructure', percentage: 15, dueDate: new Date('2023-10-01'), completedDate: new Date('2023-09-28'), status: 'completed' } }),
    db.milestone.create({ data: { projectId: projects[6].id, title: 'Ground Floor Slab', percentage: 25, dueDate: new Date('2024-01-31'), completedDate: new Date('2024-02-05'), status: 'completed' } }),
    db.milestone.create({ data: { projectId: projects[6].id, title: 'Floors 3-6 Structure', percentage: 50, dueDate: new Date('2024-06-30'), completedDate: new Date('2024-07-10'), status: 'completed' } }),
    db.milestone.create({ data: { projectId: projects[6].id, title: 'Floors 7-12 Structure', percentage: 70, dueDate: new Date('2024-12-31'), status: 'in_progress' } }),
    db.milestone.create({ data: { projectId: projects[6].id, title: 'MEP & Finishing Works', percentage: 90, dueDate: new Date('2025-04-30'), status: 'pending' } }),
    db.milestone.create({ data: { projectId: projects[6].id, title: 'Practical Completion', percentage: 100, dueDate: new Date('2025-06-01'), status: 'pending' } }),
    db.milestone.create({ data: { projectId: projects[8].id, title: 'Pump Station Installation', percentage: 30, dueDate: new Date('2024-08-31'), completedDate: new Date('2024-08-25'), status: 'completed' } }),
    db.milestone.create({ data: { projectId: projects[8].id, title: 'Pipeline Reticulation Phase 1', percentage: 60, dueDate: new Date('2025-01-31'), status: 'in_progress' } }),
    db.milestone.create({ data: { projectId: projects[8].id, title: 'Pipeline Reticulation Phase 2', percentage: 85, dueDate: new Date('2025-03-15'), status: 'pending' } }),
    db.milestone.create({ data: { projectId: projects[8].id, title: 'Testing & Commissioning', percentage: 100, dueDate: new Date('2025-03-31'), status: 'pending' } }),
  ]);

  await Promise.all([
    db.payment.create({ data: { userId: users[5].id, amount: 2000, type: 'search', status: 'completed', mpesaRef: 'QJK3L5M7X9' } }),
    db.payment.create({ data: { userId: users[6].id, amount: 8000, type: 'premium', status: 'completed', mpesaRef: 'RFH7N2P4K1' } }),
    db.payment.create({ data: { userId: users[1].id, amount: 8000, type: 'premium', status: 'completed', mpesaRef: 'SBK9W5T3M2' } }),
    db.payment.create({ data: { userId: users[7].id, amount: 25000, type: 'prequal_report', status: 'pending' } }),
  ]);

  // LPOs
  await Promise.all([
    db.localPurchaseOrder.create({ data: { contractorId: contractors[0].id, lpoNumber: 'LPO/KCG/2023/0456', issuingOrg: 'Kiambu County Government', scopeOfWorks: 'Rehabilitation of 12km rural roads including drainage and culverts', lpoValue: 12400000, issuedDate: new Date('2023-08-15'), validUntil: new Date('2024-06-30'), projectId: projects[0].id, status: 'fully_utilized', utilizationPct: 100 } }),
    db.localPurchaseOrder.create({ data: { contractorId: contractors[0].id, lpoNumber: 'LPO/KCG/2024/0789', issuingOrg: 'Kiambu County Government', scopeOfWorks: 'Dual carriageway widening of Limuru Road Phase 2', lpoValue: 28500000, issuedDate: new Date('2024-02-20'), validUntil: new Date('2025-02-28'), projectId: projects[4].id, status: 'active', utilizationPct: 45 } }),
    db.localPurchaseOrder.create({ data: { contractorId: contractors[1].id, lpoNumber: 'LPO/NCG/2023/1234', issuingOrg: 'Nairobi County Government', scopeOfWorks: 'Westlands storm drain rehabilitation - primary and secondary drains', lpoValue: 14200000, issuedDate: new Date('2023-12-10'), validUntil: new Date('2024-12-31'), projectId: projects[3].id, status: 'fully_utilized', utilizationPct: 100 } }),
    db.localPurchaseOrder.create({ data: { contractorId: contractors[1].id, lpoNumber: 'LPO/NCG/2024/1890', issuingOrg: 'Nairobi County Government', scopeOfWorks: 'Mombasa Road service lane rehabilitation', lpoValue: 18700000, issuedDate: new Date('2024-09-01'), validUntil: new Date('2025-09-30'), status: 'issued', utilizationPct: 10 } }),
    db.localPurchaseOrder.create({ data: { contractorId: contractors[3].id, lpoNumber: 'LPO/NCG/2023/0567', issuingOrg: 'Nairobi County Government', scopeOfWorks: 'Construction of 5 modular health clinics across Nairobi sub-counties', lpoValue: 45000000, issuedDate: new Date('2022-12-15'), validUntil: new Date('2024-01-31'), projectId: projects[7].id, status: 'fully_utilized', utilizationPct: 100 } }),
    db.localPurchaseOrder.create({ data: { contractorId: contractors[3].id, lpoNumber: 'LPO/UHL/2023/0345', issuingOrg: 'Unity Homes Ltd', scopeOfWorks: 'Grade A commercial office tower - 12 floors with basement parking', lpoValue: 180000000, issuedDate: new Date('2023-05-10'), validUntil: new Date('2025-06-30'), projectId: projects[6].id, status: 'active', utilizationPct: 65 } }),
    db.localPurchaseOrder.create({ data: { contractorId: contractors[4].id, lpoNumber: 'LPO/KCG/2024/0234', issuingOrg: 'Kiambu County Government', scopeOfWorks: 'Water supply extension to Kisumu East sub-county - Phase 2', lpoValue: 22000000, issuedDate: new Date('2024-03-15'), validUntil: new Date('2025-03-31'), projectId: projects[8].id, status: 'active', utilizationPct: 55 } }),
  ]);

  console.log('Database seeded successfully!');
}

seed().catch(console.error).finally(() => process.exit(0));
