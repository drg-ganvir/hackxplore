import { InternshipCard, Scholarship, HackathonCard, HackathonType } from "@/types";

const YEAR = new Date().getFullYear();

// ─── CACHE ────────────────────────────────────────────────────────────────────
const cache: Record<string, { data: unknown; ts: number }> = {};
const CACHE_TTL = 5 * 60 * 1000;

async function fetchJSON<T>(url: string, timeout = 8000): Promise<T | null> {
  const cached = cache[url];
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data as T;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return null;
    const data = await res.json();
    cache[url] = { data, ts: Date.now() };
    return data as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// ─── HACKATHONS ───────────────────────────────────────────────────────────────
// Strategy: Devpost API (global) + large curated India-focused list as primary

export async function fetchLiveHackathons(): Promise<HackathonCard[]> {
  try {
    // Try Devpost — works when CORS allows
    const data = await fetchJSON<{ hackathons: any[] }>(
      "https://devpost.com/api/hackathons?status[]=upcoming&status[]=open&order_by=deadline&per_page=24"
    );

    if (data?.hackathons?.length) {
      const devpostCards: HackathonCard[] = data.hackathons.map((h: any) => {
        const loc = h.display_location || "Online";
        const online = !h.display_location || /online|virtual|remote/i.test(h.display_location);
        const yr = String(YEAR);
        let start = new Date().toISOString().split("T")[0];
        let end = new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0];
        let deadline = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];
        try {
          if (h.submission_period_dates) {
            const parts = h.submission_period_dates.split(" - ");
            const s = new Date(`${parts[0]?.trim()} ${yr}`);
            const e = parts[1] ? new Date(parts[1].trim()) : new Date(s.getTime() + 30 * 86400000);
            if (!isNaN(s.getTime())) {
              start = s.toISOString().split("T")[0];
              end = e.toISOString().split("T")[0];
              deadline = new Date(s.getTime() - 7 * 86400000).toISOString().split("T")[0];
            }
          }
        } catch {}
        const prize = h.prize_amount ? parseInt(h.prize_amount.replace(/[^0-9]/g, ""), 10) : 0;
        const themes = h.themes ?? [];
        const s = themes.map((t: any) => t.name?.toLowerCase()).join(" ");
        let type: HackathonType = "Open";
        if (s.includes("ai") || s.includes("machine learning")) type = "AI/ML";
        else if (s.includes("web3") || s.includes("blockchain")) type = "Web3";
        else if (s.includes("mobile")) type = "Mobile";
        else if (s.includes("health")) type = "HealthTech";
        else if (s.includes("education")) type = "EdTech";

        return {
          id: `devpost-${h.id}`,
          title: h.title,
          organizer: h.organization_name || "Devpost",
          startDate: start, endDate: end,
          location: loc,
          mode: online ? "Online" : "In-person",
          prizePool: prize,
          tags: themes.map((t: any) => t.name).filter(Boolean),
          applicationDeadline: deadline,
          url: h.url,
          image: h.thumbnail_url || "",
          isPopular: h.featured || h.registrations_count > 500,
          type,
          description: `${h.submission_period_dates || ""}${h.prize_amount ? ` · Prize: ${h.prize_amount}` : ""}`,
        } as HackathonCard;
      });

      // Merge with India-specific ones at the top
      const merged = [...INDIA_HACKATHONS, ...devpostCards];
      const seen = new Set<string>();
      return merged.filter(h => { if (seen.has(h.title)) return false; seen.add(h.title); return true; });
    }
  } catch {}

  // Fallback: full curated list
  return CURATED_HACKATHONS;
}

// ─── CURATED HACKATHONS (India-first + Global) ────────────────────────────────

const INDIA_HACKATHONS: HackathonCard[] = [
  {
    id: "sih-2025", title: `Smart India Hackathon ${YEAR}`,
    organizer: "Govt. of India (MIC)", startDate: `${YEAR}-08-01`, endDate: `${YEAR}-08-03`,
    location: "India (Multiple Locations)", mode: "In-person", prizePool: 100000,
    tags: ["Open Innovation", "GovTech", "Social Impact"], applicationDeadline: `${YEAR}-07-01`,
    url: "https://www.sih.gov.in/", image: "https://www.sih.gov.in/uploads2/sih_logo.png",
    isPopular: true, type: "Open",
    description: "India's biggest national hackathon organized by the Government of India. Open to all college students.",
  },
  {
    id: "hackindia-2025", title: `HackIndia ${YEAR}`,
    organizer: "HackIndia", startDate: `${YEAR}-03-15`, endDate: `${YEAR}-05-31`,
    location: "Pan India (50+ cities)", mode: "Hybrid", prizePool: 500000,
    tags: ["Web3", "AI/ML", "Open Innovation"], applicationDeadline: `${YEAR}-03-01`,
    url: "https://hackindia.xyz/", image: "",
    isPopular: true, type: "Web3",
    description: "India's largest Web3 hackathon series happening across 50+ cities with massive prize pools.",
  },
  {
    id: "flipkart-grid-2025", title: `Flipkart Grid ${YEAR}`,
    organizer: "Flipkart", startDate: `${YEAR}-07-01`, endDate: `${YEAR}-09-30`,
    location: "Online + Bengaluru, India", mode: "Hybrid", prizePool: 300000,
    tags: ["E-Commerce", "AI/ML", "Robotics"], applicationDeadline: `${YEAR}-06-15`,
    url: "https://unstop.com/competitions/flipkart-grid-60-software-development-track-flipkart-grid-60-flipkart-1024247",
    image: "", isPopular: true, type: "AI/ML",
    description: "Flipkart's flagship engineering challenge for engineering students across India.",
  },
  {
    id: "hackwithinfy-2025", title: `HackWithInfy ${YEAR}`,
    organizer: "Infosys", startDate: `${YEAR}-06-01`, endDate: `${YEAR}-08-31`,
    location: "Online", mode: "Online", prizePool: 500000,
    tags: ["AI/ML", "Open Innovation", "Software Development"], applicationDeadline: `${YEAR}-05-15`,
    url: "https://hackwithinfy.com/", image: "",
    isPopular: true, type: "AI/ML",
    description: "Infosys's premier coding hackathon for engineering students with ₹5 lakh prize pool.",
  },
  {
    id: "tata-imagination-2025", title: `Tata Imagination Challenge ${YEAR}`,
    organizer: "Tata Group", startDate: `${YEAR}-09-01`, endDate: `${YEAR}-11-30`,
    location: "Online", mode: "Online", prizePool: 200000,
    tags: ["Innovation", "Sustainability", "Social Impact"], applicationDeadline: `${YEAR}-08-15`,
    url: "https://www.tata.com/imagination-challenge", image: "",
    isPopular: true, type: "Open",
    description: "Tata Group's annual innovation challenge open to students and young professionals across India.",
  },
  {
    id: "codechef-snackdown-2025", title: `CodeChef SnackDown ${YEAR}`,
    organizer: "CodeChef", startDate: `${YEAR}-08-01`, endDate: `${YEAR}-10-31`,
    location: "Online", mode: "Online", prizePool: 150000,
    tags: ["Competitive Programming", "Algorithms"], applicationDeadline: `${YEAR}-07-15`,
    url: "https://www.codechef.com/snackdown", image: "",
    isPopular: true, type: "Open",
    description: "CodeChef's global programming competition with strong Indian participation and cash prizes.",
  },
  {
    id: "hacknitr-2025", title: `HackNITR ${YEAR}`,
    organizer: "NIT Rourkela", startDate: `${YEAR}-03-14`, endDate: `${YEAR}-03-16`,
    location: "Rourkela, Odisha, India", mode: "In-person", prizePool: 80000,
    tags: ["Open Innovation", "Web Development", "AI/ML"], applicationDeadline: `${YEAR}-03-01`,
    url: "https://hacknitr.com/", image: "",
    isPopular: false, type: "Open",
    description: "One of the biggest student-run hackathons in Eastern India hosted by NIT Rourkela.",
  },
  {
    id: "devjam-2025", title: `DevJam India ${YEAR}`,
    organizer: "GFG & Unstop", startDate: `${YEAR}-10-01`, endDate: `${YEAR}-10-31`,
    location: "Online", mode: "Online", prizePool: 100000,
    tags: ["Web Development", "Mobile Development", "Open Innovation"], applicationDeadline: `${YEAR}-09-20`,
    url: "https://unstop.com/", image: "",
    isPopular: false, type: "Open",
    description: "Monthly online hackathon for Indian developers by GeeksforGeeks and Unstop.",
  },
  {
    id: "hackerearth-sprint-2025", title: `HackerEarth Monthly Sprint ${YEAR}`,
    organizer: "HackerEarth", startDate: `${YEAR}-04-01`, endDate: `${YEAR}-04-30`,
    location: "Online", mode: "Online", prizePool: 50000,
    tags: ["Competitive Programming", "Data Structures"], applicationDeadline: `${YEAR}-03-28`,
    url: "https://www.hackerearth.com/challenges/", image: "",
    isPopular: false, type: "Open",
    description: "Monthly coding sprints on HackerEarth with cash prizes for top performers.",
  },
  {
    id: "amazon-hackon-2025", title: `Amazon HackOn ${YEAR}`,
    organizer: "Amazon India", startDate: `${YEAR}-05-01`, endDate: `${YEAR}-07-31`,
    location: "Online", mode: "Online", prizePool: 300000,
    tags: ["AWS", "Cloud Computing", "AI/ML"], applicationDeadline: `${YEAR}-04-15`,
    url: "https://amazon.in/hackon", image: "",
    isPopular: true, type: "AI/ML",
    description: "Amazon India's hackathon for students to build solutions using AWS services.",
  },
];

const CURATED_HACKATHONS: HackathonCard[] = [
  ...INDIA_HACKATHONS,
  {
    id: "google-solution-2025", title: `Google Solution Challenge ${YEAR}`,
    organizer: "Google", startDate: `${YEAR}-02-01`, endDate: `${YEAR}-04-30`,
    location: "Online (Global)", mode: "Online", prizePool: 50000,
    tags: ["AI/ML", "Sustainability", "Social Impact"], applicationDeadline: `${YEAR}-03-31`,
    url: "https://developers.google.com/community/gdsc-solution-challenge",
    image: "", isPopular: true, type: "AI/ML",
    description: "Build solutions for UN Sustainable Development Goals using Google technologies.",
  },
  {
    id: "microsoft-imagine-2025", title: `Microsoft Imagine Cup ${YEAR}`,
    organizer: "Microsoft", startDate: `${YEAR}-10-01`, endDate: `${YEAR}-12-31`,
    location: "Online (Global)", mode: "Online", prizePool: 125000,
    tags: ["AI/ML", "Azure", "Open Innovation"], applicationDeadline: `${YEAR}-09-30`,
    url: "https://imaginecup.microsoft.com/",
    image: "", isPopular: true, type: "AI/ML",
    description: "Microsoft's global student technology competition with $125K in prizes.",
  },
  {
    id: "ethglobal-2025", title: `ETHGlobal Online ${YEAR}`,
    organizer: "ETHGlobal", startDate: `${YEAR}-09-01`, endDate: `${YEAR}-09-30`,
    location: "Online", mode: "Online", prizePool: 200000,
    tags: ["Blockchain", "Web3", "DeFi"], applicationDeadline: `${YEAR}-08-25`,
    url: "https://ethglobal.com/",
    image: "", isPopular: true, type: "Web3",
    description: "World's largest Ethereum hackathon with $200K+ in prizes from top Web3 sponsors.",
  },
  {
    id: "buildspace-2025", title: `Buildspace Nights & Weekends ${YEAR}`,
    organizer: "Buildspace", startDate: `${YEAR}-06-01`, endDate: `${YEAR}-08-31`,
    location: "Online", mode: "Online", prizePool: 0,
    tags: ["AI/ML", "Web3", "Startups"], applicationDeadline: `${YEAR}-05-20`,
    url: "https://buildspace.so/",
    image: "", isPopular: true, type: "AI/ML",
    description: "Build your dream project in 6 weeks with a global community of builders.",
  },
];

// ─── INTERNSHIPS ──────────────────────────────────────────────────────────────
// Primary: Remotive (remote global) + large India-specific curated list

interface RemotiveJob {
  id: number; url: string; title: string;
  company_name: string; company_logo: string;
  tags: string[]; publication_date: string;
  candidate_required_location: string; salary: string; description: string;
}

function extractSkills(tags: string[], title: string): string[] {
  const kw = ["Python", "JavaScript", "TypeScript", "React", "Node.js", "Java", "C++",
    "Go", "SQL", "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Machine Learning",
    "AI", "Data Science", "DevOps", "Flutter", "Swift", "Kotlin", "Vue", "Angular",
    "Django", "FastAPI", "Spring Boot", "Android", "iOS"];
  const combined = [...tags, title].join(" ").toLowerCase();
  return kw.filter(k => combined.includes(k.toLowerCase())).slice(0, 5);
}

function stipend(salary: string): number {
  if (!salary) return 0;
  const n = salary.match(/\d[\d,]*/g);
  if (!n) return 0;
  const v = parseInt(n[0].replace(/,/g, ""), 10);
  return v > 10000 ? Math.round(v / 12) : v;
}

export async function fetchLiveInternships(): Promise<InternshipCard[]> {
  // Always start with India internships
  const indiaInternships = [...INDIA_INTERNSHIPS];

  try {
    // Fetch remote global internships from Remotive in parallel
    const categories = ["software-dev", "data", "devops-sysadmin"];
    const responses = await Promise.all(
      categories.map(cat =>
        fetchJSON<{ jobs: RemotiveJob[] }>(
          `https://remotive.com/api/remote-jobs?category=${cat}&limit=8`
        ).catch(() => null)
      )
    );

    const seen = new Set<string>(indiaInternships.map(i => `${i.company}-${i.title}`));
    const remoteResults: InternshipCard[] = [];

    for (const res of responses) {
      if (!res?.jobs) continue;
      for (const job of res.jobs) {
        const key = `${job.company_name}-${job.title}`;
        if (seen.has(key)) continue;
        seen.add(key);

        const cleanDesc = job.description
          .replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 280);
        const posted = new Date(job.publication_date);
        const deadline = new Date(posted.getTime() + 60 * 86400000);
        const skills = extractSkills(job.tags ?? [], job.title);

        remoteResults.push({
          id: `remotive-${job.id}`,
          title: job.title,
          company: job.company_name,
          location: job.candidate_required_location || "Remote",
          imageUrl: job.company_logo || "",
          logo: job.company_logo || "",
          isRemote: true,
          stipend: stipend(job.salary),
          duration: "3-6 months",
          skills, requiredSkills: skills,
          postedDate: job.publication_date.split("T")[0],
          applicationDeadline: deadline.toISOString().split("T")[0],
          type: "Tech", companySize: "Large",
          description: cleanDesc || "Exciting remote opportunity at a leading tech company.",
          url: job.url,
        });
      }
    }

    // India first, then remote global
    return [...indiaInternships, ...remoteResults].slice(0, 30);
  } catch {
    return indiaInternships;
  }
}

// ─── INDIA INTERNSHIPS (curated, always fresh) ────────────────────────────────
const TODAY = new Date().toISOString().split("T")[0];
const IN60 = new Date(Date.now() + 60 * 86400000).toISOString().split("T")[0];
const IN45 = new Date(Date.now() + 45 * 86400000).toISOString().split("T")[0];
const IN30 = new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0];

const INDIA_INTERNSHIPS: InternshipCard[] = [
  {
    id: "in-tcs-1", title: "Software Developer Intern", company: "TCS (Tata Consultancy Services)",
    location: "Pune / Mumbai / Bengaluru, India", imageUrl: "", logo: "",
    isRemote: false, stipend: 10000, duration: "6 months",
    skills: ["Java", "Python", "SQL"], requiredSkills: ["Java", "Python", "SQL"],
    postedDate: TODAY, applicationDeadline: IN60, type: "Tech", companySize: "Large",
    description: "Work on enterprise software projects with one of India's largest IT companies. Exposure to Java, cloud, and agile methodologies.",
    url: "https://www.tcs.com/careers/india/students",
  },
  {
    id: "in-infosys-1", title: "InStep Intern – Software Engineering", company: "Infosys",
    location: "Bengaluru / Hyderabad / Pune, India", imageUrl: "", logo: "",
    isRemote: false, stipend: 15000, duration: "2-6 months",
    skills: ["Python", "Java", "React", "SQL"], requiredSkills: ["Python", "Java", "React"],
    postedDate: TODAY, applicationDeadline: IN60, type: "Tech", companySize: "Large",
    description: "Infosys InStep is one of India's most prestigious internship programs. Work on real client projects with mentorship from senior engineers.",
    url: "https://instep.infosys.com/",
  },
  {
    id: "in-wipro-1", title: "Software Engineering Intern", company: "Wipro",
    location: "Bengaluru / Chennai / Hyderabad, India", imageUrl: "", logo: "",
    isRemote: false, stipend: 12000, duration: "6 months",
    skills: ["Java", "Python", "Cloud Computing", "SQL"], requiredSkills: ["Java", "Python"],
    postedDate: TODAY, applicationDeadline: IN60, type: "Tech", companySize: "Large",
    description: "Join Wipro's engineering team and work on digital transformation projects for global clients.",
    url: "https://careers.wipro.com/students",
  },
  {
    id: "in-google-blr-1", title: "Software Engineering Intern (India)", company: "Google",
    location: "Bengaluru, India", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2008px-Google_%22G%22_Logo.svg.png",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2008px-Google_%22G%22_Logo.svg.png",
    isRemote: false, stipend: 80000, duration: "3 months",
    skills: ["Python", "C++", "Java", "Algorithms"], requiredSkills: ["Python", "C++", "Algorithms"],
    postedDate: TODAY, applicationDeadline: IN45, type: "Tech", companySize: "Large",
    description: "Google India's flagship SWE internship in Bengaluru. Work on cutting-edge products used by billions worldwide.",
    url: "https://careers.google.com/students/",
  },
  {
    id: "in-microsoft-hyd-1", title: "Software Engineering Intern", company: "Microsoft India",
    location: "Hyderabad, India", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/2048px-Microsoft_logo_%282012%29.svg.png",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/2048px-Microsoft_logo_%282012%29.svg.png",
    isRemote: false, stipend: 70000, duration: "2 months",
    skills: ["C#", "Azure", "TypeScript", "Python"], requiredSkills: ["C#", "Azure", "Python"],
    postedDate: TODAY, applicationDeadline: IN45, type: "Tech", companySize: "Large",
    description: "Microsoft's India Development Center (IDC) in Hyderabad. Work on Azure, Office, or Xbox products.",
    url: "https://careers.microsoft.com/students/",
  },
  {
    id: "in-amazon-blr-1", title: "SDE Intern", company: "Amazon India",
    location: "Bengaluru, India", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png",
    isRemote: false, stipend: 75000, duration: "3 months",
    skills: ["Java", "Python", "AWS", "Data Structures"], requiredSkills: ["Java", "AWS", "Data Structures"],
    postedDate: TODAY, applicationDeadline: IN45, type: "Tech", companySize: "Large",
    description: "Amazon India SDE internship in Bengaluru. Build scalable systems used by millions of customers.",
    url: "https://www.amazon.jobs/en/teams/internships-for-students",
  },
  {
    id: "in-flipkart-1", title: "Software Development Intern", company: "Flipkart",
    location: "Bengaluru, India", imageUrl: "", logo: "",
    isRemote: false, stipend: 50000, duration: "2-6 months",
    skills: ["Java", "Python", "React", "Node.js"], requiredSkills: ["Java", "Python", "React"],
    postedDate: TODAY, applicationDeadline: IN60, type: "Tech", companySize: "Large",
    description: "Work on India's largest e-commerce platform. Build features used by 400M+ customers.",
    url: "https://www.flipkartcareers.com/#!/internship",
  },
  {
    id: "in-swiggy-1", title: "Backend Engineering Intern", company: "Swiggy",
    location: "Bengaluru, India", imageUrl: "", logo: "",
    isRemote: true, stipend: 40000, duration: "3-6 months",
    skills: ["Python", "Go", "Node.js", "Kubernetes"], requiredSkills: ["Python", "Go", "Node.js"],
    postedDate: TODAY, applicationDeadline: IN45, type: "Tech", companySize: "Large",
    description: "Build systems that power food delivery for 500+ cities. Work on real-time logistics and ML pipelines.",
    url: "https://careers.swiggy.com/",
  },
  {
    id: "in-zomato-1", title: "Software Engineering Intern", company: "Zomato",
    location: "Gurugram, India (Remote OK)", imageUrl: "", logo: "",
    isRemote: true, stipend: 35000, duration: "3-6 months",
    skills: ["Python", "React", "Node.js", "AWS"], requiredSkills: ["Python", "React", "Node.js"],
    postedDate: TODAY, applicationDeadline: IN45, type: "Tech", companySize: "Large",
    description: "Work on Zomato's core apps — restaurant discovery, delivery, Hyperpure supply chain. Remote-friendly!",
    url: "https://www.zomato.com/careers",
  },
  {
    id: "in-razorpay-1", title: "Full Stack Intern", company: "Razorpay",
    location: "Bengaluru, India", imageUrl: "", logo: "",
    isRemote: true, stipend: 30000, duration: "3-6 months",
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL"], requiredSkills: ["React", "Node.js", "TypeScript"],
    postedDate: TODAY, applicationDeadline: IN30, type: "Tech", companySize: "Medium",
    description: "Build India's leading payment infrastructure. Work on dashboards, APIs, and checkout experiences.",
    url: "https://razorpay.com/jobs/",
  },
  {
    id: "in-byju-1", title: "Product Engineering Intern", company: "BYJU'S",
    location: "Bengaluru, India", imageUrl: "", logo: "",
    isRemote: true, stipend: 20000, duration: "3 months",
    skills: ["React", "Python", "Android", "iOS"], requiredSkills: ["React", "Python"],
    postedDate: TODAY, applicationDeadline: IN60, type: "Tech", companySize: "Large",
    description: "Work on edtech products that reach 150M+ students. Focus on personalized learning and gamification.",
    url: "https://byjus.com/jobs/",
  },
  {
    id: "in-meesho-1", title: "Data Science Intern", company: "Meesho",
    location: "Bengaluru, India (Remote)", imageUrl: "", logo: "",
    isRemote: true, stipend: 25000, duration: "3-6 months",
    skills: ["Python", "Machine Learning", "SQL", "Data Science"], requiredSkills: ["Python", "Machine Learning", "SQL"],
    postedDate: TODAY, applicationDeadline: IN45, type: "Tech", companySize: "Large",
    description: "Build ML models for India's largest social commerce platform serving 140M+ entrepreneurs.",
    url: "https://meesho.io/careers",
  },
  {
    id: "in-paytm-1", title: "Android Developer Intern", company: "Paytm",
    location: "Noida, India", imageUrl: "", logo: "",
    isRemote: false, stipend: 20000, duration: "3-6 months",
    skills: ["Android", "Kotlin", "Java", "REST"], requiredSkills: ["Android", "Kotlin", "Java"],
    postedDate: TODAY, applicationDeadline: IN60, type: "Tech", companySize: "Large",
    description: "Build features for India's largest digital payments app used by 300M+ users.",
    url: "https://paytm.com/careers",
  },
  {
    id: "in-ola-1", title: "ML Engineering Intern", company: "Ola",
    location: "Bengaluru, India", imageUrl: "", logo: "",
    isRemote: false, stipend: 30000, duration: "3-6 months",
    skills: ["Python", "Machine Learning", "Deep Learning", "TensorFlow"], requiredSkills: ["Python", "Machine Learning"],
    postedDate: TODAY, applicationDeadline: IN45, type: "Tech", companySize: "Large",
    description: "Work on ML systems for ride-hailing, maps, EV products at Ola's AI lab in Bengaluru.",
    url: "https://ola.jobs/",
  },
  {
    id: "in-cred-1", title: "Frontend Engineering Intern", company: "CRED",
    location: "Bengaluru, India", imageUrl: "", logo: "",
    isRemote: true, stipend: 35000, duration: "3-6 months",
    skills: ["React", "TypeScript", "CSS", "JavaScript"], requiredSkills: ["React", "TypeScript"],
    postedDate: TODAY, applicationDeadline: IN30, type: "Tech", companySize: "Medium",
    description: "Build beautiful, performant UIs for CRED's fintech products used by India's top credit cardholders.",
    url: "https://careers.cred.club/",
  },
  {
    id: "in-zerodha-1", title: "Software Engineering Intern", company: "Zerodha",
    location: "Bengaluru, India", imageUrl: "", logo: "",
    isRemote: false, stipend: 25000, duration: "3-6 months",
    skills: ["Python", "Go", "JavaScript", "SQL"], requiredSkills: ["Python", "Go"],
    postedDate: TODAY, applicationDeadline: IN60, type: "Tech", companySize: "Medium",
    description: "Work on India's largest stock broker platform. Build trading tools, analytics, and APIs.",
    url: "https://zerodha.com/careers/",
  },
  {
    id: "in-freshworks-1", title: "Software Engineer Intern", company: "Freshworks",
    location: "Chennai / Bengaluru, India", imageUrl: "", logo: "",
    isRemote: false, stipend: 25000, duration: "3-6 months",
    skills: ["Ruby on Rails", "React", "Python", "SQL"], requiredSkills: ["React", "Python"],
    postedDate: TODAY, applicationDeadline: IN45, type: "Tech", companySize: "Large",
    description: "Build SaaS CRM and customer support tools at Freshworks — a NASDAQ-listed Indian SaaS company.",
    url: "https://www.freshworks.com/company/careers/",
  },
  {
    id: "in-phonepe-1", title: "Backend Engineering Intern", company: "PhonePe",
    location: "Bengaluru, India", imageUrl: "", logo: "",
    isRemote: false, stipend: 40000, duration: "3-6 months",
    skills: ["Java", "Spring Boot", "Kafka", "SQL"], requiredSkills: ["Java", "Spring Boot"],
    postedDate: TODAY, applicationDeadline: IN45, type: "Tech", companySize: "Large",
    description: "Build UPI payment systems at PhonePe — India's #1 payments app with 500M+ users.",
    url: "https://careers.phonepe.com/",
  },
  {
    id: "in-myntra-1", title: "Data Analyst Intern", company: "Myntra",
    location: "Bengaluru, India", imageUrl: "", logo: "",
    isRemote: false, stipend: 20000, duration: "3-6 months",
    skills: ["Python", "SQL", "Data Analysis", "Tableau"], requiredSkills: ["Python", "SQL", "Data Analysis"],
    postedDate: TODAY, applicationDeadline: IN60, type: "Tech", companySize: "Large",
    description: "Analyze fashion trends and customer behavior data at India's leading fashion e-commerce platform.",
    url: "https://careers.myntra.com/",
  },
  {
    id: "in-adobe-blr-1", title: "Computer Science Intern", company: "Adobe India",
    location: "Noida / Bengaluru, India", imageUrl: "", logo: "",
    isRemote: false, stipend: 60000, duration: "2-6 months",
    skills: ["C++", "Python", "Machine Learning", "Computer Vision"], requiredSkills: ["C++", "Python"],
    postedDate: TODAY, applicationDeadline: IN45, type: "Tech", companySize: "Large",
    description: "Adobe India research labs in Noida and Bengaluru work on AI, creative cloud, and document intelligence.",
    url: "https://www.adobe.com/careers/university.html",
  },
];

// ─── SCHOLARSHIPS ─────────────────────────────────────────────────────────────

const LIVE_SCHOLARSHIPS: Scholarship[] = [
  { id: "s1", title: `Google Generation Scholarship ${YEAR}`, provider: "Google", amount: 10000, deadline: `${YEAR}-06-15`, type: "STEM", eligibility: ["Undergraduate Students", "CS Majors", "GPA 3.5+", "Underrepresented Groups"], link: "https://buildyourfuture.withgoogle.com/scholarships", description: "Google's Generation Scholarship helps aspiring CS students excel in technology with a $10,000 award for the academic year." },
  { id: "s2", title: `Microsoft Scholarship Program ${YEAR}`, provider: "Microsoft", amount: 15000, deadline: `${YEAR}-07-01`, type: "Diversity", eligibility: ["Undergraduate Students", "CS Majors", "Women in STEM", "GPA 3.0+"], link: "https://careers.microsoft.com/students/us/en/usscholarshipprogram", description: "Microsoft supports underrepresented students in STEM with financial aid and mentorship." },
  { id: "s3", title: `Amazon Future Engineer Scholarship ${YEAR}`, provider: "Amazon", amount: 40000, deadline: `${YEAR}-05-20`, type: "Merit-based", eligibility: ["High School Seniors", "CS Intent", "Financial Need", "GPA 3.0+"], link: "https://www.amazonfutureengineer.com/scholarships", description: "$40,000 over four years for underrepresented students planning to study computer science." },
  { id: "s4", title: `Adobe Women-in-Technology Scholarship ${YEAR}`, provider: "Adobe", amount: 10000, deadline: `${YEAR}-08-10`, type: "Diversity", eligibility: ["Undergraduate Female Students", "CS or Engineering", "GPA 3.0+"], link: "https://research.adobe.com/scholarship/", description: "Recognizes outstanding female CS/engineering students with a $10,000 grant and Adobe mentorship." },
  { id: "s5", title: `Meta Research PhD Fellowship ${YEAR}`, provider: "Meta", amount: 42000, deadline: `${YEAR}-10-01`, type: "Research", eligibility: ["PhD Students", "AI/VR/Privacy Research", "International Students"], link: "https://research.facebook.com/fellowship/", description: "Full tuition + stipend for doctoral students in innovative CS and engineering research." },
  { id: "s6", title: `NVIDIA Graduate Fellowship ${YEAR}`, provider: "NVIDIA", amount: 50000, deadline: `${YEAR}-11-15`, type: "Research", eligibility: ["PhD Students", "AI/Graphics/HPC Research", "International Students"], link: "https://www.nvidia.com/en-us/research/graduate-fellowships/", description: "NVIDIA funds PhD students in GPU computing, AI, robotics, and computer vision." },
  { id: "s7", title: `IBM Watson Memorial Scholarship ${YEAR}`, provider: "IBM", amount: 25000, deadline: `${YEAR}-05-15`, type: "Merit-based", eligibility: ["Undergraduate Students", "CS or Engineering", "Leadership", "GPA 3.5+"], link: "https://www.ibm.com/services/volunteers/grant-programs.html", description: "Rewards academic excellence and leadership in students pursuing technology innovation." },
  { id: "s8", title: `Palantir Women in Tech Scholarship ${YEAR}`, provider: "Palantir", amount: 7000, deadline: `${YEAR}-09-30`, type: "Diversity", eligibility: ["Undergraduate Women", "STEM Majors", "GPA 3.0+", "US/India Citizens"], link: "https://www.palantir.com/careers/students/scholarship/", description: "Financial support and Palantir engineer mentorship for women in STEM." },
  { id: "s9", title: `Qualcomm Innovation Fellowship India ${YEAR}`, provider: "Qualcomm", amount: 100000, deadline: `${YEAR}-10-15`, type: "Research", eligibility: ["PhD Students", "Engineering or CS", "Mobile/AI Research", "Indian Universities"], link: "https://www.qualcomm.com/research/university-relations/innovation-fellowship/india", description: "Qualcomm India funds PhD students doing innovative research in mobile, AI, and wireless tech." },
  { id: "s10", title: `Tata Scholarship ${YEAR}`, provider: "Tata Trusts", amount: 20000, deadline: `${YEAR}-12-01`, type: "Need-based", eligibility: ["Indian Students", "Undergraduate", "Financial Need", "STEM Majors"], link: "https://www.tatatrusts.org/", description: "Tata Trusts scholarship for financially needy Indian students pursuing undergraduate STEM degrees." },
  { id: "s11", title: `Infosys Foundation Scholarship ${YEAR}`, provider: "Infosys Foundation", amount: 15000, deadline: `${YEAR}-07-31`, type: "Merit-based", eligibility: ["Indian Students", "Engineering Majors", "GPA 3.0+", "First Generation"], link: "https://www.infosys.com/infosys-foundation/", description: "Infosys Foundation scholarships for meritorious first-generation Indian engineering students." },
  { id: "s12", title: `Aditya Birla Scholarship ${YEAR}`, provider: "Aditya Birla Group", amount: 65000, deadline: `${YEAR}-09-15`, type: "Merit-based", eligibility: ["IIT/IIM/BITS Students", "Indian Citizens", "GPA 3.5+", "Leadership"], link: "https://adityabirlascholars.net/", description: "Prestigious scholarship for top students at IITs, IIMs, and BITS Pilani with ₹65,000 award." },
];

export async function fetchLiveScholarships(): Promise<Scholarship[]> {
  return LIVE_SCHOLARSHIPS;
}
