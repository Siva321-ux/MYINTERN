export const INITIAL_APPLICATIONS = [
  {
    _id: "app-1",
    companyName: "Google",
    role: "Software Engineering Intern",
    applicationDate: "2026-09-20",
    stage: "Interview",
    notes: "Completed initial recruiter phone screen. Coding interview scheduled for Sept 28.",
    followUpDate: "2026-09-28",
    createdAt: "2026-09-20T10:00:00.000Z",
    updatedAt: "2026-09-22T14:30:00.000Z",
    activities: [
      {
        _id: "act-101",
        type: "CREATED",
        content: "Application created",
        createdAt: "2026-09-20T10:00:00.000Z"
      },
      {
        _id: "act-102",
        type: "STAGE_CHANGED",
        content: "Stage changed from Applied to Interview",
        previousStage: "Applied",
        newStage: "Interview",
        createdAt: "2026-09-22T11:00:00.000Z"
      },
      {
        _id: "act-103",
        type: "NOTE_ADDED",
        content: "Technical interview scheduled for Friday with Senior Staff Engineer.",
        createdAt: "2026-09-22T14:30:00.000Z"
      }
    ]
  },
  {
    _id: "app-2",
    companyName: "Microsoft",
    role: "SWE Intern",
    applicationDate: "2026-09-18",
    stage: "Applied",
    notes: "Applied through university career portal using version 2 resume.",
    followUpDate: new Date().toISOString().split('T')[0], // Today's date!
    createdAt: "2026-09-18T09:15:00.000Z",
    updatedAt: "2026-09-18T09:15:00.000Z",
    activities: [
      {
        _id: "act-201",
        type: "CREATED",
        content: "Application created",
        createdAt: "2026-09-18T09:15:00.000Z"
      },
      {
        _id: "act-202",
        type: "FOLLOW_UP_UPDATED",
        content: "Set follow-up date for today to check application portal status.",
        createdAt: "2026-09-18T09:20:00.000Z"
      }
    ]
  },
  {
    _id: "app-3",
    companyName: "Zoho",
    role: "Front-End Developer Intern",
    applicationDate: "2026-09-15",
    stage: "Offer",
    notes: "Offer received! Base stipend $2,500/mo. Response required by end of month.",
    followUpDate: "2026-09-30",
    createdAt: "2026-09-15T08:00:00.000Z",
    updatedAt: "2026-09-23T12:00:00.000Z",
    activities: [
      {
        _id: "act-301",
        type: "CREATED",
        content: "Application created",
        createdAt: "2026-09-15T08:00:00.000Z"
      },
      {
        _id: "act-302",
        type: "STAGE_CHANGED",
        content: "Stage changed from Applied to Interview",
        previousStage: "Applied",
        newStage: "Interview",
        createdAt: "2026-09-17T10:00:00.000Z"
      },
      {
        _id: "act-303",
        type: "STAGE_CHANGED",
        content: "Stage changed from Interview to Offer",
        previousStage: "Interview",
        newStage: "Offer",
        createdAt: "2026-09-23T12:00:00.000Z"
      },
      {
        _id: "act-304",
        type: "NOTE_ADDED",
        content: "Received official written offer letter via email.",
        createdAt: "2026-09-23T12:05:00.000Z"
      }
    ]
  },
  {
    _id: "app-4",
    companyName: "Amazon",
    role: "SDE Intern",
    applicationDate: "2026-09-12",
    stage: "Rejected",
    notes: "Completed Online Assessment (OA2). Received automated rejection notice.",
    followUpDate: "",
    createdAt: "2026-09-12T14:20:00.000Z",
    updatedAt: "2026-09-19T16:45:00.000Z",
    activities: [
      {
        _id: "act-401",
        type: "CREATED",
        content: "Application created",
        createdAt: "2026-09-12T14:20:00.000Z"
      },
      {
        _id: "act-402",
        type: "STAGE_CHANGED",
        content: "Stage changed from Applied to Interview",
        previousStage: "Applied",
        newStage: "Interview",
        createdAt: "2026-09-14T11:00:00.000Z"
      },
      {
        _id: "act-403",
        type: "STAGE_CHANGED",
        content: "Stage changed from Interview to Rejected",
        previousStage: "Interview",
        newStage: "Rejected",
        createdAt: "2026-09-19T16:45:00.000Z"
      }
    ]
  },
  {
    _id: "app-5",
    companyName: "Meta",
    role: "Production Engineering Intern",
    applicationDate: "2026-09-10",
    stage: "Applied",
    notes: "Referral submitted by Alex from LinkedIn.",
    followUpDate: "2026-09-20", // Overdue date! (Sept 20 is past relative to Sept 23)
    createdAt: "2026-09-10T11:00:00.000Z",
    updatedAt: "2026-09-10T11:00:00.000Z",
    activities: [
      {
        _id: "act-501",
        type: "CREATED",
        content: "Application created with referral",
        createdAt: "2026-09-10T11:00:00.000Z"
      }
    ]
  },
  {
    _id: "app-6",
    companyName: "TCS",
    role: "System Engineer Intern",
    applicationDate: "2026-09-05",
    stage: "Rejected",
    notes: "NQT test completed. Position filled.",
    followUpDate: "",
    createdAt: "2026-09-05T09:00:00.000Z",
    updatedAt: "2026-09-15T15:00:00.000Z",
    activities: [
      {
        _id: "act-601",
        type: "CREATED",
        content: "Application created",
        createdAt: "2026-09-05T09:00:00.000Z"
      },
      {
        _id: "act-602",
        type: "STAGE_CHANGED",
        content: "Stage changed to Rejected",
        previousStage: "Applied",
        newStage: "Rejected",
        createdAt: "2026-09-15T15:00:00.000Z"
      }
    ]
  }
];
