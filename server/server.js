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

app.get("/api", (req, res) => {
  res.send("Server is running!");
});

app.get("/api/students", async (req, res) => {
  
    const students = await Student.find();
    res.json(students);
  
});

app.post("/api/students", async (req, res) => {
 
    const newStudent = new Student({
      name: req.body.name.trim(),
      course: req.body.course.trim(),
      age: req.body.age,
    });

    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  
});

app.put("/api/students/:id", async (req, res) => {
  
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

app.delete("/api/students/:id", async (req, res) => {
  
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);

    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found." });
    }

    res.json({ message: "Student deleted.", student: deletedStudent });
  
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});