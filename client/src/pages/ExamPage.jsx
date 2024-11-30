import React, { useState, useEffect } from "react";
import axios from "axios";

const CLASS_API_URI = `${import.meta.env.VITE_SERVER_URL.replace(
	/\/$/,
	""
)}/api/classes`;

const EXAM_API_URI = `${import.meta.env.VITE_SERVER_URL.replace(
	/\/$/,
	""
)}/api/exams`;

const ExamPage = () => {
	const [classes, setClasses] = useState([]);
	const [exams, setExams] = useState([]);
	const [filteredExams, setFilteredExams] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [form, setForm] = useState({
		classId: "",
		examDate: "",
		examTime: "",
		remarks: "",
	});
	const [editingExamId, setEditingExamId] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	// Fetch classes and exams on load
	useEffect(() => {
		fetchClasses();
		fetchExams();
	}, []);

	// Filter exams based on search query
	// Filter exams based on search query
	useEffect(() => {
		if (!searchQuery) {
			// If no search query, reset filtered exams to show all
			setFilteredExams(exams);
			return;
		}

		if (classes.length === 0 || exams.length === 0) return; // Skip filtering if no data

		try {
			const lowerCaseQuery = searchQuery.toLowerCase();

			// Filter exams by matching className
			const filteredExams = exams.filter((exam) => {
				// Find the class associated with the exam's classId
				const cls = classes.find((cls) => cls._id === exam.classId);
				const clsName = cls ? cls.className : ""; // Extract className or default to empty string

				// Check if className includes the search query
				return clsName.toLowerCase().includes(lowerCaseQuery);
			});

			setFilteredExams(filteredExams);
		} catch (error) {
			setErrorMessage(
				"Error filtering exams data. Please try again later."
			);
			console.error(error);
		}
	}, [searchQuery, classes, exams]);

	const fetchClasses = async () => {
		try {
			const response = await axios.get(CLASS_API_URI, {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});

			if (Array.isArray(response.data)) {
				setClasses(response.data);
			} else if (
				response.data.classes &&
				Array.isArray(response.data.classes)
			) {
				setClasses(response.data.classes);
			} else {
				console.error("Unexpected data structure:", response.data);
				setClasses([]);
			}

			// Display success message
	
		} catch (error) {
			console.error("Failed to fetch classes:", error.message);
			setClasses([]);
		}
	};

	const fetchExams = async () => {
		try {
			const response = await axios.get(`${EXAM_API_URI}/all`);
			setExams(response.data);
			setFilteredExams(response.data); // Initialize filtered exams
		} catch (error) {
			console.error("Failed to fetch exams:", error.message);
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setForm({ ...form, [name]: value });
	};

	const handleAddOrUpdateExam = async (e) => {
		e.preventDefault();

		try {
			if (editingExamId) {
				// Update exam
				await axios.put(`${EXAM_API_URI}/edit/${editingExamId}`, form);
				setEditingExamId(null);
			} else {
				// Add new exam
				await axios.post(`${EXAM_API_URI}/add`, form);
			}
			setForm({ classId: "", examDate: "", examTime: "", remarks: "" });
			setShowForm(false);
			fetchExams();
		} catch (error) {
			console.error("Failed to add/update exam:", error.message);
		}
	};

	const handleEditExam = (exam) => {
		setForm({
			classId: exam.classId._id,
			examDate: exam.examDate.slice(0, 10),
			examTime: exam.examTime,
			remarks: exam.remarks || "",
		});
		setEditingExamId(exam._id);
		setShowForm(true);
	};

	const handleDeleteExam = async (examId) => {
		try {
			await axios.delete(`${EXAM_API_URI}/remove/${examId}`);
			fetchExams();
		} catch (error) {
			console.error("Failed to delete exam:", error.message);
		}
	};

	// Get class details from classes list based on classId
	const getClassDetails = (classId) => {
		const clas = classes.find((c) => c._id === classId);
		return clas ? clas.className : "Unknown"; // Return className if class exists, else "Unknown"
	};

	return (
		<div className="container mx-auto p-6 animate__animated animate__fadeIn">
			<h1 className="text-3xl font-bold text-center mb-6 text-gray-1000">
				Exam Management
			</h1>

			{/* Add Exam Button */}
			<button
				onClick={() => setShowForm(true)}
				className="bg-blue-700 text-white px-6 py-3 rounded-lg mb-4 hover:bg-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105"
			>
				Add Student
			</button>

			{/* Search Bar */}
			<div className="mb-4">
				<input
					type="text"
					placeholder="Search by class name..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="w-full px-4 py-2 rounded-lg shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			{/* Exam List */}
			<div className="max-w-7xl mx-auto mt-10 p-6 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-xl border border-gray-800 overflow-x-auto">
				<h2 className="text-lg font-bold mb-2 text-white">Scheduled Exams</h2>

				<table className="min-w-full table-auto bg-gray-800 text-white rounded-lg">
					<thead>
						<tr className="bg-gray-700 text-xs font-semibold text-gray-300 uppercase tracking-wider">
							<th className="py-3 px-4 text-left">Class</th>
							<th className="py-3 px-4 text-left">Date</th>
							<th className="py-3 px-4 text-left">Time</th>
							<th className="py-3 px-4 text-left">Remarks</th>
							<th className="py-3 px-4 text-center" colSpan="2">
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						{filteredExams.map((exam) => (
							<tr
								key={exam._id}
								className="hover:bg-gray-700 text-sm"
							>
								<td className="py-3 px-4">
									{getClassDetails(exam.classId)}
								</td>
								<td className="py-3 px-4">
									{new Date(
										exam.examDate
									).toLocaleDateString()}
								</td>
								<td className="py-3 px-4">{exam.examTime}</td>
								<td className="py-3 px-4">
									{exam.remarks || "N/A"}
								</td>
								<td className="py-3 px-4">
									<button
										onClick={() => handleEditExam(exam)}
										className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
									>
										Edit
									</button>
									<button
										onClick={() =>
											handleDeleteExam(exam._id)
										}
										className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
									>
										Delete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Add Exam Button */}

			{/* Floating Pop-up Form */}
			{showForm && (
				<div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
					<div className="bg-white p-6 rounded shadow-lg w-96">
						<h2 className="text-lg font-bold mb-2">
							{editingExamId ? "Edit Exam" : "Add Exam"}
						</h2>
						<form onSubmit={handleAddOrUpdateExam}>
							<label className="block mb-2">
								Class:
								<select
									name="classId"
									value={form.classId}
									onChange={handleInputChange}
									required
									className="block w-full mt-1 p-2 border rounded"
								>
									<option value="">Select a class</option>
									{classes.map((classItem) => (
										<option
											key={classItem._id}
											value={classItem._id}
										>
											{classItem.className}
										</option>
									))}
								</select>
							</label>

							<label className="block mb-2">
								Exam Date:
								<input
									type="date"
									name="examDate"
									value={form.examDate}
									onChange={handleInputChange}
									required
									className="block w-full mt-1 p-2 border rounded"
								/>
							</label>

							<label className="block mb-2">
								Exam Time:
								<input
									type="time"
									name="examTime"
									value={form.examTime}
									onChange={handleInputChange}
									required
									className="block w-full mt-1 p-2 border rounded"
								/>
							</label>

							<label className="block mb-2">
								Remarks:
								<textarea
									name="remarks"
									value={form.remarks}
									onChange={handleInputChange}
									className="block w-full mt-1 p-2 border rounded"
									placeholder="Optional remarks"
								/>
							</label>

							<div className="flex justify-end">
								<button
									type="button"
									onClick={() => setShowForm(false)}
									className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
								>
									{editingExamId ? "Update" : "Add"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default ExamPage;
