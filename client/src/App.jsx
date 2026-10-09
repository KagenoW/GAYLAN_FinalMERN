import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "https://gaylanfinalmern-seven.vercel.app";

function App() {
  const [students, setStudents] = useState([]);

  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [age, setAge] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [notice, setNotice] = useState(null);

  const fetchStudents = () => {
    axios
      .get(API_URL)
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.error(error);
        setNotice({ type: "error", text: "Could not load students. Is the server (node server.js) running?" });
      });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const resetForm = () => {
    setName("");
    setCourse("");
    setAge("");
    setEditingId(null);
  };

  const addStudent = async (studentData) => {
    try {
      await axios.post(API_URL, studentData);
      setNotice({ type: "success", text: `${studentData.name} was added.` });
      resetForm();
      fetchStudents();
    } catch (error) {
      console.error(error);
      setNotice({ type: "error", text: error.response?.data?.message || "Could not add the student." });
    }
  };

  const updateStudent = async (studentData) => {
    try {
      await axios.put(`${API_URL}/${editingId}`, studentData);
      setNotice({ type: "success", text: `${studentData.name} was updated.` });
      resetForm();
      fetchStudents();
    } catch (error) {
      console.error(error);
      setNotice({ type: "error", text: error.response?.data?.message || "Could not update the student." });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const studentData = { name: name.trim(), course: course.trim(), age: Number(age) };

    if (editingId) {
      updateStudent(studentData);
    } else {
      addStudent(studentData);
    }
  };

  const startEdit = (student) => {
    setEditingId(student._id);
    setName(student.name ?? "");
    setCourse(student.course ?? "");
    setAge(student.age ?? "");
    setNotice(null);
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      setNotice({ type: "success", text: `${response.data.student.name} was deleted.` });
      if (id === editingId) {
        resetForm();
      }
      fetchStudents();
    } catch (error) {
      console.error(error);
      setNotice({ type: "error", text: error.response?.data?.message || "Could not delete the student." });
    }
  };

  return (
    <div className="app">
      <h1>Student Management System</h1>

      {notice && <p className={`notice ${notice.type}`}>{notice.text}</p>}

      <div className="layout">
        <form className="student-form" onSubmit={handleSubmit}>
          <h2>{editingId ? "Edit Student" : "Add Student"}</h2>

          <label>
            Name
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Juan Dela Cruz"
              required
            />
          </label>

          <label>
            Course
            <input
              type="text"
              value={course}
              onChange={(event) => setCourse(event.target.value)}
              placeholder="e.g. BSIT"
              required
            />
          </label>

          <label>
            Age
            <input
              type="number"
              min="1"
              value={age}
              onChange={(event) => setAge(event.target.value)}
              placeholder="e.g. 20"
              required
            />
          </label>

          <div className="form-buttons">
            <button type="submit" className="primary">
              {editingId ? "Update Student" : "Add Student"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <section>
          <h2>Students ({students.length})</h2>

          {students.length === 0 && <p className="empty">No students yet. Add one using the form.</p>}

          <div className="student-list">
            {students.map((student) => (
              <div
                key={student._id}
                className={student._id === editingId ? "student-card editing" : "student-card"}
              >
                <p className="student-name">Name: {student.name}</p>
                <p>Course: {student.course}</p>
                <p>Age: {student.age}</p>

                <div className="card-buttons">
                  <button onClick={() => startEdit(student)}>Edit</button>
                  <button className="danger" onClick={() => deleteStudent(student._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;