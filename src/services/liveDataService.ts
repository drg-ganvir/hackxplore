import { InternshipCard, Scholarship, HackathonCard, HackathonType } from "@/types";

const YEAR = new Date().getFullYear();

// ─── CACHE ───────────────────────────────────────────────────────────────────
// In-memory cache so navigating back doesn't re-fetch
const cache: Record<string, { data: unknown; ts: number }> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchJSON<T>(url: string, timeout = 8000): Promise<T> {
  const cached = cache[url];
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data as T;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    cache[url] = { data, ts: Date.now() };
    return data as T;
  } finally {
    clearTimeout(timer);
  }
}

// ─── HACKATHONS ───────────────────────────────────────────────────────────────
// Devpost supports CORS — fetch directly, no proxy needed.

interface DevpostHackathon {
  id: number;
  title: string;
  url: string;
  display_location: string;
  submission_period_dates: string;
  prize_amount: string;
  themes: { name: string; id: string }[];
  organization_name: string;
  thumbnail_url: string;
  registrations_count: number;
  featured: boolean;
}

function parsePrize(s: string): number {
  if (!s) return 0;
  const n = s.replace(/[^0-9]/g, "");
  return n ? parseInt(n, 10) : 0;
}

function parseDates(dateStr: string) {
  const fallback = {
    start: new Date().toISOString().split("T")[0],
    end: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    deadline: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
  };
  if (!dateStr) return fallback;
  try {
    // "Apr 1 - May 31, 2026"  or  "Mar 15 - Apr 15"
    const parts = dateStr.split(" - ");
    const startStr = parts[0]?.trim();
    const endStr = parts[1]?.trim();
    const yr = endStr?.match(/\d{4}/)?.[0] || String(YEAR);
    const start = new Date(`${startStr} ${yr}`);
    const end = endStr ? new Date(endStr) : new Date(start.getTime() + 30 * 86400000);
    if (isNaN(start.getTime())) return fallback;
    const deadline = new Date(start.getTime() - 7 * 86400000);
    return {
      start: start.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0],
      deadline: deadline.toISOString().split("T")[0],
    };
  } catch {
    return fallback;
  }
}

function toType(themes: { name: string }[]): HackathonType {
  const s = themes.map((t) => t.name.toLowerCase()).join(" ");
  if (s.includes("ai") || s.includes("machine learning")) return "AI/ML";
  if (s.includes("web3") || s.includes("blockchain")) return "Web3";
  if (s.includes("mobile")) return "Mobile";
  if (s.includes("iot") || s.includes("hardware")) return "IoT";
  if (s.includes("health")) return "HealthTech";
  if (s.includes("education")) return "EdTech";
  if (s.includes("game")) return "Game Development";
  if (s.includes("beginner")) return "Beginner-Friendly";
  return "Open";
}

export async function fetchLiveHackathons(): Promise<HackathonCard[]> {
  try {
    // Devpost supports CORS — direct fetch works in browser
    const data = await fetchJSON<{ hackathons: DevpostHackathon[] }>(
      "https://devpost.com/api/hackathons?status[]=upcoming&status[]=open&order_by=deadline&per_page=24"
    );
    if (!data?.hackathons?.length) throw new Error("empty");

    return data.hackathons.map((h) => {
      const { start, end, deadline } = parseDates(h.submission_period_dates);
      const loc = h.display_location || "Online";
      const online =
        !h.display_location ||
        /online|virtual|remote/i.test(h.display_location);
      return {
        id: `devpost-${h.id}`,
        title: h.title,
        organizer: h.organization_name || "Devpost",
        startDate: start,
        endDate: end,
        location: loc,
        mode: online ? "Online" : "In-person",
        prizePool: parsePrize(h.prize_amount),
        tags: h.themes?.map((t) => t.name) ?? [],
        applicationDeadline: deadline,
        url: h.url,
        image: h.thumbnail_url || "",
        isPopular: h.featured || h.registrations_count > 500,
        type: toType(h.themes ?? []),
        description: `${h.submission_period_dates}${h.prize_amount ? ` · Prize: ${h.prize_amount}` : ""}`,
      } as HackathonCard;
    });
  } catch (err) {
    console.warn("fetchLiveHackathons failed, using curated data:", err);
    return CURATED_HACKATHONS;
  }
}

// Curated fallback — always current-year dates
const CURATED_HACKATHONS: HackathonCard[] = [
  {
    id: "hk-1", title: `Smart India Hackathon ${YEAR}`,
    organizer: "Govt. of India", startDate: `${YEAR}-08-01`, endDate: `${YEAR}-08-03`,
    location: "India (Multiple Locations)", mode: "In-person", prizePool: 100000,
    tags: ["Open Innovation", "GovTech"], applicationDeadline: `${YEAR}-07-15`,
    url: "https://www.sih.gov.in/", image: "", isPopular: true, type: "Open",
  },
  {
    id: "hk-2", title: `HackWithInfy ${YEAR}`,
    organizer: "Infosys", startDate: `${YEAR}-06-01`, endDate: `${YEAR}-06-30`,
    location: "Online", mode: "Online", prizePool: 500000,
    tags: ["AI/ML", "Open Innovation"], applicationDeadline: `${YEAR}-05-15`,
    url: "https://hackwithinfy.com/", image: "", isPopular: true, type: "AI/ML",
  },
  {
    id: "hk-3", title: `Google Solution Challenge ${YEAR}`,
    organizer: "Google", startDate: `${YEAR}-02-01`, endDate: `${YEAR}-04-30`,
    location: "Online", mode: "Online", prizePool: 50000,
    tags: ["AI/ML", "Sustainability"], applicationDeadline: `${YEAR}-03-31`,
    url: "https://developers.google.com/community/gdsc-solution-challenge", image: "", isPopular: true, type: "AI/ML",
  },
  {
    id: "hk-4", title: `Microsoft Imagine Cup ${YEAR}`,
    organizer: "Microsoft", startDate: `${YEAR}-10-01`, endDate: `${YEAR}-12-31`,
    location: "Online", mode: "Online", prizePool: 125000,
    tags: ["AI/ML", "Open Innovation"], applicationDeadline: `${YEAR}-09-30`,
    url: "https://imaginecup.microsoft.com/", image: "", isPopular: true, type: "AI/ML",
  },
  {
    id: "hk-5", title: `ETHGlobal Hackathon ${YEAR}`,
    organizer: "ETHGlobal", startDate: `${YEAR}-09-01`, endDate: `${YEAR}-09-03`,
    location: "Online", mode: "Online", prizePool: 200000,
    tags: ["Blockchain", "Web3"], applicationDeadline: `${YEAR}-08-25`,
    url: "https://ethglobal.com/", image: "", isPopular: true, type: "Web3",
  },
  {
    id: "hk-6", title: `Flipkart Grid ${YEAR}`,
    organizer: "Flipkart", startDate: `${YEAR}-07-01`, endDate: `${YEAR}-09-30`,
    location: "Online + Bengaluru", mode: "Hybrid", prizePool: 300000,
    tags: ["E-Commerce", "AI/ML"], applicationDeadline: `${YEAR}-06-30`,
    url: "https://dare2compete.com/competition/flipkart-grid", image: "", isPopular: true, type: "Open",
  },
  {
    id: "hk-7", title: `HackNITR ${YEAR}`,
    organizer: "NIT Rourkela", startDate: `${YEAR}-03-14`, endDate: `${YEAR}-03-16`,
    location: "Rourkela, India", mode: "In-person", prizePool: 80000,
    tags: ["Open Innovation", "Web Development"], applicationDeadline: `${YEAR}-03-01`,
    url: "https://hacknitr.com/", image: "", isPopular: false, type: "Open",
  },
  {
    id: "hk-8", title: `Codeforces Round ${YEAR}`,
    organizer: "Codeforces", startDate: `${YEAR}-05-01`, endDate: `${YEAR}-05-01`,
    location: "Online", mode: "Online", prizePool: 10000,
    tags: ["Competitive Programming"], applicationDeadline: `${YEAR}-04-28`,
    url: "https://codeforces.com/", image: "", isPopular: false, type: "Open",
  },
  {
    id: "hk-9", title: `BuildSpace Nights & Weekends ${YEAR}`,
    organizer: "Buildspace", startDate: `${YEAR}-06-01`, endDate: `${YEAR}-08-31`,
    location: "Online", mode: "Online", prizePool: 0,
    tags: ["AI/ML", "Web3", "Open Innovation"], applicationDeadline: `${YEAR}-05-20`,
    url: "https://buildspace.so/", image: "", isPopular: true, type: "AI/ML",
  },
];

// ─── INTERNSHIPS via Remotive (native CORS support) ───────────────────────────

interface RemotiveJob {
  id: number; url: string; title: string;
  company_name: string; company_logo: string;
  tags: string[]; publication_date: string;
  candidate_required_location: string; salary: string; description: string;
}

function extractSkills(tags: string[], title: string): string[] {
  const kw = ["Python","JavaScript","TypeScript","React","Node.js","Java","C++","Go",
    "Rust","SQL","AWS","Azure","GCP","Docker","Kubernetes","Machine Learning",
    "AI","Data Science","DevOps","iOS","Android","Flutter","Swift","Kotlin","Vue","Angular"];
  const combined = [...tags, title].join(" ").toLowerCase();
  return kw.filter((k) => combined.includes(k.toLowerCase())).slice(0, 5);
}

function stipend(salary: string): number {
  if (!salary) return 0;
  const n = salary.match(/\d[\d,]*/g);
  if (!n) return 0;
  const v = parseInt(n[0].replace(/,/g, ""), 10);
  return v > 10000 ? Math.round(v / 12) : v;
}

export async function fetchLiveInternships(): Promise<InternshipCard[]> {
  try {
    // Remotive supports CORS — all categories in parallel for speed
    const categories = ["software-dev", "data", "devops-sysadmin", "design"];
    const responses = await Promise.all(
      categories.map((cat) =>
        fetchJSON<{ jobs: RemotiveJob[] }>(
          `https://remotive.com/api/remote-jobs?category=${cat}&limit=10`
        ).catch(() => ({ jobs: [] }))
      )
    );

    const seen = new Set<string>();
    const results: InternshipCard[] = [];

    for (const res of responses) {
      for (const job of res.jobs ?? []) {
        const key = `${job.company_name}-${job.title}`;
        if (seen.has(key)) continue;
        seen.add(key);

        const cleanDesc = job.description
          .replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 280);
        const posted = new Date(job.publication_date);
        const deadline = new Date(posted.getTime() + 60 * 86400000);
        const skills = extractSkills(job.tags ?? [], job.title);

        results.push({
          id: `remotive-${job.id}`,
          title: job.title,
          company: job.company_name,
          location: job.candidate_required_location || "Remote",
          imageUrl: job.company_logo || "",
          logo: job.company_logo || "",
          isRemote: true,
          stipend: stipend(job.salary),
          duration: "3-6 months",
          skills,
          requiredSkills: skills,
          postedDate: job.publication_date.split("T")[0],
          applicationDeadline: deadline.toISOString().split("T")[0],
          type: "Tech",
          companySize: "Large",
          description: cleanDesc || "Exciting opportunity at a leading tech company.",
          url: job.url,
        });
      }
    }
    return results.slice(0, 24);
  } catch (err) {
    console.warn("fetchLiveInternships failed:", err);
    return [];
  }
}

// ─── SCHOLARSHIPS (curated, always current year) ──────────────────────────────

const LIVE_SCHOLARSHIPS: Scholarship[] = [
  { id: "s1", title: `Google Generation Scholarship ${YEAR}`, provider: "Google", amount: 10000, deadline: `${YEAR}-06-15`, type: "STEM", eligibility: ["Undergraduate Students", "CS Majors", "GPA 3.5+", "Underrepresented Groups"], link: "https://buildyourfuture.withgoogle.com/scholarships", description: "Google's Generation Scholarship helps aspiring CS students excel in technology with a $10,000 award for the academic year." },
  { id: "s2", title: `Microsoft Scholarship Program ${YEAR}`, provider: "Microsoft", amount: 15000, deadline: `${YEAR}-07-01`, type: "Diversity", eligibility: ["Undergraduate Students", "CS Majors", "Women in STEM", "GPA 3.0+"], link: "https://careers.microsoft.com/students/us/en/usscholarshipprogram", description: "Microsoft supports underrepresented students in STEM with financial aid and mentorship." },
  { id: "s3", title: `Amazon Future Engineer Scholarship ${YEAR}`, provider: "Amazon", amount: 40000, deadline: `${YEAR}-05-20`, type: "Merit-based", eligibility: ["High School Seniors", "CS Intent", "Financial Need", "GPA 3.0+"], link: "https://www.amazonfutureengineer.com/scholarships", description: "$40,000 over four years for underrepresented students planning to study computer science." },
  { id: "s4", title: `Adobe Women-in-Technology Scholarship ${YEAR}`, provider: "Adobe", amount: 10000, deadline: `${YEAR}-08-10`, type: "Diversity", eligibility: ["Undergraduate Female Students", "CS or Engineering", "GPA 3.0+"], link: "https://research.adobe.com/scholarship/", description: "Recognizes outstanding female CS/engineering students with a $10,000 grant and Adobe mentorship." },
  { id: "s5", title: `Meta Research PhD Fellowship ${YEAR}`, provider: "Meta", amount: 42000, deadline: `${YEAR}-10-01`, type: "Research", eligibility: ["PhD Students", "AI/VR/Privacy Research", "International Students"], link: "https://research.facebook.com/fellowship/", description: "Full tuition + stipend for doctoral students in innovative CS and engineering research." },
  { id: "s6", title: `NVIDIA Graduate Fellowship ${YEAR}`, provider: "NVIDIA", amount: 50000, deadline: `${YEAR}-11-15`, type: "Research", eligibility: ["PhD Students", "AI/Graphics/HPC Research", "International Students"], link: "https://www.nvidia.com/en-us/research/graduate-fellowships/", description: "NVIDIA funds PhD students in GPU computing, AI, robotics, and computer vision." },
  { id: "s7", title: `IBM Watson Memorial Scholarship ${YEAR}`, provider: "IBM", amount: 25000, deadline: `${YEAR}-05-15`, type: "Merit-based", eligibility: ["Undergraduate Students", "CS or Engineering", "Leadership", "GPA 3.5+"], link: "https://www.ibm.com/services/volunteers/grant-programs.html", description: "Rewards academic excellence and leadership in students pursuing technology innovation." },
  { id: "s8", title: `Palantir Women in Tech Scholarship ${YEAR}`, provider: "Palantir", amount: 7000, deadline: `${YEAR}-09-30`, type: "Diversity", eligibility: ["Undergraduate Women", "STEM Majors", "GPA 3.0+", "US Citizens/PR"], link: "https://www.palantir.com/careers/students/scholarship/", description: "Financial support and Palantir engineer mentorship for women in STEM." },
  { id: "s9", title: `Qualcomm Innovation Fellowship ${YEAR}`, provider: "Qualcomm", amount: 100000, deadline: `${YEAR}-10-15`, type: "Research", eligibility: ["PhD Students", "Engineering or CS", "Mobile/AI Research", "US Universities"], link: "https://www.qualcomm.com/research/university-relations/innovation-fellowship", description: "Funds pairs of PhD students doing innovative research relevant to Qualcomm's technologies." },
  { id: "s10", title: `Dell Scholars Program ${YEAR}`, provider: "Dell", amount: 20000, deadline: `${YEAR}-12-01`, type: "Need-based", eligibility: ["Undergraduate Students", "Financial Need", "First-Generation", "STEM Majors"], link: "https://www.dellscholars.org/", description: "$20,000 over two years with strong community support for students overcoming financial obstacles." },
  { id: "s11", title: `Salesforce FutureForce Scholarship ${YEAR}`, provider: "Salesforce", amount: 5000, deadline: `${YEAR}-07-31`, type: "Merit-based", eligibility: ["Undergraduate Students", "Business or CS", "GPA 3.0+", "Community Service"], link: "https://trailhead.salesforce.com/career-path/scholarship", description: "Rewards students combining academic excellence with community service in tech or business." },
  { id: "s12", title: `Apple HBCU Scholars Program ${YEAR}`, provider: "Apple", amount: 15000, deadline: `${YEAR}-03-31`, type: "Diversity", eligibility: ["HBCU Students", "STEM Majors", "GPA 3.0+", "US Citizens"], link: "https://www.apple.com/diversity/", description: "Scholarship + Apple summer internship for students from Historically Black Colleges and Universities." },
];

export async function fetchLiveScholarships(): Promise<Scholarship[]> {
  return LIVE_SCHOLARSHIPS;
}
