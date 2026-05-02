export const properties = [
  { id: 1, name: 'Al-Rawdah Tower', type: 'Commercial', units: 24, occupancy: '92%', revenue: 'SAR 180,000', status: 'Active' },
  { id: 2, name: 'Marina Residence', type: 'Residential', units: 48, occupancy: '87%', revenue: 'SAR 320,000', status: 'Active' },
  { id: 3, name: 'Al-Nakheel Plaza', type: 'Mixed', units: 36, occupancy: '78%', revenue: 'SAR 245,000', status: 'Active' },
  { id: 4, name: 'King Fahd Complex', type: 'Commercial', units: 18, occupancy: '100%', revenue: 'SAR 420,000', status: 'Active' },
  { id: 5, name: 'Corniche Villas', type: 'Residential', units: 12, occupancy: '83%', revenue: 'SAR 156,000', status: 'Maintenance' },
]

export const tenants = [
  { id: 1, name: 'Ahmed Al-Rashid', property: 'Al-Rawdah Tower', unit: 'A-204', lease: '2024-01-15 → 2025-01-14', rent: 'SAR 8,500/mo', status: 'Active' },
  { id: 2, name: 'Fatima Corp.', property: 'King Fahd Complex', unit: 'B-101', lease: '2023-06-01 → 2025-05-31', rent: 'SAR 25,000/mo', status: 'Active' },
  { id: 3, name: 'Mohammed Hassan', property: 'Marina Residence', unit: 'C-412', lease: '2024-03-01 → 2025-02-28', rent: 'SAR 6,200/mo', status: 'Active' },
  { id: 4, name: 'Saudi Tech Ltd.', property: 'Al-Nakheel Plaza', unit: 'D-305', lease: '2024-07-01 → 2025-06-30', rent: 'SAR 18,000/mo', status: 'Pending' },
  { id: 5, name: 'Khalid Ibrahim', property: 'Corniche Villas', unit: 'V-03', lease: '2023-12-01 → 2024-11-30', rent: 'SAR 12,000/mo', status: 'Expiring' },
]

export const maintenanceRequests = [
  { id: 'MR-001', property: 'Marina Residence', unit: 'C-208', issue: 'AC Not Working', priority: 'High', status: 'In Progress', date: '2024-11-28' },
  { id: 'MR-002', property: 'Al-Rawdah Tower', unit: 'A-105', issue: 'Water Leak', priority: 'Critical', status: 'Open', date: '2024-11-29' },
  { id: 'MR-003', property: 'King Fahd Complex', unit: 'B-203', issue: 'Elevator Maintenance', priority: 'Medium', status: 'Scheduled', date: '2024-11-25' },
  { id: 'MR-004', property: 'Corniche Villas', unit: 'V-07', issue: 'Garden Irrigation', priority: 'Low', status: 'Completed', date: '2024-11-20' },
  { id: 'MR-005', property: 'Al-Nakheel Plaza', unit: 'D-112', issue: 'Parking Gate', priority: 'Medium', status: 'Open', date: '2024-11-30' },
]

export const expenses = [
  { id: 1, category: 'Maintenance', description: 'HVAC System Repair', property: 'Marina Residence', amount: 'SAR 12,500', date: '2024-11-28', status: 'Paid' },
  { id: 2, category: 'Utilities', description: 'Electricity Bill Q4', property: 'All Properties', amount: 'SAR 45,000', date: '2024-11-25', status: 'Pending' },
  { id: 3, category: 'Insurance', description: 'Annual Property Insurance', property: 'King Fahd Complex', amount: 'SAR 85,000', date: '2024-11-15', status: 'Paid' },
  { id: 4, category: 'Staff', description: 'Security Team Salary', property: 'All Properties', amount: 'SAR 32,000', date: '2024-11-30', status: 'Scheduled' },
  { id: 5, category: 'Legal', description: 'Contract Review Fees', property: 'Al-Nakheel Plaza', amount: 'SAR 8,000', date: '2024-11-22', status: 'Paid' },
]

export const revenueData = [
  { month: 'Jun', rental: 1120000, services: 45000, other: 12000 },
  { month: 'Jul', rental: 1150000, services: 48000, other: 15000 },
  { month: 'Aug', rental: 1180000, services: 52000, other: 11000 },
  { month: 'Sep', rental: 1200000, services: 50000, other: 18000 },
  { month: 'Oct', rental: 1220000, services: 55000, other: 14000 },
  { month: 'Nov', rental: 1250000, services: 58000, other: 16000 },
]

export const documents = [
  { id: 1, name: 'Lease Agreement - Ahmed Al-Rashid', type: 'Contract', property: 'Al-Rawdah Tower', date: '2024-01-15', size: '2.4 MB' },
  { id: 2, name: 'Insurance Policy 2024', type: 'Insurance', property: 'All Properties', date: '2024-03-01', size: '5.1 MB' },
  { id: 3, name: 'Building Inspection Report', type: 'Report', property: 'Marina Residence', date: '2024-10-20', size: '8.7 MB' },
  { id: 4, name: 'Tax Filing Q3 2024', type: 'Financial', property: 'All Properties', date: '2024-10-15', size: '1.2 MB' },
  { id: 5, name: 'Maintenance Contract - HVAC', type: 'Contract', property: 'King Fahd Complex', date: '2024-06-01', size: '3.3 MB' },
]
