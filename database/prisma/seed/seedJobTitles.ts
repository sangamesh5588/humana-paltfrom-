import { PrismaClient, MasterStatus, JobLevel } from '@prisma/client';

export async function seedJobTitles(prisma: PrismaClient) {
  console.log('Seeding job titles...');

  const jobTitles = [
    // ─── Engineering & IT ──────────────────────────────────────
    { title: 'Software Engineer', slug: 'software-engineer', category: 'Engineering', level: JobLevel.MID },
    { title: 'Junior Software Engineer', slug: 'junior-software-engineer', category: 'Engineering', level: JobLevel.JUNIOR },
    { title: 'Senior Software Engineer', slug: 'senior-software-engineer', category: 'Engineering', level: JobLevel.SENIOR },
    { title: 'Lead Software Engineer', slug: 'lead-software-engineer', category: 'Engineering', level: JobLevel.LEAD },
    { title: 'Staff Engineer', slug: 'staff-engineer', category: 'Engineering', level: JobLevel.SENIOR },
    { title: 'Principal Engineer', slug: 'principal-engineer', category: 'Engineering', level: JobLevel.SENIOR },
    { title: 'Frontend Engineer', slug: 'frontend-engineer', category: 'Engineering', level: JobLevel.MID },
    { title: 'Senior Frontend Engineer', slug: 'senior-frontend-engineer', category: 'Engineering', level: JobLevel.SENIOR },
    { title: 'Backend Engineer', slug: 'backend-engineer', category: 'Engineering', level: JobLevel.MID },
    { title: 'Senior Backend Engineer', slug: 'senior-backend-engineer', category: 'Engineering', level: JobLevel.SENIOR },
    { title: 'Full Stack Engineer', slug: 'full-stack-engineer', category: 'Engineering', level: JobLevel.MID },
    { title: 'Senior Full Stack Engineer', slug: 'senior-full-stack-engineer', category: 'Engineering', level: JobLevel.SENIOR },
    { title: 'Mobile Engineer', slug: 'mobile-engineer', category: 'Engineering', level: JobLevel.MID },
    { title: 'DevOps Engineer', slug: 'devops-engineer', category: 'Engineering', level: JobLevel.MID },
    { title: 'Senior DevOps Engineer', slug: 'senior-devops-engineer', category: 'Engineering', level: JobLevel.SENIOR },
    { title: 'Site Reliability Engineer', slug: 'site-reliability-engineer', category: 'Engineering', level: JobLevel.MID },
    { title: 'QA Engineer', slug: 'qa-engineer', category: 'Engineering', level: JobLevel.MID },
    { title: 'Security Engineer', slug: 'security-engineer', category: 'Engineering', level: JobLevel.MID },
    { title: 'Data Engineer', slug: 'data-engineer', category: 'Engineering', level: JobLevel.MID },
    { title: 'Senior Data Engineer', slug: 'senior-data-engineer', category: 'Engineering', level: JobLevel.SENIOR },
    { title: 'Cloud Architect', slug: 'cloud-architect', category: 'Engineering', level: JobLevel.SENIOR },
    { title: 'Solutions Architect', slug: 'solutions-architect', category: 'Engineering', level: JobLevel.SENIOR },
    { title: 'Engineering Manager', slug: 'engineering-manager', category: 'Engineering Management', level: JobLevel.MANAGER },
    { title: 'Director of Engineering', slug: 'director-of-engineering', category: 'Engineering Management', level: JobLevel.DIRECTOR },

    // ─── Data Science & AI ─────────────────────────────────────
    { title: 'Data Scientist', slug: 'data-scientist', category: 'Data Science', level: JobLevel.MID },
    { title: 'Senior Data Scientist', slug: 'senior-data-scientist', category: 'Data Science', level: JobLevel.SENIOR },
    { title: 'Data Analyst', slug: 'data-analyst', category: 'Data Science', level: JobLevel.MID },
    { title: 'Machine Learning Engineer', slug: 'machine-learning-engineer', category: 'Artificial Intelligence', level: JobLevel.MID },
    { title: 'Senior ML Engineer', slug: 'senior-ml-engineer', category: 'Artificial Intelligence', level: JobLevel.SENIOR },
    { title: 'AI Researcher', slug: 'ai-researcher', category: 'Artificial Intelligence', level: JobLevel.MID },

    // ─── Product Management ────────────────────────────────────
    { title: 'Product Manager', slug: 'product-manager', category: 'Product', level: JobLevel.MID },
    { title: 'Associate Product Manager', slug: 'associate-product-manager', category: 'Product', level: JobLevel.JUNIOR },
    { title: 'Senior Product Manager', slug: 'senior-product-manager', category: 'Product', level: JobLevel.SENIOR },
    { title: 'Lead Product Manager', slug: 'lead-product-manager', category: 'Product', level: JobLevel.LEAD },
    { title: 'Director of Product', slug: 'director-of-product', category: 'Product', level: JobLevel.DIRECTOR },
    { title: 'Technical Product Manager', slug: 'technical-product-manager', category: 'Product', level: JobLevel.MID },

    // ─── Design & Creative ─────────────────────────────────────
    { title: 'Product Designer', slug: 'product-designer', category: 'Design', level: JobLevel.MID },
    { title: 'Senior Product Designer', slug: 'senior-product-designer', category: 'Design', level: JobLevel.SENIOR },
    { title: 'UI/UX Designer', slug: 'ui-ux-designer', category: 'Design', level: JobLevel.MID },
    { title: 'UX Researcher', slug: 'ux-researcher', category: 'Design', level: JobLevel.MID },
    { title: 'Graphic Designer', slug: 'graphic-designer', category: 'Design', level: JobLevel.MID },
    { title: 'Creative Director', slug: 'creative-director', category: 'Design', level: JobLevel.DIRECTOR },
    { title: 'Lead Designer', slug: 'lead-designer', category: 'Design', level: JobLevel.LEAD },

    // ─── Marketing ─────────────────────────────────────────────
    { title: 'Marketing Manager', slug: 'marketing-manager', category: 'Marketing', level: JobLevel.MID },
    { title: 'Growth Marketer', slug: 'growth-marketer', category: 'Marketing', level: JobLevel.MID },
    { title: 'SEO Specialist', slug: 'seo-specialist', category: 'Marketing', level: JobLevel.MID },
    { title: 'Content Writer', slug: 'content-writer', category: 'Marketing', level: JobLevel.MID },
    { title: 'Social Media Manager', slug: 'social-media-manager', category: 'Marketing', level: JobLevel.MID },
    { title: 'Brand Manager', slug: 'brand-manager', category: 'Marketing', level: JobLevel.MID },
    { title: 'Product Marketing Manager', slug: 'product-marketing-manager', category: 'Marketing', level: JobLevel.MID },
    { title: 'Director of Marketing', slug: 'director-of-marketing', category: 'Marketing', level: JobLevel.DIRECTOR },

    // ─── Sales & Business Development ──────────────────────────
    { title: 'Account Executive', slug: 'account-executive', category: 'Sales', level: JobLevel.MID },
    { title: 'Senior Account Executive', slug: 'senior-account-executive', category: 'Sales', level: JobLevel.SENIOR },
    { title: 'Business Development Representative', slug: 'business-development-representative', category: 'Sales', level: JobLevel.JUNIOR },
    { title: 'Sales Development Representative', slug: 'sales-development-representative', category: 'Sales', level: JobLevel.JUNIOR },
    { title: 'Sales Manager', slug: 'sales-manager', category: 'Sales', level: JobLevel.MANAGER },
    { title: 'Customer Success Manager', slug: 'customer-success-manager', category: 'Sales', level: JobLevel.MID },
    { title: 'Account Manager', slug: 'account-manager', category: 'Sales', level: JobLevel.MID },

    // ─── Finance & Accounting ──────────────────────────────────
    { title: 'Financial Analyst', slug: 'financial-analyst', category: 'Finance', level: JobLevel.MID },
    { title: 'Senior Financial Analyst', slug: 'senior-financial-analyst', category: 'Finance', level: JobLevel.SENIOR },
    { title: 'Accountant', slug: 'accountant', category: 'Finance', level: JobLevel.MID },
    { title: 'Senior Accountant', slug: 'senior-accountant', category: 'Finance', level: JobLevel.SENIOR },
    { title: 'Finance Manager', slug: 'finance-manager', category: 'Finance', level: JobLevel.MANAGER },
    { title: 'Investment Banker', slug: 'investment-banker', category: 'Finance', level: JobLevel.MID },
    { title: 'Portfolio Manager', slug: 'portfolio-manager', category: 'Finance', level: JobLevel.MANAGER },
    { title: 'Controller', slug: 'controller', category: 'Finance', level: JobLevel.DIRECTOR },

    // ─── Human Resources ───────────────────────────────────────
    { title: 'HR Manager', slug: 'hr-manager', category: 'Human Resources', level: JobLevel.MANAGER },
    { title: 'HR Specialist', slug: 'hr-specialist', category: 'Human Resources', level: JobLevel.MID },
    { title: 'Technical Recruiter', slug: 'technical-recruiter', category: 'Human Resources', level: JobLevel.MID },
    { title: 'Recruiting Coordinator', slug: 'recruiting-coordinator', category: 'Human Resources', level: JobLevel.JUNIOR },
    { title: 'People Ops Manager', slug: 'people-ops-manager', category: 'Human Resources', level: JobLevel.MANAGER },
    { title: 'Director of Human Resources', slug: 'director-of-human-resources', category: 'Human Resources', level: JobLevel.DIRECTOR },

    // ─── Operations & Consulting ───────────────────────────────
    { title: 'Operations Manager', slug: 'operations-manager', category: 'Operations', level: JobLevel.MANAGER },
    { title: 'Operations Associate', slug: 'operations-associate', category: 'Operations', level: JobLevel.JUNIOR },
    { title: 'Project Manager', slug: 'project-manager', category: 'Operations', level: JobLevel.MID },
    { title: 'Program Manager', slug: 'program-manager', category: 'Operations', level: JobLevel.MID },
    { title: 'Management Consultant', slug: 'management-consultant', category: 'Consulting', level: JobLevel.MID },
    { title: 'Senior Consultant', slug: 'senior-consultant', category: 'Consulting', level: JobLevel.SENIOR },

    // ─── Executive & Leadership ────────────────────────────────
    { title: 'Chief Executive Officer', slug: 'chief-executive-officer', category: 'Executive', level: JobLevel.C_LEVEL },
    { title: 'Chief Technology Officer', slug: 'chief-technology-officer', category: 'Executive', level: JobLevel.C_LEVEL },
    { title: 'Chief Product Officer', slug: 'chief-product-officer', category: 'Executive', level: JobLevel.C_LEVEL },
    { title: 'Chief Operating Officer', slug: 'chief-operating-officer', category: 'Executive', level: JobLevel.C_LEVEL },
    { title: 'Chief Financial Officer', slug: 'chief-financial-officer', category: 'Executive', level: JobLevel.C_LEVEL },
    { title: 'Chief Marketing Officer', slug: 'chief-marketing-officer', category: 'Executive', level: JobLevel.C_LEVEL },
    { title: 'VP of Engineering', slug: 'vp-of-engineering', category: 'Executive', level: JobLevel.VP },
    { title: 'VP of Product', slug: 'vp-of-product', category: 'Executive', level: JobLevel.VP },
    { title: 'VP of Sales', slug: 'vp-of-sales', category: 'Executive', level: JobLevel.VP },
    { title: 'VP of Marketing', slug: 'vp-of-marketing', category: 'Executive', level: JobLevel.VP },

    // ─── Legal & Compliance ────────────────────────────────────
    { title: 'General Counsel', slug: 'general-counsel', category: 'Legal', level: JobLevel.C_LEVEL },
    { title: 'Legal Counsel', slug: 'legal-counsel', category: 'Legal', level: JobLevel.MID },
    { title: 'Corporate Attorney', slug: 'corporate-attorney', category: 'Legal', level: JobLevel.MID },
    { title: 'Compliance Officer', slug: 'compliance-officer', category: 'Legal', level: JobLevel.MID },
    { title: 'Paralegal', slug: 'paralegal', category: 'Legal', level: JobLevel.JUNIOR },

    // ─── Healthcare & Medical ──────────────────────────────────
    { title: 'Medical Doctor', slug: 'medical-doctor', category: 'Healthcare', level: JobLevel.MID },
    { title: 'Registered Nurse', slug: 'registered-nurse', category: 'Healthcare', level: JobLevel.MID },
    { title: 'Physician Assistant', slug: 'physician-assistant', category: 'Healthcare', level: JobLevel.MID },
    { title: 'Pharmacist', slug: 'pharmacist', category: 'Healthcare', level: JobLevel.MID },
    { title: 'Physical Therapist', slug: 'physical-therapist', category: 'Healthcare', level: JobLevel.MID },
    { title: 'Clinical Director', slug: 'clinical-director', category: 'Healthcare', level: JobLevel.DIRECTOR },

    // ─── Miscellaneous & Internships ───────────────────────────
    { title: 'Software Engineering Intern', slug: 'software-engineering-intern', category: 'Engineering', level: JobLevel.INTERN },
    { title: 'Product Management Intern', slug: 'product-management-intern', category: 'Product', level: JobLevel.INTERN },
    { title: 'Marketing Intern', slug: 'marketing-intern', category: 'Marketing', level: JobLevel.INTERN },
    { title: 'Business Analyst', slug: 'business-analyst', category: 'Operations', level: JobLevel.MID },
    { title: 'Research Assistant', slug: 'research-assistant', category: 'Science', level: JobLevel.JUNIOR },
    { title: 'Customer Support Representative', slug: 'customer-support-representative', category: 'Support', level: JobLevel.JUNIOR },
  ];

  let count = 0;
  for (const job of jobTitles) {
    await prisma.jobTitle.upsert({
      where: { slug: job.slug },
      update: {
        title: job.title,
        category: job.category,
        level: job.level,
      },
      create: {
        title: job.title,
        slug: job.slug,
        category: job.category,
        level: job.level,
        status: MasterStatus.ACTIVE,
      },
    });
    count++;
  }
  console.log(`Seeded ${count} job titles.`);
}

