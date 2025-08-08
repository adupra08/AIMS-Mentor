import { StudentProfile, Opportunity } from "@shared/schema";

interface MatchingScore {
  opportunity: Opportunity;
  score: number;
  reasons: string[];
}

export function matchOpportunities(
  studentProfile: StudentProfile,
  opportunities: Opportunity[]
): MatchingScore[] {
  const matches: MatchingScore[] = [];

  for (const opportunity of opportunities) {
    let score = 0;
    const reasons: string[] = [];

    // Grade eligibility (mandatory - skip if not eligible)
    const eligibleGrades = opportunity.eligibleGrades as number[];
    if (eligibleGrades && eligibleGrades.length > 0) {
      if (!eligibleGrades.includes(studentProfile.currentGrade)) {
        continue; // Skip this opportunity if student is not in eligible grades
      }
      score += 10;
      reasons.push("Grade eligible");
    }

    // Subject matching
    const opportunitySubjects = (opportunity.subjects as string[]) || [];
    const studentInterests = [
      ...(studentProfile.academicInterests || []),
      ...(studentProfile.interestedSubjects || []),
      ...(studentProfile.currentSubjects || [])
    ];

    let subjectMatches = 0;
    for (const subject of opportunitySubjects) {
      if (studentInterests.some(interest => 
        interest.toLowerCase().includes(subject.toLowerCase()) ||
        subject.toLowerCase().includes(interest.toLowerCase())
      )) {
        subjectMatches++;
      }
    }

    if (subjectMatches > 0) {
      score += subjectMatches * 15;
      reasons.push(`Matches ${subjectMatches} of your interests: ${opportunitySubjects.slice(0, 2).join(', ')}`);
    }

    // Career goals alignment
    if (studentProfile.careerGoals && opportunity.description) {
      const careerGoals = studentProfile.careerGoals.toLowerCase();
      const description = opportunity.description.toLowerCase();
      
      if (careerGoals.includes('engineer') && (description.includes('engineering') || description.includes('stem'))) {
        score += 20;
        reasons.push("Aligns with engineering career goals");
      } else if (careerGoals.includes('research') && description.includes('research')) {
        score += 20;
        reasons.push("Matches research interests");
      } else if (careerGoals.includes('business') && (description.includes('business') || description.includes('leadership'))) {
        score += 15;
        reasons.push("Fits business/leadership aspirations");
      } else if (careerGoals.includes('medicine') && (description.includes('biology') || description.includes('health'))) {
        score += 20;
        reasons.push("Relevant to medical field interests");
      }
    }

    // Dream college alignment (boost for prestigious programs)
    const dreamColleges = (studentProfile.dreamColleges || []).map(c => c.toLowerCase());
    const tags = (opportunity.tags as string[]) || [];
    
    if (dreamColleges.some(college => 
      college.includes('mit') || college.includes('stanford') || 
      college.includes('harvard') || college.includes('caltech')
    )) {
      if (tags.includes('prestigious') || tags.includes('mit') || 
          tags.includes('stanford') || tags.includes('harvard')) {
        score += 25;
        reasons.push("Prestigious program matching your dream colleges");
      }
    }

    // GPA-based difficulty matching
    if (studentProfile.currentGpa) {
      const gpa = parseFloat(studentProfile.currentGpa.toString());
      if (opportunity.difficultyLevel === 'advanced' && gpa >= 3.7) {
        score += 15;
        reasons.push("Advanced program suitable for your high GPA");
      } else if (opportunity.difficultyLevel === 'intermediate' && gpa >= 3.3) {
        score += 10;
        reasons.push("Well-matched difficulty level");
      } else if (opportunity.difficultyLevel === 'beginner') {
        score += 5;
        reasons.push("Good starting opportunity");
      }
    }

    // Current opportunities boost (available now)
    const currentTags = (opportunity.tags as string[]) || [];
    if (currentTags.includes('current') || currentTags.includes('now')) {
      score += 30;
      reasons.push("Currently accepting applications!");
    }

    // Deadline urgency (boost soon-to-expire opportunities)
    if (opportunity.deadline) {
      const now = new Date();
      const deadline = new Date(opportunity.deadline);
      const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilDeadline > 0 && daysUntilDeadline <= 30) {
        score += 20;
        reasons.push(`Application deadline in ${daysUntilDeadline} days - apply soon!`);
      } else if (daysUntilDeadline > 30 && daysUntilDeadline <= 90) {
        score += 10;
        reasons.push(`Upcoming deadline: ${deadline.toLocaleDateString()}`);
      }
    }

    // Extracurricular alignment
    const extracurriculars = (studentProfile.extracurricularActivities || []).map(e => e.toLowerCase());
    if (extracurriculars.some(activity => 
      activity.includes('research') || activity.includes('science') || 
      activity.includes('math') || activity.includes('coding')
    )) {
      if (opportunity.category === 'research' || opportunity.category === 'competition') {
        score += 10;
        reasons.push("Matches your extracurricular interests");
      }
    }

    // Only include opportunities with a reasonable match score
    if (score >= 15) {
      matches.push({
        opportunity,
        score,
        reasons: reasons.slice(0, 3) // Limit to top 3 reasons
      });
    }
  }

  // Sort by score (highest first) and return top matches
  return matches.sort((a, b) => b.score - a.score).slice(0, 10);
}

export function getUpcomingOpportunities(opportunities: Opportunity[]): Opportunity[] {
  const now = new Date();
  const nextMonths = new Date();
  nextMonths.setMonth(now.getMonth() + 3); // Next 3 months

  return opportunities
    .filter(opp => {
      if (!opp.deadline) return false;
      const deadline = new Date(opp.deadline);
      return deadline >= now && deadline <= nextMonths;
    })
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, 5);
}

export function categorizOpportunityByStudent(
  opportunity: Opportunity,
  studentProfile: StudentProfile
): {
  category: 'highly-recommended' | 'good-match' | 'consider' | 'stretch-goal';
  reasoning: string;
} {
  const eligibleGrades = opportunity.eligibleGrades as number[];
  const isGradeEligible = eligibleGrades && eligibleGrades.includes(studentProfile.currentGrade);
  
  if (!isGradeEligible) {
    return {
      category: 'consider',
      reasoning: 'Not currently grade-eligible, but good to keep in mind for future'
    };
  }

  const currentGpa = studentProfile.currentGpa ? parseFloat(studentProfile.currentGpa.toString()) : 0;
  const isAdvanced = opportunity.difficultyLevel === 'advanced';
  const isPaid = opportunity.isPaid;

  if (isAdvanced && currentGpa >= 3.8) {
    return {
      category: 'highly-recommended',
      reasoning: 'Your strong academic record makes you a competitive candidate'
    };
  } else if (isAdvanced && currentGpa >= 3.5) {
    return {
      category: 'stretch-goal',
      reasoning: 'Challenging but achievable with your academic background'
    };
  } else if (!isAdvanced && currentGpa >= 3.3) {
    return {
      category: 'highly-recommended',
      reasoning: 'Well-matched to your current academic level'
    };
  } else {
    return {
      category: 'good-match',
      reasoning: 'Good opportunity to build experience and skills'
    };
  }
}