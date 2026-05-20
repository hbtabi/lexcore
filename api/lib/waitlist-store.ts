import fs from "fs";
import path from "path";

interface WaitlistEntry {
  id: number;
  fullName: string;
  email: string;
  company: string | null;
  role: string | null;
  interest: string | null;
  createdAt: string;
}

const STORE_PATH = path.resolve(process.cwd(), "data/waitlist.json");

function ensureDir() {
  const dir = path.dirname(STORE_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function seedData(): WaitlistEntry[] {
  const names = [
    "Sarah Chen", "Marcus Johnson", "Priya Patel", "James Mitchell",
    "Elena Rodriguez", "David Kim", "Aisha Williams", "Thomas Anderson",
    "Maria Garcia", "Robert Taylor", "Lisa Brown", "Kevin Nguyen",
    "Amanda Foster", "Christopher Lee", "Natasha Singh", "Brandon Davis",
    "Rachel Green", "Daniel Martinez", "Olivia Wilson", "Jonathan Clark",
    "Sophia Turner", "Michael Adams", "Emily White", "Ryan Jackson",
    "Isabella Moore", "William Harris", "Mia Thompson", "Alexander Lewis",
    "Charlotte Robinson", "Benjamin Walker", "Amelia Hall", "Henry Young",
    "Harper King", "Sebastian Wright", "Evelyn Scott", "Jack Green",
    "Abigail Baker", "Owen Hill", "Ella Nelson", "Lucas Carter",
    "Avery Mitchell", "Mason Roberts", "Scarlett Turner", "Logan Phillips",
    "Grace Campbell", "Ethan Parker", "Chloe Evans", "Jacob Edwards",
    "Zoey Collins", "Dylan Stewart",
  ];

  const companies = [
    "Google", "Microsoft", "Apple", "Amazon", "Meta", "Tesla", "Netflix",
    "Stripe", "Shopify", "Airbnb", "Uber", "Spotify", "Slack", "Twitter",
    "Goldman Sachs", "JP Morgan", "Harvard Law", "Stanford Law", "Yale Law",
    null, null, null, null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null, null, null,
  ];

  const interests = [
    "Contract review automation", "Employment law consultation",
    "Housing dispute resolution", "Immigration legal help",
    "Small claims guidance", "Legal document generation",
    "Corporate compliance", "Intellectual property",
    "Family law support", "Criminal defense research",
    "Tax law guidance", "Real estate legal services",
    "Startup legal framework", "Non-profit legal advice",
    "International law research", "Consumer rights protection",
    "Data privacy compliance", "Healthcare regulations",
    "Environmental law", "Education law policy",
  ];

  return names.map((name, i) => ({
    id: i + 1,
    fullName: name,
    email: `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
    company: companies[i % companies.length] || null,
    role: i % 3 === 0 ? "Legal Counsel" : i % 3 === 1 ? "Founder" : "Engineer",
    interest: interests[i % interests.length],
    createdAt: new Date(Date.now() - (50 - i) * 86400000).toISOString(),
  }));
}

function load(): WaitlistEntry[] {
  try {
    ensureDir();
    if (!fs.existsSync(STORE_PATH)) {
      const seeded = seedData();
      fs.writeFileSync(STORE_PATH, JSON.stringify(seeded, null, 2));
      return seeded;
    }
    return JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
  } catch {
    const seeded = seedData();
    fs.writeFileSync(STORE_PATH, JSON.stringify(seeded, null, 2));
    return seeded;
  }
}

function save(entries: WaitlistEntry[]) {
  ensureDir();
  fs.writeFileSync(STORE_PATH, JSON.stringify(entries, null, 2));
}

export const waitlistStore = {
  count(): number {
    return load().length;
  },

  list(): WaitlistEntry[] {
    return load().reverse();
  },

  add(entry: { fullName: string; email: string; company?: string; role?: string; interest?: string }): { success: boolean; message: string; id?: number } {
    const entries = load();

    const existing = entries.find(e => e.email.toLowerCase() === entry.email.toLowerCase());
    if (existing) {
      return { success: false, message: "This email is already on the waitlist." };
    }

    const maxId = entries.reduce((max, e) => Math.max(max, e.id), 0);
    const newEntry: WaitlistEntry = {
      id: maxId + 1,
      fullName: entry.fullName,
      email: entry.email,
      company: entry.company || null,
      role: entry.role || null,
      interest: entry.interest || null,
      createdAt: new Date().toISOString(),
    };

    entries.push(newEntry);
    save(entries);

    return { success: true, message: "You've been added to the waitlist!", id: newEntry.id };
  },
};
