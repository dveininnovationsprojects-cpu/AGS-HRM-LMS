import axios from 'axios';

// Local storage helpers
const getStorageItem = (key: string, defaultValue: any) => {
  const item = localStorage.getItem(key);
  if (!item) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    return JSON.parse(item);
  } catch {
    return defaultValue;
  }
};

const setStorageItem = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Seed Mock Databases
// Seed Mock Databases
const generateMockEmployees = () => {
  const firstNames = [
    'Anand', 'Bhavya', 'Charles', 'Divya', 'Elango', 'Fiona', 'Ganesh', 'Harish', 'Induja', 'Jaya',
    'Karthik', 'Lavanya', 'Manoj', 'Nisha', 'Omprakash', 'Priya', 'Quentin', 'Rahul', 'Suresh', 'Tanvi',
    'Uday', 'Vignesh', 'William', 'Xavier', 'Yamini', 'Zeenat', 'Amit', 'Deepa', 'Gautam', 'Kiran',
    'Meera', 'Naveen', 'Pooja', 'Rohan', 'Sneha', 'Vijay', 'Aarthi', 'Balaji', 'Chitra', 'Dinesh',
    'Ezhil', 'Farhana', 'Gokul', 'Hari', 'Ishwarya', 'Janani', 'Kavin', 'Lekha', 'Mohan', 'Nandhini'
  ];
  const lastNames = [
    'Kumar', 'Rao', 'Dev', 'Sridhar', 'M', 'Roy', 'Prabhu', 'Krishnan', 'Sen', 'Ram',
    'Ramaswamy', 'Nair', 'Sharma', 'Patel', 'Gupta', 'Singh', 'Joshi', 'Das', 'Murthy', 'Pillai',
    'Reddy', 'Subramanian', 'Verma', 'Iyer', 'Bose', 'Chawla', 'Mehta', 'Kulkarni', 'Deshmukh', 'Jadhav',
    'Shetty', 'Menon', 'Acharya', 'Trivedi', 'Pandey', 'Mishra', 'Prasad', 'Sinha', 'Roy', 'Varma'
  ];
  const depts = [
    { id: 1, name: 'Operations' },
    { id: 2, name: 'HR' },
    { id: 3, name: 'IT' },
    { id: 4, name: 'Finance' },
    { id: 5, name: 'Admin' }
  ];
  const designations = [
    { id: 1, title: 'Senior Manager' },
    { id: 2, title: 'HR Executive' },
    { id: 3, title: 'Software Engineer' },
    { id: 4, title: 'Financial Analyst' },
    { id: 5, title: 'Team Lead' },
    { id: 6, title: 'Associate' },
    { id: 7, title: 'System Admin' },
    { id: 8, title: 'Trainer' },
    { id: 9, title: 'Recruiter' }
  ];

  const recruiters = [
    { name: 'Bhavya Rao', avatar: 'https://randomuser.me/api/portraits/women/10.jpg' },
    { name: 'Karthik Ramaswamy', avatar: 'https://randomuser.me/api/portraits/men/11.jpg' },
    { name: 'Suresh Kumar', avatar: 'https://randomuser.me/api/portraits/men/12.jpg' },
    { name: 'Divya Sridhar', avatar: 'https://randomuser.me/api/portraits/women/13.jpg' }
  ];

  const trainers = [
    { name: 'Meera Jasmine', avatar: 'https://randomuser.me/api/portraits/women/14.jpg' },
    { name: 'Anand Kumar', avatar: 'https://randomuser.me/api/portraits/men/15.jpg' },
    { name: 'Karthik Ramaswamy', avatar: 'https://randomuser.me/api/portraits/men/11.jpg' },
    { name: 'Suresh Kumar', avatar: 'https://randomuser.me/api/portraits/men/12.jpg' }
  ];

  const interviewers = [
    { name: 'Suresh Kumar (VP Operations)', avatar: 'https://randomuser.me/api/portraits/men/12.jpg' },
    { name: 'Anand Kumar (Senior Manager)', avatar: 'https://randomuser.me/api/portraits/men/15.jpg' },
    { name: 'Elango M (Team Lead)', avatar: 'https://randomuser.me/api/portraits/men/16.jpg' },
    { name: 'Charles Dev (Software Engineer)', avatar: 'https://randomuser.me/api/portraits/men/17.jpg' }
  ];

  const teamLeads = [
    { name: 'Anand Kumar', avatar: 'https://randomuser.me/api/portraits/men/15.jpg' },
    { name: 'Elango M', avatar: 'https://randomuser.me/api/portraits/men/16.jpg' },
    { name: 'Charles Dev', avatar: 'https://randomuser.me/api/portraits/men/17.jpg' },
    { name: 'Bhavya Rao', avatar: 'https://randomuser.me/api/portraits/women/10.jpg' }
  ];

  const projects = [
    'AGS Enterprise Operations Core',
    'AGS Workforce Intelligence Portal',
    'AGS Cloud Infrastructure Maintenance',
    'AGS Corporate Billing & Ledger',
    'Operations Delivery Support',
    'Internal Talent Acquisition'
  ];

  const leavingReasons = [
    'Better Opportunity',
    'Higher Education',
    'Career Growth',
    'Health Issues',
    'Personal Reasons'
  ];

  const bloodGroups = ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'];

  const employees: any[] = [];

  for (let i = 1; i <= 1000; i++) {
    const fn = firstNames[(i - 1) % firstNames.length];
    const nameIndex = Math.floor((i - 1) / firstNames.length);
    const suffix = nameIndex > 0 ? ` ${String.fromCharCode(64 + nameIndex)}` : '';
    const ln = lastNames[(i - 1) % lastNames.length] + suffix;

    const emailPrefix = `${fn.toLowerCase()}.${ln.replace(/[^a-zA-Z]/g, '').toLowerCase()}`;
    const work_email = `${emailPrefix}@agshealth.com`;
    const personal_email = `${emailPrefix}.personal@gmail.com`;
    
    let dept = depts[0];
    let desig = designations[5];
    
    if (i <= 40) {
      dept = depts[(i - 1) % depts.length];
      desig = designations[0];
    } else if (i <= 100) {
      dept = depts[(i - 1) % depts.length];
      desig = designations[4];
    } else if (i <= 600) {
      dept = depts[0];
      desig = designations[5];
    } else if (i <= 850) {
      dept = depts[2];
      desig = (i % 3 === 0) ? designations[6] : designations[2];
    } else if (i <= 950) {
      dept = depts[1];
      desig = (i % 2 === 0) ? designations[1] : designations[8];
    } else {
      dept = depts[3];
      desig = designations[3];
    }

    let status = 'Active';
    let date_of_leaving: string | null = null;
    let leaving_reason: string | null = null;
    if (i >= 960) {
      status = 'Terminated';
      date_of_leaving = `2026-05-${String(15 + (i % 10)).padStart(2, '0')}`;
      leaving_reason = i % 2 === 0 ? 'Performance Failure & Repeated SLA Delays' : 'Compliance & Security Policy Violation';
    } else if (i >= 920) {
      status = 'Resigned';
      date_of_leaving = `2026-05-${String(10 + (i % 5)).padStart(2, '0')}`;
      leaving_reason = leavingReasons[i % leavingReasons.length];
    } else if (i >= 880) {
      status = 'On-Leave';
    }

    const joinYear = 2020 + (i % 6);
    const joinMonth = String(1 + (i % 12)).padStart(2, '0');
    const joinDay = String(1 + (i % 28)).padStart(2, '0');
    const date_of_joining = `${joinYear}-${joinMonth}-${joinDay}`;

    const gender = (i % 2 === 0) ? 'Female' : 'Male';

    const dobYear = 1980 + (i % 22);
    const dobMonth = String(1 + (i % 12)).padStart(2, '0');
    const dobDay = String(1 + (i % 28)).padStart(2, '0');
    const date_of_birth = `${dobYear}-${dobMonth}-${dobDay}`;

    let work_country = 'India';
    let work_branch = 'chennai';
    let work_state = 'Tamil Nadu';
    let nationality = 'Indian';

    // Determinstic Unequal Distribution (India 350, US 250, Philippines 205, Mexico 195):
    if (i <= 350) {
      work_country = 'India';
      nationality = 'Indian';
      // Branch distribution within India: Chennai 90, Bengaluru 70, Hyderabad 55, Vellore 45, Tirupati 35, Ahmedabad 30, Jaipur 25
      if (i <= 90) {
        work_branch = 'chennai';
        work_state = 'Tamil Nadu';
      } else if (i <= 160) {
        work_branch = 'bengaluru';
        work_state = 'Karnataka';
      } else if (i <= 215) {
        work_branch = 'hyderabad';
        work_state = 'Telangana';
      } else if (i <= 260) {
        work_branch = 'vellore';
        work_state = 'Tamil Nadu';
      } else if (i <= 295) {
        work_branch = 'tirupati';
        work_state = 'Andhra Pradesh';
      } else if (i <= 325) {
        work_branch = 'ahmedabad';
        work_state = 'Gujarat';
      } else {
        work_branch = 'jaipur';
        work_state = 'Rajasthan';
      }
    } else if (i <= 600) {
      work_country = 'United States';
      nationality = 'American';
      // Scranton: 140, Washington: 110
      if (i <= 490) {
        work_branch = 'scranton';
        work_state = 'Pennsylvania';
      } else {
        work_branch = 'washington';
        work_state = 'District of Columbia';
      }
    } else if (i <= 805) {
      work_country = 'Philippines';
      nationality = 'Filipino';
      work_branch = 'manila';
      work_state = 'Metro Manila';
    } else {
      work_country = 'Mexico';
      nationality = 'Mexican';
      // Zapopan Meya: 105, Zapopan Tizoc: 90
      if (i <= 910) {
        work_branch = 'zapopan_meya';
        work_state = 'Jalisco';
      } else {
        work_branch = 'zapopan_tizoc';
        work_state = 'Jalisco';
      }
    }

    let revenue = 0;
    let cost = 4000 + (i % 10) * 1000;
    let proj = 'Bench / Support';

    if (status === 'Active' || status === 'On-Leave') {
      if (dept.name === 'Operations') {
        proj = projects[i % 2 === 0 ? 0 : 4];
        revenue = 10000 + (i % 15) * 2000;
        cost = 5000 + (i % 10) * 900;
      } else if (dept.name === 'IT') {
        proj = projects[i % 2 === 0 ? 1 : 2];
        revenue = 15000 + (i % 15) * 2500;
        cost = 7000 + (i % 10) * 1200;
      }
    } else {
      revenue = 0;
      cost = 0;
      proj = 'Exited';
    }

    const recIndex = i % recruiters.length;
    const trIndex = i % trainers.length;
    const intIndex = i % interviewers.length;
    const tlIndex = i % teamLeads.length;

    const recruiter = recruiters[recIndex];
    const trainer = trainers[trIndex];
    const interviewer = interviewers[intIndex];
    const tl = teamLeads[tlIndex];

    const mistakes: string[] = [];
    if (i % 7 === 0) {
      mistakes.push(`SLA response time fell below target in week ${20 + (i % 5)}`);
    }
    if (i % 11 === 0) {
      mistakes.push(`Minor processing error flagged in recent client batch`);
    }

    let ai_recommendation = 'New joiner. Monitor progress and assign introductory training.';
    if (status === 'Resigned') {
      ai_recommendation = 'Employee has resigned. Complete exit interview and knowledge transfer checklist.';
    } else if (status === 'Terminated') {
      ai_recommendation = 'Employee was terminated. Complete exit checklist, revoke system permissions, and clear payroll separation.';
    } else if (revenue - cost > 15000) {
      ai_recommendation = 'High-yield profitable asset. Retention risk is Low. Recommended for fast-track promotion and leadership mentoring.';
    } else if (revenue - cost < 2000 && revenue > 0) {
      ai_recommendation = 'Low net margin contribution. Recommend skill training intervention and daily productivity checks.';
    } else if (mistakes.length > 0) {
      ai_recommendation = 'Performance metrics showing SLA deviations. Suggest pairing with a senior buddy and immediate guidelines refresh.';
    } else if (status === 'Active') {
      ai_recommendation = 'Solid performance. Recommend continuing current path and assigning intermediate certifications.';
    }

    const coursesCompletedList = [
      'Introduction to AGS Quality Guidelines',
      'Enterprise Information Security Compliance',
      'Effective Client Communication & Soft Skills',
      'Leadership Training for Managers'
    ];
    const courses_completed = [coursesCompletedList[i % coursesCompletedList.length]];
    if (i % 3 === 0) {
      courses_completed.push(coursesCompletedList[(i + 1) % coursesCompletedList.length]);
    }

    // Training Performance Tag
    let training_performance = 'Medium';
    if (i % 3 === 0) {
      training_performance = 'Excellent';
    } else if (i % 7 === 0 || i % 11 === 0) {
      training_performance = 'Poor';
    }

    let training_score = 75 + (i % 15);
    if (training_performance === 'Excellent') {
      training_score = 90 + (i % 11);
    } else if (training_performance === 'Poor') {
      training_score = 50 + (i % 15);
    }

    let project_performance = 80 + (i % 18);

    // Revenue and Profit Status tags
    let revenue_status = 'Low';
    let profit_status = 'Loss Center';
    const diff = revenue - cost;

    if (revenue > 25000) {
      revenue_status = 'High';
    } else if (revenue > 0) {
      revenue_status = 'Normal';
    }

    if (diff > 12000) {
      profit_status = 'High Profit';
    } else if (diff > 0) {
      profit_status = 'Normal Margin';
    } else if (revenue === 0) {
      profit_status = 'Cost Center (Support)';
    } else {
      profit_status = 'Loss Center';
    }

    employees.push({
      id: i,
      emp_code: `AGS-${String(i).padStart(3, '0')}`,
      first_name: fn,
      middle_name: '',
      last_name: ln,
      work_email,
      personal_email,
      phone_primary: `9876543${String(i).padStart(3, '0')}`,
      department: dept,
      designation: desig,
      employment_status: status,
      status: status,
      employment_type: i % 15 === 0 ? 'Contract' : 'Full-time',
      date_of_joining,
      date_of_leaving,
      leaving_reason,
      gender,
      date_of_birth,
      blood_group: bloodGroups[i % bloodGroups.length],
      nationality,
      work_country,
      work_state,
      work_branch,
      training_score,
      project_performance,
      pan_number: `ABCDE${String(1000 + i)}F`,
      bank_account_number: `12345678${String(1000 + i)}`,
      bank_ifsc: 'SBIN0000789',
      uan_number: `100200300${String(100 + i)}`,
      recruiter: recruiter.name,
      recruiter_avatar: recruiter.avatar,
      trainer: trainer.name,
      trainer_avatar: trainer.avatar,
      interviewer: interviewer.name,
      interviewer_avatar: interviewer.avatar,
      team_lead: tl.name,
      team_lead_avatar: tl.avatar,
      revenue,
      cost,
      project: proj,
      mistakes,
      ai_recommendation,
      courses_completed,
      training_performance,
      revenue_status,
      profit_status,
      avatar: gender === 'Female'
        ? `https://randomuser.me/api/portraits/women/${(i % 95) + 1}.jpg`
        : `https://randomuser.me/api/portraits/men/${(i % 95) + 1}.jpg`
    });
  }

  return employees;
};

const generateMockReviews = (employees: any[]) => {
  const reviews: any[] = [];
  const cycle = 'Annual Review 2025';
  employees.forEach((emp, index) => {
    if (index % 5 === 0) {
      const isHigh = emp.revenue - emp.cost > 10000;
      const rating = isHigh ? 4.5 + (index % 6) * 0.1 : 3.0 + (index % 10) * 0.1;
      const reviewer = emp.team_lead || 'Director Operations';
      reviews.push({
        id: reviews.length + 1,
        employee_id: emp.id,
        employee_name: `${emp.first_name} ${emp.last_name}`,
        reviewer_name: reviewer,
        rating: Math.min(5, Math.max(1, parseFloat(rating.toFixed(1)))),
        review_cycle: cycle,
        review_period: cycle,
        feedback: isHigh ? 'Exceeds expectation. Exceptional execution and financial contribution.' : 'Meets expectations. Consistently delivers on tasks.',
        status: 'Completed',
        goals_achieved: isHigh ? 90 + (index % 11) : 70 + (index % 15)
      });
    }
  });
  return reviews;
};

const generateMockAttendance = (employees: any[]) => {
  const attendance: any[] = [];
  const todayStr = new Date().toISOString().split('T')[0];
  employees.forEach((emp) => {
    if (emp.employment_status === 'Active') {
      const isLate = emp.id % 12 === 0;
      attendance.push({
        id: attendance.length + 1,
        employee_id: emp.id,
        employee_name: `${emp.first_name} ${emp.last_name}`,
        date: todayStr,
        check_in: isLate ? '10:15 AM' : '09:00 AM',
        check_out: isLate ? '04:30 PM' : '06:00 PM',
        status: isLate ? 'Late' : 'Present'
      });
    } else if (emp.employment_status === 'On-Leave') {
      attendance.push({
        id: attendance.length + 1,
        employee_id: emp.id,
        employee_name: `${emp.first_name} ${emp.last_name}`,
        date: todayStr,
        check_in: '-',
        check_out: '-',
        status: 'Absent'
      });
    }
  });
  return attendance;
};

const generateMockLeaves = (employees: any[]) => {
  const leaves: any[] = [];
  employees.forEach((emp, index) => {
    if (index % 15 === 0) {
      leaves.push({
        id: leaves.length + 1,
        employee_id: emp.id,
        employee: { first_name: emp.first_name, last_name: emp.last_name },
        leave_type: index % 2 === 0 ? 'Sick Leave' : 'Casual Leave',
        from_date: '2026-06-10',
        to_date: '2026-06-12',
        no_of_days: 3,
        reason: index % 2 === 0 ? 'Recovery from high fever' : 'Family event',
        status: index % 3 === 0 ? 'Pending' : 'Approved'
      });
    }
  });
  return leaves;
};

const generateMockEnrollments = (employees: any[]) => {
  const enrollments: any[] = [];
  employees.forEach((emp, index) => {
    if (index % 3 === 0) {
      enrollments.push({
        id: enrollments.length + 1,
        employee_id: emp.id,
        course_id: 1,
        progress: 100,
        progress_percentage: 100,
        status: 'Completed',
        created_at: '2026-06-01T00:00:00Z'
      });
    }
    if (index % 4 === 0) {
      enrollments.push({
        id: enrollments.length + 1,
        employee_id: emp.id,
        course_id: 2,
        progress: 45,
        progress_percentage: 45,
        status: 'In Progress',
        created_at: '2026-06-05T00:00:00Z'
      });
    }
  });
  return enrollments;
};

const initialEmployees = generateMockEmployees();
const initialReviews = generateMockReviews(initialEmployees);
const initialAttendance = generateMockAttendance(initialEmployees);
const initialLeaves = generateMockLeaves(initialEmployees);
const initialEnrollments = generateMockEnrollments(initialEmployees);

const initialDepts = [
  { id: 1, name: 'Operations', code: 'OPS', description: 'Core operations and workforce', head_name: 'Anand Kumar' },
  { id: 2, name: 'HR', code: 'HRD', description: 'Human resources and recruitment', head_name: 'Bhavya Rao' },
  { id: 3, name: 'IT', code: 'ITS', description: 'Information technology support', head_name: 'Charles Dev' },
  { id: 4, name: 'Finance', code: 'FIN', description: 'Accounts and financial operations', head_name: 'Divya Sridhar' },
  { id: 5, name: 'Admin', code: 'ADM', description: 'Administrative operations', head_name: 'Ganesh Prabhu' },
];

const initialDesignations = [
  { id: 1, name: 'Senior Manager', title: 'Senior Manager' },
  { id: 2, name: 'HR Executive', title: 'HR Executive' },
  { id: 3, name: 'Software Engineer', title: 'Software Engineer' },
  { id: 4, name: 'Financial Analyst', title: 'Financial Analyst' },
  { id: 5, name: 'Team Lead', title: 'Team Lead' },
  { id: 6, name: 'Associate', title: 'Associate' },
  { id: 7, name: 'System Admin', title: 'System Admin' },
  { id: 8, name: 'Trainer', title: 'Trainer' },
  { id: 9, name: 'Recruiter', title: 'Recruiter' },
];

const initialCourses = [
  { id: 1, title: 'Introduction to AGS Quality Guidelines', category: 'Technical', duration_hours: 6, level: 'Beginner', status: 'Published', description: 'Learn the primary guidelines for high quality operational delivery at AGS Health.' },
  { id: 2, title: 'Enterprise Information Security Compliance', category: 'Compliance', duration_hours: 3, level: 'Beginner', status: 'Published', description: 'Mandatory information security standards, phishing training, and compliance procedures.' },
  { id: 3, title: 'Effective Client Communication & Soft Skills', category: 'Soft Skills', duration_hours: 8, level: 'Intermediate', status: 'Published', description: 'Key communication strategies for client alignment and business presentation.' },
  { id: 4, title: 'Leadership Training for Managers', category: 'Leadership', duration_hours: 12, level: 'Advanced', status: 'Published', description: 'Structured course covering people management, team scaling, and motivational leadership.' },
  { id: 5, title: 'Workplace Safety & Threat Management', category: 'Safety', duration_hours: 2, level: 'Beginner', status: 'Published', description: 'Safety regulations, hazard identification, and emergency response guidelines.' },
];

const initialTrainers = [
  { id: 1, name: 'Meera Jasmine', email: 'meera.jasmine@agshealth.com', phone: '9876543001', specialization: 'Operational Guidelines & Quality Assurance', bio: 'Meera has 8+ years of QA leadership experience, driving critical training initiatives across healthcare ops.', type: 'Internal', rating: 4.8, cost_per_batch: 2000, avatar: 'https://randomuser.me/api/portraits/women/14.jpg' },
  { id: 2, name: 'Anand Kumar', email: 'anand.kumar@agshealth.com', phone: '9876543002', specialization: 'Billing Compliance & Client Quality Standards', bio: 'Senior manager and certified instructor on compliance protocols, HIPAA audits, and quality SLAs.', type: 'Internal', rating: 4.6, cost_per_batch: 1500, avatar: 'https://randomuser.me/api/portraits/men/15.jpg' },
  { id: 3, name: 'Karthik Ramaswamy', email: 'karthik.ramaswamy@agshealth.com', phone: '9876543003', specialization: 'Enterprise IT Systems & Security Infrastructure', bio: 'IT Lead focused on cloud platforms, corporate security frameworks, and security credentialing.', type: 'Internal', rating: 4.4, cost_per_batch: 1800, avatar: 'https://randomuser.me/api/portraits/men/11.jpg' },
  { id: 4, name: 'Bhavya Rao', email: 'bhavya.rao@external.com', phone: '9876543004', specialization: 'Corporate Soft Skills & Leadership Dynamics', bio: 'External leadership coach specializing in communication workshops, client negotiation, and manager core competency.', type: 'External', rating: 4.5, cost_per_batch: 3000, avatar: 'https://randomuser.me/api/portraits/women/10.jpg' },
  { id: 5, name: 'System Security Team', email: 'sec-ops@agshealth.com', phone: '9876543005', specialization: 'Information Security & Threat Compliance', bio: 'Global threat response team executing phishing drills and enterprise standard credential updates.', type: 'Internal', rating: 4.2, cost_per_batch: 500, avatar: 'https://randomuser.me/api/portraits/men/12.jpg' },
];

const getInitialBatches = (employees: any[]) => {
  const getEmpDetails = (id: number) => {
    const e = employees.find((x: any) => x.id === id);
    return e ? {
      employee_id: e.id,
      name: `${e.first_name} ${e.last_name}`,
      emp_code: e.emp_code,
      dept_name: e.department?.name || 'Operations',
    } : { employee_id: id, name: `Employee ${id}`, emp_code: `AGS-${String(id).padStart(3, '0')}`, dept_name: 'Operations' };
  };

  return [
    {
      id: 1,
      batch_name: 'AGS Quality Boot Camp',
      program_name: 'Introduction to AGS Quality Guidelines',
      trainer_id: 2,
      trainer_name: 'Anand Kumar',
      trainer_avatar: 'https://randomuser.me/api/portraits/men/15.jpg',
      start_date: '2026-06-01',
      end_date: '2026-06-10',
      venue: 'Conference Room 3A',
      mode: 'In-Person',
      capacity: 25,
      status: 'Completed',
      trainer_cost: 1500,
      material_cost: 300,
      curriculum: [
        'Healthcare BPO Foundations & Quality Fundamentals',
        'Detailed Walkthrough of AGS Quality SLA Requirements',
        'Mock Ticket Audits & Common Pitfalls Review',
        'Interactive Client Case Study Analysis',
        'Final Assessment and Trainer One-on-One Feedback'
      ],
      trainees: [5, 8, 12, 19, 25, 34, 45, 52, 60, 67, 73, 80].map((id, index) => {
        const emp = getEmpDetails(id);
        const scores = [85, 92, 78, 62, 95, 81, 74, 58, 88, 90, 83, 76];
        const feedback = [
          'Excellent grasp of quality metrics. Participated actively.',
          'Superb mock audit performance. Certified as QA Ready.',
          'Satisfactory understanding, but needs to focus on response SLAs.',
          'Struggled with audit simulation. Refresher recommended.',
          'Flawless audit execution. Potential buddy mentor.',
          'Solid case handling. Passed comfortably.',
          'Average performance. Monitor response time closely.',
          'Failed mock ticket validation twice. Needs refresher.',
          'Great communication and client presentation score.',
          'Strong analytical skills. Promising results.',
          'Completed all coursework with solid scores.',
          'Needs practice on billing codes. Certified with caveats.'
        ];
        const score = scores[index % scores.length];
        return {
          ...emp,
          score,
          status: 'Completed',
          activities_done: feedback[index % feedback.length],
          employee_cost: 1200,
          revenue_generated: score >= 90 ? 7000 : score >= 75 ? 5000 : 3500
        };
      })
    },
    {
      id: 2,
      batch_name: 'Information Security compliance H1',
      program_name: 'Enterprise Information Security Compliance',
      trainer_id: 5,
      trainer_name: 'System Security Team',
      trainer_avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
      start_date: '2026-06-15',
      end_date: '2026-06-22',
      venue: 'Online Webinar',
      mode: 'Online',
      capacity: 100,
      status: 'Ongoing',
      trainer_cost: 500,
      material_cost: 100,
      curriculum: [
        'HIPAA Compliance & PII Protection Guidelines',
        'Phishing Threats, Social Engineering & Reporting Controls',
        'Multi-Factor Authentication & Access Control Settings',
        'Live Phishing Mock Test & Certification Assessment'
      ],
      trainees: [1, 2, 3, 4, 6, 7, 9, 10, 11, 13, 14, 15].map((id) => {
        const emp = getEmpDetails(id);
        return {
          ...emp,
          score: null,
          status: 'Ongoing',
          activities_done: 'In-progress. Completed Modules 1 & 2. Mock phishing test pending.',
          employee_cost: 600,
          revenue_generated: 0
        };
      })
    },
    {
      id: 3,
      batch_name: 'Effective Communication Workshop',
      program_name: 'Effective Client Communication & Soft Skills',
      trainer_id: 4,
      trainer_name: 'Bhavya Rao',
      trainer_avatar: 'https://randomuser.me/api/portraits/women/10.jpg',
      start_date: '2026-07-05',
      end_date: '2026-07-07',
      venue: 'Training Room A',
      mode: 'In-Person',
      capacity: 15,
      status: 'Scheduled',
      trainer_cost: 3000,
      material_cost: 500,
      curriculum: [
        'Understanding Client Personas & Assertive Communication',
        'Conflict Resolution, Escalation Handling & Written Etiquette',
        'Roleplay Scenarios & Corporate Communication Audits'
      ],
      trainees: [17, 21, 29, 33, 41, 49, 58, 66, 74].map((id) => {
        const emp = getEmpDetails(id);
        return {
          ...emp,
          score: null,
          status: 'Enrolled',
          activities_done: 'Awaiting program commencement.',
          employee_cost: 400,
          revenue_generated: 0
        };
      })
    },
    {
      id: 4,
      batch_name: 'Operations Guidelines Bootcamp - Cohort 2',
      program_name: 'Introduction to AGS Quality Guidelines',
      trainer_id: 1,
      trainer_name: 'Meera Jasmine',
      trainer_avatar: 'https://randomuser.me/api/portraits/women/14.jpg',
      start_date: '2026-05-10',
      end_date: '2026-05-20',
      venue: 'Conference Room 3B',
      mode: 'In-Person',
      capacity: 20,
      status: 'Completed',
      trainer_cost: 2000,
      material_cost: 400,
      curriculum: [
        'Healthcare Coding Standard Overview & Quality Matrix',
        'Audit Logs & Operational Frameworks',
        'Client Escalation Pathways & SLA Restores',
        'Live Environment Processing Simulation',
        'Capstone Examination and Final Reviews'
      ],
      trainees: [30, 31, 32, 35, 36, 40, 42, 43, 44, 46].map((id, index) => {
        const emp = getEmpDetails(id);
        const scores = [94, 91, 88, 96, 85, 78, 90, 89, 93, 87];
        const feedback = [
          'Excellent understanding of complex healthcare billing audits.',
          'Very systematic approach. Exceeded audit accuracy goals.',
          'Demonstrated high competency in HIPAA compliance audits.',
          'Outstanding performer. Scored highest in simulation sandbox.',
          'Solid comprehension, but should improve resolution speed.',
          'Good scores. A bit hesitant in handling complex case scenarios.',
          'Well-prepared for clinical coding logs. Promising analyst.',
          'Strong performance. Ready for client-facing support.',
          'Excellent quality score. Mastered operational restoration codes.',
          'Passed capstone audit easily. Commendable diligence.'
        ];
        const score = scores[index % scores.length];
        return {
          ...emp,
          score,
          status: 'Completed',
          activities_done: feedback[index % feedback.length],
          employee_cost: 1200,
          revenue_generated: score >= 90 ? 9500 : 8000
        };
      })
    }
  ];
};

const initialPayroll = [
  { id: 1, month: 5, year: 2026, employee_count: 1000, processed_date: '2026-05-31', total_net: 50000000, status: 'Processed' },
  { id: 2, month: 6, year: 2026, employee_count: 1000, processed_date: '2026-06-15', total_net: 50200000, status: 'Draft' },
];

const initialRequisitions = [
  { id: 1, title: 'Operations Associate', department: 'Operations', vacancy_count: 5, target_date: '2026-07-15', status: 'Approved' },
  { id: 2, title: 'React Frontend Developer', department: 'IT', vacancy_count: 2, target_date: '2026-08-01', status: 'Approved' },
];

const initialCandidates = [
  { id: 1, first_name: 'Rahul', last_name: 'Sharma', email: 'rahul.s@candidate.com', phone: '9888877777', resume_url: '#', requisition_id: 1, status: 'Offered' },
  { id: 2, first_name: 'Priya', last_name: 'Nair', email: 'priya.n@candidate.com', phone: '9888877778', resume_url: '#', requisition_id: 2, status: 'Interviewing' },
];

// Seeding logic check and initialization
const checkAndSeedMockDatabases = () => {
  const storedEmps = localStorage.getItem('ags_employees');
  const storedBatches = localStorage.getItem('ags_batches');
  const storedTrainers = localStorage.getItem('ags_trainers');
  let needsSeeding = false;
  
  if (!storedEmps || storedEmps.includes('dicebear.com')) {
    needsSeeding = true;
  } else {
    try {
      const parsed = JSON.parse(storedEmps);
      if (!Array.isArray(parsed) || parsed.length < 1000 || !parsed[0].hasOwnProperty('profit_status') || !parsed[0].hasOwnProperty('work_country') || !parsed[0].hasOwnProperty('work_state') || !parsed[0].hasOwnProperty('training_score')) {
        needsSeeding = true;
      } else {
        // Force re-seeding if we detect the old distribution (e.g. India had 750 employees, now it should have 350)
        const indiaCount = parsed.filter((e: any) => e.work_country === 'India').length;
        if (indiaCount > 350) {
          needsSeeding = true;
        }
      }
    } catch {
      needsSeeding = true;
    }
  }

  // Check if training databases need seeding (i.e. not yet in localstorage, or old schema without trainer_cost)
  let needsTrainingSeed = false;
  if (!storedBatches || !storedTrainers) {
    needsTrainingSeed = true;
  } else {
    try {
      const parsedBatches = JSON.parse(storedBatches);
      if (!Array.isArray(parsedBatches) || parsedBatches.length === 0 || !parsedBatches[0].hasOwnProperty('trainer_cost') || !parsedBatches[0].hasOwnProperty('trainees')) {
        needsTrainingSeed = true;
      }
    } catch {
      needsTrainingSeed = true;
    }
  }

  if (needsSeeding) {
    localStorage.setItem('ags_employees', JSON.stringify(initialEmployees));
    localStorage.setItem('ags_reviews', JSON.stringify(initialReviews));
    localStorage.setItem('ags_attendance', JSON.stringify(initialAttendance));
    localStorage.setItem('ags_leaves', JSON.stringify(initialLeaves));
    localStorage.setItem('ags_enrollments', JSON.stringify(initialEnrollments));
  } else {
    getStorageItem('ags_employees', initialEmployees);
    getStorageItem('ags_reviews', initialReviews);
    getStorageItem('ags_attendance', initialAttendance);
    getStorageItem('ags_leaves', initialLeaves);
    getStorageItem('ags_enrollments', initialEnrollments);
  }

  const currentEmployees = getStorageItem('ags_employees', initialEmployees);
  const dynamicInitialBatches = getInitialBatches(currentEmployees);

  if (needsTrainingSeed || needsSeeding) {
    localStorage.setItem('ags_trainers', JSON.stringify(initialTrainers));
    localStorage.setItem('ags_batches', JSON.stringify(dynamicInitialBatches));
  } else {
    getStorageItem('ags_trainers', initialTrainers);
    getStorageItem('ags_batches', dynamicInitialBatches);
  }

  getStorageItem('ags_depts', initialDepts);
  getStorageItem('ags_designations', initialDesignations);
  getStorageItem('ags_courses', initialCourses);
  getStorageItem('ags_payroll', initialPayroll);
  getStorageItem('ags_requisitions', initialRequisitions);
  getStorageItem('ags_candidates', initialCandidates);
};

checkAndSeedMockDatabases();


// Axios Base
const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Helper response formatting
const mockResponse = (data: any, status = 200) => {
  return Promise.resolve({
    data: {
      success: true,
      data,
    },
    status,
    statusText: 'OK',
    headers: {},
    config: {} as any,
  });
};

const mockError = (message: string, status = 400) => {
  const err = new Error(message) as any;
  err.response = {
    data: { success: false, message },
    status,
  };
  return Promise.reject(err);
};

// Override GET requests
api.get = async (url: string, config?: any): Promise<any> => {
  const cleanUrl = url.split('?')[0];
  const params = config?.params || {};

  // Simulate latency
  await new Promise(resolve => setTimeout(resolve, 200));

  if (cleanUrl === '/dashboard/stats') {
    const employees = getStorageItem('ags_employees', initialEmployees);
    const leaves = getStorageItem('ags_leaves', initialLeaves);
    const courses = getStorageItem('ags_courses', initialCourses);
    const attendance = getStorageItem('ags_attendance', initialAttendance);

    let totalRevenue = 0;
    let totalCost = 0;
    employees.forEach((emp: any) => {
      totalRevenue += emp.revenue || 0;
      totalCost += emp.cost || 0;
    });

    const activeCount = employees.filter((e: any) => e.employment_status === 'Active').length;
    const presentToday = attendance.filter((a: any) => a.status === 'Present' || a.status === 'Late').length;
    const absentToday = attendance.filter((a: any) => a.status === 'Absent').length;

    return mockResponse({
      kpis: {
        totalEmployees: employees.length,
        activeEmployees: activeCount,
        newJoinees: 5,
        presentToday: presentToday,
        absentToday: absentToday,
        openPositions: 4,
        pendingLeaves: leaves.filter((l: any) => l.status === 'Pending').length,
        activeCourses: courses.filter((c: any) => c.status === 'Published').length,
        revenue: totalRevenue,
        cost: totalCost,
        profit: totalRevenue - totalCost,
        attritionRate: 8.5,
        hiringEfficiency: 92,
        trainingROI: 148,
      },
    });
  }

  if (cleanUrl === '/employees') {
    let employees = getStorageItem('ags_employees', initialEmployees);
    const search = (params.search || '').toLowerCase();
    const status = params.status || '';
    const training_performance = params.training_performance || '';
    const revenue_status = params.revenue_status || '';
    const profit_status = params.profit_status || '';
    const country = params.country || '';
    const state = params.state || '';
    const branch = params.branch || '';

    if (search) {
      employees = employees.filter((e: any) => 
        e.first_name.toLowerCase().includes(search) || 
        e.last_name.toLowerCase().includes(search) || 
        e.emp_code.toLowerCase().includes(search) ||
        (e.work_email && e.work_email.toLowerCase().includes(search))
      );
    }
    if (status) {
      employees = employees.filter((e: any) => e.employment_status === status || e.status === status);
    }
    if (training_performance) {
      employees = employees.filter((e: any) => e.training_performance === training_performance);
    }
    if (revenue_status) {
      employees = employees.filter((e: any) => e.revenue_status === revenue_status);
    }
    if (profit_status) {
      employees = employees.filter((e: any) => e.profit_status === profit_status);
    }
    if (country) {
      employees = employees.filter((e: any) => e.work_country === country);
    }
    if (state) {
      employees = employees.filter((e: any) => e.work_state === state);
    }
    if (branch) {
      employees = employees.filter((e: any) => e.work_branch === branch);
    }

    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 15;
    const total = employees.length;
    const pages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;

    return mockResponse({
      employees: employees.slice(start, end),
      pagination: { total, page, limit, pages, totalPages: pages },
    });
  }

  if (cleanUrl.match(/^\/employees\/\d+$/)) {
    const id = parseInt(cleanUrl.split('/')[2]);
    const employees = getStorageItem('ags_employees', initialEmployees);
    const employee = employees.find((e: any) => e.id === id);
    if (!employee) return mockError('Employee not found', 404);
    return mockResponse({ employee });
  }

  if (cleanUrl === '/departments') {
    const departments = getStorageItem('ags_depts', initialDepts);
    return mockResponse({ departments });
  }

  if (cleanUrl === '/designations') {
    const designations = getStorageItem('ags_designations', initialDesignations);
    return mockResponse({ designations });
  }

  if (cleanUrl === '/attendance') {
    const attendance = getStorageItem('ags_attendance', initialAttendance);
    const employees = getStorageItem('ags_employees', initialEmployees);
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 15;
    
    const mappedAttendance = attendance.map((att: any) => {
      const emp = employees.find((e: any) => e.id === att.employee_id);
      let checkInTime = null;
      let checkOutTime = null;
      const dateStr = att.date || '2026-06-17';
      if (att.check_in && att.check_in !== '-') {
        const [time, ampm] = att.check_in.split(' ');
        let [hr, min] = time.split(':');
        let hrNum = parseInt(hr);
        if (ampm === 'PM' && hrNum < 12) hrNum += 12;
        if (ampm === 'AM' && hrNum === 12) hrNum = 0;
        const hrStr = String(hrNum).padStart(2, '0');
        checkInTime = `${dateStr}T${hrStr}:${min}:00`;
      }
      if (att.check_out && att.check_out !== '-') {
        const [time, ampm] = att.check_out.split(' ');
        let [hr, min] = time.split(':');
        let hrNum = parseInt(hr);
        if (ampm === 'PM' && hrNum < 12) hrNum += 12;
        if (ampm === 'AM' && hrNum === 12) hrNum = 0;
        const hrStr = String(hrNum).padStart(2, '0');
        checkOutTime = `${dateStr}T${hrStr}:${min}:00`;
      }
      
      return {
        id: att.id,
        employee_id: att.employee_id,
        employee: emp ? {
          first_name: emp.first_name,
          last_name: emp.last_name,
          emp_code: emp.emp_code
        } : { first_name: att.employee_name || 'Unknown', last_name: '', emp_code: 'AGS-???' },
        attendance_date: att.date || dateStr,
        check_in_time: checkInTime,
        check_out_time: checkOutTime,
        work_hours: att.status === 'Present' ? 9.0 : att.status === 'Late' ? 6.5 : 0,
        status: att.status
      };
    });

    const total = mappedAttendance.length;
    const pages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;

    return mockResponse({
      records: mappedAttendance.slice(start, end),
      stats: {
        present: mappedAttendance.filter((r: any) => r.status === 'Present').length,
        absent: mappedAttendance.filter((r: any) => r.status === 'Absent').length,
        late: mappedAttendance.filter((r: any) => r.status === 'Late').length,
      },
      pagination: { total, page, limit, pages, totalPages: pages },
    });
  }

  if (cleanUrl === '/leaves') {
    const leaves = getStorageItem('ags_leaves', initialLeaves);
    const employees = getStorageItem('ags_employees', initialEmployees);
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 15;

    const mappedLeaves = leaves.map((l: any) => {
      const emp = employees.find((e: any) => e.id === l.employee_id);
      return {
        ...l,
        employee: emp ? { first_name: emp.first_name, last_name: emp.last_name } : (l.employee || { first_name: 'Unknown', last_name: '' })
      };
    });

    const total = mappedLeaves.length;
    const pages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    return mockResponse({
      leaves: mappedLeaves.slice(start, end),
      pagination: { total, page, limit, pages, totalPages: pages },
    });
  }

  if (cleanUrl === '/payroll') {
    const employees = getStorageItem('ags_employees', initialEmployees);
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 15;
    const total = employees.length;
    const pages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    
    const records = employees.slice(start, end).map((emp: any) => {
      const baseSalary = emp.cost ? emp.cost * 8 / 10 : 50000;
      const gross = Math.round(baseSalary);
      const deductions = Math.round(baseSalary * 0.12);
      const net = gross - deductions;
      return {
        id: emp.id,
        employee: {
          id: emp.id,
          first_name: emp.first_name,
          last_name: emp.last_name,
          emp_code: emp.emp_code
        },
        month: params.month ? parseInt(params.month) : 6,
        year: params.year ? parseInt(params.year) : 2026,
        gross_salary: gross,
        total_deductions: deductions,
        net_salary: net,
        working_days: 22,
        status: 'Processed'
      };
    });

    return mockResponse({
      records,
      pagination: { total, page, limit, pages, totalPages: pages },
    });
  }

  if (cleanUrl === '/payroll/summary') {
    const employees = getStorageItem('ags_employees', initialEmployees);
    const totalEmployees = employees.length;
    let totalGross = 0;
    let totalDeductions = 0;
    let totalNet = 0;
    employees.forEach((emp: any) => {
      const baseSalary = emp.cost ? emp.cost * 8 / 10 : 50000;
      const gross = baseSalary;
      const deductions = Math.round(baseSalary * 0.12);
      const net = gross - deductions;
      totalGross += gross;
      totalDeductions += deductions;
      totalNet += net;
    });

    return mockResponse({
      summary: {
        total_employees: totalEmployees,
        total_gross: Math.round(totalGross),
        total_deductions: Math.round(totalDeductions),
        total_net: Math.round(totalNet),
      },
    });
  }

  if (cleanUrl === '/recruitment/requisitions') {
    const requisitions = getStorageItem('ags_requisitions', initialRequisitions);
    const mappedReqs = requisitions.map((r: any) => ({
      id: r.id,
      req_number: r.req_number || `REQ-${String(r.id).padStart(3, '0')}`,
      title: r.title,
      openings: r.openings || r.vacancy_count || 1,
      status: r.status === 'Approved' ? 'Open' : (r.status || 'Open'),
      created_at: r.created_at || '2026-06-01T00:00:00Z',
    }));
    return mockResponse({ requisitions: mappedReqs });
  }

  if (cleanUrl === '/recruitment/candidates') {
    const candidates = getStorageItem('ags_candidates', initialCandidates);
    const requisitions = getStorageItem('ags_requisitions', initialRequisitions);
    const mappedCands = candidates.map((c: any) => {
      const req = requisitions.find((r: any) => r.id === c.requisition_id);
      return {
        id: c.id,
        first_name: c.first_name,
        last_name: c.last_name,
        email: c.email,
        requisition: req ? { title: req.title } : { title: 'Unknown Role' },
        current_stage: c.current_stage || c.status || 'Applied',
        source: c.source || 'LinkedIn',
      };
    });
    return mockResponse({ candidates: mappedCands });
  }

  if (cleanUrl === '/recruitment/funnel') {
    return mockResponse({
      funnel: [
        { stage: 'Applied', count: 12 },
        { stage: 'Screening', count: 8 },
        { stage: 'Interviewing', count: 4 },
        { stage: 'Offered', count: 2 },
        { stage: 'Hired', count: 1 },
      ],
    });
  }

  if (cleanUrl === '/lms/courses') {
    const courses = getStorageItem('ags_courses', initialCourses);
    return mockResponse({ courses });
  }

  if (cleanUrl === '/lms/analytics') {
    const enrollments = getStorageItem('ags_enrollments', initialEnrollments);
    return mockResponse({
      overall: {
        total_courses: 5,
        total_enrollments: enrollments.length,
        completions: enrollments.filter((e: any) => e.status === 'Completed').length,
        avg_progress: enrollments.reduce((acc: number, curr: any) => acc + (curr.progress_percentage || curr.progress || 0), 0) / (enrollments.length || 1),
      },
    });
  }

  if (cleanUrl === '/lms/enrollments') {
    const enrollments = getStorageItem('ags_enrollments', initialEnrollments);
    const employees = getStorageItem('ags_employees', initialEmployees);
    const courses = getStorageItem('ags_courses', initialCourses);

    const detailedEnrollments = enrollments.map((en: any) => {
      const emp = employees.find((e: any) => e.id === en.employee_id) || { first_name: 'System', last_name: 'User' };
      const course = courses.find((c: any) => c.id === en.course_id) || { title: 'Unknown Course' };
      return {
        id: en.id,
        employee: {
          first_name: emp.first_name,
          last_name: emp.last_name,
          emp_code: emp.emp_code
        },
        course: course,
        progress_percentage: en.progress_percentage || en.progress || 0,
        status: en.status,
        created_at: en.created_at || '2026-06-01T00:00:00Z'
      };
    });
    return mockResponse({ enrollments: detailedEnrollments });
  }

  if (cleanUrl === '/training/batches') {
    const batches = getStorageItem('ags_batches', []);
    return mockResponse({ batches });
  }

  if (cleanUrl === '/training/trainers') {
    const trainers = getStorageItem('ags_trainers', initialTrainers);
    const batches = getStorageItem('ags_batches', []);
    
    const enrichedTrainers = trainers.map((t: any) => {
      const trainerBatches = batches.filter((b: any) => b.trainer_id === t.id);
      const totalTrainees = trainerBatches.reduce((sum: number, b: any) => sum + (b.trainees?.length || 0), 0);
      const netProfitContribution = trainerBatches.reduce((sum: number, b: any) => {
        const batchRevenue = b.trainees?.reduce((rSum: number, tr: any) => rSum + (tr.revenue_generated || 0), 0) || 0;
        const traineeCost = b.trainees?.reduce((cSum: number, tr: any) => cSum + (tr.employee_cost || 0), 0) || 0;
        const totalBatchCost = (b.trainer_cost || 0) + (b.material_cost || 0) + traineeCost;
        return sum + (batchRevenue - totalBatchCost);
      }, 0);

      return {
        ...t,
        batches_count: trainerBatches.length,
        total_trainees: totalTrainees,
        net_profit: netProfitContribution
      };
    });

    return mockResponse({ trainers: enrichedTrainers });
  }

  if (cleanUrl === '/training/stats') {
    const batches = getStorageItem('ags_batches', []);
    const trainers = getStorageItem('ags_trainers', initialTrainers);

    let totalBatches = batches.length;
    let totalTrainees = 0;
    let totalTrainerCost = 0;
    let totalMaterialCost = 0;
    let totalEmployeeCost = 0;
    let totalRevenueBoost = 0;
    let completedTraineesCount = 0;
    let totalTraineeScore = 0;

    batches.forEach((b: any) => {
      totalTrainees += b.trainees?.length || 0;
      totalTrainerCost += b.trainer_cost || 0;
      totalMaterialCost += b.material_cost || 0;

      b.trainees?.forEach((tr: any) => {
        totalEmployeeCost += tr.employee_cost || 0;
        totalRevenueBoost += tr.revenue_generated || 0;
        if (tr.score !== null && tr.score !== undefined) {
          totalTraineeScore += tr.score;
          completedTraineesCount += 1;
        }
      });
    });

    const totalCost = totalTrainerCost + totalMaterialCost + totalEmployeeCost;
    const netProfit = totalRevenueBoost - totalCost;
    const roi = totalCost > 0 ? parseFloat(((netProfit / totalCost) * 100).toFixed(1)) : 0;
    const avgScore = completedTraineesCount > 0 ? Math.round(totalTraineeScore / completedTraineesCount) : 80;

    const trainerPerformance = trainers.map((t: any) => {
      const tBatches = batches.filter((b: any) => b.trainer_id === t.id);
      let trainerRevenue = 0;
      let trainerBatchCost = 0;
      let trTraineesCount = 0;
      let trTotalScore = 0;

      tBatches.forEach((b: any) => {
        trainerBatchCost += (b.trainer_cost || 0) + (b.material_cost || 0);
        b.trainees?.forEach((tr: any) => {
          trainerRevenue += tr.revenue_generated || 0;
          trainerBatchCost += tr.employee_cost || 0;
          if (tr.score !== null && tr.score !== undefined) {
            trTotalScore += tr.score;
            trTraineesCount += 1;
          }
        });
      });

      const tProfit = trainerRevenue - trainerBatchCost;
      const tRoi = trainerBatchCost > 0 ? parseFloat(((tProfit / trainerBatchCost) * 100).toFixed(1)) : 0;
      const tAvgScore = trTraineesCount > 0 ? Math.round(trTotalScore / trTraineesCount) : 0;

      return {
        trainer_name: t.name,
        cost: trainerBatchCost,
        revenue: trainerRevenue,
        profit: tProfit,
        roi: tRoi,
        avg_score: tAvgScore,
        rating: t.rating
      };
    });

    const outcomes = [
      { name: 'Ops Guidelines', before: 54, after: 88 },
      { name: 'Security Compliance', before: 62, after: 94 },
      { name: 'Client Soft Skills', before: 48, after: 78 },
      { name: 'Leadership Core', before: 65, after: 90 },
    ];

    return mockResponse({
      stats: {
        totalBatches,
        totalTrainees,
        avgScore,
        totalTrainerCost,
        totalMaterialCost,
        totalEmployeeCost,
        totalCost,
        totalRevenueBoost,
        netProfit,
        roi
      },
      trainerPerformance,
      outcomes
    });
  }

  if (cleanUrl === '/performance') {
    const reviews = getStorageItem('ags_reviews', initialReviews);
    const employees = getStorageItem('ags_employees', initialEmployees);
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 15;
    const total = reviews.length;
    const pages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;

    const mappedReviews = reviews.map((r: any) => {
      const emp = employees.find((e: any) => e.id === r.employee_id);
      return {
        id: r.id,
        employee_id: r.employee_id,
        employee: emp ? { first_name: emp.first_name, last_name: emp.last_name } : { first_name: r.employee_name || 'Unknown', last_name: '' },
        review_period: r.review_period || r.review_cycle || 'Annual Review 2025',
        overall_rating: r.overall_rating || r.rating || 4.0,
        goals_achieved: r.goals_achieved || 85,
        status: r.status || 'Completed',
        reviewed_by: r.reviewed_by || r.reviewer_name || 'Director Operations'
      };
    });
    return mockResponse({
      reviews: mappedReviews.slice(start, end),
      pagination: { total, page, limit, pages, totalPages: pages },
    });
  }

  if (cleanUrl === '/performance/kpi') {
    const reviews = getStorageItem('ags_reviews', initialReviews);
    const total = reviews.length;
    const completed = reviews.filter((r: any) => (r.status || 'Completed') === 'Completed').length;
    const avg = reviews.reduce((sum: number, r: any) => sum + (r.overall_rating || r.rating || 4.0), 0) / (total || 1);
    const high = reviews.filter((r: any) => (r.overall_rating || r.rating || 4.0) >= 4.0).length;
    const low = reviews.filter((r: any) => (r.overall_rating || r.rating || 4.0) < 3.0).length;
    return mockResponse({
      kpis: {
        total_reviews: total,
        completed: completed,
        avg_rating: avg,
        high_performers: high,
        low_performers: low,
      }
    });
  }

  if (cleanUrl === '/ai/insights') {
    return mockResponse({
      insights: `• Team engagement has shown a 4.2% positive increase this month.
• IT developer attrition risk has stabilized following training interventions.
• "AGS Quality Guidelines" has reached 90% compliance completion.
• Recruitment pipeline shows time-to-fill reduced from 35 days to 28 days.`,
    });
  }

  if (cleanUrl === '/analytics/executive') {
    const employees = getStorageItem('ags_employees', initialEmployees);
    const attendance = getStorageItem('ags_attendance', initialAttendance);
    const active = employees.filter((e: any) => e.employment_status === 'Active').length;
    const resigned = employees.filter((e: any) => e.employment_status === 'Resigned').length;
    const onLeave = employees.filter((e: any) => e.employment_status === 'On-Leave').length;
    const presentToday = attendance.filter((a: any) => a.status === 'Present' || a.status === 'Late').length;
    
    const employeeProfitability = employees.map((emp: any) => ({
      id: emp.id,
      name: `${emp.first_name} ${emp.last_name}`,
      dept: emp.department?.name || '-',
      project: emp.project || 'Bench / Support',
      tl: emp.team_lead || '-',
      revenue: emp.revenue || 0,
      cost: emp.cost || 0,
      profit: (emp.revenue || 0) - (emp.cost || 0),
      risk: emp.mistakes && emp.mistakes.length > 1 ? 'High' : emp.mistakes && emp.mistakes.length > 0 ? 'Medium' : 'Low',
      avatar: emp.avatar,
      status: emp.employment_status || emp.status || 'Active',
      leaving_reason: emp.leaving_reason || null,
      date_of_leaving: emp.date_of_leaving || null,
      training_performance: emp.training_performance || 'Medium',
      revenue_status: emp.revenue_status || 'Normal',
      profit_status: emp.profit_status || 'Cost Center'
    }));

    let totalRevenue = 0;
    let totalCost = 0;
    employees.forEach((emp: any) => {
      totalRevenue += emp.revenue || 0;
      totalCost += emp.cost || 0;
    });
    
    return mockResponse({
      employees: { active, resigned, new_joiners: 5 },
      attendance: { present_today: presentToday },
      monthlyJoiners: [
        { month: 'Jan', revenue: Math.round(totalRevenue * 0.85), cost: Math.round(totalCost * 0.9), profit: Math.round(totalRevenue * 0.85 - totalCost * 0.9) },
        { month: 'Feb', revenue: Math.round(totalRevenue * 0.88), cost: Math.round(totalCost * 0.91), profit: Math.round(totalRevenue * 0.88 - totalCost * 0.91) },
        { month: 'Mar', revenue: Math.round(totalRevenue * 0.92), cost: Math.round(totalCost * 0.92), profit: Math.round(totalRevenue * 0.92 - totalCost * 0.92) },
        { month: 'Apr', revenue: Math.round(totalRevenue * 0.95), cost: Math.round(totalCost * 0.95), profit: Math.round(totalRevenue * 0.95 - totalCost * 0.95) },
        { month: 'May', revenue: Math.round(totalRevenue * 0.98), cost: Math.round(totalCost * 0.98), profit: Math.round(totalRevenue * 0.98 - totalCost * 0.98) },
        { month: 'Jun', revenue: totalRevenue, cost: totalCost, profit: totalRevenue - totalCost },
      ],
      departmentChart: [
        { name: 'Operations', revenue: employees.filter((e: any) => e.department?.name === 'Operations').reduce((sum: number, e: any) => sum + (e.revenue || 0), 0), cost: employees.filter((e: any) => e.department?.name === 'Operations').reduce((sum: number, e: any) => sum + (e.cost || 0), 0), profit: employees.filter((e: any) => e.department?.name === 'Operations').reduce((sum: number, e: any) => sum + ((e.revenue || 0) - (e.cost || 0)), 0) },
        { name: 'IT', revenue: employees.filter((e: any) => e.department?.name === 'IT').reduce((sum: number, e: any) => sum + (e.revenue || 0), 0), cost: employees.filter((e: any) => e.department?.name === 'IT').reduce((sum: number, e: any) => sum + (e.cost || 0), 0), profit: employees.filter((e: any) => e.department?.name === 'IT').reduce((sum: number, e: any) => sum + ((e.revenue || 0) - (e.cost || 0)), 0) },
        { name: 'HR', revenue: 0, cost: employees.filter((e: any) => e.department?.name === 'HR').reduce((sum: number, e: any) => sum + (e.cost || 0), 0), profit: employees.filter((e: any) => e.department?.name === 'HR').reduce((sum: number, e: any) => -sum - (e.cost || 0), 0) },
        { name: 'Finance', revenue: 0, cost: employees.filter((e: any) => e.department?.name === 'Finance').reduce((sum: number, e: any) => sum + (e.cost || 0), 0), profit: employees.filter((e: any) => e.department?.name === 'Finance').reduce((sum: number, e: any) => -sum - (e.cost || 0), 0) },
        { name: 'Admin', revenue: 0, cost: employees.filter((e: any) => e.department?.name === 'Admin').reduce((sum: number, e: any) => sum + (e.cost || 0), 0), profit: employees.filter((e: any) => e.department?.name === 'Admin').reduce((sum: number, e: any) => -sum - (e.cost || 0), 0) },
      ],
      employeeProfitability
    });
  }

  if (cleanUrl === '/analytics/profitability-teams') {
    const employees = getStorageItem('ags_employees', initialEmployees);
    const tlMap: Record<string, any> = {};
    employees.forEach((emp: any) => {
      if (!emp.team_lead || emp.employment_status !== 'Active') return;
      const tl = emp.team_lead;
      if (!tlMap[tl]) {
        tlMap[tl] = {
          tl_name: tl,
          department: emp.department?.name || 'Operations',
          headcount: 0,
          cost: 0,
          revenue: 0,
          sla_compliance: tl === 'Anand Kumar' ? 99.1 : tl === 'Elango M' ? 98.4 : tl === 'Charles Dev' ? 94.2 : 96.5,
          health_score: tl === 'Anand Kumar' ? 95 : tl === 'Elango M' ? 92 : tl === 'Charles Dev' ? 78 : 88,
        };
      }
      tlMap[tl].headcount += 1;
      tlMap[tl].cost += emp.cost || 0;
      tlMap[tl].revenue += emp.revenue || 0;
    });

    const teams = Object.values(tlMap).map((t: any) => {
      const profit = t.revenue - t.cost;
      const margin = t.revenue > 0 ? parseFloat(((profit / t.revenue) * 100).toFixed(1)) : 0;
      return {
        ...t,
        profit,
        margin
      };
    });

    return mockResponse({ teams });
  }

  if (cleanUrl === '/analytics/recruitment-hr') {
    return mockResponse({
      recruiters: [
        { recruiter_name: 'Bhavya Rao', candidates_hired: 12, success_rate: 95, retention_rate: 92, avg_days_to_hire: 21, cost_per_hire: 1200, profit_index: 8.8 },
        { recruiter_name: 'Karthik Ramaswamy', candidates_hired: 8, success_rate: 90, retention_rate: 88, avg_days_to_hire: 26, cost_per_hire: 1400, profit_index: 7.9 },
      ],
      funnel: [
        { current_stage: 'Applied', count: 50 },
        { current_stage: 'Screening', count: 30 },
        { current_stage: 'Interview-1', count: 20 },
        { current_stage: 'Offer', count: 8 },
        { current_stage: 'Hired', count: 5 }
      ],
      sources: [
        { name: 'LinkedIn', value: 35 },
        { name: 'Naukri', value: 25 },
        { name: 'Referral', value: 20 },
        { name: 'Website', value: 12 },
        { name: 'Campus', value: 8 }
      ]
    });
  }

  if (cleanUrl === '/analytics/training-roi') {
    return mockResponse({
      trainers: [
        { trainer_name: 'Meera Jasmine', batches: 8, rating: 4.8, improvement: 32, training_cost: 12000, business_impact: 38000, roi: 216 },
        { trainer_name: 'Anand Kumar', batches: 5, rating: 4.6, improvement: 28, training_cost: 8000, business_impact: 22000, roi: 175 },
        { trainer_name: 'Karthik Ramaswamy', batches: 4, rating: 4.4, improvement: 25, training_cost: 6000, business_impact: 14000, roi: 133 },
      ],
      outcomes: [
        { name: 'Ops Guidelines', before: 54, after: 86 },
        { name: 'Security Compliance', before: 62, after: 94 },
        { name: 'Client Soft Skills', before: 48, after: 76 },
        { name: 'Leadership Core', before: 65, after: 88 },
      ]
    });
  }

  if (cleanUrl === '/analytics/cost-leakage') {
    return mockResponse({
      utilization: [
        { name: 'Billable Operations', value: 68 },
        { name: 'IT Infrastructure / Support', value: 18 },
        { name: 'Bench / Unassigned', value: 14 },
      ],
      leakages: [
        { category: 'Bench Resource Leakage', amount: 35000, impact: 'High', description: 'IT Bench resources unassigned to billable clients for > 30 days.' },
        { category: 'Unfinished Training Delays', amount: 12000, impact: 'Medium', description: 'Associates in Operations lagging on client guidelines certification.' },
        { category: 'SLA Failure Penalty', amount: 8000, impact: 'Low', description: 'Operations Team Lead response delays in week 23.' }
      ],
      suggestions: [
        { id: 1, text: 'Deploy 2 IT developers from bench to active Workforce Intelligence portal support to capture billable revenue.' },
        { id: 2, text: 'Schedule a trainer-led follow-up for training batch participants lagging on guidelines certification.' },
        { id: 3, text: 'Automate Q1 operational check-in notifications to prevent manual workflow delays.' }
      ]
    });
  }

  if (cleanUrl === '/ai/attrition') {
    return mockResponse({
      predictions: [
        { first_name: 'Charles', last_name: 'Dev', attrition_risk: 'Medium' },
        { first_name: 'Fiona', last_name: 'Roy', attrition_risk: 'High' },
        { first_name: 'Elango', last_name: 'M', attrition_risk: 'Low' },
      ],
    });
  }

  return mockError(`Mock GET endpoint not found for URL: ${url}`, 404);
};

// Override POST requests
api.post = async (url: string, data?: any): Promise<any> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  if (url === '/auth/login') {
    const { email } = data || {};
    if (email === 'admin@agshealth.com' || email === 'admin@ags.com' || true) {
      return mockResponse({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: {
          id: 1,
          email: email || 'admin@agshealth.com',
          firstName: 'Admin',
          lastName: 'User',
          roles: ['Super Admin'],
          permissions: ['all'],
        },
      });
    }
    return mockError('Invalid credentials', 401);
  }

  if (url === '/auth/logout') {
    return mockResponse({ success: true });
  }

  if (url === '/employees') {
    const employees = getStorageItem('ags_employees', initialEmployees);
    const depts = getStorageItem('ags_depts', initialDepts);
    const desigs = getStorageItem('ags_designations', initialDesignations);

    const deptId = parseInt(data.dept_id) || 1;
    const desigId = parseInt(data.designation_id) || 1;

    const targetDept = depts.find((d: any) => d.id === deptId) || { name: 'Operations' };
    const targetDesig = desigs.find((d: any) => d.id === desigId) || { title: 'Associate' };

    const newEmp = {
      id: employees.length + 1,
      emp_code: `AGS-00${employees.length + 1}`,
      first_name: data.first_name,
      middle_name: data.middle_name || '',
      last_name: data.last_name,
      work_email: data.work_email || `${data.first_name.toLowerCase()}.${data.last_name.toLowerCase()}@agshealth.com`,
      personal_email: data.personal_email || '',
      phone_primary: data.phone_primary || '',
      department: { id: deptId, name: targetDept.name },
      designation: { id: desigId, title: targetDesig.title || targetDesig.name },
      employment_status: data.employment_status || 'Active',
      employment_type: data.employment_type || 'Full-time',
      date_of_joining: data.date_of_joining || new Date().toISOString().split('T')[0],
      gender: data.gender || 'Male',
      date_of_birth: data.date_of_birth || '',
      blood_group: data.blood_group || '',
      nationality: data.nationality || '',
      work_country: data.work_country || 'India',
      work_branch: data.work_branch || 'Chennai',
      pan_number: data.pan_number || '',
      bank_account_number: data.bank_account_number || '',
      bank_ifsc: data.bank_ifsc || '',
      uan_number: data.uan_number || ''
    };
    employees.push(newEmp);
    setStorageItem('ags_employees', employees);
    return mockResponse({ employee: newEmp });
  }

  if (url === '/departments') {
    const departments = getStorageItem('ags_depts', initialDepts);
    const newDept = {
      id: departments.length + 1,
      name: data.name,
      code: data.code || 'DEPT',
      description: data.description || '',
      head_name: data.head_name || 'System User',
    };
    departments.push(newDept);
    setStorageItem('ags_depts', departments);
    return mockResponse({ department: newDept });
  }

  if (url === '/attendance/checkin' || url === '/attendance/checkout') {
    return mockResponse({ success: true });
  }

  if (url === '/leaves') {
    const leaves = getStorageItem('ags_leaves', initialLeaves);
    const employees = getStorageItem('ags_employees', initialEmployees);
    const targetEmp = employees.find((e: any) => e.id === parseInt(data.employee_id)) || { first_name: 'Employee', last_name: String(data.employee_id) };

    const newLeave = {
      id: leaves.length + 1,
      employee_id: parseInt(data.employee_id),
      employee: { first_name: targetEmp.first_name, last_name: targetEmp.last_name },
      leave_type: data.leave_type,
      from_date: data.from_date,
      to_date: data.to_date,
      no_of_days: 3,
      reason: data.reason || '',
      status: 'Pending',
    };
    leaves.push(newLeave);
    setStorageItem('ags_leaves', leaves);
    return mockResponse({ leave: newLeave });
  }

  if (url === '/payroll/process') {
    const payroll = getStorageItem('ags_payroll', initialPayroll);
    const nextId = payroll.length + 1;
    const newRun = {
      id: nextId,
      month: data.month || 6,
      year: data.year || 2026,
      employee_count: 7,
      processed_date: new Date().toISOString().split('T')[0],
      total_net: 452000,
      status: 'Processed',
    };
    payroll.push(newRun);
    setStorageItem('ags_payroll', payroll);
    return mockResponse({ run: newRun });
  }

  if (url === '/recruitment/requisitions') {
    const requisitions = getStorageItem('ags_requisitions', initialRequisitions);
    const newReq = {
      id: requisitions.length + 1,
      title: data.title,
      department: data.department || 'Operations',
      vacancy_count: parseInt(data.vacancy_count) || 1,
      target_date: data.target_date || new Date().toISOString().split('T')[0],
      status: 'Approved',
    };
    requisitions.push(newReq);
    setStorageItem('ags_requisitions', requisitions);
    return mockResponse({ requisition: newReq });
  }

  if (url === '/recruitment/candidates') {
    const candidates = getStorageItem('ags_candidates', initialCandidates);
    const newCand = {
      id: candidates.length + 1,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      resume_url: '#',
      requisition_id: parseInt(data.requisition_id) || 1,
      status: 'Applied',
    };
    candidates.push(newCand);
    setStorageItem('ags_candidates', candidates);
    return mockResponse({ candidate: newCand });
  }

  if (url === '/lms/courses') {
    const courses = getStorageItem('ags_courses', initialCourses);
    const newCourse = {
      id: courses.length + 1,
      title: data.title,
      category: data.category || 'Technical',
      duration_hours: parseInt(data.duration_hours) || 4,
      level: data.level || 'Beginner',
      status: data.status || 'Published',
      description: data.description || '',
    };
    courses.push(newCourse);
    setStorageItem('ags_courses', courses);
    return mockResponse({ course: newCourse });
  }

  if (url === '/lms/enroll') {
    const enrollments = getStorageItem('ags_enrollments', initialEnrollments);
    const newEn = {
      id: enrollments.length + 1,
      employee_id: parseInt(data.employee_id) || 1,
      course_id: parseInt(data.course_id) || 1,
      progress: 0,
      progress_percentage: 0,
      status: 'In Progress',
      created_at: new Date().toISOString()
    };
    enrollments.push(newEn);
    setStorageItem('ags_enrollments', enrollments);
    return mockResponse({ enrollment: newEn });
  }

  if (url === '/training/batches') {
    const batches = getStorageItem('ags_batches', []);
    const trainers = getStorageItem('ags_trainers', initialTrainers);
    const employees = getStorageItem('ags_employees', initialEmployees);

    const trainerId = parseInt(data.trainer_id) || 1;
    const trainer = trainers.find((t: any) => t.id === trainerId) || { name: 'System Trainer', avatar: '' };

    const traineeIds = Array.isArray(data.trainee_ids) ? data.trainee_ids.map(Number) : [];
    const trainees = traineeIds.map((tid: number) => {
      const emp = employees.find((e: any) => e.id === tid);
      return emp ? {
        employee_id: emp.id,
        name: `${emp.first_name} ${emp.last_name}`,
        emp_code: emp.emp_code,
        dept_name: emp.department?.name || 'Operations',
        score: null,
        status: 'Enrolled',
        activities_done: 'Awaiting program start.',
        employee_cost: 400,
        revenue_generated: 0
      } : {
        employee_id: tid,
        name: `Employee ${tid}`,
        emp_code: `AGS-${String(tid).padStart(3, '0')}`,
        dept_name: 'Operations',
        score: null,
        status: 'Enrolled',
        activities_done: 'Awaiting program start.',
        employee_cost: 400,
        revenue_generated: 0
      };
    });

    const newBatch = {
      id: batches.length + 1,
      batch_name: data.batch_name,
      program_name: data.program_name || 'General Training Program',
      trainer_id: trainerId,
      trainer_name: trainer.name,
      trainer_avatar: trainer.avatar,
      start_date: data.start_date || new Date().toISOString().split('T')[0],
      end_date: data.end_date || new Date().toISOString().split('T')[0],
      venue: data.venue || 'Online',
      mode: data.mode || 'Online',
      capacity: parseInt(data.capacity) || 20,
      status: 'Scheduled',
      trainer_cost: parseFloat(data.trainer_cost) || trainer.cost_per_batch || 1500,
      material_cost: parseFloat(data.material_cost) || 200,
      curriculum: Array.isArray(data.curriculum) ? data.curriculum : typeof data.curriculum === 'string' ? data.curriculum.split('\n').filter(Boolean) : ['Course introduction and overview.'],
      trainees
    };

    batches.push(newBatch);
    setStorageItem('ags_batches', batches);
    return mockResponse({ batch: newBatch }, 201);
  }

  if (url === '/training/trainers') {
    const trainers = getStorageItem('ags_trainers', initialTrainers);
    const newTrainer = {
      id: trainers.length + 1,
      name: data.name,
      email: data.email,
      phone: data.phone,
      specialization: data.specialization,
      bio: data.bio || '',
      type: data.type || 'Internal',
      rating: 5.0,
      cost_per_batch: parseFloat(data.cost_per_batch) || 1500,
      avatar: data.avatar || `https://randomuser.me/api/portraits/${data.gender === 'Female' ? 'women' : 'men'}/${Math.floor(Math.random() * 90) + 1}.jpg`
    };
    trainers.push(newTrainer);
    setStorageItem('ags_trainers', trainers);
    return mockResponse({ trainer: newTrainer }, 201);
  }

  if (url.match(/^\/training\/batches\/\d+\/evaluate$/)) {
    const id = parseInt(url.split('/')[3]);
    const batches = getStorageItem('ags_batches', []);
    const employees = getStorageItem('ags_employees', initialEmployees);

    const bIndex = batches.findIndex((b: any) => b.id === id);
    if (bIndex === -1) return mockError('Batch not found', 404);

    const { employee_id, score, status, activities_done } = data;
    const tIndex = batches[bIndex].trainees.findIndex((t: any) => t.employee_id === parseInt(employee_id));
    if (tIndex === -1) return mockError('Trainee not enrolled in this batch', 404);

    batches[bIndex].trainees[tIndex].score = score ? parseInt(score) : null;
    batches[bIndex].trainees[tIndex].status = status;
    batches[bIndex].trainees[tIndex].activities_done = activities_done;

    if (status === 'Completed') {
      const parsedScore = parseInt(score) || 80;
      batches[bIndex].trainees[tIndex].revenue_generated = parsedScore >= 90 ? 8500 : parsedScore >= 75 ? 6000 : 4000;
      batches[bIndex].trainees[tIndex].employee_cost = 1200;
      
      const eIndex = employees.findIndex((e: any) => e.id === parseInt(employee_id));
      if (eIndex !== -1) {
        employees[eIndex].training_score = parsedScore;
        employees[eIndex].training_performance = parsedScore >= 90 ? 'Excellent' : parsedScore >= 75 ? 'Medium' : 'Poor';
        setStorageItem('ags_employees', employees);
      }
    } else if (status === 'Dropped') {
      batches[bIndex].trainees[tIndex].revenue_generated = 0;
      batches[bIndex].trainees[tIndex].employee_cost = 400;
    }

    setStorageItem('ags_batches', batches);
    return mockResponse({ batch: batches[bIndex] }, 200);
  }

  if (url === '/performance') {
    const reviews = getStorageItem('ags_reviews', initialReviews);
    const newReview = {
      id: reviews.length + 1,
      employee_id: parseInt(data.employee_id) || 1,
      reviewer_name: 'Director Operations',
      rating: parseFloat(data.overall_rating) || 4.0,
      review_cycle: data.review_period || 'Mid-Year Review 2026',
      feedback: data.strengths || '',
      status: 'Completed',
      goals_achieved: parseInt(data.goals_achieved) || 85
    };
    reviews.push(newReview);
    setStorageItem('ags_reviews', reviews);
    return mockResponse({ review: newReview });
  }

  if (url === '/ai/chat') {
    const userMsg = data.message || '';
    let response = '';
    const lowerMsg = userMsg.toLowerCase();
    const employees = getStorageItem('ags_employees', initialEmployees);

    // Check if the user is asking about a specific employee by name
    const matchingEmp = employees.find((e: any) => {
      const fullname = `${e.first_name} ${e.last_name}`.toLowerCase();
      return lowerMsg.includes(e.first_name.toLowerCase()) || lowerMsg.includes(fullname);
    });

    if (lowerMsg.includes('top 5') || lowerMsg.includes('perform pannathu yaru') || lowerMsg.includes('performing employees')) {
      const activeEmps = employees.filter((e: any) => e.status === 'Active');
      const sorted = [...activeEmps].sort((a: any, b: any) => (b.revenue - b.cost) - (a.revenue - a.cost));
      const top5 = sorted.slice(0, 5);
      let list = top5.map((e: any, idx: number) => {
        return `${idx + 1}. **${e.first_name} ${e.last_name}** (${e.department?.name || 'Operations'}):
   - **Hired by Recruiter:** ${e.recruiter || 'Bhavya Rao'}
   - **Trained by Trainer:** ${e.trainer || 'Meera Jasmine'}
   - **Current Team Lead (TL):** ${e.team_lead || 'Anand Kumar'}
   - **Monthly Revenue:** $${(e.revenue || 0).toLocaleString()} (Net Margin: +$${(e.revenue - e.cost).toLocaleString()})`;
      }).join('\n\n');
      response = `Here are the **Top 5 Performing Employees** in our database, including who hired, trained, and led them, and the revenue they generated this month:\n\n${list}`;
    } else if (lowerMsg.includes('team-oda performance') || lowerMsg.includes('performance yen drop') || lowerMsg.includes('drop aaguthu') || lowerMsg.includes('team\'s performance') || lowerMsg.includes('team performance') || lowerMsg.includes('performance dropping')) {
      response = `**Root Cause Analysis: IT Team (Charles Dev) Performance Drop**

Our analytics show that the IT Team led by **Charles Dev** has a performance/profitability drop (currently running at a net loss of **-$2,500/month**).

**Root Cause Analysis:**
1. **Bench Resource Leakage:** 2 software engineers in this team have been on 'Bench' status for over 30 days without active client projects, costing the company **$35,000/month** in unutilized salary.
2. **Training Certification Lag:** The team has a low **SLA Compliance (94.2%)** and a low **Team Health Score (78/100)** because several members have not completed their *AGS Quality Guidelines* LMS course.
3. **TL Guidance vs Training:** The issue is **not** due to poor TL guidance or employee capability. Rather, it is a resource allocation issue (bench leakage) and a delay in training compliance.

**Recommended Actions:**
- Immediately deploy the 2 benched developers to active billable projects (e.g., AGS Workforce Intelligence Portal).
- Mandate completion of the *AGS Quality Guidelines* LMS course by the end of this week.`;
    } else if (lowerMsg.includes('thodarnthu sariya') || lowerMsg.includes('trace details') || lowerMsg.includes('sariya perform pannatha') || lowerMsg.includes('underperforming employees') || lowerMsg.includes('consistently underperforming')) {
      response = `**Trace Details of Consistently Underperforming Employees / Attrition Risks:**

We have identified **Fiona Roy** (Operations Associate) as a key performance risk:
- **Hired by Recruiter:** Bhavya Rao (HR Executive)
- **Trained by Trainer:** Meera Jasmine (LMS rating: 4.8)
- **Current Team Lead:** Anand Kumar
- **LMS Course Progress:** Only completed "Introduction to AGS Quality Guidelines" but has failed the Q1 assessment twice.
- **SLA Mistakes:** 2 major SLA deviations logged (response time fell below target in week 21).
- **Financial Status:** Generating low net margins.

**Recommended Action:** Reassign to a refresher training bootcamp and pair with a senior mentor.`;
    } else if (lowerMsg.includes('poor performance panra') || lowerMsg.includes('financial loss') || lowerMsg.includes('evlo loss') || lowerMsg.includes('loss aagirukku') || lowerMsg.includes('loss from poor performers') || lowerMsg.includes('how much loss')) {
      response = `**Financial Loss from Underperformance & Operational Leakage:**

The company has suffered a total of **$55,000/month** in operational financial loss:
1. **Bench resource under-utilization:** **$35,000/mo** lost due to unassigned IT resources.
2. **Unfinished training compliance delay:** **$12,000/mo** lost in delayed billing starts.
3. **SLA response delay penalties:** **$8,000/mo** lost in client SLA penalty deductions (logged in Operations team).

*Full breakdown is available in the **Cost Leakage** tab under Workforce Intelligence Analytics.*`;
    } else if (lowerMsg.includes('further loss') || lowerMsg.includes('ai-oda suggestion') || lowerMsg.includes('further loss aagama') || lowerMsg.includes('ai\'s suggestion') || lowerMsg.includes('ai suggestion')) {
      response = `**AI Recommendation to Mitigate Operational Losses & Prevent Further Damage:**

Instead of immediate termination, we suggest:
1. **Refresher Training (Do not terminate yet):** For employees like Fiona Roy, assign a mandatory 3-day trainer-led guidelines bootcamp and pair them with a senior mentor.
2. **Shift Team Lead / Project:** Realignment of underperforming IT resources to billable portals to capture **$35,000/mo** in lost revenue.
3. **Automate LMS Triggers:** Set up automated Slack/email warnings for training delays to prevent the **$12,000/mo** training lag loss.
4. **TL Realignment:** Realign low-margin associates to Anand Kumar's team, which currently holds the highest operational efficiency (45.8% margin).`;
    } else if (lowerMsg.includes('yentha hr') || lowerMsg.includes('hr hire') || lowerMsg.includes('candidates athigama fail') || lowerMsg.includes('recruiter\'s hires fail') || lowerMsg.includes('candidates fail the most')) {
      response = `**HR Recruiter Sourcing & Failure Rate Analysis:**

Based on candidate lifecycle tracking:
- Candidates hired by **Karthik Ramaswamy** show a slightly higher failure/resignation rate (retention rate: **88%**, average days to hire: 26 days).
- Candidates hired by **Bhavya Rao** are highly successful, showing a **95% hiring success rate** and **92% retention rate**.
- **Financial Impact:** Lower retention rates from Karthik's hiring pipeline have led to an estimated **$14,000** in recruitment cost leakages (due to sourcing replacement hires). We recommend Karthik adopt Bhavya Rao's candidate sourcing guidelines.`;
    } else if (lowerMsg.includes('trainer / team lead') || lowerMsg.includes('combo') || lowerMsg.includes('successful-a irukku') || lowerMsg.includes('trainer and team lead') || lowerMsg.includes('most successful combo')) {
      response = `**Most Successful Trainer & Team Lead Combinations:**

The most successful combination is **Trainer: Meera Jasmine** & **Team Lead: Anand Kumar**.

**Why this combo works:**
- Recruits trained by **Meera Jasmine** achieve **32% post-training skill improvement** (highest in the LMS).
- These recruits are then deployed under **Anand Kumar**, who maintains a **99.1% SLA compliance** and a **45.8% net margin** (highest team profit in Operations).
- This pipeline generates **+$19,500/month** in net margin contribution, indicating exceptional alignment between Meera's training curriculum and Anand's operational requirements.`;
    } else if (matchingEmp) {
      const empProfit = (matchingEmp.revenue || 0) - (matchingEmp.cost || 0);
      response = `I found employee **${matchingEmp.first_name} ${matchingEmp.last_name}** (${matchingEmp.emp_code}) in our database:
• **Role:** ${matchingEmp.designation?.title || 'Associate'} (${matchingEmp.department?.name || 'Operations'})
• **Status:** ${matchingEmp.employment_status}
• **Financials:** Monthly Revenue: **$${(matchingEmp.revenue || 0).toLocaleString()}** | Cost: **$${(matchingEmp.cost || 0).toLocaleString()}**
• **Net Contribution:** **$${empProfit.toLocaleString()}** (${matchingEmp.profit_status || 'Cost Center'})
• **Training Performance:** **${matchingEmp.training_performance || 'Medium'}**
• **AI Advisor Recommendation:** ${matchingEmp.ai_recommendation || 'No active plan.'}

Would you like me to analyze their guidance path (Recruiter: ${matchingEmp.recruiter}, Trainer: ${matchingEmp.trainer}, TL: ${matchingEmp.team_lead})?`;
    } else if (lowerMsg.includes('most profitable employee') || lowerMsg.includes('highest profit') || lowerMsg.includes('profitable assets') || lowerMsg.includes('profitable employee')) {
      const activeBillable = employees
        .map((e: any) => ({ name: `${e.first_name} ${e.last_name}`, profit: (e.revenue || 0) - (e.cost || 0), project: e.project }))
        .filter((e: any) => e.profit > 0)
        .sort((a: any, b: any) => b.profit - a.profit);
      
      const top5 = activeBillable.slice(0, 5);
      let list = top5.map((e: any, idx: number) => `${idx + 1}. **${e.name}** (${e.project}): Net Margin **+$${e.profit.toLocaleString()}**`).join('\n');
      response = `Here are our top 5 most profitable employee assets based on live project records:
${list}
Detailed filters are available on the **Profit & Loss Analyzer** dashboard.`;
    } else if (lowerMsg.includes('loss employee') || lowerMsg.includes('most loss') || lowerMsg.includes('loss center') || lowerMsg.includes('unprofitable') || lowerMsg.includes('who is causing loss')) {
      const lossMakers = employees
        .map((e: any) => ({ name: `${e.first_name} ${e.last_name}`, profit: (e.revenue || 0) - (e.cost || 0), project: e.project, status: e.employment_status }))
        .filter((e: any) => e.profit < 0 && e.status === 'Active')
        .sort((a: any, b: any) => a.profit - b.profit);
      
      const topLoss = lossMakers.slice(0, 5);
      let list = topLoss.map((e: any, idx: number) => `${idx + 1}. **${e.name}** (${e.project}): Net Loss **-$${Math.abs(e.profit).toLocaleString()}**`).join('\n');
      response = `Here are our top active employees currently running at a net loss (operational leakage):
${list || 'No active loss center employees logged. All billable resources are operating at positive margins.'}
We recommend immediate project reallocation or training guidelines interventions. Check the **Profit & Loss Analyzer** dashboard for actions.`;
    } else if (lowerMsg.includes('profit decrease') || lowerMsg.includes('profit drop') || lowerMsg.includes('why did profit')) {
      response = `Our financial analytics indicate that operating profit decreased by **3.2%** this month due to two cost leakages:
1. **Bench Resource Costs**: IT department has 2 software engineers on unassigned bench status for > 30 days, leaking approx. **$35,000** in operational cost.
2. **Guidelines Non-Compliance Delay**: 3 new associates in Operations had delayed billing start dates due to lag in completing their mandatory *AGS Quality Guidelines* certification.
We recommend deploying bench resources immediately and accelerating training compliance.`;
    } else if (lowerMsg.includes('recruiter') || lowerMsg.includes('hires the best') || lowerMsg.includes('proficient hr')) {
      response = `Based on candidate lifecycle tracking:
• **Bhavya Rao (HR Executive)** is our most proficient recruiter. She has hired 12 candidates with a **95% hiring success rate** and an exceptional **92% YTD retention rate**.
• **Karthik Ramaswamy (HR Lead)** has a success rate of 90% and retention of 88%.
Bhavya Rao's recruits also show a 14% higher average performance rating in their first 6 months.`;
    } else if (lowerMsg.includes('trainer') || lowerMsg.includes('highest-performing') || lowerMsg.includes('best trainer')) {
      response = `Our Training ROI Engine scores **Meera Jasmine (Head of Learning)** as the most effective trainer. 
• Her training cohorts achieve a **32% average skill level improvement** post-training.
• Her courses have a calculated **Training ROI of 216%**, generating **$38,000** in direct business value versus **$12,000** in training delivery cost.`;
    } else if (lowerMsg.includes('team lead') || lowerMsg.includes('contributes most') || lowerMsg.includes('best tl') || lowerMsg.includes('tl team')) {
      response = `According to our Team Lead Effectiveness scoring:
• **Anand Kumar's Operations Team** contributes the highest profitability, generating **$19,500/month in net profit** with an exceptional **45.8% profit margin** and **99.1% SLA compliance**.
• **Elango M's Team** is second, bringing in **$10,000/month** in net profit with **37.7% margin**.
• **Charles Dev's IT Team** is currently showing a net loss of **-$2,500/month** due to resource under-utilization (bench leakage). We recommend moving developers to active client projects.`;
    } else if (lowerMsg.includes('attrition') || lowerMsg.includes('exit') || lowerMsg.includes('risk')) {
      response = `Our Prediction Engine identifies the following workforce attrition risks:
• **Fiona Roy (Operations Associate)**: **High Risk** (92% probability) due to operational errors and SLA warnings in week 21. Suggest immediate mentor assignment.
• **Charles Dev (Software Engineer)**: **Medium Risk** (54% probability) due to stagnant training completions. Suggest scheduling a Q3 performance review.`;
    } else if (lowerMsg.includes('manpower') || lowerMsg.includes('future manpower') || lowerMsg.includes('requirements')) {
      response = `Our workforce forecasting models predict the following manpower requirements:
• **Q3 2026**: We need to hire **5 Operations Associates** (to support new client onboarding in July) and **2 React Frontend Developers** (for internal portal scaling).
• Recruitment cost is forecasted at **$8,800** with an expected hiring profitability break-even within 3.5 months of deployment.`;
    } else if (lowerMsg.includes('training') || lowerMsg.includes('course') || lowerMsg.includes('learn')) {
      response = `Currently we recommend prioritizing the following training batches:
1. **Introduction to AGS Quality Guidelines** for the Operations team (compliance is currently at 76%).
2. **Enterprise Information Security Compliance** for all new joinees in June 2026.`;
    } else if (lowerMsg.includes('hiring') || lowerMsg.includes('recruitment')) {
      response = `Our talent acquisition funnel shows:
• **Operations Associate**: 5 approved vacancies (Target Date: 2026-07-15).
• **React Frontend Developer**: 2 approved vacancies (Target Date: 2026-08-01).
Candidate Rahul Sharma is offered and pending Day-1 onboarding checklist assignment.`;
    } else {
      const attendance = getStorageItem('ags_attendance', initialAttendance);
      const activeCount = employees.filter((e: any) => e.employment_status === 'Active').length;
      const presentToday = attendance.filter((a: any) => a.status === 'Present' || a.status === 'Late').length;
      const attendanceRate = activeCount > 0 ? Math.round((presentToday / activeCount) * 100) : 100;
      
      let totalRevenue = 0;
      let totalCost = 0;
      employees.forEach((emp: any) => {
        totalRevenue += emp.revenue || 0;
        totalCost += emp.cost || 0;
      });
      const profit = totalRevenue - totalCost;

      response = `Hello! I am your AGS Health AI Workforce Advisor. I have reviewed your real-time workforce parameters:
• **Total Headcount:** ${employees.length} employees (${activeCount} active).
• **Attendance Today:** ${presentToday} present/late (${attendanceRate}% attendance rate).
• **Monthly Revenue:** $${totalRevenue.toLocaleString()} | Cost: $${totalCost.toLocaleString()}
• **Monthly Net Profit:** **$${profit.toLocaleString()}**
• **Training ROI:** **148%** | **Hiring Efficiency:** **92%**

I can assist you with profitability analyzer reports, recruiter retention tracking, trainer scores, or TL team performance details. What would you like to analyze today?`;
    }

    return mockResponse({ response });
  }

  return mockError(`Mock POST endpoint not found for URL: ${url}`, 404);
};

// Override PUT requests
api.put = async (url: string, data?: any): Promise<any> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  if (url.match(/^\/training\/batches\/\d+$/)) {
    const id = parseInt(url.split('/')[3]);
    const batches = getStorageItem('ags_batches', []);
    const index = batches.findIndex((b: any) => b.id === id);
    if (index === -1) return mockError('Batch not found', 404);

    batches[index] = {
      ...batches[index],
      ...data
    };
    setStorageItem('ags_batches', batches);
    return mockResponse({ batch: batches[index] });
  }

  if (url.match(/^\/employees\/\d+$/)) {
    const id = parseInt(url.split('/')[2]);
    const employees = getStorageItem('ags_employees', initialEmployees);
    const index = employees.findIndex((e: any) => e.id === id);
    if (index === -1) return mockError('Employee not found', 404);

    const depts = getStorageItem('ags_depts', initialDepts);
    const desigs = getStorageItem('ags_designations', initialDesignations);

    const deptId = parseInt(data.dept_id) || employees[index].department?.id || 1;
    const desigId = parseInt(data.designation_id) || employees[index].designation?.id || 1;

    const targetDept = depts.find((d: any) => d.id === deptId) || { name: 'Operations' };
    const targetDesig = desigs.find((d: any) => d.id === desigId) || { title: 'Associate' };

    employees[index] = {
      ...employees[index],
      ...data,
      department: { id: deptId, name: targetDept.name },
      designation: { id: desigId, title: targetDesig.title || targetDesig.name },
      id,
    };
    setStorageItem('ags_employees', employees);
    return mockResponse({ employee: employees[index] });
  }

  if (url.match(/^\/departments\/\d+$/)) {
    const id = parseInt(url.split('/')[2]);
    const departments = getStorageItem('ags_depts', initialDepts);
    const index = departments.findIndex((d: any) => d.id === id);
    if (index === -1) return mockError('Department not found', 404);

    departments[index] = {
      ...departments[index],
      ...data,
      id,
    };
    setStorageItem('ags_depts', departments);
    return mockResponse({ department: departments[index] });
  }

  return mockError(`Mock PUT endpoint not found for URL: ${url}`, 404);
};

// Override PATCH requests
api.patch = async (url: string, data?: any): Promise<any> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  if (url.match(/^\/leaves\/\d+\/status$/)) {
    const id = parseInt(url.split('/')[2]);
    const leaves = getStorageItem('ags_leaves', initialLeaves);
    const index = leaves.findIndex((l: any) => l.id === id);
    if (index === -1) return mockError('Leave request not found', 404);

    leaves[index].status = data.status || 'Approved';
    setStorageItem('ags_leaves', leaves);
    return mockResponse({ leave: leaves[index] });
  }

  return mockError(`Mock PATCH endpoint not found for URL: ${url}`, 404);
};

// Request interceptor — attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    return Promise.reject(error);
  }
);

export default api;
