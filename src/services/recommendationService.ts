
import { HackathonCard, InternshipCard, Scholarship, UserSkill, HackathonType, ScholarshipType } from "@/types";

// Filter hackathons based on user preferences
export const filterHackathons = (hackathons: HackathonCard[], filters: any) => {
  const { types, mode, prizePoolMin, prizePoolMax, timeframe, skills } = filters;
  
  return hackathons.filter(hackathon => {
    // Filter by hackathon types
    if (types && types.length > 0) {
      // Check if the hackathon's type matches any of the selected types
      if (Array.isArray(hackathon.type)) {
        if (!hackathon.type.some(type => types.includes(type))) {
          return false;
        }
      } else if (!types.includes(hackathon.type)) {
        return false;
      }
    }
    
    // Filter by mode (online, in-person, hybrid)
    if (mode && mode !== "all") {
      // Convert to lowercase for comparison
      const hackathonMode = hackathon.mode.toLowerCase();
      const filterMode = mode.toLowerCase();
      if (hackathonMode !== filterMode) {
        return false;
      }
    }
    
    // Filter by prize pool
    if (hackathon.prizePool) {
      const prizePool = typeof hackathon.prizePool === 'string' 
        ? parseInt(hackathon.prizePool.replace(/,/g, '')) 
        : hackathon.prizePool;
      
      if (prizePoolMin !== undefined && prizePool < prizePoolMin) {
        return false;
      }
      
      if (prizePoolMax !== undefined && prizePool > prizePoolMax) {
        return false;
      }
    }
    
    // Filter by timeframe (upcoming, ongoing, past)
    if (timeframe && timeframe !== "all") {
      const today = new Date();
      const startDate = new Date(hackathon.startDate);
      const endDate = new Date(hackathon.endDate);
      
      if (timeframe === "upcoming" && startDate <= today) {
        return false;
      } else if (timeframe === "ongoing" && (startDate > today || endDate < today)) {
        return false;
      } else if (timeframe === "past" && endDate >= today) {
        return false;
      }
    }
    
    // Filter by skills
    if (skills && skills.length > 0 && hackathon.tags) {
      // Check if any of the selected skills match the hackathon's tags
      const hackathonSkills = hackathon.tags.map(tag => tag.toLowerCase());
      const matchingSkills = skills.filter(skill => 
        hackathonSkills.includes(skill.toLowerCase())
      );
      
      if (matchingSkills.length === 0) {
        return false;
      }
    }
    
    return true;
  });
};

// Filter scholarships based on user preferences
export const filterScholarships = (scholarships: Scholarship[], filters: any) => {
  const { types, amountMin, amountMax, deadlineType, provider, eligibility } = filters;
  
  return scholarships.filter(scholarship => {
    // Filter by scholarship types
    if (types && types.length > 0) {
      if (!types.includes(scholarship.type)) {
        return false;
      }
    }
    
    // Filter by amount
    if (scholarship.amount) {
      if (amountMin !== undefined && scholarship.amount < amountMin) {
        return false;
      }
      
      if (amountMax !== undefined && scholarship.amount > amountMax) {
        return false;
      }
    }
    
    // Filter by deadline type (upcoming, past)
    if (deadlineType && deadlineType !== "all") {
      const today = new Date();
      const deadlineDate = new Date(scholarship.deadline);
      
      if (deadlineType === "upcoming" && deadlineDate < today) {
        return false;
      } else if (deadlineType === "past" && deadlineDate >= today) {
        return false;
      }
    }
    
    // Filter by provider
    if (provider && provider.trim() !== "") {
      if (!scholarship.provider.toLowerCase().includes(provider.toLowerCase())) {
        return false;
      }
    }
    
    // Filter by eligibility criteria
    if (eligibility && eligibility.length > 0) {
      // Check if scholarship meets any of the selected eligibility criteria
      const matchingCriteria = eligibility.filter(criterion =>
        scholarship.eligibility.some(item => 
          item.toLowerCase().includes(criterion.toLowerCase())
        )
      );
      
      if (matchingCriteria.length === 0) {
        return false;
      }
    }
    
    return true;
  });
};

// Filter internships based on user preferences
export const filterInternships = (internships: InternshipCard[], filters: any) => {
  const { skills, isRemote, stipendMin, stipendMax, location } = filters;

  return internships.filter(internship => {
    if (skills && skills.length > 0) {
      const internshipSkills = internship.requiredSkills.map(skill => skill.toLowerCase());
      const matchingSkills = skills.filter(skill =>
        internshipSkills.includes(skill.toLowerCase())
      );

      if (matchingSkills.length === 0) {
        return false;
      }
    }

    if (isRemote !== undefined && internship.isRemote !== isRemote) {
      return false;
    }

    if (internship.stipend !== undefined) {
      if (stipendMin !== undefined && internship.stipend < stipendMin) {
        return false;
      }
      
      if (stipendMax !== undefined && internship.stipend > stipendMax) {
        return false;
      }
    }

    if (location && !internship.location.toLowerCase().includes(location.toLowerCase())) {
      return false;
    }

    return true;
  });
};

// Get recommended hackathons based on user skills and interests
export const getRecommendedHackathons = (
  hackathons: HackathonCard[],
  userSkills: UserSkill[],
  userInterests: HackathonType[]
): HackathonCard[] => {
  if (!userSkills?.length && !userInterests?.length) return [];
  
  // Score each hackathon based on match with user skills and interests
  const scoredHackathons = hackathons.map(hackathon => {
    let score = 0;
    
    // Match skills with hackathon tags
    if (userSkills?.length && hackathon.tags) {
      const hackathonSkillTags = hackathon.tags.map(tag => tag.toLowerCase());
      const matchingSkills = userSkills.filter(skill => 
        hackathonSkillTags.includes(skill.toLowerCase())
      );
      
      score += matchingSkills.length * 2; // Higher weight for skill matches
    }
    
    // Match user interests with hackathon type
    if (userInterests?.length) {
      if (Array.isArray(hackathon.type)) {
        const matchingInterests = userInterests.filter(interest => 
          hackathon.type.includes(interest)
        );
        score += matchingInterests.length * 3; // Higher weight for interest matches
      } else if (userInterests.includes(hackathon.type as HackathonType)) {
        score += 3;
      }
    }
    
    return { hackathon, score };
  });
  
  // Sort by score (highest first) and return the top 5
  return scoredHackathons
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.hackathon)
    .slice(0, 5);
};

// Get recommended internships based on user skills
export const getRecommendedInternships = (
  internships: InternshipCard[],
  userSkills: UserSkill[]
): InternshipCard[] => {
  if (!userSkills?.length) return [];

  // Score each internship based on match with user skills
  const scoredInternships = internships.map(internship => {
    let score = 0;

    // Match skills with internship required skills
    if (internship.requiredSkills?.length) {
      const internshipSkills = internship.requiredSkills.map(skill => skill.toLowerCase());
      const matchingSkills = userSkills.filter(skill =>
        internshipSkills.includes(skill.toLowerCase())
      );

      score += matchingSkills.length;
    }

    return { internship, score };
  });

  // Sort by score (highest first) and return the top 5
  return scoredInternships
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.internship)
    .slice(0, 5);
};

// Get recommended scholarships based on user profile and preferences
export const getRecommendedScholarships = (
  scholarships: Scholarship[],
  userSkills: UserSkill[],
  userInterests: string[]
): Scholarship[] => {
  if (!userSkills?.length && !userInterests?.length) return [];
  
  // Score each scholarship based on match with user skills and interests
  const scoredScholarships = scholarships.map(scholarship => {
    let score = 0;
    
    // Match user interests with scholarship type
    if (userInterests?.length) {
      if (userInterests.includes(scholarship.type.toLowerCase())) {
        score += 3; // Higher weight for interest matches
      }
    }
    
    // Higher score for scholarships with higher amounts
    score += Math.min(scholarship.amount / 5000, 3); // Cap at 3 points
    
    return { scholarship, score };
  });
  
  // Sort by score (highest first) and return the top 5
  return scoredScholarships
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.scholarship)
    .slice(0, 5);
};
