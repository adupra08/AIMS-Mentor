import { StudentProfile, Opportunity } from "@shared/schema";

interface CompetitionMatch {
  opportunity: Opportunity;
  score: number;
  reasons: string[];
  isRelevant: boolean;
}

export function matchStartupCompetitions(
  studentProfile: StudentProfile,
  competitions: Opportunity[]
): CompetitionMatch[] {
  const matches: CompetitionMatch[] = [];
  const now = new Date();

  for (const competition of competitions) {
    // Filter to only startup-competition category
    if (competition.category !== "startup-competition") {
      continue;
    }

    // Check if deadline is in the future
    if (competition.deadline) {
      const deadline = new Date(competition.deadline);
      if (deadline <= now) {
        continue;
      }
    }

    let score = 0;
    const reasons: string[] = [];
    let isRelevant = false;

    // Grade eligibility (mandatory filter)
    const eligibleGrades = competition.eligibleGrades as number[];
    if (eligibleGrades && eligibleGrades.length > 0) {
      if (!eligibleGrades.includes(studentProfile.currentGrade)) {
        continue; // Skip if not eligible grade
      }
      score += 10;
      reasons.push("Grade eligible");
      isRelevant = true;
    }

    // GPA minimum requirements (startup competitions generally require 3.0+)
    const gpa = studentProfile.currentGpa ? parseFloat(studentProfile.currentGpa.toString()) : 0;
    if (gpa >= 3.5) {
      score += 20;
      reasons.push("Strong GPA for competitive programs");
    } else if (gpa >= 3.0) {
      score += 10;
      reasons.push("Meets GPA requirements");
    } else if (gpa >= 2.8) {
      score += 5;
      reasons.push("GPA acceptable for most programs");
    } else {
      // GPA below 2.8 makes student less relevant for competitive startup competitions
      isRelevant = false;
    }

    // Entrepreneurship interest alignment (KEY FILTER)
    const studentInterests = [
      ...(studentProfile.academicInterests || []),
      ...(studentProfile.interestedSubjects || []),
      ...(studentProfile.extracurricularActivities || [])
    ];

    const hasEntrepreneurshipInterest = studentInterests.some(interest =>
      interest.toLowerCase().includes("business") ||
      interest.toLowerCase().includes("entrepren") ||
      interest.toLowerCase().includes("startup") ||
      interest.toLowerCase().includes("leadership") ||
      interest.toLowerCase().includes("finance")
    );

    if (hasEntrepreneurshipInterest) {
      score += 30;
      reasons.push("Strong entrepreneurship interest");
      isRelevant = true;
    } else {
      // No entrepreneurship interest = not relevant
      isRelevant = false;
    }

    // Team-based competitions (boost for students with group activity experience)
    if (competition.isTeamBased) {
      const hasTeamExperience = studentInterests.some(interest =>
        interest.toLowerCase().includes("club") ||
        interest.toLowerCase().includes("team") ||
        interest.toLowerCase().includes("group") ||
        interest.toLowerCase().includes("debate") ||
        interest.toLowerCase().includes("model")
      );
      if (hasTeamExperience) {
        score += 10;
        reasons.push("Team experience matches collaboration requirement");
      }
    }

    // Career goals alignment with business/tech
    if (studentProfile.careerGoals) {
      const careerGoals = studentProfile.careerGoals.toLowerCase();
      if (careerGoals.includes("business") || careerGoals.includes("entrepren") ||
          careerGoals.includes("startup") || careerGoals.includes("tech")) {
        score += 25;
        reasons.push("Aligns with entrepreneurship career goals");
        isRelevant = true;
      }
    }

    // Dream college alignment
    const dreamColleges = (studentProfile.dreamColleges || []).map(c => c.toLowerCase());
    const tags = (competition.tags as string[]) || [];
    
    if (dreamColleges.length > 0) {
      if (tags.some(tag => 
        tag.toLowerCase().includes("mit") || 
        tag.toLowerCase().includes("stanford") || 
        tag.toLowerCase().includes("harvard") ||
        tag.toLowerCase().includes("global") ||
        tag.toLowerCase().includes("venture"))) {
        score += 15;
        reasons.push("Prestigious competition for elite schools");
      }
    }

    // Prize money motivation (relevant for all students)
    if (competition.isPaid) {
      score += 10;
      reasons.push("Offers prize money/funding");
    }

    // Difficulty level alignment
    if (studentProfile.currentGpa) {
      const gpaNum = parseFloat(studentProfile.currentGpa.toString());
      if (competition.difficultyLevel === "advanced" && gpaNum >= 3.7) {
        score += 15;
        reasons.push("Advanced program suitable for your profile");
      } else if (competition.difficultyLevel === "intermediate" && gpaNum >= 3.3) {
        score += 10;
        reasons.push("Well-matched difficulty level");
      } else if (competition.difficultyLevel === "beginner") {
        score += 8;
        reasons.push("Great entry-level startup competition");
      }
    }

    // Deadline urgency
    if (competition.deadline) {
      const deadline = new Date(competition.deadline);
      const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilDeadline > 0 && daysUntilDeadline <= 30) {
        score += 20;
        reasons.push(`Deadline in ${daysUntilDeadline} days`);
      } else if (daysUntilDeadline > 30 && daysUntilDeadline <= 90) {
        score += 10;
        reasons.push(`Upcoming deadline: ${deadline.toLocaleDateString()}`);
      }
    }

    // Only include relevant competitions with meaningful score
    if (isRelevant && score >= 20) {
      matches.push({
        opportunity: competition,
        score,
        reasons: reasons.slice(0, 3),
        isRelevant: true
      });
    }
  }

  // Sort by score (highest first)
  return matches.sort((a, b) => b.score - a.score);
}

export function filterRelevantStartupCompetitions(
  studentProfile: StudentProfile,
  competitions: Opportunity[]
): Opportunity[] {
  const matches = matchStartupCompetitions(studentProfile, competitions);
  return matches
    .filter(m => m.isRelevant)
    .map(m => m.opportunity)
    .slice(0, 12); // Return top 12 matches
}
