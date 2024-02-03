const Job = require("../models/Job");

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.user._id });

    res.render("jobs", { jobs });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving jobs");
  }
};

const addJob = async (req, res) => {
  try {
    const { company, position, status } = req.body;

    const newJob = new Job({
      company,
      position,
      status,
      createdBy: req.user._id,
    });

    await newJob.save();
    res.redirect("/jobs");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding a job");
  }
};

const showNewJobForm = (req, res) => {
  res.render("job", { job: null });
};

const showEditJobForm = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).send("Job not found");
    }

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).send("You do not have permission");
    }

    res.render("job", { job });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving job for editing");
  }
};

const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const { company, position, status } = req.body;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).send("Job not found");
    }

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).send("You do not have permission");
    }

    job.company = company;
    job.position = position;
    job.status = status;

    await job.save();
    res.redirect("/jobs");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating job");
  }
};

const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).send("Job not found");
    }

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).send("You do not have permission");
    }

    await Job.deleteOne({ _id: jobId });
    res.redirect("/jobs");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting the job");
  }
};

module.exports = {
  getAllJobs,
  addJob,
  showNewJobForm,
  showEditJobForm,
  updateJob,
  deleteJob,
};
