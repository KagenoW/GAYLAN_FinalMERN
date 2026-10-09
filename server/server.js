const mongoose = require("mongoose");
require("dotenv").config();

const express = require("express");

const cors = require("cors");
const Student = require("./models/Student");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });

app.get("/", (req, res) => {
  res.send("Server is running!");
});

// function validateId(req, res, next) {
//   if (!mongoose.isValidObjectId(req.params.id)) {
//     return res.status(400).json({ message: "Invalid student ID." });
//   }
//   next();
// }

// function validateStudent(req, res, next) {
//   const { name, course, age } = req.body || {};

//   const hasName = typeof name === "string" && name.trim() !== "";
//   const hasCourse = typeof course === "string" && course.trim() !== "";
//   const hasAge = age !== undefined && age !== null && age !== "";

//   if (!hasName || !hasCourse || !hasAge) {
//     return res.status(400).json({ message: "Name, course, and age are required." });
//   }

//   const ageNumber = Number(age);
//   if (!Number.isInteger(ageNumber) || ageNumber <= 0) {
//     return res.status(400).json({ message: "Age must be a whole number greater than 0." });
//   }

//   next();
// }

app.get("/students", async (req, res) => {
  
    const students = await Student.find();
    res.json(students);
  
});

// app.post("/students", validateStudent, async (req, res) => {
 
//     const newStudent = new Student({
//       name: req.body.name.trim(),
//       course: req.body.course.trim(),
//       age: req.body.age,
//     });

//     const savedStudent = await newStudent.save();
//     res.status(201).json(savedStudent);
  
// });

app.post("/students", async (req, res) => {
 
    const newStudent = new Student({
      name: req.body.name.trim(),
      course: req.body.course.trim(),
      age: req.body.age,
    });

    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  
});

// app.put("/students/:id", validateId, validateStudent, async (req, res) => {
  
//     const updatedStudent = await Student.findByIdAndUpdate(
//       req.params.id,
//       {
//         name: req.body.name.trim(),
//         course: req.body.course.trim(),
//         age: req.body.age,
//       },
//       { returnDocument: "after", runValidators: true }
//     );

//     if (!updatedStudent) {
//       return res.status(404).json({ message: "Student not found." });
//     }

//     res.json(updatedStudent);
  
// });

app.put("/students/:id",  async (req, res) => {
  
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name.trim(),
        course: req.body.course.trim(),
        age: req.body.age,
      },
      { returnDocument: "after", runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found." });
    }

    res.json(updatedStudent);
  
});

app.delete("/students/:id", async (req, res) => {
  
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);

    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found." });
    }

    res.json({ message: "Student deleted.", student: deletedStudent });
  
});


// app.delete("/students/:id", validateId, async (req, res) => {
  
//     const deletedStudent = await Student.findByIdAndDelete(req.params.id);

//     if (!deletedStudent) {
//       return res.status(404).json({ message: "Student not found." });
//     }

//     res.json({ message: "Student deleted.", student: deletedStudent });
  
// });

app.listen(5000, () => {
  console.log("Server running on port 5000");
});