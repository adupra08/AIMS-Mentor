import type { StudentProfile, Scholarship } from "@shared/schema";

interface ScholarshipMatch {
  scholarship: Scholarship;
  score: number;
  reasons: string[];
}

export function matchScholarships(
  profile: StudentProfile,
  scholarships: Scholarship[]
): ScholarshipMatch[] {
  const matches: ScholarshipMatch[] = [];

  for (const scholarship of scholarships) {
    const { score, reasons} = calculateMatchScore(profile, scholarship);
    
    if (score > 0) {
      matches.push({
        scholarship,
        score,
        reasons,
      });
    }
  }

  // Sort by score descending
  return matches.sort((a, b) => b.score - a.score);
}

function calculateMatchScore(
  profile: StudentProfile,
  scholarship: Scholarship
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // Base eligibility checks (return 0 if not eligible)
  
  // 1. Grade eligibility (required)
  if (scholarship.eligibleGrades && scholarship.eligibleGrades.length > 0) {
    if (!scholarship.eligibleGrades.includes(profile.currentGrade)) {
      return { score: 0, reasons: [] }; // Not eligible
    }
    score += 20;
    reasons.push(`Eligible grade level (${profile.currentGrade})`);
  }

  // 2. GPA requirement (required if set)
  if (scholarship.minGpa && profile.currentGpa) {
    const gpa = parseFloat(profile.currentGpa.toString());
    const minGpa = parseFloat(scholarship.minGpa.toString());
    if (gpa < minGpa) {
      return { score: 0, reasons: [] }; // Does not meet GPA requirement
    }
    const gpaExcess = gpa - minGpa;
    score += 15 + (gpaExcess * 5); // Bonus for exceeding minimum
    reasons.push(`Meets GPA requirement (${gpa.toFixed(2)} ≥ ${minGpa.toFixed(2)})`);
  }

  // 3. State eligibility (required if specified)
  if (scholarship.states && scholarship.states.length > 0 && profile.state) {
    if (!scholarship.states.includes(profile.state)) {
      return { score: 0, reasons: [] }; // Not eligible for this state
    }
    score += 25;
    reasons.push(`Available in your state (${profile.state})`);
  }

  // 4. Test score requirements (SAT/ACT)
  if (profile.testScores) {
    if (scholarship.minSat && profile.testScores.sat) {
      if (profile.testScores.sat < scholarship.minSat) {
        return { score: 0, reasons: [] }; // Does not meet SAT requirement
      }
      score += 10;
      reasons.push(`Meets SAT requirement (${profile.testScores.sat} ≥ ${scholarship.minSat})`);
    }
    
    if (scholarship.minAct && profile.testScores.act) {
      if (profile.testScores.act < scholarship.minAct) {
        return { score: 0, reasons: [] }; // Does not meet ACT requirement
      }
      score += 10;
      reasons.push(`Meets ACT requirement (${profile.testScores.act} ≥ ${scholarship.minAct})`);
    }
  }

  // Preference matching (adds bonus points but not required)
  
  // 5. Academic subjects match
  if (scholarship.subjects && scholarship.subjects.length > 0) {
    const studentSubjects = [
      ...(profile.academicInterests || []),
      ...(profile.interestedSubjects || []),
    ];
    
    const matchingSubjects = scholarship.subjects.filter(subject => 
      studentSubjects.some(studentSubject => 
        studentSubject.toLowerCase().includes(subject.toLowerCase()) ||
        subject.toLowerCase().includes(studentSubject.toLowerCase())
      )
    );
    
    if (matchingSubjects.length > 0) {
      score += matchingSubjects.length * 10;
      reasons.push(`Matches ${matchingSubjects.length} of your academic interests`);
    }
  }

  // 6. Extracurricular activities match
  if (scholarship.extracurriculars && scholarship.extracurriculars.length > 0) {
    const studentActivities = profile.extracurricularActivities || [];
    
    const matchingActivities = scholarship.extracurriculars.filter(activity =>
      studentActivities.some(studentActivity =>
        studentActivity.toLowerCase().includes(activity.toLowerCase()) ||
        activity.toLowerCase().includes(studentActivity.toLowerCase())
      )
    );
    
    if (matchingActivities.length > 0) {
      score += matchingActivities.length * 10;
      reasons.push(`Matches ${matchingActivities.length} of your extracurriculars`);
    }
  }

  // 7. High-value scholarships get a boost
  if (scholarship.amount >= 20000) {
    score += 15;
    reasons.push(`High-value scholarship ($${scholarship.amount.toLocaleString()})`);
  } else if (scholarship.amount >= 10000) {
    score += 10;
    reasons.push(`Valuable scholarship ($${scholarship.amount.toLocaleString()})`);
  }

  // 8. Renewable scholarships get a boost
  if (scholarship.renewable) {
    score += 10;
    reasons.push("Renewable for multiple years");
  }

  // 9. Upcoming deadlines get priority
  if (scholarship.deadline) {
    const daysUntilDeadline = Math.ceil(
      (new Date(scholarship.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysUntilDeadline > 0 && daysUntilDeadline <= 30) {
      score += 20;
      reasons.push(`Deadline approaching (${daysUntilDeadline} days)`);
    } else if (daysUntilDeadline > 30 && daysUntilDeadline <= 60) {
      score += 10;
      reasons.push(`Application due soon (${daysUntilDeadline} days)`);
    } else if (daysUntilDeadline <= 0) {
      return { score: 0, reasons: [] }; // Deadline passed
    }
  }

  // 10. Merit-based preference if student has good GPA
  if (scholarship.meritBased && profile.currentGpa) {
    const gpa = parseFloat(profile.currentGpa.toString());
    if (gpa >= 3.5) {
      score += 5;
      reasons.push("Merit-based (matches your high GPA)");
    }
  }

  return { score, reasons };
}

export function filterScholarships(
  scholarships: Scholarship[],
  filters: {
    minAmount?: number;
    maxAmount?: number;
    subjects?: string[];
    states?: string[];
    meritBased?: boolean;
    needBased?: boolean;
  }
): Scholarship[] {
  return scholarships.filter(scholarship => {
    if (filters.minAmount && scholarship.amount < filters.minAmount) return false;
    if (filters.maxAmount && scholarship.amount > filters.maxAmount) return false;
    
    if (filters.subjects && filters.subjects.length > 0) {
      const hasMatchingSubject = scholarship.subjects?.some(subject =>
        filters.subjects?.includes(subject)
      );
      if (!hasMatchingSubject) return false;
    }
    
    if (filters.states && filters.states.length > 0) {
      if (scholarship.states && scholarship.states.length > 0) {
        const hasMatchingState = scholarship.states.some(state =>
          filters.states?.includes(state)
        );
        if (!hasMatchingState) return false;
      }
    }
    
    if (filters.meritBased !== undefined && scholarship.meritBased !== filters.meritBased) {
      return false;
    }
    
    if (filters.needBased !== undefined && scholarship.financialNeedBased !== filters.needBased) {
      return false;
    }
    
    return true;
  });
}
