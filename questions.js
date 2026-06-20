// This file stores all the quiz questions. You can easily add more chapters here!
// Each chapter has a unique ID, a title, description, and an array of questions.

export const quizData = {
    "chapter1": {
        title: "Chapter 1: Network Architecture",
        description: "Test your knowledge on basic network topologies, OSI model, and concepts.",
        questions: [
            {
                question: "Which layer of the OSI model is responsible for logical addressing and routing?",
                options: ["Data Link Layer", "Network Layer", "Transport Layer", "Presentation Layer"],
                correctAnswer: 1 // Index of the correct option
            },
            {
                question: "What topology connects all devices to a single central device, like a switch?",
                options: ["Ring", "Mesh", "Star", "Bus"],
                correctAnswer: 2
            },
            {
                question: "Which port does HTTPS typically use?",
                options: ["80", "443", "22", "53"],
                correctAnswer: 1
            }
        ]
    },
    "chapter2": {
        title: "Chapter 2: Network Operations",
        description: "Questions covering routing, switching, and basic network operations.",
        questions: [
            {
                question: "Which protocol is used to automatically assign IP addresses to devices?",
                options: ["DNS", "DHCP", "ARP", "NTP"],
                correctAnswer: 1
            },
            {
                question: "What command is used to test reachability to a specific IP address?",
                options: ["tracert", "ipconfig", "ping", "netstat"],
                correctAnswer: 2
            }
        ]
    }
};
