// Dashboard stats
export const dashboardStats = {
    totalRequests: 6,
    newRequests: 2,
    inProgress: 2,
    overdue: 1,
    totalEquipment: 5,
    scrappedEquipment: 1,
  };
  
  // Maintenance Requests (Kanban style)
  export const maintenanceRequests = {
    new: [
      {
        id: 1,
        subject: "Generator not starting",
        equipment: "Power Generator",
        priority: "High",
      },
      {
        id: 2,
        subject: "Laptop overheating",
        equipment: "Dell XPS",
        priority: "Medium",
      },
    ],
    inProgress: [
      {
        id: 3,
        subject: "CNC calibration",
        equipment: "CNC Machine 01",
        priority: "High",
      },
    ],
    repaired: [
      {
        id: 4,
        subject: "Network issue fixed",
        equipment: "Office Router",
        priority: "Low",
      },
    ],
    scrap: [
      {
        id: 5,
        subject: "Old Desktop PC",
        equipment: "Old Desktop PC",
        priority: "Low",
      },
    ],
  };
  
  // Equipment list
  export const equipmentList = [
    {
      name: "CNC Machine 01",
      serial: "CNC-2024-001",
      category: "Machine",
      department: "Production",
      team: "Mechanics",
      scrapped: false,
    },
    {
      name: "Forklift Truck",
      serial: "FL-TRUCK-332",
      category: "Vehicle",
      department: "Warehouse",
      team: "Operations Team",
      scrapped: false,
    },
    {
      name: "Old Desktop PC",
      serial: "OLD-PC-1999",
      category: "Computer",
      department: "Accounts",
      team: "Electrical Team",
      scrapped: true,
    },
  ];
  
  // Calendar data
  export const calendarRequests = {
    "2025-12-10": ["CNC Calibration"],
    "2025-12-15": ["Generator Inspection"],
  };
  