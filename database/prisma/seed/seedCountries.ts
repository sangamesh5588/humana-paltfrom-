import { PrismaClient, MasterStatus } from '@prisma/client';

export async function seedCountries(prisma: PrismaClient) {
  console.log('Seeding countries from public repository...');
  
  try {
    const res = await fetch('https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/json/countries.json');
    if (!res.ok) {
      throw new Error(`Failed to fetch countries: ${res.statusText}`);
    }
    const rawCountries = await res.json() as any[];
    
    console.log(`Fetched ${rawCountries.length} countries. Starting upsert...`);
    
    let count = 0;
    for (const c of rawCountries) {
      if (!c.iso2 || !c.iso3) continue;
      
      const rawPhone = c.phonecode ? String(c.phonecode) : null;
      const phoneCode = rawPhone
        ? (rawPhone.startsWith('+') ? rawPhone : '+' + rawPhone) 
        : null;
        
      const timezone = c.timezones && c.timezones.length > 0 
        ? c.timezones[0].zoneName 
        : null;

      const flagUrl = `https://flagcdn.com/w320/${c.iso2.toLowerCase()}.png`;

      await prisma.country.upsert({
        where: { iso2: c.iso2 },
        update: {
          name: c.name,
          iso3: c.iso3,
          phoneCode,
          currency: c.currency || null,
          currencySymbol: c.currency_symbol || null,
          timezone,
          flagEmoji: c.emoji || null,
          flagUrl,
          continent: c.region || null,
        },
        create: {
          name: c.name,
          iso2: c.iso2,
          iso3: c.iso3,
          phoneCode,
          currency: c.currency || null,
          currencySymbol: c.currency_symbol || null,
          timezone,
          flagEmoji: c.emoji || null,
          flagUrl,
          continent: c.region || null,
          status: MasterStatus.ACTIVE,
        },
      });
      count++;
    }
    
    console.log(`Successfully upserted ${count} countries.`);
  } catch (error) {
    console.error('Failed to fetch countries online, seeding fallback...', error);
    
    // Fallback countries
    const fallbackCountries = [
      { name: 'India', iso2: 'IN', iso3: 'IND', phoneCode: '+91', currency: 'INR', flagEmoji: '🇮🇳', continent: 'Asia' },
      { name: 'United States', iso2: 'US', iso3: 'USA', phoneCode: '+1', currency: 'USD', flagEmoji: '🇺🇸', continent: 'North America' },
      { name: 'United Kingdom', iso2: 'GB', iso3: 'GBR', phoneCode: '+44', currency: 'GBP', flagEmoji: '🇬🇧', continent: 'Europe' },
      { name: 'Canada', iso2: 'CA', iso3: 'CAN', phoneCode: '+1', currency: 'CAD', flagEmoji: '🇨🇦', continent: 'North America' },
      { name: 'Australia', iso2: 'AU', iso3: 'AUS', phoneCode: '+61', currency: 'AUD', flagEmoji: '🇦🇺', continent: 'Oceania' },
      { name: 'Germany', iso2: 'DE', iso3: 'DEU', phoneCode: '+49', currency: 'EUR', flagEmoji: '🇩🇪', continent: 'Europe' },
      { name: 'France', iso2: 'FR', iso3: 'FRA', phoneCode: '+33', currency: 'EUR', flagEmoji: '🇫🇷', continent: 'Europe' },
      { name: 'Japan', iso2: 'JP', iso3: 'JPN', phoneCode: '+81', currency: 'JPY', flagEmoji: '🇯🇵', continent: 'Asia' },
    ];
    
    for (const c of fallbackCountries) {
      await prisma.country.upsert({
        where: { iso2: c.iso2 },
        update: {},
        create: {
          ...c,
          status: MasterStatus.ACTIVE,
        },
      });
    }
    console.log(`Seeded ${fallbackCountries.length} fallback countries.`);
  }
}
