import { GraduationCap, Target, Users, TrendingUp, BookOpen, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <GraduationCap className="text-white text-xl" />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">AIMS</span>
            </div>
            <Button onClick={handleLogin} className="bg-primary hover:bg-primary/90">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AI-Driven Mentoring
            </span>
            <br />
            to Launch Your Future
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            AIMS (Artificial Intelligence Mentor for Students) creates personalized academic pathways 
            to help high school students reach their dream colleges.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Button 
              onClick={handleLogin}
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-lg px-8 py-3"
            >
              Start Your Journey
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-3 border-primary text-primary hover:bg-primary/10"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose AIMS?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform addresses the gaps in traditional high school mentoring 
              by providing personalized, comprehensive guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="text-primary text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Personalized Pathways
                </h3>
                <p className="text-gray-600">
                  AI-generated academic plans tailored to your interests, goals, and dream colleges.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="text-secondary text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Opportunity Discovery
                </h3>
                <p className="text-gray-600">
                  Find competitions, internships, and programs you never knew existed, with deadline tracking.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="text-accent text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  AP/IB Guidance
                </h3>
                <p className="text-gray-600">
                  Smart course recommendations based on your academic performance and college goals.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="text-purple-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  24/7 AI Mentor
                </h3>
                <p className="text-gray-600">
                  Get instant answers to your academic questions with our intelligent chatbot.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="text-green-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Progress Tracking
                </h3>
                <p className="text-gray-600">
                  Monitor your academic journey with detailed analytics and milestone tracking.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <GraduationCap className="text-red-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  End-to-End Support
                </h3>
                <p className="text-gray-600">
                  Complete academic ecosystem from 9th grade through college admissions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Problem Statement */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Problem We Solve
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              "Many miss opportunities not due to lack of ability, but because they aren't aware or ready when it arrives."
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Current Challenges:
              </h3>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Overworked school counselors with limited time for individual guidance</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Missed opportunities due to lack of awareness and poor timing</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Generic advice that doesn't fit individual student profiles</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Expensive private college counseling services</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Students realize their mistakes too late in the process</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                AIMS Solution:
              </h3>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>AI-powered personalized mentoring available 24/7</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Proactive opportunity discovery with deadline reminders</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Tailored recommendations based on individual student data</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Affordable solution accessible to all students</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Early intervention starting from 9th grade</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Academic Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already using AIMS to navigate their path to their dream colleges.
          </p>
          <Button 
            onClick={handleLogin}
            size="lg" 
            className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-3"
          >
            Get Started Now
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <GraduationCap className="text-white text-xl" />
              </div>
              <span className="ml-3 text-xl font-bold">AIMS</span>
            </div>
            <p className="text-gray-400 mb-4">
              Artificial Intelligence Mentor for Students
            </p>
            <p className="text-gray-500 text-sm">
              © 2024 AIMS. All rights reserved. Empowering students to reach their full potential.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
