# AIMS Design Guidelines

## Design Approach

**Selected Framework:** Design System Approach with Ed-Tech Inspiration
- Primary System: Material Design 3 with adaptations for educational context
- Reference Inspiration: Khan Academy's approachable clarity + Coursera's professional structure + Notion's clean organization
- Rationale: Students need familiar, intuitive patterns that reduce cognitive load while maintaining professional credibility for academic content

## Core Design Principles

1. **Clarity First:** Educational tools must prioritize information comprehension over decoration
2. **Student-Centered:** Design for focused learning sessions without distracting elements
3. **Trust Through Professionalism:** Clean, structured layouts build confidence in academic guidance
4. **Scalable Information:** Support dense academic content without feeling overwhelming

---

## Typography System

**Primary Font:** Inter (via Google Fonts CDN)
- Display/Headers: 600 weight, tight line-height (1.2)
- Body Text: 400 weight, comfortable reading (1.6 line-height)
- UI Elements: 500 weight for buttons and labels

**Type Scale:**
- Hero Headline: 3.5rem desktop / 2.25rem mobile
- Section Headers: 2rem desktop / 1.5rem mobile  
- Card Titles: 1.25rem
- Body Text: 1rem (16px base)
- Small Text/Labels: 0.875rem

**Supporting Font:** System font stack for data-heavy sections (tables, dashboards)

---

## Spacing System

**Tailwind Units Strategy:** Use 4, 6, 8, 12, 16, 20 as primary spacing primitives
- Micro spacing (component internal): 2, 3, 4
- Standard gaps: 6, 8
- Section padding: 12, 16, 20 (responsive)
- Large separators: 24, 32

**Header Spacing Critical Rules:**
- Logo container: pl-6 pr-8 (gives logo breathing room)
- Navigation items: mx-8 (prevents crowding near logo)
- Header internal padding: px-6 md:px-12
- Minimum header height: 64px (16 units)
- Logo max-width: 180px, keep aspect ratio
- Navigation tabs minimum touch target: 44px height

---

## Layout Architecture

**Container Strategy:**
- Full-width header/footer: w-full
- Content sections: max-w-7xl mx-auto px-6 md:px-12
- Dashboard cards grid: max-w-6xl mx-auto
- Reading content: max-w-4xl for comfortable line length

**Grid System:**
- Dashboard: 3-column desktop (lg:grid-cols-3), 2-column tablet (md:grid-cols-2), single mobile
- Feature sections: 2-column desktop (lg:grid-cols-2)
- Course listings: 4-column desktop for cards (lg:grid-cols-4)

**Viewport Management:**
- Hero section: 70vh minimum (creates impact without forcing full viewport)
- Content sections: Natural height with py-16 md:py-20
- Dashboard: Natural scroll based on card count

---

## Component Library

### Header Navigation
**Structure:** Fixed top navigation with two-zone layout
- Left zone: Logo (180px max-width, py-4)
- Right zone: Navigation tabs + Profile avatar
- Separation: justify-between with min 48px gap
- Shadow: Subtle bottom shadow (shadow-sm) for depth separation
- Background: Solid with slight transparency (bg-white/95 backdrop-blur)

**Navigation Tabs:**
- Horizontal flex layout with gap-8
- Active state: Bottom border (3px) + slightly bolder weight
- Inactive: Standard weight with hover underline animation
- Minimum touch target: 44x44px per WCAG

### Hero Section
**Layout:** Split layout (60/40) with text-left, image-right
- Text Column: max-w-xl, pr-12
- Image Column: Aspect ratio 4:3, rounded corners (rounded-2xl)
- Background: Gradient subtle overlay (top-to-bottom, light)
- CTA Buttons: Primary + Secondary stacked vertically (gap-4), with backdrop-blur-md bg-white/90 when overlaying image

### Dashboard Cards
**Card Structure:**
- Rounded corners: rounded-xl
- Padding: p-6
- Shadow: shadow-md with hover:shadow-lg transition
- Border: 1px subtle border for definition
- Icon area: 48x48px circle or rounded-square at top
- Content hierarchy: Icon → Title (1.25rem) → Description (0.875rem) → Action link

**Dashboard Grid:**
- "Quick Actions" row: 4 cards (lg:grid-cols-4)
- "Progress Tracking" row: 2 large cards (lg:grid-cols-2)  
- "Upcoming Sessions" row: 3 cards (lg:grid-cols-3)

### Forms & Inputs
**Input Fields:**
- Height: h-12 (consistent touch targets)
- Padding: px-4 py-3
- Border: 2px border, rounded-lg
- Focus state: Ring-2 offset-1
- Label: Above input, font-medium, mb-2

### Buttons
**Primary Action:**
- Padding: px-6 py-3
- Rounded: rounded-lg
- Font: 500 weight, 1rem
- Min-width: 120px for text buttons

**Secondary Action:**
- Border: 2px border
- Background: transparent
- Same padding as primary

### Data Display Components
**Course Cards:**
- Thumbnail image: 16:9 aspect ratio at top
- Content padding: p-5
- Progress bar: h-2 rounded-full at bottom
- Badge for course status: Absolute top-right corner

**Schedule Timeline:**
- Vertical timeline with left-aligned nodes
- Time stamps: Left column (w-24)
- Event cards: Right column with connecting line
- Current event: Emphasized with larger dot + stronger border

---

## Images Section

**Hero Image:**
- **YES - Large Hero Image Required**
- Placement: Right side of hero section (40% width on desktop, full-width on mobile below text)
- Description: High school student using laptop with mentor interface visible on screen, bright natural lighting, modern educational setting, diverse representation
- Aspect Ratio: 4:3 landscape
- Treatment: Rounded-2xl corners, subtle shadow-lg

**Dashboard Illustrations:**
- Placement: Empty states for "No upcoming sessions" and similar
- Description: Friendly, minimalist illustrations in line art style showing students learning, growth metaphors, achievement symbols
- Size: 200x200px, centered in empty state containers

**Course Thumbnails:**
- Placement: Top of each course card in course catalog
- Description: Subject-specific imagery (books for English, equations for Math, atoms for Science) with modern, clean aesthetic
- Aspect Ratio: 16:9
- Treatment: Rounded-t-lg (top corners only), with gradient overlay for text readability

**Feature Section Images:**
- Placement: Alternating left/right in feature grid sections
- Description: Screenshots of AIMS interface showing AI mentor chat, progress analytics, personalized study plans
- Treatment: Shadow-xl, rounded-xl, with subtle border

---

## Section Structure (Landing Page)

1. **Hero:** Split layout with headline + CTA left, large hero image right (70vh)
2. **Social Proof Bar:** Logo strip of partner schools/universities (py-8)
3. **Key Features:** 3-column grid with icons, titles, descriptions (py-20)
4. **How It Works:** 4-step horizontal process flow with numbers + images (py-20)
5. **Student Success Stories:** 2-column testimonial cards with photos (py-16)
6. **Mentor Showcase:** Grid of AI mentor specialties with preview cards (py-20)
7. **Pricing/Access:** Single centered card or 2-column comparison (py-16)
8. **Final CTA:** Full-width with background image, blurred button treatments (py-24)
9. **Footer:** 4-column layout (About, Features, Resources, Contact) with newsletter signup (py-12)

**Critical Quality Notes:**
- Each section fully designed with complete content, no placeholders
- Consistent py-16 to py-24 vertical rhythm between sections
- max-w-7xl containers for all content sections
- Responsive grid collapsing: 3→2→1, 4→2→1 columns