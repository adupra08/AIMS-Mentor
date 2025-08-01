// Enhanced AI Mentor Icon Component
export default function AIMentorIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Head/Face Circle */}
      <circle cx="12" cy="8" r="5" fill="currentColor" opacity="0.9" />
      
      {/* Eyes */}
      <circle cx="10.5" cy="7" r="0.8" fill="white" />
      <circle cx="13.5" cy="7" r="0.8" fill="white" />
      <circle cx="10.5" cy="7" r="0.4" fill="currentColor" />
      <circle cx="13.5" cy="7" r="0.4" fill="currentColor" />
      
      {/* Smile */}
      <path
        d="M 9.5 9 Q 12 10.5 14.5 9"
        stroke="white"
        strokeWidth="0.8"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Body/Torso */}
      <rect x="9" y="12" width="6" height="8" rx="3" fill="currentColor" opacity="0.8" />
      
      {/* Arms */}
      <rect x="6" y="13" width="3" height="1.5" rx="0.75" fill="currentColor" opacity="0.7" />
      <rect x="15" y="13" width="3" height="1.5" rx="0.75" fill="currentColor" opacity="0.7" />
      
      {/* Graduation Cap */}
      <rect x="8" y="4" width="8" height="1" rx="0.5" fill="white" opacity="0.9" />
      <polygon points="7,4 17,4 16,2 8,2" fill="white" opacity="0.8" />
      <circle cx="17" cy="3" r="0.5" fill="white" />
      
      {/* Brain/Knowledge Symbol */}
      <path
        d="M 10 5.5 Q 11 4.5 12 5.5 Q 13 4.5 14 5.5"
        stroke="currentColor"
        strokeWidth="0.3"
        fill="none"
        opacity="0.6"
      />
      
      {/* Tech Elements */}
      <rect x="10.5" y="15" width="1" height="1" rx="0.2" fill="white" opacity="0.6" />
      <rect x="12.5" y="15" width="1" height="1" rx="0.2" fill="white" opacity="0.6" />
      <rect x="11.5" y="17" width="1" height="1" rx="0.2" fill="white" opacity="0.6" />
    </svg>
  );
}