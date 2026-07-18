// mockData.js - SalaConnect Seed Data for LocalStorage

const initialMockData = {
  users: [
    {
      username: "admin",
      nameEN: "System Admin",
      nameKH: "អ្នកគ្រប់គ្រងប្រព័ន្ធ",
      email: "admin@school.edu.kh",
      password: "password",
      role: "admin",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80"
    },
    {
      username: "teacher1",
      nameEN: "Cher Somnang",
      nameKH: "លោកគ្រូ សំណាង",
      email: "somnang@school.edu.kh",
      password: "password",
      role: "teacher",
      classes: ["12A", "11B"],
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    },
    {
      username: "teacher2",
      nameEN: "Cher Sophy",
      nameKH: "អ្នកគ្រូ សុភី",
      email: "sophy@school.edu.kh",
      password: "password",
      role: "teacher",
      classes: ["12A", "10A"],
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
    },
    {
      username: "parent1",
      nameEN: "Sok Dara",
      nameKH: "លោក សុខ ដារ៉ា",
      email: "dara@email.com",
      password: "password",
      role: "parent",
      studentId: "STU001",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    },
    {
      username: "parent2",
      nameEN: "Keo Bory",
      nameKH: "អ្នកស្រី កែវ បូរី",
      email: "bory@email.com",
      password: "password",
      role: "parent",
      studentId: "STU002",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
    }
  ],
  students: [
    {
      id: "STU001",
      nameEN: "Sok Sophea",
      nameKH: "សុខ សុភា",
      class: "12A",
      parentId: "parent1",
      grades: {
        Math: 88,
        Khmer: 92,
        Physics: 79,
        Chemistry: 84,
        English: 95
      },
      attendance: {
        Present: 45,
        Absent: 2,
        Late: 1
      },
      remarks: "Sophea is extremely diligent. She participates actively and exhibits exceptional literary analysis skills. Needs to keep working on advanced physics exercises."
    },
    {
      id: "STU002",
      nameEN: "Keo Piseth",
      nameKH: "កែវ ពិសិដ្ឋ",
      class: "12A",
      parentId: "parent2",
      grades: {
        Math: 95,
        Khmer: 80,
        Physics: 91,
        Chemistry: 88,
        English: 85
      },
      attendance: {
        Present: 46,
        Absent: 1,
        Late: 1
      },
      remarks: "Piseth shows fantastic critical thinking. His scores in science and maths are outstanding. We encourage him to read more Khmer literature to improve essay structures."
    },
    {
      id: "STU003",
      nameEN: "Nguon Linda",
      nameKH: "ងួន លីនដា",
      class: "11B",
      parentId: "", // Unlinked
      grades: {
        Math: 72,
        Khmer: 85,
        Physics: 68,
        Chemistry: 70,
        English: 89
      },
      attendance: {
        Present: 41,
        Absent: 5,
        Late: 2
      },
      remarks: "Linda is very creative. Her art and English expressions are high-level. She should seek extra tutoring for Physics concepts."
    }
  ],
  messages: [
    {
      id: "msg_1",
      sender: "teacher1",
      receiver: "parent1",
      text: "Hello Mr. Dara, I wanted to discuss Sophea's score in the recent Chemistry quiz.",
      timestamp: "2026-07-17T09:15:00Z",
      isGroup: false
    },
    {
      id: "msg_2",
      sender: "parent1",
      receiver: "teacher1",
      text: "Hello Cher Somnang, yes! Is everything okay? Did she struggle with the test?",
      timestamp: "2026-07-17T09:22:00Z",
      isGroup: false
    },
    {
      id: "msg_3",
      sender: "teacher1",
      receiver: "parent1",
      text: "She did well (84%), but I believe she could achieve higher with slightly more focus on stoichiometry equations. I've given her some practice sheets.",
      timestamp: "2026-07-17T09:30:00Z",
      isGroup: false
    },
    {
      id: "msg_4",
      sender: "parent1",
      receiver: "teacher1",
      text: "Thank you so much! I will make sure she spends time on those sheets this weekend.",
      timestamp: "2026-07-17T10:05:00Z",
      isGroup: false
    },
    // Group Chat 12A
    {
      id: "msg_g1",
      sender: "teacher1",
      receiver: "12A",
      text: "Dear parents of grade 12A, please note that the science lab report is due this Tuesday. Please check your child's progress.",
      timestamp: "2026-07-16T08:00:00Z",
      isGroup: true
    },
    {
      id: "msg_g2",
      sender: "parent2",
      receiver: "12A",
      text: "Thanks for the reminder, Teacher Somnang. Piseth is working on it tonight.",
      timestamp: "2026-07-16T11:45:00Z",
      isGroup: true
    }
  ],
  announcements: [
    {
      id: "ann_1",
      titleEN: "Parent-Teacher Conference (Q3)",
      titleKH: "ការប្រជុំអាណាព្យាបាល និងគ្រូបង្រៀន (ត្រីមាសទី៣)",
      contentEN: "Join us for the parent-teacher meeting next Saturday, July 25th, from 8:30 AM to 11:30 AM. Individual student progress reports will be handed out.",
      contentKH: "សូមគោរពអញ្ជើញចូលរួមការប្រជុំរវាងអាណាព្យាបាល និងគ្រូបង្រៀននៅថ្ងៃសៅរ៍សប្តាហ៍ក្រោយ ទី២៥ ខែកក្កដា ចាប់ពីម៉ោង ៨:៣០ ព្រឹក ដល់ម៉ោង ១១:៣០ ព្រឹក។ របាយការណ៍លទ្ធផលសិក្សារបស់សិស្សម្នាក់ៗនឹងត្រូវផ្តល់ជូនក្នុងអង្គប្រជុំ។",
      date: "2026-07-18",
      author: "School Administration",
      categoryEN: "Events",
      categoryKH: "ព្រឹត្តិការណ៍",
      image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: "ann_2",
      titleEN: "High School National Exam Registration",
      titleKH: "ការចុះឈ្មោះប្រឡងសញ្ញាបត្រមធ្យមសិក្សាទុតិយភូមិ (បាក់ឌុប)",
      contentEN: "All Grade 12 students are required to verify their spelling in their birth certificates and confirm photo submissions at the administration office before Friday.",
      contentKH: "សិស្សថ្នាក់ទី១២ ទាំងអស់ត្រូវតែមកផ្ទៀងផ្ទាត់អក្ខរាវិរុទ្ធឈ្មោះក្នុងសំបុត្រកំណើត និងបញ្ជាក់ពីការដាក់រូបថតនៅការិយាល័យរដ្ឋបាលឱ្យបានមុនថ្ងៃសុក្រនេះ។",
      date: "2026-07-17",
      author: "Registrar Office",
      categoryEN: "Academic",
      categoryKH: "ការសិក្សា",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80"
    }
  ]
};

// Initialize DB if not present
function initializeDB() {
  const storedUsers = localStorage.getItem("salaconnect_users");
  if (!storedUsers) {
    localStorage.setItem("salaconnect_users", JSON.stringify(initialMockData.users));
  } else {
    // Migration: if admin account is missing from existing localStorage users, add it
    const parsedUsers = JSON.parse(storedUsers);
    if (!parsedUsers.some(u => u.username === "admin")) {
      const adminSeed = initialMockData.users.find(u => u.username === "admin");
      if (adminSeed) {
        parsedUsers.unshift(adminSeed);
        localStorage.setItem("salaconnect_users", JSON.stringify(parsedUsers));
      }
    }
  }

  if (!localStorage.getItem("salaconnect_students")) {
    localStorage.setItem("salaconnect_students", JSON.stringify(initialMockData.students));
  }
  if (!localStorage.getItem("salaconnect_messages")) {
    localStorage.setItem("salaconnect_messages", JSON.stringify(initialMockData.messages));
  }
  if (!localStorage.getItem("salaconnect_announcements")) {
    localStorage.setItem("salaconnect_announcements", JSON.stringify(initialMockData.announcements));
  }
}

window.initialMockData = initialMockData;
window.initializeDB = initializeDB;
