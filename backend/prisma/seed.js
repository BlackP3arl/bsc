import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create Perspectives
  const financial = await prisma.perspective.upsert({
    where: { name: 'Financial' },
    update: {},
    create: {
      name: 'Financial',
      color_bg: '#dbeafe',
      color_bar: '#3b82f6',
      color_header: '#1e40af',
      display_order: 1,
    },
  });

  const customer = await prisma.perspective.upsert({
    where: { name: 'Customer' },
    update: {},
    create: {
      name: 'Customer',
      color_bg: '#dcfce7',
      color_bar: '#22c55e',
      color_header: '#166534',
      display_order: 2,
    },
  });

  const internalProcess = await prisma.perspective.upsert({
    where: { name: 'Internal Process' },
    update: {},
    create: {
      name: 'Internal Process',
      color_bg: '#fef3c7',
      color_bar: '#f59e0b',
      color_header: '#b45309',
      display_order: 3,
    },
  });

  const organization = await prisma.perspective.upsert({
    where: { name: 'Organization' },
    update: {},
    create: {
      name: 'Organization',
      color_bg: '#f3e8ff',
      color_bar: '#a855f7',
      color_header: '#7c3aed',
      display_order: 4,
    },
  });

  // Financial Initiatives (F1-F6)
  const financialInitiatives = [
    { code: 'F1', name: 'License usage audit', description: 'Conduct comprehensive audit of software license usage' },
    { code: 'F2', name: 'Real-time license monitoring system', description: 'Implement system to monitor license usage in real-time' },
    { code: 'F3', name: 'Open-source alternatives assessment', description: 'Evaluate open-source alternatives to proprietary software' },
    { code: 'F4', name: 'Pilot testing open-source solutions', description: 'Test selected open-source solutions in controlled environment' },
    { code: 'F5', name: 'Migration roadmap development', description: 'Develop roadmap for migrating to open-source solutions' },
    { code: 'F6', name: 'Staff training on open-source tools', description: 'Train staff on using open-source tools' },
  ];

  // Customer Initiatives (C1-C11)
  const customerInitiatives = [
    { code: 'C1', name: 'Project/task management system', description: 'Implement project and task management system' },
    { code: 'C2', name: 'Extend CMMS functionality', description: 'Extend Computerized Maintenance Management System features' },
    { code: 'C3', name: 'Extend PMS functionality', description: 'Extend Property Management System features' },
    { code: 'C4', name: 'Boatyard Management System (ERD)', description: 'Develop Entity Relationship Diagram for Boatyard Management System' },
    { code: 'C5', name: 'Digitize historical records (CS)', description: 'Digitize historical records for Customer Service' },
    { code: 'C6', name: 'Digitalize board paper submission (CS)', description: 'Digitalize board paper submission process for Customer Service' },
    { code: 'C7', name: 'Implement Retail module (TD)', description: 'Implement Retail module for Trade Division' },
    { code: 'C8', name: 'Implement CRM module (TD)', description: 'Implement Customer Relationship Management module for Trade Division' },
    { code: 'C9', name: 'Helpdesk KPIs and metrics', description: 'Define and track helpdesk KPIs and metrics' },
    { code: 'C10', name: 'AI chatbots for support', description: 'Implement AI-powered chatbots for customer support' },
    { code: 'C11', name: 'Cybersecurity awareness training', description: 'Provide cybersecurity awareness training to customers' },
  ];

  // Internal Process Initiatives (I1-I7)
  const internalProcessInitiatives = [
    { code: 'I1', name: 'Define SLAs for critical services', description: 'Define Service Level Agreements for critical ICT services' },
    { code: 'I2', name: 'SLA monitoring and reporting tools', description: 'Implement tools for monitoring and reporting SLA performance' },
    { code: 'I3', name: 'Regular SLA performance reviews', description: 'Establish regular review process for SLA performance' },
    { code: 'I4', name: 'Corrective measures for SLA issues', description: 'Develop process for corrective measures when SLA issues occur' },
    { code: 'I5', name: 'ICT staff SLA management training', description: 'Train ICT staff on SLA management' },
    { code: 'I6', name: 'Map IT processes and identify gaps', description: 'Map existing IT processes and identify gaps' },
    { code: 'I7', name: 'Standardized workflows documentation', description: 'Document standardized workflows' },
  ];

  // Organization Initiatives (O1-O6)
  const organizationInitiatives = [
    { code: 'O1', name: 'Technical workshops/knowledge sharing', description: 'Organize technical workshops and knowledge sharing sessions' },
    { code: 'O2', name: 'Certification incentives program', description: 'Establish certification incentives program for staff' },
    { code: 'O3', name: 'Pilot emerging technologies', description: 'Pilot emerging technologies to evaluate potential' },
    { code: 'O4', name: 'Innovation lab/sandbox environment', description: 'Set up innovation lab and sandbox environment' },
    { code: 'O5', name: 'Innovation brainstorming sessions', description: 'Conduct innovation brainstorming sessions' },
    { code: 'O6', name: 'Reward technology adoption success', description: 'Establish rewards for successful technology adoption' },
  ];

  // Create all initiatives
  let displayOrder = 1;

  for (const init of financialInitiatives) {
    await prisma.initiative.upsert({
      where: { code: init.code },
      update: {},
      create: {
        ...init,
        perspective_id: financial.id,
        display_order: displayOrder++,
        priority: 'medium',
      },
    });
  }

  for (const init of customerInitiatives) {
    await prisma.initiative.upsert({
      where: { code: init.code },
      update: {},
      create: {
        ...init,
        perspective_id: customer.id,
        display_order: displayOrder++,
        priority: 'medium',
      },
    });
  }

  for (const init of internalProcessInitiatives) {
    await prisma.initiative.upsert({
      where: { code: init.code },
      update: {},
      create: {
        ...init,
        perspective_id: internalProcess.id,
        display_order: displayOrder++,
        priority: 'medium',
      },
    });
  }

  for (const init of organizationInitiatives) {
    await prisma.initiative.upsert({
      where: { code: init.code },
      update: {},
      create: {
        ...init,
        perspective_id: organization.id,
        display_order: displayOrder++,
        priority: 'medium',
      },
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

