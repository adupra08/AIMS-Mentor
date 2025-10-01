import { GraduationCap, Mail, MapPin, Phone } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [location] = useLocation();
  const isLandingPage = location === "/";

  return (
    <footer className="bg-gray-900 text-white mt-auto" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-8 sm:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Brand & Description */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <GraduationCap className="text-white" size={24} />
              </div>
              <span className="ml-3 text-xl font-bold" data-testid="footer-brand">AIMS</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Artificial Intelligence Mentor for Students - Empowering high school students with personalized academic pathways to reach their dream colleges.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white" data-testid="footer-quicklinks-title">Quick Links</h3>
            <ul className="space-y-2">
              {isLandingPage && (
                <>
                  <li>
                    <a href="#features" className="text-gray-400 hover:text-primary transition-colors duration-200 text-sm" data-testid="footer-link-features">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#about" className="text-gray-400 hover:text-primary transition-colors duration-200 text-sm" data-testid="footer-link-about">
                      About Us
                    </a>
                  </li>
                </>
              )}
              <li>
                <Link 
                  href="/" 
                  className="text-gray-400 hover:text-primary transition-colors duration-200 text-sm" 
                  data-testid="footer-link-home"
                >
                  {isLandingPage ? "Home" : "Landing Page"}
                </Link>
              </li>
              <li>
                <a href="mailto:Pranav.adurty@gmail.com" className="text-gray-400 hover:text-primary transition-colors duration-200 text-sm" data-testid="footer-link-contact">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white" data-testid="footer-resources-title">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:Pranav.adurty@gmail.com" className="text-gray-400 hover:text-primary transition-colors duration-200 text-sm" data-testid="footer-link-support">
                  Email Support
                </a>
              </li>
              <li>
                <a href="tel:805-501-6142" className="text-gray-400 hover:text-primary transition-colors duration-200 text-sm" data-testid="footer-link-phone">
                  Call Us
                </a>
              </li>
              <li>
                <span className="text-gray-500 text-sm">Monday - Friday</span>
              </li>
              <li>
                <span className="text-gray-500 text-sm">9:00 AM - 5:00 PM EST</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white" data-testid="footer-contact-title">Get In Touch</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Mail className="text-primary mt-0.5 flex-shrink-0" size={16} />
                <a href="mailto:Pranav.adurty@gmail.com" className="text-gray-400 hover:text-primary transition-colors duration-200 text-sm" data-testid="footer-contact-email">
                  Pranav.adurty@gmail.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="text-primary mt-0.5 flex-shrink-0" size={16} />
                <a href="tel:805-501-6142" className="text-gray-400 hover:text-primary transition-colors duration-200 text-sm" data-testid="footer-contact-phone">
                  805-501-6142
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="text-primary mt-0.5 flex-shrink-0" size={16} />
                <span className="text-gray-400 text-sm" data-testid="footer-contact-address">
                  123 Education Ave<br />
                  San Francisco, CA 94105
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center">
            <p className="text-gray-500 text-sm text-center sm:text-left" data-testid="footer-copyright">
              © {currentYear} AIMS - Artificial Intelligence Mentor for Students. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
