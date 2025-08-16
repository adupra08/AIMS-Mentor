import { Clock, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StudentProfile } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface RecommendedCoursesProps {
  studentProfile: StudentProfile;
}

interface Course {
  title: string;
  grade: string;
  year: string;
  description: string;
  prerequisites: string;
  matchLevel: "perfect" | "high" | "good";
  category: string;
}

export default function RecommendedCourses({ studentProfile }: RecommendedCoursesProps) {
  const { toast } = useToast();

  const handleAddToPlan = (course: Course) => {
    console.log("Add to plan clicked:", course.title);
    toast({
      title: "Course Added to Plan",
      description: `${course.title} has been added to your academic plan.`,
    });
  };
  // Generate course recommendations based on student profile
  const generateRecommendations = (): Course[] => {
    const recommendations: Course[] = [];
    const currentGrade = studentProfile.currentGrade;
    const interests = studentProfile.academicInterests || [];
    const interestedSubjects = studentProfile.interestedSubjects || [];
    const careerGoals = studentProfile.careerGoals || "";

    // Check for AI/ML/Robotics specific interests
    const hasAIInterests = careerGoals.toLowerCase().includes("ai") || 
                          careerGoals.toLowerCase().includes("ml") || 
                          careerGoals.toLowerCase().includes("robotics") ||
                          careerGoals.toLowerCase().includes("machine learning");

    // Math courses - Higher priority for AI/ML students
    if (interests.includes("STEM Research") || interests.includes("Engineering") || 
        interests.includes("Computer Science") || interestedSubjects.includes("Mathematics") || hasAIInterests) {
      if (currentGrade <= 10) {
        recommendations.push({
          title: "AP Calculus AB",
          grade: "10th Grade", 
          year: "2025",
          description: hasAIInterests ? "Critical foundation for AI/ML algorithms and startup ventures" : "Essential for engineering and math-focused college applications",
          prerequisites: "Algebra II",
          matchLevel: "perfect",
          category: "Mathematics"
        });
      }
      if (currentGrade <= 11) {
        recommendations.push({
          title: "AP Calculus BC",
          grade: "11th Grade",
          year: "2026", 
          description: hasAIInterests ? "Advanced calculus essential for machine learning and neural networks" : "Advanced calculus for top-tier STEM programs",
          prerequisites: "AP Calculus AB or Pre-Calculus",
          matchLevel: "perfect",
          category: "Mathematics"
        });
      }
      // Add AP Statistics for AI/ML students
      if (hasAIInterests && currentGrade <= 11) {
        recommendations.push({
          title: "AP Statistics",
          grade: "11th Grade",
          year: "2026",
          description: "Statistical analysis and data science fundamentals for AI/ML",
          prerequisites: "Algebra II",
          matchLevel: "perfect", 
          category: "Mathematics"
        });
      }
    }

    // Science courses - Prioritized for Robotics/Engineering
    if (interests.includes("STEM Research") || interests.includes("Engineering") || 
        interestedSubjects.includes("Science") || hasAIInterests) {
      if (currentGrade <= 10) {
        recommendations.push({
          title: "AP Physics 1",
          grade: "10th Grade",
          year: "2025",
          description: hasAIInterests ? "Physics principles essential for robotics and engineering systems" : "Strong foundation for STEM applications",
          prerequisites: "None",
          matchLevel: hasAIInterests ? "perfect" : "high",
          category: "Science"
        });
      }
      if (currentGrade <= 11) {
        // Physics C for robotics students
        if (hasAIInterests) {
          recommendations.push({
            title: "AP Physics C (Mechanics)",
            grade: "11th Grade",
            year: "2026",
            description: "Advanced mechanics for robotics and engineering applications",
            prerequisites: "AP Physics 1, Calculus AB",
            matchLevel: "perfect",
            category: "Science"
          });
        } else {
          recommendations.push({
            title: "AP Chemistry",
            grade: "11th Grade", 
            year: "2026",
            description: "Critical for pre-med and chemistry-focused programs",
            prerequisites: "Chemistry or Honors Chemistry",
            matchLevel: "high",
            category: "Science"
          });
        }
      }
      // Only add biology for medical research interests
      if (interests.includes("Medical Research")) {
        recommendations.push({
          title: "AP Biology",
          grade: `${currentGrade + 1}th Grade`,
          year: `${new Date().getFullYear() + (currentGrade + 1 - currentGrade)}`,
          description: "Essential for pre-med and biological science programs",
          prerequisites: "Biology",
          matchLevel: "perfect",
          category: "Science"
        });
      }
    }

    // Computer Science - Enhanced for AI/ML/Robotics interests
    if (interests.includes("Computer Science") || interests.includes("Engineering") ||
        interestedSubjects.includes("Computer Science") || hasAIInterests) {
      // AP Computer Science A - earlier for AI students
      const csaGrade = hasAIInterests ? Math.max(currentGrade + 1, 10) : Math.max(currentGrade + 1, 11);
      recommendations.push({
        title: "AP Computer Science A",
        grade: `${csaGrade}th Grade`,
        year: `${new Date().getFullYear() + Math.max(1, csaGrade - currentGrade)}`,
        description: hasAIInterests ? "Programming foundation essential for AI/ML development and startup success" : "Aligns with your interest in technology competitions",
        prerequisites: "Algebra II",
        matchLevel: "perfect",
        category: "Computer Science"
      });
      
      // Add AP Computer Science Principles for broader CS understanding
      if (hasAIInterests) {
        recommendations.push({
          title: "AP Computer Science Principles",
          grade: `${currentGrade + 1}th Grade`,
          year: `${new Date().getFullYear() + 1}`,
          description: "Computational thinking and technology entrepreneurship concepts",
          prerequisites: "None",
          matchLevel: "perfect",
          category: "Computer Science"
        });
      }
    }

    // Social Sciences
    if (interests.includes("Social Sciences") || interests.includes("International Relations") ||
        interestedSubjects.includes("History")) {
      recommendations.push({
        title: "AP US History",
        grade: `${currentGrade + 1}th Grade`,
        year: `${new Date().getFullYear() + 1}`,
        description: "Develops critical thinking and writing skills",
        prerequisites: "None",
        matchLevel: "good",
        category: "Social Science"
      });
    }

    // Business and Economics - Enhanced for startup interests
    if (interests.includes("Business & Entrepreneurship") || 
        interestedSubjects.includes("Business") ||
        careerGoals.toLowerCase().includes("startup") || 
        careerGoals.toLowerCase().includes("company")) {
      recommendations.push({
        title: "AP Economics (Micro/Macro)",
        grade: "12th Grade",
        year: `${new Date().getFullYear() + (12 - currentGrade)}`,
        description: careerGoals.toLowerCase().includes("startup") ? "Economic principles essential for startup success and business strategy" : "Foundation for business and economics programs",
        prerequisites: "Algebra II",
        matchLevel: "perfect",
        category: "Social Science"
      });
    }

    // Language courses
    if (interestedSubjects.includes("Foreign Languages")) {
      recommendations.push({
        title: "AP Spanish Language",
        grade: `${currentGrade + 2}th Grade`,
        year: `${new Date().getFullYear() + 2}`,
        description: "Demonstrates cultural awareness and language proficiency",
        prerequisites: "Spanish III or equivalent",
        matchLevel: "good",
        category: "World Language"
      });
    }

    return recommendations.slice(0, 6); // Limit to 6 recommendations
  };

  const recommendations = generateRecommendations();

  const getMatchBadge = (matchLevel: string) => {
    switch (matchLevel) {
      case "perfect":
        return <Badge className="bg-green-100 text-green-800">Perfect Match</Badge>;
      case "high":
        return <Badge className="bg-yellow-100 text-yellow-800">High Match</Badge>;
      case "good":
        return <Badge className="bg-blue-100 text-blue-800">Good Match</Badge>;
      default:
        return <Badge variant="secondary">Match</Badge>;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Mathematics":
        return "text-blue-600";
      case "Science":
        return "text-green-600";
      case "Computer Science":
        return "text-purple-600";
      case "Social Science":
        return "text-orange-600";
      case "World Language":
        return "text-pink-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="mb-8">
      <Card className="shadow-sm border border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-gray-900">Recommended AP/IB Courses</CardTitle>
            <Button variant="ghost" className="text-primary hover:text-primary/80">
              Customize Recommendations
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((course, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors aims-card-hover"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{course.title}</h3>
                      <p className="text-sm text-gray-500">{course.grade} - {course.year}</p>
                    </div>
                    {getMatchBadge(course.matchLevel)}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>Prerequisites: {course.prerequisites}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <span className={`text-xs font-medium ${getCategoryColor(course.category)}`}>
                      {course.category}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-primary hover:text-primary/80 text-sm font-medium"
                      onClick={() => handleAddToPlan(course)}
                    >
                      Add to Plan
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="text-gray-400 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recommendations Yet</h3>
              <p className="text-gray-600 mb-4">
                Complete your profile with more academic interests to receive personalized course recommendations.
              </p>
              <Button className="bg-primary hover:bg-primary/90">
                Update Profile
              </Button>
            </div>
          )}

          {recommendations.length > 0 && (
            <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h4 className="font-semibold text-amber-900 mb-2">💡 Course Planning Tips</h4>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• Plan to take 6-8 AP courses throughout high school for competitive colleges</li>
                <li>• Focus on subjects related to your intended major</li>
                <li>• Don't overload - maintain balance with extracurriculars</li>
                <li>• Consider taking AP exams even if your school doesn't offer the course</li>
                <li>• Some colleges give credit for scores of 4 or 5</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
