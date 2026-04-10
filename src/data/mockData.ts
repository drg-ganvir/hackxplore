import { HackathonCard, InternshipCard, Scholarship, PartnerLogo } from "@/types";

// Mock data for hackathons
export const hackathonsData: HackathonCard[] = [
  {
    id: "hackathon-1",
    title: "Sui Overflow 2025",
    organizer: "Devfolio",
    startDate: "2025-04-01",
    endDate: "2025-05-11",
    location: "Online",
    mode: "Online",
    prizePool: 50000,
    tags: ["Blockchain Technology"],
    applicationDeadline: "2025-03-25",
    url: "https://sui-overflow-2025.devfolio.co/",
    image: "https://sui-overflow-2025.devfolio.co/_next/image?url=https%3A%2F%2Fassets.devfolio.co%2Fhackathons%2Fee91218f02d542d79c57d44e6d1f7700%2Fassets%2Fcover%2F835.png&w=1440&q=100",
    isPopular: true,
    type: "Themed"
  },
  {
    id: "hackathon-2",
    title: "Bio x AI Hackathon 2025",
    organizer: "Devfolio",
    startDate: "2025-04-08",
    endDate: "2025-06-06",
    location: "Virtual Event",
    mode: "Online",
    prizePool: 40000,
    tags: ["AI/ML", "Healthtech"],
    applicationDeadline: "2025-04-01",
    url: "https://bio-x-ai-berlin.devfolio.co/",
    image: "https://bio-x-ai-berlin.devfolio.co/_next/image?url=https%3A%2F%2Fassets.devfolio.co%2Fhackathons%2Fcef47ebfc13142cfb8110e750875d03f%2Fassets%2Fcover%2F861.png&w=1440&q=100",
    isPopular: true,
    type: "Themed"
  },
  {
    id: "hackathon-3",
    title: "Hack On Hills 6.0",
    organizer: "Devfolio",
    startDate: "2025-04-11",
    endDate: "2025-04-13",
    location: "Himachal Pradesh, India",
    mode: "In-person",
    prizePool: 30000,
    tags: ["Open Innovation"],
    applicationDeadline: "2025-04-05",
    url: "https://hack-on-hills.devfolio.co/",
    image: "https://hack-on-hills.devfolio.co/_next/image?url=https%3A%2F%2Fassets.devfolio.co%2Fhackathons%2F56f07f74a9bd4da492709b8aadd11d2a%2Fassets%2Fcover%2F699.png&w=1440&q=100",
    isPopular: false,
    type: "Open"
  },
  {
    id: "hackathon-4",
    title: "Hackofiesta 6.1",
    organizer: "Devfolio",
    startDate: "2025-04-05",
    endDate: "2025-04-06",
    location: "Multiple Locations",
    mode: "Hybrid",
    prizePool: 25000,
    tags: ["Web Development", "Mobile Development"],
    applicationDeadline: "2025-03-30",
    url: "https://hackofiesta-6-1.devfolio.co/",
    image: "https://hackofiesta-6-1.devfolio.co/_next/image?url=https%3A%2F%2Fassets.devfolio.co%2Fhackathons%2Fe6070be6ac9d4cfdaa601fb62c180589%2Fassets%2Fcover%2F882.png&w=1440&q=100",
    isPopular: false,
    type: "Themed"
  },
  {
    id: "hackathon-5",
    title: "Metallurgica Tech Hackathon'25",
    organizer: "Devfolio",
    startDate: "2025-03-30",
    endDate: "2025-04-04",
    location: "Virtual Event",
    mode: "Online",
    prizePool: 35000,
    tags: ["IoT", "AI/ML"],
    applicationDeadline: "2025-03-25",
    url: "https://metallurgica-tech-hackathon.devfolio.co/",
    image: "https://metallurgica-tech-hackathon.devfolio.co/_next/image?url=https%3A%2F%2Fassets.devfolio.co%2Fhackathons%2Fb70d9e873a69479c875a8167da263345%2Fassets%2Fcover%2F241.jpeg&w=1440&q=100",
    isPopular: true,
    type: "Themed"
  },
  {
    id: "hackathon-6",
    title: "NITDGP Hacks 2.0",
    organizer: "Devfolio",
    startDate: "2025-04-05",
    endDate: "2025-04-06",
    location: "Durgapur, India",
    mode: "In-person",
    prizePool: 20000,
    tags: ["Open Innovation"],
    applicationDeadline: "2025-03-30",
    url: "https://nitdgp-hacks-2.devfolio.co/",
    image: "https://nitdgp-hacks-2.devfolio.co/_next/image?url=https%3A%2F%2Fassets.devfolio.co%2Fhackathons%2F8f14d2f827304855a29a604ae8f1b503%2Fassets%2Fcover%2F892.png&w=1440&q=100",
    isPopular: false,
    type: "Open"
  },
  {
    id: "hackathon-7",
    title: "HackBlitz 2k25",
    organizer: "Devfolio",
    startDate: "2025-04-26",
    endDate: "2025-04-27",
    location: "Virtual Event",
    mode: "Online",
    prizePool: 28000,
    tags: ["Web Development", "AI/ML"],
    applicationDeadline: "2025-04-20",
    url: "https://hackblitz2k25.devfolio.co/",
    image: "https://hackblitz2k25.devfolio.co/_next/image?url=https%3A%2F%2Fassets.devfolio.co%2Fhackathons%2Faacd658b01914278b141b8704a4e36e3%2Fassets%2Fcover%2F165.png&w=1440&q=100",
    isPopular: true,
    type: "Themed"
  },
  {
    id: "hackathon-8",
    title: "GajShield KJSSE Hack 8",
    organizer: "Devfolio",
    startDate: "2025-04-12",
    endDate: "2025-04-13",
    location: "Mumbai, India",
    mode: "Hybrid",
    prizePool: 32000,
    tags: ["Cybersecurity", "Fintech"],
    applicationDeadline: "2025-04-07",
    url: "https://gajshield-kjsse-hack8.devfolio.co/",
    image: "https://gajshield-kjsse-hack8.devfolio.co/_next/image?url=https%3A%2F%2Fassets.devfolio.co%2Fhackathons%2F9affbc7d8b4946d584a31f6c478c1d57%2Fassets%2Fcover%2F349.png&w=1440&q=100",
    isPopular: false,
    type: "Themed"
  },
  {
    id: "hackathon-9",
    title: "HackVSIT6.0",
    organizer: "Devfolio",
    startDate: "2025-04-25",
    endDate: "2025-04-26",
    location: "Delhi, India",
    mode: "In-person",
    prizePool: 22000,
    tags: ["Web Development", "Mobile Development"],
    applicationDeadline: "2025-04-20",
    url: "https://hackvsit-6.devfolio.co/",
    image: "https://hackvsit-6.devfolio.co/_next/image?url=https%3A%2F%2Fassets.devfolio.co%2Fhackathons%2F40a650f1a6524982bdc6455d79c9ba54%2Fassets%2Fcover%2F423.png&w=1440&q=100",
    isPopular: true,
    type: "Themed"
  },
  {
    id: "hackathon-10",
    title: "RotaTechX",
    organizer: "Devfolio",
    startDate: "2025-04-12",
    endDate: "2025-04-13",
    location: "Virtual Event",
    mode: "Online",
    prizePool: 18000,
    tags: ["Social Impact", "Open Innovation"],
    applicationDeadline: "2025-04-07",
    url: "https://rotatechx-1.devfolio.co/",
    image: "https://rotatechx-1.devfolio.co/_next/image?url=https%3A%2F%2Fassets.devfolio.co%2Fhackathons%2Fdb9c42c5c0bf476aaecd1331e40aa076%2Fassets%2Fcover%2F267.png&w=1440&q=100",
    isPopular: false,
    type: "Open"
  },
  {
    id: "hackathon-11",
    title: "Spectrum'25",
    organizer: "Devfolio",
    startDate: "2025-04-11",
    endDate: "2025-04-12",
    location: "Virtual Event",
    mode: "Online",
    prizePool: 25000,
    tags: ["Web Development", "AI/ML"],
    applicationDeadline: "2025-04-06",
    url: "https://spectrum25.devfolio.co/",
    image: "https://spectrum25.devfolio.co/_next/image?url=https%3A%2F%2Fassets.devfolio.co%2Fhackathons%2F04b5354a4b4e4761a2c9db42ae7ed089%2Fassets%2Fcover%2F316.png&w=1440&q=100",
    isPopular: true,
    type: "Themed"
  },
  {
    id: "hackathon-12",
    title: "Hack The Grid – LUKSO",
    organizer: "Devfolio",
    startDate: "2025-03-25",
    endDate: "2025-04-07",
    location: "Virtual Event",
    mode: "Online",
    prizePool: 45000,
    tags: ["Blockchain", "Web3"],
    applicationDeadline: "2025-03-20",
    url: "https://hack-the-grid-level.devfolio.co/",
    image: "https://hack-the-grid-level.devfolio.co/_next/image?url=https%3A%2F%2Fassets.devfolio.co%2Fhackathons%2F95688d8dd80d4ebeb247dde86af66c5e%2Fassets%2Fcover%2F498.png&w=1440&q=100",
    isPopular: true,
    type: "Themed"
  },
  {
    id: "hackathon-13",
    title: "DoraHacks Global Hack 2025",
    organizer: "DoraHacks",
    startDate: "2025-05-15",
    endDate: "2025-06-30",
    location: "Virtual Event",
    mode: "Online",
    prizePool: 100000,
    tags: ["Blockchain", "Web3", "AI/ML"],
    applicationDeadline: "2025-05-10",
    url: "https://dorahacks.io/hackathon/global2025",
    image: "https://plus.unsplash.com/premium_photo-1679079456083-9f288e224e96?q=80&w=1000",
    isPopular: true,
    type: "Open"
  },
  {
    id: "hackathon-14",
    title: "Web3 Infinity Hackathon",
    organizer: "DoraHacks",
    startDate: "2025-04-20",
    endDate: "2025-05-20",
    location: "Virtual Event",
    mode: "Online",
    prizePool: 70000,
    tags: ["Blockchain", "Web3"],
    applicationDeadline: "2025-04-15",
    url: "https://dorahacks.io/hackathon/web3infinity",
    image: "https://plus.unsplash.com/premium_photo-1675062287160-ebb2dd150ccd?q=80&w=1000",
    isPopular: true,
    type: "Themed"
  },
  {
    id: "hackathon-15",
    title: "DevTown AI/ML Championship",
    organizer: "DevTown",
    startDate: "2025-05-01",
    endDate: "2025-05-15",
    location: "Virtual Event",
    mode: "Online",
    prizePool: 30000,
    tags: ["AI/ML", "Data Science"],
    applicationDeadline: "2025-04-25",
    url: "https://devtown.io/hackathons/aiml-championship",
    image: "https://images.unsplash.com/photo-1677442135968-6bd548d6d060?q=80&w=1000",
    isPopular: false,
    type: "Themed"
  },
  {
    id: "hackathon-16",
    title: "DevTown Web Dev Showdown",
    organizer: "DevTown",
    startDate: "2025-06-05",
    endDate: "2025-06-12",
    location: "Virtual Event",
    mode: "Online",
    prizePool: 25000,
    tags: ["Web Development"],
    applicationDeadline: "2025-05-30",
    url: "https://devtown.io/hackathons/webdev-showdown",
    image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=1000",
    isPopular: false,
    type: "Themed"
  }
];

// Mock data for internships
export const internshipsData: InternshipCard[] = [
  {
    id: "internship-1",
    title: "AI Research Intern, Summer 2024",
    company: "Google",
    location: "Mountain View, CA",
    isRemote: false,
    stipend: 8000,
    duration: "12 weeks",
    applicationDeadline: "2024-03-15",
    url: "https://careers.google.com/internships",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2008px-Google_%22G%22_Logo.svg.png",
    requiredSkills: ["Python", "Machine Learning", "AI"],
    companySize: "Large",
    description: "Join Google's AI research team and work on cutting-edge projects. Contribute to the development of next-generation AI technologies."
  },
  {
    id: "internship-2",
    title: "Software Engineer Intern, Summer 2024",
    company: "Microsoft",
    location: "Redmond, WA",
    isRemote: false,
    stipend: 7500,
    duration: "10 weeks",
    applicationDeadline: "2024-04-01",
    url: "https://careers.microsoft.com/internships",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/2048px-Microsoft_logo_%282012%29.svg.png",
    requiredSkills: ["C#", ".NET", "Azure", "Software Development"],
    companySize: "Large",
    description: "Develop innovative software solutions and work on real-world projects. Collaborate with experienced engineers and contribute to Microsoft products."
  },
  {
    id: "internship-3",
    title: "Data Science Intern, Summer 2024",
    company: "Amazon",
    location: "Seattle, WA",
    isRemote: false,
    stipend: 8500,
    duration: "12 weeks",
    applicationDeadline: "2024-03-20",
    url: "https://www.amazon.jobs/en/internships",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png",
    requiredSkills: ["Python", "Data Analysis", "Machine Learning", "AWS"],
    companySize: "Large",
    description: "Analyze large datasets and develop machine learning models. Contribute to Amazon's data-driven decision-making process."
  },
  {
    id: "internship-4",
    title: "Software Engineer Intern, Summer 2024",
    company: "Meta",
    location: "Menlo Park, CA",
    isRemote: false,
    stipend: 9000,
    duration: "12 weeks",
    applicationDeadline: "2024-03-25",
    url: "https://www.metacareers.com/internships/",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/2048px-2021_Facebook_icon.svg.png",
    requiredSkills: ["JavaScript", "React", "Node.js", "Software Development"],
    companySize: "Large",
    description: "Build and maintain Meta's core products and services. Collaborate with experienced engineers and contribute to the company's mission."
  },
  {
    id: "internship-5",
    title: "Research Intern, Summer 2024",
    company: "IBM",
    location: "Yorktown Heights, NY",
    isRemote: false,
    stipend: 7000,
    duration: "10 weeks",
    applicationDeadline: "2024-04-05",
    url: "https://www.research.ibm.com/careers/students/",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/2560px-IBM_logo.svg.png",
    requiredSkills: ["Python", "Data Science", "AI", "Cloud Computing"],
    companySize: "Large",
    description: "Conduct research in various areas of computer science. Contribute to IBM's research and development efforts."
  },
  {
    id: "internship-6",
    title: "Software Engineer Intern, Summer 2024",
    company: "Apple",
    location: "Cupertino, CA",
    isRemote: false,
    stipend: 9500,
    duration: "12 weeks",
    applicationDeadline: "2024-04-10",
    url: "https://www.apple.com/careers/us/students.html",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png",
    requiredSkills: ["Swift", "Objective-C", "iOS Development", "macOS Development"],
    companySize: "Large",
    description: "Develop innovative software solutions for Apple products. Collaborate with experienced engineers and contribute to the company's ecosystem."
  },
  {
    id: "internship-7",
    title: "Cloud Infrastructure Intern, Summer 2024",
    company: "Oracle",
    location: "Austin, TX",
    isRemote: false,
    stipend: 7200,
    duration: "10 weeks",
    applicationDeadline: "2024-04-15",
    url: "https://www.oracle.com/corporate/careers/students-graduates/",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Oracle_logo.svg/2560px-Oracle_logo.svg.png",
    requiredSkills: ["Java", "Cloud Computing", "AWS", "Azure"],
    companySize: "Large",
    description: "Work on Oracle's cloud infrastructure and develop innovative solutions. Contribute to the company's cloud strategy."
  },
  {
    id: "internship-8",
    title: "Software Engineer Intern, Summer 2024",
    company: "Intel",
    location: "Santa Clara, CA",
    isRemote: false,
    stipend: 8000,
    duration: "12 weeks",
    applicationDeadline: "2024-04-20",
    url: "https://www.intel.com/content/www/us/en/jobs/students.html",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Intel-logo.svg/2560px-Intel-logo.svg.png",
    requiredSkills: ["C++", "Software Development", "Computer Architecture", "Embedded Systems"],
    companySize: "Large",
    description: "Develop software solutions for Intel's hardware products. Contribute to the company's innovation efforts."
  }
];

// Add scholarship types
export const scholarshipTypes = [
  "Merit-based",
  "Need-based",
  "Research",
  "STEM",
  "Diversity",
  "International",
  "Athletic",
  "Community Service",
  "Creative Arts"
];

// Add eligibility options
export const eligibilityOptions = [
  "Undergraduate Students",
  "Graduate Students",
  "High School Seniors",
  "First-Generation Students",
  "International Students",
  "Women in STEM",
  "Minorities in Tech",
  "LGBTQ+ Students",
  "Students with Disabilities",
  "Low-Income Households",
  "US Citizens",
  "GPA 3.0+",
  "GPA 3.5+",
  "Computer Science Majors",
  "Engineering Majors",
  "Business Majors",
  "Arts & Humanities Majors"
];

// Add interest options
export const interestOptions = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "Artificial Intelligence",
  "Cybersecurity",
  "Cloud Computing",
  "DevOps",
  "Blockchain",
  "UI/UX Design",
  "Game Development",
  "Robotics",
  "IoT",
  "AR/VR",
  "Full Stack Development"
];

// Update partner logos to match the PartnerLogo interface
export const partnerLogos: PartnerLogo[] = [
  { 
    name: "Microsoft", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.jpg", 
    url: "https://microsoft.com" 
  },
  { 
    name: "Google", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.jpg", 
    url: "https://google.com" 
  },
  { 
    name: "Amazon", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1200px-Amazon_logo.svg.jpg", 
    url: "https://amazon.com" 
  },
  { 
    name: "Meta", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/1200px-Meta_Platforms_Inc._logo.svg.jpg", 
    url: "https://meta.com" 
  },
  { 
    name: "IBM", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/1200px-IBM_logo.svg.jpg", 
    url: "https://ibm.com" 
  },
  { 
    name: "NVIDIA", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Nvidia_logo.svg/1200px-Nvidia_logo.svg.jpg", 
    url: "https://nvidia.com" 
  },
  { 
    name: "Intel", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Intel_logo_%282006-2020%29.svg/1200px-Intel_logo_%282006-2020%29.svg.jpg", 
    url: "https://intel.com" 
  },
  { 
    name: "Apple", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1200px-Apple_logo_black.svg.jpg", 
    url: "https://apple.com" 
  }
];

// Add testimonials data
export const testimonialsData = [
  {
    id: "1",
    name: "Alex Johnson",
    role: "Software Engineer at Google",
    avatar: "/avatars/avatar-1.png",
    text: "HackXplore helped me find my first hackathon which led to an internship at Google! The team formation feature was especially useful as I connected with talented peers who became long-term collaborators.",
    company: "Google",
    image: "/avatars/avatar-1.png"
  },
  {
    id: "2",
    name: "Sophia Chen",
    role: "Product Manager at Microsoft",
    avatar: "/avatars/avatar-2.png",
    text: "As a student looking to break into product management, the internship listings on HackXplore were incredibly valuable. I found my Microsoft internship here, and the rest is history!",
    company: "Microsoft",
    image: "/avatars/avatar-2.png"
  },
  {
    id: "3",
    name: "Marcus Williams",
    role: "Full Stack Developer",
    avatar: "/avatars/avatar-3.png",
    text: "The scholarship section on HackXplore was a game-changer for me. I discovered and secured funding that helped me complete my degree without financial stress. Now I'm working at my dream job!",
    company: "Freelance",
    image: "/avatars/avatar-3.png"
  }
];

// Add scholarship data
export const scholarshipsData = [
  {
    id: "scholarship-1",
    title: "Google Generation Scholarship",
    provider: "Google",
    amount: 10000,
    deadline: "2025-06-15",
    type: "STEM",
    eligibility: [
      "Undergraduate Students", 
      "Computer Science Majors", 
      "GPA 3.5+", 
      "Underrepresented Groups in Tech"
    ],
    link: "https://buildyourfuture.withgoogle.com/scholarships",
    description: "The Google Generation Scholarship was established to help aspiring students pursuing computer science degrees excel in technology and become leaders in the field. Selected students will receive a $10,000 USD scholarship for the academic year."
  },
  {
    id: "scholarship-2",
    title: "Microsoft Scholarship Program",
    provider: "Microsoft",
    amount: 15000,
    deadline: "2025-07-01",
    type: "Diversity",
    eligibility: [
      "Undergraduate Students",
      "Computer Science Majors",
      "Women in STEM",
      "GPA 3.0+"
    ],
    link: "https://careers.microsoft.com/students/us/en/usscholarshipprogram",
    description: "Microsoft is committed to increasing access to education through technology, grants, partnerships, and programs. The Microsoft Scholarship Program supports underrepresented students pursuing studies in STEM fields."
  },
  {
    id: "scholarship-3",
    title: "Amazon Future Engineer Scholarship",
    provider: "Amazon",
    amount: 40000,
    deadline: "2025-05-20",
    type: "Merit-based",
    eligibility: [
      "High School Seniors",
      "Computer Science Intent",
      "Financial Need",
      "GPA 3.0+"
    ],
    link: "https://www.amazonfutureengineer.com/scholarships",
    description: "The Amazon Future Engineer Scholarship provides $40,000 over four years to students from underrepresented communities who plan to study computer science in college."
  },
  {
    id: "scholarship-4",
    title: "Adobe Research Women-in-Technology Scholarship",
    provider: "Adobe",
    amount: 10000,
    deadline: "2025-08-10",
    type: "Diversity",
    eligibility: [
      "Undergraduate Female Students",
      "Computer Science or Engineering Majors",
      "GPA 3.0+"
    ],
    link: "https://research.adobe.com/scholarship/",
    description: "This scholarship recognizes outstanding female students in the field of technology. The Adobe Research Women-in-Technology Scholarship provides recipients with a $10,000 grant and a mentoring opportunity with an Adobe researcher."
  },
  {
    id: "scholarship-5",
    title: "Meta Global Fellowship",
    provider: "Meta",
    amount: 5000,
    deadline: "2025-09-30",
    type: "Research",
    eligibility: [
      "PhD Students",
      "Research Focus in AI, VR, or Privacy",
      "International Students"
    ],
    link: "https://research.fb.com/fellowship/",
    description: "The Meta Fellowship is a global program designed to encourage and support promising doctoral students engaged in innovative and relevant research across computer science and engineering."
  },
  {
    id: "scholarship-6",
    title: "Intel Diversity Scholars Program",
    provider: "Intel",
    amount: 20000,
    deadline: "2025-04-30",
    type: "Diversity",
    eligibility: [
      "Undergraduate Students",
      "Engineering or Computer Science Majors",
      "Minorities in Tech",
      "GPA 3.0+"
    ],
    link: "https://www.intel.com/content/www/us/en/diversity/diversity-overview.html",
    description: "Intel is committed to supporting diversity in the tech industry. This scholarship aims to increase the representation of women and underrepresented minorities in STEM fields through financial support and mentorship."
  },
  {
    id: "scholarship-7",
    title: "IBM Thomas J. Watson Memorial Scholarship",
    provider: "IBM",
    amount: 25000,
    deadline: "2025-05-15",
    type: "Merit-based",
    eligibility: [
      "Undergraduate Students",
      "Computer Science or Engineering Majors",
      "Demonstrated Leadership",
      "GPA 3.5+"
    ],
    link: "https://www.ibm.com/services/volunteers/grant-programs.html",
    description: "Named after IBM's founder, this prestigious scholarship rewards academic excellence and leadership potential in students pursuing degrees in computer science, engineering, or a related field with a focus on technology innovation."
  },
  {
    id: "scholarship-8",
    title: "Apple HBCU Scholars Program",
    provider: "Apple",
    amount: 15000,
    deadline: "2025-03-31",
    type: "Diversity",
    eligibility: [
      "Students at HBCUs",
      "STEM Majors",
      "GPA 3.0+",
      "US Citizens"
    ],
    link: "https://www.apple.com/diversity/",
    description: "Apple's HBCU Scholars Program provides scholarships to students from Historically Black Colleges and Universities. Recipients receive a scholarship and a summer internship at Apple headquarters."
  },
  {
    id: "scholarship-9",
    title: "NVIDIA Graduate Fellowship",
    provider: "NVIDIA",
    amount: 50000,
    deadline: "2025-11-15",
    type: "Research",
    eligibility: [
      "PhD Students",
      "Research in AI, Graphics, or High-Performance Computing",
      "International Students"
    ],
    link: "https://www.nvidia.com/en-us/research/graduate-fellowships/",
    description: "The NVIDIA Graduate Fellowship Program provides funding to PhD students who are conducting research in graphics processing unit (GPU) computing, computer graphics, AI, robotics, computer vision, or related fields."
  }
];

// Skills options
export const skillsOptions = [
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "TypeScript",
  "React",
  "Angular",
  "Vue.js",
  "Node.js",
  "Express.js",
  "Django",
  "Flask",
  "Ruby on Rails",
  "SQL",
  "NoSQL",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "AWS",
  "Azure",
  "Google Cloud",
  "Docker",
  "Kubernetes",
  "Git",
  "HTML",
  "CSS",
  "Sass",
  "Less",
  "UI/UX Design",
  "Figma",
  "Sketch",
  "Adobe XD",
  "Machine Learning",
  "Deep Learning",
  "Data Science",
  "Data Analysis",
  "Cybersecurity",
  "Network Security",
  "Cryptography",
  "Penetration Testing",
  "Blockchain",
  "Web3",
  "AR/VR",
  "IoT",
  "Robotics",
  "Game Development",
  "Mobile Development",
  "Swift",
  "Kotlin",
  "React Native",
  "Flutter"
];
