// Single Course Pivot Data

export const siteConfig = {
    name: "The Modern Side Hustle Blueprint",
    description: "Build a profitable side hustle in 30 days.",
    instructor: "Alex Hustle",
    price: 14.99,
    originalPrice: 49.99,
};

export const singleCourse = {
    id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    title: "The Modern Side Hustle Blueprint",
    slug: "modern-side-hustle-blueprint",
    description: "A comprehensive step-by-step guide to finding, validating, and launching a profitable side hustle while working a 9-5 job. No fluff, just actionable strategies.",
    price: 14.99,
    originalPrice: 49.99,
    instructor: "Alex Hustle",
    rating: 4.9,
    students: 2450,
    modulesCount: 7,
    lessonsCount: 32, // approx 4-5 per module
    level: "All Levels",
    bestseller: true,
    image: "/images/course-cover.jpg", // Placeholder
    features: [
        "7 Comprehensive Modules",
        "30+ Actionable Lessons",
        "Downloadable PDF Worksheets",
        "Lifetime Access",
        "Certificate of Completion",

    ],
    curriculum: [
        {
            title: "Module 1: The Mindset Shift",
            lessons: [
                { title: "Welcome & Course Overview", type: "text", duration: "5 min read" },
                { title: "Employee vs. Entrepreneur Mindset", type: "text", duration: "10 min read" },
                { title: "Overcoming Fear of Failure", type: "text", duration: "8 min read" },
                { title: "Setting Your 30-Day Goal", type: "text", duration: "5 min read" },
            ]
        },
        {
            title: "Module 2: Idea Generation & Validation",
            lessons: [
                { title: "Finding Your Niche", type: "text", duration: "12 min read" },
                { title: "The 'Problem First' Approach", type: "text", duration: "8 min read" },
                { title: "Validating Your Idea for $0", type: "text", duration: "15 min read" },
                { title: "Tools for Market Research", type: "pdf", duration: "5 min read" },
            ]
        },
        {
            title: "Module 3: Building Your Offer",
            lessons: [
                { title: "Crafting an Irresistible Offer", type: "text", duration: "12 min read" },
                { title: "Pricing Psychology", type: "text", duration: "10 min read" },
                { title: "Creating Your MVP", type: "text", duration: "15 min read" },
                { title: "Offer Worksheet", type: "pdf", duration: "10 min read" },
            ]
        },
        {
            title: "Module 4: Setting Up Your Systems",
            lessons: [
                { title: "Essential Tech Stack", type: "text", duration: "8 min read" },
                { title: "Automating Payments", type: "text", duration: "10 min read" },
                { title: "Email Marketing Basics", type: "text", duration: "12 min read" },
                { title: "Time Management for Side Hustlers", type: "text", duration: "8 min read" },
            ]
        },
        {
            title: "Module 5: Getting Your First Sales",
            lessons: [
                { title: "Organic Social Media Strategy", type: "text", duration: "15 min read" },
                { title: "Cold Outreach Masterclass", type: "text", duration: "18 min read" },
                { title: "Leveraging Your Network", type: "text", duration: "5 min read" },
                { title: "Handling Objections", type: "text", duration: "10 min read" },
            ]
        },
        {
            title: "Module 6: Scaling & Automation",
            lessons: [
                { title: "When to Hire Help", type: "text", duration: "8 min read" },
                { title: "Reinvesting Profits", type: "text", duration: "6 min read" },
                { title: "Building a Personal Brand", type: "text", duration: "12 min read" },
                { title: "Scaling Roadmap", type: "pdf", duration: "5 min read" },
            ]
        },
        {
            title: "Module 7: Bonus Case Studies",
            lessons: [
                { title: "Case Study: $1k/mo Freelance Writer", type: "text", duration: "15 min read" },
                { title: "Case Study: $5k/mo E-com Store", type: "text", duration: "20 min read" },
                { title: "Case Study: $10k/mo Consultant", type: "text", duration: "25 min read" },
                { title: "Final Words & Next Steps", type: "text", duration: "5 min read" },
            ]
        }
    ]
};

// Re-export old arrays as empty or compatible minimal versions if referenced elsewhere to avoid build breaks
export const courses = [singleCourse];
export const platformStats = {
    totalRevenue: 12450,
    totalUsers: 2450,
    activeCourses: 1,
};
export const users = [
    { id: "u1", name: "Minh Nguyen", email: "minh@example.com", role: "admin", enrolledCourses: ["side-hustle-blueprint"] },
    { id: "u2", name: "Sarah Smith", email: "sarah@example.com", role: "student", enrolledCourses: ["side-hustle-blueprint"] },
];
export const categories = ["Business", "Entrepreneurship", "Marketing"];
