import { PrismaClient, MasterStatus } from '@prisma/client';

interface CompanyEntry {
  name: string;
  slug: string;
  website: string;
  domain: string; // for logo URL
  country: string; // iso2
  industry: string; // slug
  description?: string;
}

const COMPANIES: CompanyEntry[] = [
  // ─── INFORMATION TECHNOLOGY ──────────────────────────
  { name: 'Google', slug: 'google', website: 'https://google.com', domain: 'google.com', country: 'US', industry: 'information-technology', description: 'Search engine, cloud computing, AI' },
  { name: 'Microsoft', slug: 'microsoft', website: 'https://microsoft.com', domain: 'microsoft.com', country: 'US', industry: 'information-technology', description: 'Software, cloud, enterprise solutions' },
  { name: 'Apple', slug: 'apple', website: 'https://apple.com', domain: 'apple.com', country: 'US', industry: 'information-technology', description: 'Consumer electronics, software, services' },
  { name: 'Amazon', slug: 'amazon', website: 'https://amazon.com', domain: 'amazon.com', country: 'US', industry: 'information-technology', description: 'E-commerce, cloud computing (AWS)' },
  { name: 'Meta', slug: 'meta', website: 'https://meta.com', domain: 'meta.com', country: 'US', industry: 'information-technology', description: 'Social media, virtual reality' },
  { name: 'Netflix', slug: 'netflix', website: 'https://netflix.com', domain: 'netflix.com', country: 'US', industry: 'information-technology', description: 'Streaming entertainment' },
  { name: 'Tesla', slug: 'tesla', website: 'https://tesla.com', domain: 'tesla.com', country: 'US', industry: 'manufacturing', description: 'Electric vehicles, clean energy' },
  { name: 'NVIDIA', slug: 'nvidia', website: 'https://nvidia.com', domain: 'nvidia.com', country: 'US', industry: 'information-technology', description: 'GPUs, AI computing' },
  { name: 'Adobe', slug: 'adobe', website: 'https://adobe.com', domain: 'adobe.com', country: 'US', industry: 'information-technology', description: 'Creative software, digital media' },
  { name: 'Salesforce', slug: 'salesforce', website: 'https://salesforce.com', domain: 'salesforce.com', country: 'US', industry: 'information-technology', description: 'Cloud-based CRM' },
  { name: 'Oracle', slug: 'oracle', website: 'https://oracle.com', domain: 'oracle.com', country: 'US', industry: 'information-technology', description: 'Database, cloud, enterprise software' },
  { name: 'IBM', slug: 'ibm', website: 'https://ibm.com', domain: 'ibm.com', country: 'US', industry: 'information-technology', description: 'Enterprise computing, AI, consulting' },
  { name: 'Intel', slug: 'intel', website: 'https://intel.com', domain: 'intel.com', country: 'US', industry: 'information-technology', description: 'Semiconductors, processors' },
  { name: 'Cisco', slug: 'cisco', website: 'https://cisco.com', domain: 'cisco.com', country: 'US', industry: 'information-technology', description: 'Networking, cybersecurity' },
  { name: 'Uber', slug: 'uber', website: 'https://uber.com', domain: 'uber.com', country: 'US', industry: 'information-technology', description: 'Ride-sharing, food delivery' },
  { name: 'Airbnb', slug: 'airbnb', website: 'https://airbnb.com', domain: 'airbnb.com', country: 'US', industry: 'information-technology', description: 'Online marketplace for lodging' },
  { name: 'Spotify', slug: 'spotify', website: 'https://spotify.com', domain: 'spotify.com', country: 'SE', industry: 'information-technology', description: 'Music streaming' },
  { name: 'Shopify', slug: 'shopify', website: 'https://shopify.com', domain: 'shopify.com', country: 'CA', industry: 'information-technology', description: 'E-commerce platform' },
  { name: 'Stripe', slug: 'stripe', website: 'https://stripe.com', domain: 'stripe.com', country: 'US', industry: 'information-technology', description: 'Online payments infrastructure' },
  { name: 'Zoom', slug: 'zoom', website: 'https://zoom.us', domain: 'zoom.us', country: 'US', industry: 'information-technology', description: 'Video communications' },
  { name: 'Slack', slug: 'slack', website: 'https://slack.com', domain: 'slack.com', country: 'US', industry: 'information-technology', description: 'Business messaging' },
  { name: 'Twitter', slug: 'twitter', website: 'https://x.com', domain: 'x.com', country: 'US', industry: 'information-technology', description: 'Social media platform' },
  { name: 'LinkedIn', slug: 'linkedin', website: 'https://linkedin.com', domain: 'linkedin.com', country: 'US', industry: 'information-technology', description: 'Professional networking' },
  { name: 'Snap Inc.', slug: 'snap', website: 'https://snap.com', domain: 'snap.com', country: 'US', industry: 'information-technology', description: 'Camera and social media' },
  { name: 'PayPal', slug: 'paypal', website: 'https://paypal.com', domain: 'paypal.com', country: 'US', industry: 'information-technology', description: 'Digital payments' },
  { name: 'Palantir Technologies', slug: 'palantir', website: 'https://palantir.com', domain: 'palantir.com', country: 'US', industry: 'information-technology', description: 'Big data analytics' },
  { name: 'Snowflake', slug: 'snowflake', website: 'https://snowflake.com', domain: 'snowflake.com', country: 'US', industry: 'information-technology', description: 'Cloud data platform' },
  { name: 'Atlassian', slug: 'atlassian', website: 'https://atlassian.com', domain: 'atlassian.com', country: 'AU', industry: 'information-technology', description: 'Team collaboration software' },
  { name: 'SAP', slug: 'sap', website: 'https://sap.com', domain: 'sap.com', country: 'DE', industry: 'information-technology', description: 'Enterprise software, ERP' },
  { name: 'Samsung Electronics', slug: 'samsung', website: 'https://samsung.com', domain: 'samsung.com', country: 'KR', industry: 'information-technology', description: 'Electronics, semiconductors' },
  { name: 'Sony', slug: 'sony', website: 'https://sony.com', domain: 'sony.com', country: 'JP', industry: 'information-technology', description: 'Electronics, gaming, entertainment' },
  { name: 'Tata Consultancy Services', slug: 'tcs', website: 'https://tcs.com', domain: 'tcs.com', country: 'IN', industry: 'information-technology', description: 'IT services, consulting' },
  { name: 'Infosys', slug: 'infosys', website: 'https://infosys.com', domain: 'infosys.com', country: 'IN', industry: 'information-technology', description: 'IT services, digital transformation' },
  { name: 'Wipro', slug: 'wipro', website: 'https://wipro.com', domain: 'wipro.com', country: 'IN', industry: 'information-technology', description: 'IT services, consulting' },
  { name: 'HCLTech', slug: 'hcltech', website: 'https://hcltech.com', domain: 'hcltech.com', country: 'IN', industry: 'information-technology', description: 'IT services, engineering' },
  { name: 'Tech Mahindra', slug: 'tech-mahindra', website: 'https://techmahindra.com', domain: 'techmahindra.com', country: 'IN', industry: 'information-technology', description: 'IT services, BPO' },
  { name: 'Accenture', slug: 'accenture', website: 'https://accenture.com', domain: 'accenture.com', country: 'IE', industry: 'information-technology', description: 'Professional services, consulting' },
  { name: 'Capgemini', slug: 'capgemini', website: 'https://capgemini.com', domain: 'capgemini.com', country: 'FR', industry: 'information-technology', description: 'IT consulting, digital services' },
  { name: 'Deloitte', slug: 'deloitte', website: 'https://deloitte.com', domain: 'deloitte.com', country: 'GB', industry: 'information-technology', description: 'Consulting, audit, advisory' },
  { name: 'Cognizant', slug: 'cognizant', website: 'https://cognizant.com', domain: 'cognizant.com', country: 'US', industry: 'information-technology', description: 'IT services, consulting' },
  { name: 'Alibaba', slug: 'alibaba', website: 'https://alibaba.com', domain: 'alibaba.com', country: 'CN', industry: 'information-technology', description: 'E-commerce, cloud computing' },
  { name: 'Tencent', slug: 'tencent', website: 'https://tencent.com', domain: 'tencent.com', country: 'CN', industry: 'information-technology', description: 'Social media, gaming, fintech' },
  { name: 'ByteDance', slug: 'bytedance', website: 'https://bytedance.com', domain: 'bytedance.com', country: 'CN', industry: 'information-technology', description: 'TikTok parent, short video, AI' },
  { name: 'Baidu', slug: 'baidu', website: 'https://baidu.com', domain: 'baidu.com', country: 'CN', industry: 'information-technology', description: 'Search engine, AI, autonomous driving' },

  // ─── FINANCIAL SERVICES ──────────────────────────────
  { name: 'JPMorgan Chase', slug: 'jpmorgan', website: 'https://jpmorganchase.com', domain: 'jpmorganchase.com', country: 'US', industry: 'financial-services', description: 'Investment banking, financial services' },
  { name: 'Goldman Sachs', slug: 'goldman-sachs', website: 'https://goldmansachs.com', domain: 'goldmansachs.com', country: 'US', industry: 'financial-services', description: 'Investment banking, securities' },
  { name: 'Morgan Stanley', slug: 'morgan-stanley', website: 'https://morganstanley.com', domain: 'morganstanley.com', country: 'US', industry: 'financial-services', description: 'Investment banking, wealth management' },
  { name: 'Bank of America', slug: 'bank-of-america', website: 'https://bankofamerica.com', domain: 'bankofamerica.com', country: 'US', industry: 'financial-services', description: 'Banking, financial services' },
  { name: 'Citigroup', slug: 'citigroup', website: 'https://citi.com', domain: 'citi.com', country: 'US', industry: 'financial-services', description: 'Financial services, banking' },
  { name: 'Wells Fargo', slug: 'wells-fargo', website: 'https://wellsfargo.com', domain: 'wellsfargo.com', country: 'US', industry: 'financial-services', description: 'Banking, financial services' },
  { name: 'HSBC', slug: 'hsbc', website: 'https://hsbc.com', domain: 'hsbc.com', country: 'GB', industry: 'financial-services', description: 'Banking, financial services' },
  { name: 'Barclays', slug: 'barclays', website: 'https://barclays.com', domain: 'barclays.com', country: 'GB', industry: 'financial-services', description: 'Banking, investment services' },
  { name: 'Deutsche Bank', slug: 'deutsche-bank', website: 'https://db.com', domain: 'db.com', country: 'DE', industry: 'financial-services', description: 'Investment banking, asset management' },
  { name: 'UBS', slug: 'ubs', website: 'https://ubs.com', domain: 'ubs.com', country: 'CH', industry: 'financial-services', description: 'Wealth management, banking' },
  { name: 'Credit Suisse', slug: 'credit-suisse', website: 'https://credit-suisse.com', domain: 'credit-suisse.com', country: 'CH', industry: 'financial-services', description: 'Banking, financial services' },
  { name: 'BNP Paribas', slug: 'bnp-paribas', website: 'https://bnpparibas.com', domain: 'bnpparibas.com', country: 'FR', industry: 'financial-services', description: 'Banking, financial services' },
  { name: 'ICICI Bank', slug: 'icici-bank', website: 'https://icicibank.com', domain: 'icicibank.com', country: 'IN', industry: 'financial-services', description: 'Banking, insurance, investments' },
  { name: 'HDFC Bank', slug: 'hdfc-bank', website: 'https://hdfcbank.com', domain: 'hdfcbank.com', country: 'IN', industry: 'financial-services', description: 'Banking, financial services' },
  { name: 'State Bank of India', slug: 'sbi', website: 'https://sbi.co.in', domain: 'sbi.co.in', country: 'IN', industry: 'financial-services', description: 'Public sector banking' },
  { name: 'Kotak Mahindra Bank', slug: 'kotak-mahindra', website: 'https://kotak.com', domain: 'kotak.com', country: 'IN', industry: 'financial-services', description: 'Banking, financial services' },
  { name: 'Visa', slug: 'visa', website: 'https://visa.com', domain: 'visa.com', country: 'US', industry: 'financial-services', description: 'Digital payments' },
  { name: 'Mastercard', slug: 'mastercard', website: 'https://mastercard.com', domain: 'mastercard.com', country: 'US', industry: 'financial-services', description: 'Payment technology' },
  { name: 'American Express', slug: 'american-express', website: 'https://americanexpress.com', domain: 'americanexpress.com', country: 'US', industry: 'financial-services', description: 'Financial services, credit cards' },
  { name: 'BlackRock', slug: 'blackrock', website: 'https://blackrock.com', domain: 'blackrock.com', country: 'US', industry: 'financial-services', description: 'Asset management' },
  { name: 'Fidelity Investments', slug: 'fidelity', website: 'https://fidelity.com', domain: 'fidelity.com', country: 'US', industry: 'financial-services', description: 'Asset management, brokerage' },
  { name: 'Charles Schwab', slug: 'charles-schwab', website: 'https://schwab.com', domain: 'schwab.com', country: 'US', industry: 'financial-services', description: 'Brokerage, wealth management' },
  { name: 'Razorpay', slug: 'razorpay', website: 'https://razorpay.com', domain: 'razorpay.com', country: 'IN', industry: 'financial-services', description: 'Digital payments, fintech' },

  // ─── HEALTHCARE ──────────────────────────────────────
  { name: 'Johnson & Johnson', slug: 'johnson-and-johnson', website: 'https://jnj.com', domain: 'jnj.com', country: 'US', industry: 'healthcare', description: 'Pharmaceuticals, medical devices' },
  { name: 'Pfizer', slug: 'pfizer', website: 'https://pfizer.com', domain: 'pfizer.com', country: 'US', industry: 'healthcare', description: 'Pharmaceuticals, vaccines' },
  { name: 'UnitedHealth Group', slug: 'unitedhealth', website: 'https://unitedhealthgroup.com', domain: 'unitedhealthgroup.com', country: 'US', industry: 'healthcare', description: 'Health insurance, services' },
  { name: 'Abbott Laboratories', slug: 'abbott', website: 'https://abbott.com', domain: 'abbott.com', country: 'US', industry: 'healthcare', description: 'Medical devices, diagnostics' },
  { name: 'Merck', slug: 'merck', website: 'https://merck.com', domain: 'merck.com', country: 'US', industry: 'healthcare', description: 'Pharmaceuticals, vaccines' },
  { name: 'AstraZeneca', slug: 'astrazeneca', website: 'https://astrazeneca.com', domain: 'astrazeneca.com', country: 'GB', industry: 'healthcare', description: 'Pharmaceuticals, biotechnology' },
  { name: 'Novartis', slug: 'novartis', website: 'https://novartis.com', domain: 'novartis.com', country: 'CH', industry: 'healthcare', description: 'Pharmaceuticals' },
  { name: 'Roche', slug: 'roche', website: 'https://roche.com', domain: 'roche.com', country: 'CH', industry: 'healthcare', description: 'Pharmaceuticals, diagnostics' },
  { name: 'Moderna', slug: 'moderna', website: 'https://modernatx.com', domain: 'modernatx.com', country: 'US', industry: 'healthcare', description: 'Biotechnology, mRNA therapeutics' },
  { name: 'Sun Pharmaceutical', slug: 'sun-pharma', website: 'https://sunpharma.com', domain: 'sunpharma.com', country: 'IN', industry: 'healthcare', description: 'Pharmaceuticals, generics' },
  { name: 'Cipla', slug: 'cipla', website: 'https://cipla.com', domain: 'cipla.com', country: 'IN', industry: 'healthcare', description: 'Pharmaceuticals' },
  { name: 'Apollo Hospitals', slug: 'apollo-hospitals', website: 'https://apollohospitals.com', domain: 'apollohospitals.com', country: 'IN', industry: 'healthcare', description: 'Hospital chain, healthcare' },
  { name: 'Mayo Clinic', slug: 'mayo-clinic', website: 'https://mayoclinic.org', domain: 'mayoclinic.org', country: 'US', industry: 'healthcare', description: 'Medical research, hospital' },

  // ─── EDUCATION ───────────────────────────────────────
  { name: 'Coursera', slug: 'coursera', website: 'https://coursera.org', domain: 'coursera.org', country: 'US', industry: 'education', description: 'Online learning platform' },
  { name: 'Udemy', slug: 'udemy', website: 'https://udemy.com', domain: 'udemy.com', country: 'US', industry: 'education', description: 'Online courses marketplace' },
  { name: 'Khan Academy', slug: 'khan-academy', website: 'https://khanacademy.org', domain: 'khanacademy.org', country: 'US', industry: 'education', description: 'Free online education' },
  { name: 'Duolingo', slug: 'duolingo', website: 'https://duolingo.com', domain: 'duolingo.com', country: 'US', industry: 'education', description: 'Language learning platform' },
  { name: "BYJU'S", slug: 'byjus', website: 'https://byjus.com', domain: 'byjus.com', country: 'IN', industry: 'education', description: 'EdTech, online learning' },
  { name: 'Unacademy', slug: 'unacademy', website: 'https://unacademy.com', domain: 'unacademy.com', country: 'IN', industry: 'education', description: 'Online education platform' },
  { name: 'Chegg', slug: 'chegg', website: 'https://chegg.com', domain: 'chegg.com', country: 'US', industry: 'education', description: 'Student-first education platform' },
  { name: 'Pearson', slug: 'pearson', website: 'https://pearson.com', domain: 'pearson.com', country: 'GB', industry: 'education', description: 'Publishing, education services' },
  { name: 'McGraw Hill', slug: 'mcgraw-hill', website: 'https://mheducation.com', domain: 'mheducation.com', country: 'US', industry: 'education', description: 'Educational publishing' },

  // ─── MANUFACTURING ───────────────────────────────────
  { name: 'Toyota', slug: 'toyota', website: 'https://toyota.com', domain: 'toyota.com', country: 'JP', industry: 'manufacturing', description: 'Automobiles' },
  { name: 'Volkswagen', slug: 'volkswagen', website: 'https://volkswagen.com', domain: 'volkswagen.com', country: 'DE', industry: 'manufacturing', description: 'Automobiles' },
  { name: 'BMW', slug: 'bmw', website: 'https://bmw.com', domain: 'bmw.com', country: 'DE', industry: 'manufacturing', description: 'Luxury automobiles' },
  { name: 'Mercedes-Benz', slug: 'mercedes-benz', website: 'https://mercedes-benz.com', domain: 'mercedes-benz.com', country: 'DE', industry: 'manufacturing', description: 'Luxury automobiles' },
  { name: 'Ford', slug: 'ford', website: 'https://ford.com', domain: 'ford.com', country: 'US', industry: 'manufacturing', description: 'Automobiles, trucks' },
  { name: 'General Motors', slug: 'general-motors', website: 'https://gm.com', domain: 'gm.com', country: 'US', industry: 'manufacturing', description: 'Automobiles' },
  { name: 'Hyundai', slug: 'hyundai', website: 'https://hyundai.com', domain: 'hyundai.com', country: 'KR', industry: 'manufacturing', description: 'Automobiles' },
  { name: 'Honda', slug: 'honda', website: 'https://honda.com', domain: 'honda.com', country: 'JP', industry: 'manufacturing', description: 'Automobiles, motorcycles' },
  { name: 'Tata Motors', slug: 'tata-motors', website: 'https://tatamotors.com', domain: 'tatamotors.com', country: 'IN', industry: 'manufacturing', description: 'Automobiles, commercial vehicles' },
  { name: 'Mahindra & Mahindra', slug: 'mahindra', website: 'https://mahindra.com', domain: 'mahindra.com', country: 'IN', industry: 'manufacturing', description: 'Automobiles, farm equipment' },
  { name: 'Reliance Industries', slug: 'reliance', website: 'https://ril.com', domain: 'ril.com', country: 'IN', industry: 'manufacturing', description: 'Energy, petrochemicals, telecom' },
  { name: 'Siemens', slug: 'siemens', website: 'https://siemens.com', domain: 'siemens.com', country: 'DE', industry: 'manufacturing', description: 'Industrial automation, energy' },
  { name: 'General Electric', slug: 'general-electric', website: 'https://ge.com', domain: 'ge.com', country: 'US', industry: 'manufacturing', description: 'Aviation, energy, healthcare tech' },
  { name: '3M', slug: '3m', website: 'https://3m.com', domain: '3m.com', country: 'US', industry: 'manufacturing', description: 'Diversified manufacturing' },
  { name: 'Boeing', slug: 'boeing', website: 'https://boeing.com', domain: 'boeing.com', country: 'US', industry: 'manufacturing', description: 'Aerospace, defense' },
  { name: 'Airbus', slug: 'airbus', website: 'https://airbus.com', domain: 'airbus.com', country: 'FR', industry: 'manufacturing', description: 'Aerospace, defense' },
  { name: 'Caterpillar', slug: 'caterpillar', website: 'https://caterpillar.com', domain: 'caterpillar.com', country: 'US', industry: 'manufacturing', description: 'Heavy equipment, machinery' },
  { name: 'Larsen & Toubro', slug: 'larsen-toubro', website: 'https://larsentoubro.com', domain: 'larsentoubro.com', country: 'IN', industry: 'manufacturing', description: 'Engineering, construction' },

  // ─── RETAIL ──────────────────────────────────────────
  { name: 'Walmart', slug: 'walmart', website: 'https://walmart.com', domain: 'walmart.com', country: 'US', industry: 'retail', description: 'Retail, wholesale' },
  { name: 'Costco', slug: 'costco', website: 'https://costco.com', domain: 'costco.com', country: 'US', industry: 'retail', description: 'Wholesale retail' },
  { name: 'Target', slug: 'target', website: 'https://target.com', domain: 'target.com', country: 'US', industry: 'retail', description: 'Retail department stores' },
  { name: 'IKEA', slug: 'ikea', website: 'https://ikea.com', domain: 'ikea.com', country: 'SE', industry: 'retail', description: 'Furniture, home goods' },
  { name: 'Zara', slug: 'zara', website: 'https://zara.com', domain: 'zara.com', country: 'ES', industry: 'retail', description: 'Fast fashion' },
  { name: 'H&M', slug: 'hm', website: 'https://hm.com', domain: 'hm.com', country: 'SE', industry: 'retail', description: 'Fashion retail' },
  { name: 'Nike', slug: 'nike', website: 'https://nike.com', domain: 'nike.com', country: 'US', industry: 'retail', description: 'Sportswear, footwear' },
  { name: 'Adidas', slug: 'adidas', website: 'https://adidas.com', domain: 'adidas.com', country: 'DE', industry: 'retail', description: 'Sportswear, footwear' },
  { name: 'Unilever', slug: 'unilever', website: 'https://unilever.com', domain: 'unilever.com', country: 'GB', industry: 'retail', description: 'Consumer goods, FMCG' },
  { name: 'Procter & Gamble', slug: 'procter-gamble', website: 'https://pg.com', domain: 'pg.com', country: 'US', industry: 'retail', description: 'Consumer goods, FMCG' },
  { name: 'Nestle', slug: 'nestle', website: 'https://nestle.com', domain: 'nestle.com', country: 'CH', industry: 'retail', description: 'Food, beverages' },
  { name: 'Coca-Cola', slug: 'coca-cola', website: 'https://coca-cola.com', domain: 'coca-cola.com', country: 'US', industry: 'retail', description: 'Beverages' },
  { name: 'PepsiCo', slug: 'pepsico', website: 'https://pepsico.com', domain: 'pepsico.com', country: 'US', industry: 'retail', description: 'Food, beverages' },
  { name: 'Flipkart', slug: 'flipkart', website: 'https://flipkart.com', domain: 'flipkart.com', country: 'IN', industry: 'retail', description: 'E-commerce' },
  { name: 'Myntra', slug: 'myntra', website: 'https://myntra.com', domain: 'myntra.com', country: 'IN', industry: 'retail', description: 'Fashion e-commerce' },
  { name: 'Swiggy', slug: 'swiggy', website: 'https://swiggy.com', domain: 'swiggy.com', country: 'IN', industry: 'retail', description: 'Food delivery' },
  { name: 'Zomato', slug: 'zomato', website: 'https://zomato.com', domain: 'zomato.com', country: 'IN', industry: 'retail', description: 'Food delivery, restaurant discovery' },

  // ─── REAL ESTATE ─────────────────────────────────────
  { name: 'CBRE Group', slug: 'cbre', website: 'https://cbre.com', domain: 'cbre.com', country: 'US', industry: 'real-estate', description: 'Commercial real estate services' },
  { name: 'JLL', slug: 'jll', website: 'https://jll.com', domain: 'jll.com', country: 'US', industry: 'real-estate', description: 'Real estate management' },
  { name: 'WeWork', slug: 'wework', website: 'https://wework.com', domain: 'wework.com', country: 'US', industry: 'real-estate', description: 'Co-working spaces' },
  { name: 'Brookfield Asset Management', slug: 'brookfield', website: 'https://brookfield.com', domain: 'brookfield.com', country: 'CA', industry: 'real-estate', description: 'Real estate, infrastructure investment' },
  { name: 'DLF Limited', slug: 'dlf', website: 'https://dlf.in', domain: 'dlf.in', country: 'IN', industry: 'real-estate', description: 'Real estate development' },
  { name: 'Godrej Properties', slug: 'godrej-properties', website: 'https://godrejproperties.com', domain: 'godrejproperties.com', country: 'IN', industry: 'real-estate', description: 'Real estate development' },
];

export async function seedCompanies(prisma: PrismaClient) {
  console.log('Seeding companies...');

  // Pre-fetch country and industry maps for efficient lookups
  const countries = await prisma.country.findMany({ select: { id: true, iso2: true } });
  const industries = await prisma.industry.findMany({ select: { id: true, slug: true } });

  const countryMap = new Map(countries.map(c => [c.iso2, c.id]));
  const industryMap = new Map(industries.map(i => [i.slug, i.id]));

  // ── Phase 1: Upsert curated companies (with full metadata) ──
  const curatedSlugs = new Set<string>();
  let count = 0;
  for (const comp of COMPANIES) {
    const countryId = countryMap.get(comp.country) || null;
    const industryId = industryMap.get(comp.industry) || null;
    curatedSlugs.add(comp.slug);

    await prisma.company.upsert({
      where: { slug: comp.slug },
      update: {
        name: comp.name,
        website: comp.website,
        logo: `https://logo.clearbit.com/${comp.domain}`,
        countryId,
        industryId,
        description: comp.description || null,
      },
      create: {
        name: comp.name,
        slug: comp.slug,
        website: comp.website,
        logo: `https://logo.clearbit.com/${comp.domain}`,
        countryId,
        industryId,
        description: comp.description || null,
        verified: true,
        status: MasterStatus.ACTIVE,
      },
    });
    count++;
  }
  console.log(`  Phase 1: ${count} curated companies upserted.`);

  // ── Phase 2: Fetch additional companies from SEC public tickers ──
  const TARGET_TOTAL = 1000;
  const needed = TARGET_TOTAL - count;

  if (needed > 0) {
    try {
      console.log(`  Phase 2: Fetching SEC tickers to add ~${needed} more...`);
      const res = await fetch('https://www.sec.gov/files/company_tickers.json');
      if (!res.ok) throw new Error(`SEC API returned ${res.status}`);
      const raw = await res.json() as Record<string, { cik_str: number; ticker: string; title: string }>;

      // Convert to array and sort by CIK (lower = older/bigger companies)
      const tickers = Object.values(raw)
        .filter(t => t.title && t.ticker && t.ticker.length <= 5) // skip weird tickers
        .sort((a, b) => a.cik_str - b.cik_str);

      let secCount = 0;
      const usCountryId = countryMap.get('US') || null;

      for (const t of tickers) {
        if (secCount >= needed) break;

        // Clean company name: "APPLE INC" → "Apple Inc"
        const name = t.title
          .toLowerCase()
          .split(' ')
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');

        const slug = name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');

        // Skip if already in curated list or invalid slug
        if (!slug || curatedSlugs.has(slug)) continue;
        curatedSlugs.add(slug); // prevent duplicates within SEC data too

        // Best-guess domain from cleaned name
        const domain = slug.replace(/-/g, '') + '.com';

        try {
          await prisma.company.upsert({
            where: { slug },
            update: { name, countryId: usCountryId },
            create: {
              name,
              slug,
              logo: `https://logo.clearbit.com/${domain}`,
              countryId: usCountryId,
              verified: true,
              status: MasterStatus.ACTIVE,
            },
          });
          secCount++;
        } catch {
          // Skip duplicates or constraint violations
          continue;
        }
      }
      console.log(`  Phase 2: ${secCount} SEC companies added.`);
      count += secCount;
    } catch (err) {
      console.warn('  Phase 2: Could not fetch SEC data, skipping.', (err as Error).message);
    }
  }

  console.log(`Seeded ${count} companies total.`);
}
