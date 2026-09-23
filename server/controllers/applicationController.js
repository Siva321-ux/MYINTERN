import Application from '../models/Application.js';
import Activity from '../models/Activity.js';

export const getAllApplications = async (req, res, next) => {
  try {
    const { search, stage, sort } = req.query;
    const query = { userId: req.user._id };

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ companyName: regex }, { role: regex }];
    }

    if (stage && stage !== 'All') {
      query.stage = stage;
    }

    let sortOptions = { applicationDate: -1 }; // default newest
    if (sort === 'oldest') sortOptions = { applicationDate: 1 };
    else if (sort === 'company') sortOptions = { companyName: 1 };
    else if (sort === 'followup') sortOptions = { followUpDate: 1 };

    const applications = await Application.find(query).sort(sortOptions);
    res.json(applications);
  } catch (error) {
    next(error);
  }
};

export const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found or unauthorized' });
    }

    const activities = await Activity.find({ applicationId: application._id }).sort({ createdAt: 1 });

    res.json({
      ...application.toObject(),
      activities
    });
  } catch (error) {
    next(error);
  }
};

export const createApplication = async (req, res, next) => {
  try {
    const { companyName, role, applicationDate, stage, notes, followUpDate } = req.body;

    if (!companyName || !role || !applicationDate) {
      return res.status(400).json({ message: 'Company name, role, and application date are required' });
    }

    const application = await Application.create({
      userId: req.user._id,
      companyName,
      role,
      applicationDate,
      stage: stage || 'Applied',
      notes: notes || '',
      followUpDate: followUpDate || null
    });

    // Activity log: CREATED
    await Activity.create({
      applicationId: application._id,
      userId: req.user._id,
      type: 'CREATED',
      content: `Application logged for ${role} at ${companyName}`
    });

    if (notes) {
      await Activity.create({
        applicationId: application._id,
        userId: req.user._id,
        type: 'NOTE_ADDED',
        content: notes
      });
    }

    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
};

export const updateApplication = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found or unauthorized' });
    }

    const { companyName, role, applicationDate, stage, notes, followUpDate } = req.body;

    if (companyName) application.companyName = companyName;
    if (role) application.role = role;
    if (applicationDate) application.applicationDate = applicationDate;
    if (notes !== undefined) application.notes = notes;
    if (followUpDate !== undefined) application.followUpDate = followUpDate || null;

    if (stage && stage !== application.stage) {
      const prevStage = application.stage;
      application.stage = stage;

      await Activity.create({
        applicationId: application._id,
        userId: req.user._id,
        type: 'STAGE_CHANGED',
        content: `Stage changed from ${prevStage} to ${stage}`,
        previousStage: prevStage,
        newStage: stage
      });
    }

    await application.save();
    res.json(application);
  } catch (error) {
    next(error);
  }
};

export const updateStage = async (req, res, next) => {
  try {
    const { stage } = req.body;
    if (!stage) {
      return res.status(400).json({ message: 'Stage is required' });
    }

    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found or unauthorized' });
    }

    const previousStage = application.stage;
    application.stage = stage;
    await application.save();

    // Log Activity
    await Activity.create({
      applicationId: application._id,
      userId: req.user._id,
      type: 'STAGE_CHANGED',
      content: `Stage changed from ${previousStage} to ${stage}`,
      previousStage,
      newStage: stage
    });

    res.json(application);
  } catch (error) {
    next(error);
  }
};

export const addNote = async (req, res, next) => {
  try {
    const { note } = req.body;
    if (!note || !note.trim()) {
      return res.status(400).json({ message: 'Note text cannot be empty' });
    }

    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found or unauthorized' });
    }

    if (!application.notes) application.notes = note;
    else application.notes += `\n${note}`;

    await application.save();

    const activity = await Activity.create({
      applicationId: application._id,
      userId: req.user._id,
      type: 'NOTE_ADDED',
      content: note.trim()
    });

    res.status(201).json({ application, activity });
  } catch (error) {
    next(error);
  }
};

export const deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found or unauthorized' });
    }

    await Activity.deleteMany({ applicationId: req.params.id });

    res.json({ message: 'Application and associated activity history deleted successfully' });
  } catch (error) {
    next(error);
  }
};
