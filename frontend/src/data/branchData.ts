// AGS Health Global Branch Mock Data — 12 branches across 4 countries

export interface BranchData {
  id: string;
  city: string;
  state: string;
  country: string;
  coordinates: [number, number];
  address: string;
  established: string;
  headCount: number;
  activeEmployees: number;
  revenue: number;
  cost: number;
  profit: number;
  attritionRate: number;
  hiringEfficiency: number;
  trainingROI: number;
  openPositions: number;
  benchStrength: number;
  slaCompliance: number;
  avgLmsScore: number;
  topDepts: { name: string; count: number }[];
  monthlyTrend: { month: string; joiners: number; leavers: number; revenue: number }[];
  recruiterLeaderboard: { name: string; hired: number; active: number; retentionPct: number }[];
  topPerformers: { name: string; role: string; revenue: number; profit: number }[];
  attritionRisk: { name: string; risk: 'Critical' | 'High' | 'Medium' | 'Low'; sla: number; lms: number; dept: string }[];
}

export const BRANCH_DATA: BranchData[] = [
  // --- INDIA BRANCHES ---
  {
    id: 'chennai', city: 'Chennai (OMR)', state: 'Tamil Nadu', country: 'India',
    coordinates: [80.2707, 13.0827],
    address: 'Prince Infocity II, Kandanchavadi, OMR, Chennai – 600096',
    established: '2014', headCount: 312, activeEmployees: 289,
    revenue: 4820000, cost: 1940000, profit: 2880000,
    attritionRate: 8.2, hiringEfficiency: 84, trainingROI: 210,
    openPositions: 18, benchStrength: 23, slaCompliance: 91, avgLmsScore: 78,
    topDepts: [
      { name: 'Medical Coder', count: 98 },
      { name: 'AR Caller', count: 82 },
      { name: 'Med. Billing Exec.', count: 64 },
      { name: 'Quality Analyst', count: 38 },
      { name: 'Team Leader', count: 22 },
      { name: 'HR', count: 8 },
    ],
    monthlyTrend: [
      { month: 'Aug', joiners: 14, leavers: 3, revenue: 720000 },
      { month: 'Sep', joiners: 18, leavers: 4, revenue: 780000 },
      { month: 'Oct', joiners: 22, leavers: 6, revenue: 820000 },
      { month: 'Nov', joiners: 16, leavers: 3, revenue: 810000 },
      { month: 'Dec', joiners: 20, leavers: 5, revenue: 840000 },
      { month: 'Jan', joiners: 26, leavers: 8, revenue: 850000 },
    ],
    recruiterLeaderboard: [
      { name: 'Priya N', hired: 48, active: 42, retentionPct: 88 },
      { name: 'Arun K', hired: 38, active: 31, retentionPct: 82 },
      { name: 'Divya S', hired: 32, active: 24, retentionPct: 75 },
    ],
    topPerformers: [
      { name: 'Anand Kumar', role: 'Senior Manager', revenue: 52400, profit: 34200 },
      { name: 'Bhavya Rao', role: 'HR Lead', revenue: 41800, profit: 27200 },
      { name: 'Charles Dev', role: 'Ops Manager', revenue: 38200, profit: 22800 },
    ],
    attritionRisk: [
      { name: 'Kiran S', risk: 'Critical', sla: 58, lms: 42, dept: 'Medical Coding' },
      { name: 'Pooja T', risk: 'High', sla: 64, lms: 51, dept: 'AR' },
      { name: 'Rahul M', risk: 'Medium', sla: 72, lms: 60, dept: 'Billing' },
    ],
  },
  {
    id: 'vellore', city: 'Vellore', state: 'Tamil Nadu', country: 'India',
    coordinates: [79.1325, 12.9165],
    address: 'Site 1, Susee Towers, Vellore – 632009',
    established: '2017', headCount: 148, activeEmployees: 132,
    revenue: 2140000, cost: 980000, profit: 1160000,
    attritionRate: 11.4, hiringEfficiency: 74, trainingROI: 178,
    openPositions: 9, benchStrength: 16, slaCompliance: 84, avgLmsScore: 71,
    topDepts: [
      { name: 'Medical Coder', count: 48 },
      { name: 'AR Caller', count: 38 },
      { name: 'Med. Billing Exec.', count: 28 },
      { name: 'Quality Analyst', count: 16 },
      { name: 'Team Leader', count: 10 },
      { name: 'HR', count: 8 },
    ],
    monthlyTrend: [
      { month: 'Aug', joiners: 6, leavers: 2, revenue: 320000 },
      { month: 'Sep', joiners: 8, leavers: 3, revenue: 340000 },
      { month: 'Oct', joiners: 10, leavers: 4, revenue: 370000 },
      { month: 'Nov', joiners: 7, leavers: 2, revenue: 360000 },
      { month: 'Dec', joiners: 9, leavers: 3, revenue: 375000 },
      { month: 'Jan', joiners: 12, leavers: 5, revenue: 375000 },
    ],
    recruiterLeaderboard: [
      { name: 'Meena R', hired: 22, active: 18, retentionPct: 82 },
      { name: 'Suresh P', hired: 18, active: 13, retentionPct: 72 },
      { name: 'Latha V', hired: 14, active: 9, retentionPct: 64 },
    ],
    topPerformers: [
      { name: 'Senthil K', role: 'Ops Manager', revenue: 34200, profit: 21400 },
      { name: 'Preethi M', role: 'HR Lead', revenue: 28600, profit: 17800 },
      { name: 'Hari B', role: 'Team Leader', revenue: 25400, profit: 14900 },
    ],
    attritionRisk: [
      { name: 'Murugan S', risk: 'High', sla: 62, lms: 48, dept: 'AR' },
      { name: 'Kavitha L', risk: 'High', sla: 66, lms: 53, dept: 'Medical Coding' },
      { name: 'Arjun R', risk: 'Medium', sla: 74, lms: 62, dept: 'HR' },
    ],
  },
  {
    id: 'hyderabad', city: 'Hyderabad', state: 'Telangana', country: 'India',
    coordinates: [78.4867, 17.3850],
    address: '9th Floor, Western Pearl, Hitech City, Hyderabad – 500081',
    established: '2015', headCount: 274, activeEmployees: 258,
    revenue: 4210000, cost: 1680000, profit: 2530000,
    attritionRate: 9.1, hiringEfficiency: 81, trainingROI: 196,
    openPositions: 14, benchStrength: 16, slaCompliance: 89, avgLmsScore: 76,
    topDepts: [
      { name: 'Medical Coder', count: 88 },
      { name: 'AR Caller', count: 70 },
      { name: 'Med. Billing Exec.', count: 58 },
      { name: 'Quality Analyst', count: 32 },
      { name: 'Team Leader', count: 18 },
      { name: 'HR', count: 8 },
    ],
    monthlyTrend: [
      { month: 'Aug', joiners: 12, leavers: 3, revenue: 630000 },
      { month: 'Sep', joiners: 15, leavers: 4, revenue: 680000 },
      { month: 'Oct', joiners: 19, leavers: 5, revenue: 720000 },
      { month: 'Nov', joiners: 13, leavers: 3, revenue: 710000 },
      { month: 'Dec', joiners: 17, leavers: 4, revenue: 730000 },
      { month: 'Jan', joiners: 22, leavers: 7, revenue: 740000 },
    ],
    recruiterLeaderboard: [
      { name: 'Ravi T', hired: 42, active: 36, retentionPct: 86 },
      { name: 'Swathi G', hired: 35, active: 28, retentionPct: 80 },
      { name: 'Naveen K', hired: 28, active: 20, retentionPct: 71 },
    ],
    topPerformers: [
      { name: 'Vikram N', role: 'Ops Manager', revenue: 48600, profit: 31200 },
      { name: 'Shalini P', role: 'Team Leader', revenue: 39800, profit: 24600 },
      { name: 'Karthik R', role: 'Sr. Manager', revenue: 36400, profit: 22100 },
    ],
    attritionRisk: [
      { name: 'Aditya V', risk: 'High', sla: 63, lms: 49, dept: 'Medical Coding' },
      { name: 'Swapna R', risk: 'Medium', sla: 70, lms: 58, dept: 'Billing' },
      { name: 'Rohit M', risk: 'Low', sla: 79, lms: 68, dept: 'AR' },
    ],
  },
  {
    id: 'tirupati', city: 'Tirupati', state: 'Andhra Pradesh', country: 'India',
    coordinates: [79.4192, 13.6288],
    address: 'Sree Rama Tech Park, Renigunta Road, Tirupati – 517507',
    established: '2019', headCount: 96, activeEmployees: 84,
    revenue: 1380000, cost: 680000, profit: 700000,
    attritionRate: 13.6, hiringEfficiency: 68, trainingROI: 152,
    openPositions: 7, benchStrength: 12, slaCompliance: 80, avgLmsScore: 68,
    topDepts: [
      { name: 'Medical Coder', count: 32 },
      { name: 'AR Caller', count: 24 },
      { name: 'Med. Billing Exec.', count: 18 },
      { name: 'Quality Analyst', count: 10 },
      { name: 'Team Leader', count: 6 },
      { name: 'HR', count: 6 },
    ],
    monthlyTrend: [
      { month: 'Aug', joiners: 4, leavers: 2, revenue: 200000 },
      { month: 'Sep', joiners: 5, leavers: 2, revenue: 220000 },
      { month: 'Oct', joiners: 7, leavers: 3, revenue: 240000 },
      { month: 'Nov', joiners: 4, leavers: 2, revenue: 230000 },
      { month: 'Dec', joiners: 6, leavers: 2, revenue: 245000 },
      { month: 'Jan', joiners: 8, leavers: 4, revenue: 245000 },
    ],
    recruiterLeaderboard: [
      { name: 'Padma T', hired: 16, active: 12, retentionPct: 75 },
      { name: 'Balaji C', hired: 14, active: 9, retentionPct: 64 },
      { name: 'Rani S', hired: 10, active: 6, retentionPct: 60 },
    ],
    topPerformers: [
      { name: 'Venkat R', role: 'Ops Manager', revenue: 26400, profit: 14800 },
      { name: 'Swetha K', role: 'HR Lead', revenue: 21800, profit: 12200 },
      { name: 'Prasad M', role: 'Team Leader', revenue: 19600, profit: 10900 },
    ],
    attritionRisk: [
      { name: 'Suresh B', risk: 'Critical', sla: 55, lms: 40, dept: 'Medical Coding' },
      { name: 'Lakshmi V', risk: 'High', sla: 61, lms: 47, dept: 'AR' },
      { name: 'Govind P', risk: 'Medium', sla: 73, lms: 61, dept: 'HR' },
    ],
  },
  {
    id: 'bengaluru', city: 'Bengaluru', state: 'Karnataka', country: 'India',
    coordinates: [77.5946, 12.9716],
    address: '8th Floor, B Wing, M2-Madhuvan North Avenue, Bengaluru – 560103',
    established: '2013', headCount: 428, activeEmployees: 406,
    revenue: 6840000, cost: 2620000, profit: 4220000,
    attritionRate: 7.4, hiringEfficiency: 88, trainingROI: 234,
    openPositions: 22, benchStrength: 22, slaCompliance: 94, avgLmsScore: 83,
    topDepts: [
      { name: 'Medical Coder', count: 132 },
      { name: 'AR Caller', count: 108 },
      { name: 'Med. Billing Exec.', count: 88 },
      { name: 'Quality Analyst', count: 52 },
      { name: 'Team Leader', count: 30 },
      { name: 'HR', count: 18 },
    ],
    monthlyTrend: [
      { month: 'Aug', joiners: 20, leavers: 4, revenue: 1020000 },
      { month: 'Sep', joiners: 24, leavers: 5, revenue: 1100000 },
      { month: 'Oct', joiners: 30, leavers: 7, revenue: 1180000 },
      { month: 'Nov', joiners: 22, leavers: 4, revenue: 1150000 },
      { month: 'Dec', joiners: 28, leavers: 6, revenue: 1200000 },
      { month: 'Jan', joiners: 36, leavers: 10, revenue: 1190000 },
    ],
    recruiterLeaderboard: [
      { name: 'Nisha P', hired: 64, active: 58, retentionPct: 91 },
      { name: 'Arjun M', hired: 52, active: 45, retentionPct: 87 },
      { name: 'Deepa K', hired: 44, active: 36, retentionPct: 82 },
    ],
    topPerformers: [
      { name: 'Rajesh S', role: 'VP Operations', revenue: 78400, profit: 52600 },
      { name: 'Nandita V', role: 'Sr. Director', revenue: 64200, profit: 41800 },
      { name: 'Sunil A', role: 'Ops Manager', revenue: 56800, profit: 36400 },
    ],
    attritionRisk: [
      { name: 'Rohini P', risk: 'High', sla: 65, lms: 52, dept: 'Medical Coding' },
      { name: 'Manish T', risk: 'Medium', sla: 71, lms: 60, dept: 'Billing' },
      { name: 'Swati G', risk: 'Low', sla: 81, lms: 72, dept: 'AR' },
    ],
  },
  {
    id: 'jaipur', city: 'Jaipur', state: 'Rajasthan', country: 'India',
    coordinates: [75.7873, 26.9124],
    address: 'Office 301, Malviya Nagar, Jaipur – 302017',
    established: '2020', headCount: 112, activeEmployees: 98,
    revenue: 1620000, cost: 780000, profit: 840000,
    attritionRate: 12.1, hiringEfficiency: 71, trainingROI: 162,
    openPositions: 8, benchStrength: 14, slaCompliance: 82, avgLmsScore: 70,
    topDepts: [
      { name: 'Medical Coder', count: 40 },
      { name: 'AR Caller', count: 30 },
      { name: 'Med. Billing Exec.', count: 22 },
      { name: 'Quality Analyst', count: 10 },
      { name: 'Team Leader', count: 6 },
      { name: 'HR', count: 4 },
    ],
    monthlyTrend: [
      { month: 'Aug', joiners: 5, leavers: 2, revenue: 240000 },
      { month: 'Sep', joiners: 7, leavers: 3, revenue: 260000 },
      { month: 'Oct', joiners: 9, leavers: 3, revenue: 280000 },
      { month: 'Nov', joiners: 6, leavers: 2, revenue: 270000 },
      { month: 'Dec', joiners: 8, leavers: 3, revenue: 285000 },
      { month: 'Jan', joiners: 11, leavers: 4, revenue: 285000 },
    ],
    recruiterLeaderboard: [
      { name: 'Kavya R', hired: 24, active: 19, retentionPct: 79 },
      { name: 'Mohan L', hired: 20, active: 14, retentionPct: 70 },
      { name: 'Suman B', hired: 16, active: 10, retentionPct: 63 },
    ],
    topPerformers: [
      { name: 'Amit V', role: 'Sr. Manager', revenue: 31200, profit: 18600 },
      { name: 'Sunita J', role: 'HR Lead', revenue: 25800, profit: 14900 },
      { name: 'Prakash K', role: 'Ops Lead', revenue: 22400, profit: 12800 },
    ],
    attritionRisk: [
      { name: 'Dinesh C', risk: 'High', sla: 63, lms: 50, dept: 'Billing' },
      { name: 'Rekha M', risk: 'Medium', sla: 70, lms: 59, dept: 'AR' },
      { name: 'Sanjay V', risk: 'Low', sla: 78, lms: 68, dept: 'HR' },
    ],
  },
  {
    id: 'ahmedabad', city: 'Ahmedabad', state: 'Gujarat', country: 'India',
    coordinates: [72.5714, 23.0225],
    address: 'Commerce House, Judges Bungalow Road, Ahmedabad – 380054',
    established: '2021', headCount: 88, activeEmployees: 76,
    revenue: 1240000, cost: 620000, profit: 620000,
    attritionRate: 14.8, hiringEfficiency: 65, trainingROI: 144,
    openPositions: 10, benchStrength: 12, slaCompliance: 78, avgLmsScore: 66,
    topDepts: [
      { name: 'Medical Coder', count: 30 },
      { name: 'AR Caller', count: 24 },
      { name: 'Med. Billing Exec.', count: 16 },
      { name: 'Quality Analyst', count: 8 },
      { name: 'Team Leader', count: 6 },
      { name: 'HR', count: 4 },
    ],
    monthlyTrend: [
      { month: 'Aug', joiners: 4, leavers: 2, revenue: 180000 },
      { month: 'Sep', joiners: 5, leavers: 3, revenue: 195000 },
      { month: 'Oct', joiners: 7, leavers: 3, revenue: 215000 },
      { month: 'Nov', joiners: 5, leavers: 2, revenue: 210000 },
      { month: 'Dec', joiners: 6, leavers: 3, revenue: 220000 },
      { month: 'Jan', joiners: 9, leavers: 4, revenue: 220000 },
    ],
    recruiterLeaderboard: [
      { name: 'Hetal P', hired: 18, active: 13, retentionPct: 72 },
      { name: 'Dhruv S', hired: 15, active: 10, retentionPct: 67 },
      { name: 'Pooja M', hired: 12, active: 7, retentionPct: 58 },
    ],
    topPerformers: [
      { name: 'Chirag P', role: 'Sr. Manager', revenue: 24800, profit: 13200 },
      { name: 'Riddhi S', role: 'Billing Lead', revenue: 20400, profit: 10800 },
      { name: 'Neel K', role: 'HR Lead', revenue: 18200, profit: 9400 },
    ],
    attritionRisk: [
      { name: 'Vishal M', risk: 'Critical', sla: 54, lms: 38, dept: 'Medical Coding' },
      { name: 'Prachi T', risk: 'High', sla: 62, lms: 46, dept: 'Billing' },
      { name: 'Jaimin R', risk: 'Medium', sla: 71, lms: 57, dept: 'AR' },
    ],
  },

  // --- UNITED STATES BRANCHES ---
  {
    id: 'washington', city: 'Washington D.C. (HQ)', state: 'District of Columbia', country: 'United States',
    coordinates: [-77.0369, 38.9072],
    address: 'Suite 1101, 1015 18th St. NW, Washington, D.C. 20036',
    established: '2010', headCount: 156, activeEmployees: 148,
    revenue: 9420000, cost: 4880000, profit: 4540000,
    attritionRate: 5.4, hiringEfficiency: 90, trainingROI: 245,
    openPositions: 8, benchStrength: 10, slaCompliance: 96, avgLmsScore: 84,
    topDepts: [
      { name: 'Team Leader', count: 32 },
      { name: 'Quality Analyst', count: 28 },
      { name: 'Medical Coder', count: 42 },
      { name: 'HR', count: 18 },
      { name: 'AR Caller', count: 22 },
      { name: 'Med. Billing Exec.', count: 14 },
    ],
    monthlyTrend: [
      { month: 'Aug', joiners: 8, leavers: 1, revenue: 1450000 },
      { month: 'Sep', joiners: 10, leavers: 2, revenue: 1520000 },
      { month: 'Oct', joiners: 12, leavers: 1, revenue: 1580000 },
      { month: 'Nov', joiners: 9, leavers: 2, revenue: 1560000 },
      { month: 'Dec', joiners: 11, leavers: 1, revenue: 1640000 },
      { month: 'Jan', joiners: 15, leavers: 3, revenue: 1670000 },
    ],
    recruiterLeaderboard: [
      { name: 'Sarah Connor', hired: 34, active: 31, retentionPct: 91 },
      { name: 'John Doe', hired: 28, active: 25, retentionPct: 89 },
      { name: 'Michael C', hired: 22, active: 19, retentionPct: 86 },
    ],
    topPerformers: [
      { name: 'Robert Vance', role: 'VP Global Ops', revenue: 112000, profit: 76000 },
      { name: 'Angela Martin', role: 'Finance Lead', revenue: 94000, profit: 62000 },
      { name: 'Oscar Martinez', role: 'Compliance Chief', revenue: 86000, profit: 54000 },
    ],
    attritionRisk: [
      { name: 'Ryan Howard', risk: 'High', sla: 65, lms: 55, dept: 'Operations' },
      { name: 'Kelly Kapoor', risk: 'Medium', sla: 74, lms: 68, dept: 'Customer Support' },
    ],
  },
  {
    id: 'scranton', city: 'Scranton (Olyphant)', state: 'Pennsylvania', country: 'United States',
    coordinates: [-75.5905, 41.4565],
    address: '1444 E Lackawanna Ave, Olyphant, PA 18447',
    established: '2012', headCount: 118, activeEmployees: 109,
    revenue: 6140000, cost: 3580000, profit: 2560000,
    attritionRate: 6.8, hiringEfficiency: 86, trainingROI: 220,
    openPositions: 5, benchStrength: 8, slaCompliance: 93, avgLmsScore: 80,
    topDepts: [
      { name: 'Medical Coder', count: 35 },
      { name: 'AR Caller', count: 30 },
      { name: 'Med. Billing Exec.', count: 25 },
      { name: 'Quality Analyst', count: 12 },
      { name: 'Team Leader', count: 10 },
      { name: 'HR', count: 6 },
    ],
    monthlyTrend: [
      { month: 'Aug', joiners: 5, leavers: 1, revenue: 950000 },
      { month: 'Sep', joiners: 7, leavers: 2, revenue: 990000 },
      { month: 'Oct', joiners: 8, leavers: 1, revenue: 1020000 },
      { month: 'Nov', joiners: 6, leavers: 2, revenue: 1010000 },
      { month: 'Dec', joiners: 8, leavers: 1, revenue: 1070000 },
      { month: 'Jan', joiners: 10, leavers: 2, revenue: 1100000 },
    ],
    recruiterLeaderboard: [
      { name: 'Toby Flenderson', hired: 20, active: 18, retentionPct: 90 },
      { name: 'Holly Flax', hired: 16, active: 15, retentionPct: 94 },
    ],
    topPerformers: [
      { name: 'Jim Halpert', role: 'Senior Sales Director', revenue: 98000, profit: 68000 },
      { name: 'Dwight Schrute', role: 'Sales Manager', revenue: 104000, profit: 72000 },
      { name: 'Pam Beesly', role: 'Office Administrator', revenue: 45000, profit: 25000 },
    ],
    attritionRisk: [
      { name: 'Creed Bratton', risk: 'Critical', sla: 42, lms: 22, dept: 'Quality Analyst' },
      { name: 'Stanley Hudson', risk: 'Low', sla: 80, lms: 70, dept: 'AR' },
    ],
  },

  // --- PHILIPPINES BRANCHES ---
  {
    id: 'manila', city: 'Manila (Taguig)', state: 'Metro Manila', country: 'Philippines',
    coordinates: [121.0437, 14.5303],
    address: '21st Floor, Cyber Sigma, Lawton Avenue, McKinley West, Fort Bonifacio, Taguig City, Philippines',
    established: '2016', headCount: 224, activeEmployees: 208,
    revenue: 4180000, cost: 2080000, profit: 2100000,
    attritionRate: 9.6, hiringEfficiency: 82, trainingROI: 205,
    openPositions: 12, benchStrength: 15, slaCompliance: 90, avgLmsScore: 79,
    topDepts: [
      { name: 'Medical Coder', count: 72 },
      { name: 'AR Caller', count: 62 },
      { name: 'Med. Billing Exec.', count: 48 },
      { name: 'Quality Analyst', count: 24 },
      { name: 'Team Leader', count: 12 },
      { name: 'HR', count: 6 },
    ],
    monthlyTrend: [
      { month: 'Aug', joiners: 10, leavers: 2, revenue: 640000 },
      { month: 'Sep', joiners: 12, leavers: 3, revenue: 680000 },
      { month: 'Oct', joiners: 15, leavers: 4, revenue: 710000 },
      { month: 'Nov', joiners: 11, leavers: 2, revenue: 700000 },
      { month: 'Dec', joiners: 14, leavers: 3, revenue: 720000 },
      { month: 'Jan', joiners: 18, leavers: 5, revenue: 730000 },
    ],
    recruiterLeaderboard: [
      { name: 'Maria Santos', hired: 35, active: 31, retentionPct: 88 },
      { name: 'Juan Dela Cruz', hired: 28, active: 23, retentionPct: 82 },
    ],
    topPerformers: [
      { name: 'Jose Rizal', role: 'Operations Director', revenue: 62000, profit: 41000 },
      { name: 'Catriona Gray', role: 'HR Lead', revenue: 48000, profit: 32000 },
      { name: 'Manny Pac', role: 'Team Lead', revenue: 38000, profit: 24000 },
    ],
    attritionRisk: [
      { name: 'Liza Soberano', risk: 'High', sla: 60, lms: 50, dept: 'AR Caller' },
      { name: 'Daniel Padilla', risk: 'Medium', sla: 71, lms: 61, dept: 'Medical Coding' },
    ],
  },

  // --- MEXICO BRANCHES ---
  {
    id: 'zapopan_tizoc', city: 'Zapopan (Tizoc)', state: 'Jalisco', country: 'Mexico',
    coordinates: [-103.3986, 20.6517],
    address: 'Tizoc 97, Col. Ciudad Del Sol, C.P. 45050, Zapopan, Jalisco, México',
    established: '2018', headCount: 98, activeEmployees: 90,
    revenue: 1850000, cost: 1120000, profit: 730000,
    attritionRate: 11.2, hiringEfficiency: 75, trainingROI: 180,
    openPositions: 8, benchStrength: 12, slaCompliance: 86, avgLmsScore: 72,
    topDepts: [
      { name: 'Medical Coder', count: 32 },
      { name: 'AR Caller', count: 26 },
      { name: 'Med. Billing Exec.', count: 18 },
      { name: 'Quality Analyst', count: 10 },
      { name: 'Team Leader', count: 8 },
      { name: 'HR', count: 4 },
    ],
    monthlyTrend: [
      { month: 'Aug', joiners: 4, leavers: 1, revenue: 270000 },
      { month: 'Sep', joiners: 6, leavers: 2, revenue: 290000 },
      { month: 'Oct', joiners: 8, leavers: 2, revenue: 310000 },
      { month: 'Nov', joiners: 5, leavers: 1, revenue: 300000 },
      { month: 'Dec', joiners: 7, leavers: 2, revenue: 340000 },
      { month: 'Jan', joiners: 10, leavers: 3, revenue: 340000 },
    ],
    recruiterLeaderboard: [
      { name: 'Sofia Vergara', hired: 22, active: 18, retentionPct: 81 },
      { name: 'Carlos Slim', hired: 16, active: 13, retentionPct: 81 },
    ],
    topPerformers: [
      { name: 'Guillermo Toro', role: 'Creative Ops Chief', revenue: 32000, profit: 18000 },
      { name: 'Salma Hayek', role: 'HR Director', revenue: 28000, profit: 16000 },
    ],
    attritionRisk: [
      { name: 'Diego Luna', risk: 'High', sla: 61, lms: 45, dept: 'Billing' },
      { name: 'Gael Garcia', risk: 'Medium', sla: 73, lms: 58, dept: 'AR Caller' },
    ],
  },
  {
    id: 'zapopan_meya', city: 'Zapopan (Torre Meya)', state: 'Jalisco', country: 'Mexico',
    coordinates: [-103.4026, 20.6487],
    address: 'Av. Adolfo López Mateos Sur #2220, Col. Ciudad del Sol, C.P. 45050, Zapopan, Jalisco, México',
    established: '2019', headCount: 82, activeEmployees: 74,
    revenue: 1420000, cost: 920000, profit: 500000,
    attritionRate: 12.8, hiringEfficiency: 70, trainingROI: 165,
    openPositions: 6, benchStrength: 10, slaCompliance: 83, avgLmsScore: 69,
    topDepts: [
      { name: 'Medical Coder', count: 28 },
      { name: 'AR Caller', count: 22 },
      { name: 'Med. Billing Exec.', count: 14 },
      { name: 'Quality Analyst', count: 8 },
      { name: 'Team Leader', count: 6 },
      { name: 'HR', count: 4 },
    ],
    monthlyTrend: [
      { month: 'Aug', joiners: 3, leavers: 1, revenue: 210000 },
      { month: 'Sep', joiners: 5, leavers: 2, revenue: 220000 },
      { month: 'Oct', joiners: 6, leavers: 1, revenue: 240000 },
      { month: 'Nov', joiners: 4, leavers: 1, revenue: 235000 },
      { month: 'Dec', joiners: 6, leavers: 2, revenue: 255000 },
      { month: 'Jan', joiners: 8, leavers: 3, revenue: 260000 },
    ],
    recruiterLeaderboard: [
      { name: 'Alejandro G', hired: 15, active: 12, retentionPct: 80 },
      { name: 'Luis Miguel', hired: 12, active: 9, retentionPct: 75 },
    ],
    topPerformers: [
      { name: 'Thalia Sodi', role: 'Support Lead', revenue: 22000, profit: 12000 },
      { name: 'Paulina Rubio', role: 'Billing Exec', revenue: 19000, profit: 9500 },
    ],
    attritionRisk: [
      { name: 'Vicente F', risk: 'Critical', sla: 48, lms: 32, dept: 'Medical Coding' },
    ],
  },
];

export const COUNTRIES = ['United States', 'India', 'Philippines', 'Mexico'];

export const STATES_BY_COUNTRY: Record<string, string[]> = {
  'United States': ['District of Columbia', 'Pennsylvania'],
  'India': ['Tamil Nadu', 'Telangana', 'Andhra Pradesh', 'Karnataka', 'Rajasthan', 'Gujarat'],
  'Philippines': ['Metro Manila'],
  'Mexico': ['Jalisco'],
};

const getLocalEmployees = (): any[] => {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  const data = localStorage.getItem('ags_employees');
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export function updateBranchDataFromStorage() {
  const employees = getLocalEmployees();
  if (employees.length === 0) return;

  BRANCH_DATA.forEach((branch) => {
    const branchEmployees = employees.filter((e) => e.work_branch === branch.id);
    const active = branchEmployees.filter((e) => e.status === 'Active' || e.employment_status === 'Active');
    const resigned = branchEmployees.filter((e) => e.status === 'Resigned' || e.employment_status === 'Resigned');
    const terminated = branchEmployees.filter((e) => e.status === 'Terminated' || e.employment_status === 'Terminated');
    const exited = resigned.length + terminated.length;

    const headCount = branchEmployees.length || 1; // avoid divide by zero
    const activeCount = active.length;

    const revenue = branchEmployees.reduce((sum, e) => sum + (e.revenue || 0), 0);
    const cost = branchEmployees.reduce((sum, e) => sum + (e.cost || 0), 0);
    const profit = revenue - cost;

    const avgLmsScore = Math.round(
      branchEmployees.reduce((sum, e) => sum + (e.training_score || 0), 0) / headCount
    ) || 75;

    const avgSla = Math.round(
      branchEmployees.reduce((sum, e) => sum + (e.project_performance || 0), 0) / headCount
    ) || 85;

    // Bench strength: employees on project 'Bench / Support'
    const benchStrength = branchEmployees.filter((e) => e.project === 'Bench / Support' && (e.status === 'Active' || e.status === 'On-Leave' || e.employment_status === 'Active' || e.employment_status === 'On-Leave')).length;

    // Attrition rate
    const attritionRate = parseFloat(((exited / headCount) * 100).toFixed(1)) || 5.0;

    // Training ROI
    const trainingROI = 150 + Math.round(avgLmsScore * 0.8);

    // Open positions
    const openPositions = Math.max(2, Math.round(headCount * 0.08));

    // Top departments/designations
    const deptCounts: Record<string, number> = {};
    branchEmployees.forEach((e) => {
      const name = e.designation?.title || 'Associate';
      deptCounts[name] = (deptCounts[name] || 0) + 1;
    });
    const topDepts = Object.entries(deptCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Recruiter leaderboard
    const recruiterMap: Record<string, { name: string; hired: number; active: number }> = {};
    branchEmployees.forEach((e) => {
      if (e.recruiter) {
        if (!recruiterMap[e.recruiter]) {
          recruiterMap[e.recruiter] = { name: e.recruiter, hired: 0, active: 0 };
        }
        recruiterMap[e.recruiter].hired++;
        if (e.status === 'Active' || e.employment_status === 'Active') {
          recruiterMap[e.recruiter].active++;
        }
      }
    });
    const recruiterLeaderboard = Object.values(recruiterMap)
      .map((r) => ({
        name: r.name,
        hired: r.hired,
        active: r.active,
        retentionPct: r.hired > 0 ? Math.round((r.active / r.hired) * 100) : 0,
      }))
      .sort((a, b) => b.hired - a.hired)
      .slice(0, 3);

    // Top performers (sorted by profit descending)
    const topPerformers = branchEmployees
      .map((e) => ({
        name: `${e.first_name} ${e.last_name}`,
        role: e.designation?.title || 'Associate',
        revenue: e.revenue || 0,
        profit: (e.revenue || 0) - (e.cost || 0),
      }))
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 3);

    // Attrition risk: employees with mistakes or low performance
    const attritionRisk = branchEmployees
      .filter((e) => e.status === 'Active' || e.employment_status === 'Active')
      .map((e) => {
        let risk: 'Critical' | 'High' | 'Medium' | 'Low' = 'Low';
        if (e.project_performance < 83 || (e.mistakes && e.mistakes.length > 1)) {
          risk = 'Critical';
        } else if (e.project_performance < 87 || (e.mistakes && e.mistakes.length > 0)) {
          risk = 'High';
        } else if (e.project_performance < 92) {
          risk = 'Medium';
        }
        return {
          name: `${e.first_name} ${e.last_name}`,
          risk,
          sla: e.project_performance || 85,
          lms: e.training_score || 75,
          dept: e.department?.name || 'Operations',
        };
      })
      .sort((a, b) => {
        const score = { Critical: 4, High: 3, Medium: 2, Low: 1 };
        return score[b.risk] - score[a.risk];
      })
      .slice(0, 5);

    // Monthly trends scaled to branch headcount
    const monthlyTrend = [
      { month: 'Aug', joiners: Math.round(headCount * 0.04), leavers: Math.round(headCount * 0.01), revenue: Math.round(revenue * 0.15) },
      { month: 'Sep', joiners: Math.round(headCount * 0.05), leavers: Math.round(headCount * 0.01), revenue: Math.round(revenue * 0.16) },
      { month: 'Oct', joiners: Math.round(headCount * 0.06), leavers: Math.round(headCount * 0.02), revenue: Math.round(revenue * 0.17) },
      { month: 'Nov', joiners: Math.round(headCount * 0.04), leavers: Math.round(headCount * 0.01), revenue: Math.round(revenue * 0.16) },
      { month: 'Dec', joiners: Math.round(headCount * 0.05), leavers: Math.round(headCount * 0.01), revenue: Math.round(revenue * 0.18) },
      { month: 'Jan', joiners: Math.round(headCount * 0.07), leavers: Math.round(headCount * 0.02), revenue: Math.round(revenue * 0.18) },
    ];

    // Mutate the branch object properties
    branch.headCount = headCount;
    branch.activeEmployees = activeCount;
    branch.revenue = revenue;
    branch.cost = cost;
    branch.profit = profit;
    branch.attritionRate = attritionRate;
    branch.avgLmsScore = avgLmsScore;
    branch.slaCompliance = avgSla;
    branch.benchStrength = benchStrength;
    branch.trainingROI = trainingROI;
    branch.openPositions = openPositions;
    branch.topDepts = topDepts;
    branch.recruiterLeaderboard = recruiterLeaderboard;
    branch.topPerformers = topPerformers;
    branch.attritionRisk = attritionRisk;
    branch.monthlyTrend = monthlyTrend;
  });

  // Recalculate compatibility exports in place
  const newIndia = getAggregatedDataInternal({ country: 'India' });
  const newGlobal = getAggregatedDataInternal({ country: 'all' });
  Object.assign(ALL_INDIA_DATA, newIndia);
  Object.assign(GLOBAL_DATA, newGlobal);
}

export function getAggregatedData(
  filter: { country?: string; state?: string; branchId?: string }
): BranchData {
  try {
    updateBranchDataFromStorage();
  } catch (e) {
    console.error("Failed to update branch data from storage", e);
  }
  return getAggregatedDataInternal(filter);
}

function getAggregatedDataInternal(
  filter: { country?: string; state?: string; branchId?: string }
): BranchData {
  const { country, state, branchId } = filter;

  // 1. Specific single branch selection
  if (branchId && branchId !== 'all') {
    const singleBranch = BRANCH_DATA.find((b) => b.id === branchId);
    if (singleBranch) return singleBranch;
  }

  // 2. Filter list of branches based on scope
  let filtered = BRANCH_DATA;
  if (country && country !== 'all') {
    filtered = filtered.filter((b) => b.country === country);
  }
  if (state && state !== 'all') {
    filtered = filtered.filter((b) => b.state === state);
  }

  // Fallback if no matching data found
  if (filtered.length === 0) {
    return {
      id: 'empty',
      city: 'No Data',
      state: 'None',
      country: 'None',
      coordinates: [0, 0],
      address: 'No locations available in this filter',
      established: 'N/A',
      headCount: 0,
      activeEmployees: 0,
      revenue: 0,
      cost: 0,
      profit: 0,
      attritionRate: 0,
      hiringEfficiency: 0,
      trainingROI: 0,
      openPositions: 0,
      benchStrength: 0,
      slaCompliance: 0,
      avgLmsScore: 0,
      topDepts: [],
      monthlyTrend: [],
      recruiterLeaderboard: [],
      topPerformers: [],
      attritionRisk: [],
    };
  }

  // 3. Consolidated calculations
  const totalHeadCount = filtered.reduce((s, b) => s + b.headCount, 0);
  const totalActive = filtered.reduce((s, b) => s + b.activeEmployees, 0);
  const totalRevenue = filtered.reduce((s, b) => s + b.revenue, 0);
  const totalCost = filtered.reduce((s, b) => s + b.cost, 0);
  const totalProfit = filtered.reduce((s, b) => s + b.profit, 0);

  const avgAttrition = parseFloat((filtered.reduce((s, b) => s + b.attritionRate, 0) / filtered.length).toFixed(1));
  const avgHiring = Math.round(filtered.reduce((s, b) => s + b.hiringEfficiency, 0) / filtered.length);
  const avgTraining = Math.round(filtered.reduce((s, b) => s + b.trainingROI, 0) / filtered.length);
  const totalOpen = filtered.reduce((s, b) => s + b.openPositions, 0);
  const totalBench = filtered.reduce((s, b) => s + b.benchStrength, 0);
  const avgSla = Math.round(filtered.reduce((s, b) => s + b.slaCompliance, 0) / filtered.length);
  const avgLms = Math.round(filtered.reduce((s, b) => s + b.avgLmsScore, 0) / filtered.length);

  // Consolidated Role Distribution (Departments)
  const ROLE_NAMES = ['Senior Manager', 'HR Executive', 'Software Engineer', 'Financial Analyst', 'Team Lead', 'Associate', 'System Admin', 'Trainer', 'Recruiter'];
  const topDepts = ROLE_NAMES.map((name) => ({
    name,
    count: filtered.reduce((s, b) => s + (b.topDepts.find((d) => d.name === name)?.count || 0), 0),
  }))
  .sort((a, b) => b.count - a.count)
  .slice(0, 6);

  // Consolidated Monthly Trends (consolidated by month order)
  const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
  const monthlyTrend = months.map((month, idx) => ({
    month,
    joiners: filtered.reduce((s, b) => s + (b.monthlyTrend[idx]?.joiners || 0), 0),
    leavers: filtered.reduce((s, b) => s + (b.monthlyTrend[idx]?.leavers || 0), 0),
    revenue: filtered.reduce((s, b) => s + (b.monthlyTrend[idx]?.revenue || 0), 0),
  }));

  // recruiter leaderboard
  const allRecruiters = filtered.flatMap((b) => b.recruiterLeaderboard);
  const recruiterMap: Record<string, { name: string; hired: number; active: number; retentionPct: number }> = {};
  allRecruiters.forEach((r) => {
    const baseName = r.name.split(' (')[0];
    if (!recruiterMap[baseName]) {
      recruiterMap[baseName] = { name: baseName, hired: 0, active: 0, retentionPct: 0 };
    }
    recruiterMap[baseName].hired += r.hired;
    recruiterMap[baseName].active += r.active;
  });
  const recruiterLeaderboard = Object.values(recruiterMap)
    .map((r) => ({
      ...r,
      retentionPct: r.hired > 0 ? Math.round((r.active / r.hired) * 100) : 0,
    }))
    .sort((a, b) => b.hired - a.hired)
    .slice(0, 3);

  // top performers
  const topPerformers = filtered.flatMap((b) => b.topPerformers)
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 3);

  // consolidated attrition risks
  const attritionRisk = filtered.flatMap((b) => b.attritionRisk)
    .sort((a, b) => {
      const riskScore = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      return riskScore[b.risk] - riskScore[a.risk];
    })
    .slice(0, 5);

  // Label resolving
  let labelCity = 'All Countries';
  let labelState = 'Global';
  if (country && country !== 'all') {
    labelCity = `All ${country}`;
    labelState = country;
    if (state && state !== 'all') {
      labelCity = `All ${state}`;
      labelState = state;
    }
  }

  return {
    id: branchId || 'all',
    city: labelCity,
    state: labelState,
    country: country || 'Global',
    coordinates: filtered[0]?.coordinates || [0, 0],
    address: `Consolidated workforce metrics across ${filtered.length} location(s)`,
    established: '2010',
    headCount: totalHeadCount,
    activeEmployees: totalActive,
    revenue: totalRevenue,
    cost: totalCost,
    profit: totalProfit,
    attritionRate: avgAttrition,
    hiringEfficiency: avgHiring,
    trainingROI: avgTraining,
    openPositions: totalOpen,
    benchStrength: totalBench,
    slaCompliance: avgSla,
    avgLmsScore: avgLms,
    topDepts,
    monthlyTrend,
    recruiterLeaderboard,
    topPerformers,
    attritionRisk,
  };
}

// Compatibility Exports
export const ALL_INDIA_DATA: BranchData = {
  id: 'india', city: 'All India', state: 'India', country: 'India', coordinates: [0,0], address: '', established: '',
  headCount: 0, activeEmployees: 0, revenue: 0, cost: 0, profit: 0, attritionRate: 0, hiringEfficiency: 0, trainingROI: 0, openPositions: 0, benchStrength: 0, slaCompliance: 0, avgLmsScore: 0,
  topDepts: [], monthlyTrend: [], recruiterLeaderboard: [], topPerformers: [], attritionRisk: []
};
export const GLOBAL_DATA: BranchData = {
  id: 'global', city: 'All Countries', state: 'Global', country: 'Global', coordinates: [0,0], address: '', established: '',
  headCount: 0, activeEmployees: 0, revenue: 0, cost: 0, profit: 0, attritionRate: 0, hiringEfficiency: 0, trainingROI: 0, openPositions: 0, benchStrength: 0, slaCompliance: 0, avgLmsScore: 0,
  topDepts: [], monthlyTrend: [], recruiterLeaderboard: [], topPerformers: [], attritionRisk: []
};

// Initial sync
try {
  updateBranchDataFromStorage();
} catch (e) {
  console.error("Failed to sync branch data on load", e);
}
