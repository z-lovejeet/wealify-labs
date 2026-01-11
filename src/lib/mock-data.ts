// Single Course Pivot Data

export const siteConfig = {
    name: "The Modern Side Hustle Blueprint",
    description: "Build a profitable side hustle in 30 days.",
    instructor: "Alex Hustle",
    price: 14.99,
    originalPrice: 29.99,
};

export const singleCourse = {
    id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    title: "The Modern Side Hustle Blueprint",
    slug: "modern-side-hustle-blueprint",
    description: "A comprehensive step-by-step guide to finding, validating, and launching a profitable side hustle while working a 9-5 job. No fluff, just actionable strategies.",
    price: 14.99,
    originalPrice: 29.99,
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
        "30+ Actionable Video Lessons",
        "Downloadable PDF Worksheets",
        "Lifetime Access",
        "Certificate of Completion",

    ],
    curriculum: [
        {
            title: "Module 1: The Mindset Shift",
            lessons: [
                { title: "Welcome & Course Overview", type: "video", duration: "5:00" },
                { title: "Employee vs. Entrepreneur Mindset", type: "video", duration: "12:00" },
                { title: "Overcoming Fear of Failure", type: "video", duration: "15:00" },
                { title: "Setting Your 30-Day Goal", type: "video", duration: "10:00" },
            ]
        },
        {
            title: "Module 2: Idea Generation & Validation",
            lessons: [
                { title: "Finding Your Niche", type: "video", duration: "18:00" },
                { title: "The 'Problem First' Approach", type: "video", duration: "14:00" },
                { title: "Validating Your Idea for $0", type: "video", duration: "20:00" },
                { title: "Tools for Market Research", type: "pdf", duration: "5 min read" },
            ]
        },
        {
            title: "Module 3: Building Your Offer",
            lessons: [
                { title: "Crafting an Irresistible Offer", type: "video", duration: "22:00" },
                { title: "Pricing Psychology", type: "video", duration: "15:00" },
                { title: "Creating Your MVP", type: "video", duration: "25:00" },
                { title: "Offer Worksheet", type: "pdf", duration: "10 min read" },
            ]
        },
        {
            title: "Module 4: Setting Up Your Systems",
            lessons: [
                { title: "Essential Tech Stack", type: "video", duration: "12:00" },
                { title: "Automating Payments", type: "video", duration: "16:00" },
                { title: "Email Marketing Basics", type: "video", duration: "18:00" },
                { title: "Time Management for Side Hustlers", type: "video", duration: "14:00" },
            ]
        },
        {
            title: "Module 5: Getting Your First Sales",
            lessons: [
                { title: "Organic Social Media Strategy", type: "video", duration: "20:00" },
                { title: "Cold Outreach Masterclass", type: "video", duration: "25:00" },
                { title: "Leveraging Your Network", type: "video", duration: "10:00" },
                { title: "Handling Objections", type: "video", duration: "15:00" },
            ]
        },
        {
            title: "Module 6: Scaling & Automation",
            lessons: [
                { title: "When to Hire Help", type: "video", duration: "15:00" },
                { title: "Reinvesting Profits", type: "video", duration: "12:00" },
                { title: "Building a Personal Brand", type: "video", duration: "20:00" },
                { title: "Scaling Roadmap", type: "pdf", duration: "5 min read" },
            ]
        },
        {
            title: "Module 7: Bonus Case Studies",
            lessons: [
                { title: "Case Study: $1k/mo Freelance Writer", type: "video", duration: "20:00" },
                { title: "Case Study: $5k/mo E-com Store", type: "video", duration: "25:00" },
                { title: "Case Study: $10k/mo Consultant", type: "video", duration: "30:00" },
                { title: "Final Words & Next Steps", type: "video", duration: "05:00" },
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
