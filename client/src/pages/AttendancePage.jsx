import React, { useState, useEffect } from "react";

const API_URI = "/api/attendance"; // API endpoint for attendance

const STD_API_URI = "/api/students"; // API endpoint for students

const CLASS_API_URI = "/api/classes"; // Endpoint to fetch classes

const AttendancePage = () => {
	const [students, setStudents] = useState([]);
	const [classes, setClasses] = useState([]);
	const [attendanceRecords, setAttendanceRecords] = useState([]);
	const [formData, setFormData] = useState({
		attendanceId: "",
		studentId: "",
		classId: "",
		date: "",
		status: "",
	});
	const [showForm, setShowForm] = useState(false);
	const [editMode, setEditMode] = useState(false);

	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(5);
	const [searchQuery, setSearchQuery] = useState("");
	const [filteredStudents, setFilteredStudents] = useState([]);
	const [filteredAttendance, setFilteredAttendance] = useState([]);

	const handleAddAttendance = (newAttendance) => {
		try {
			// Update students and filteredStudents
			setAttendanceRecords((prevAttendance) => {
				const updatedAttendance = [...prevAttendance, newAttendance];
				setFilteredAttendance(updatedAttendance); // Sync filtered list
				return updatedAttendance;
			});

			// Display success message
			setSuccessMessage("Attendance added successfully!");
			setTimeout(() => setSuccessMessage(""), 2000);
		} catch (error) {
			console.error("Error adding Attendance:", error);
			setErrorMessage(
				"An error occurred while adding the Attendance. Please try again."
			);
			setTimeout(() => setErrorMessage(""), 2000); // Clear error message after 2 seconds
		}
	};

	const handleUpdateAttendance = (updatedAttendance) => {
		setAttendanceRecords(
			attendanceRecords.map((attendance) =>
				attendance.attendanceId === updatedAttendance.attendanceId
					? updatedAttendance
					: attendance
			)
		);
		setSuccessMessage("Attendance updated successfully!");
		setTimeout(() => setSuccessMessage(""), 2000);
	};

	const handleDeleteAttendance = async (attendanceId) => {
		try {
			const response = await fetch(`${API_URI}/${attendanceId}`, {
				method: "DELETE",
			});

			if (response.ok) {
				setAttendanceRecords(
					attendanceRecords.filter(
						(attendance) => attendance._id !== attendanceId
					)
				);
				setSuccessMessage("Attendance deleted successfully!");

				// Clear success message after 2 seconds
				setTimeout(() => setSuccessMessage(""), 2000);
			} else {
				setErrorMessage("Error deleting attendance. Please try again.");
				setTimeout(() => setErrorMessage(""), 2000);
			}
		} catch (error) {
			setErrorMessage("Error deleting attendance. Please try again.");
			setTimeout(() => setErrorMessage(""), 2000);
		}
	};

	// Add or edit attendance record
	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const method = editMode ? "PUT" : "POST";
			const url = editMode
				? `${API_URI}/${formData.attendanceId}`
				: API_URI;

			const response = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(
					result.message || "Failed to submit attendance data."
				);
			}

			// Handle success based on mode
			editMode
				? handleUpdateAttendance(result)
				: handleAddAttendance(result);

			// Reset form and show success message
			setShowForm(false);
			setEditMode(false);
			setFormData({
				attendanceId: "",
				studentId: "",
				classId: "",
				date: "",
				status: "",
			});
			setSuccessMessage("Attendance record saved successfully.");
			setTimeout(() => setSuccessMessage(""), 2000);
		} catch (error) {
			setErrorMessage(
				error.message || "An error occurred. Please try again."
			);
			setTimeout(() => setErrorMessage(""), 10000);
		}
	};

	const handleEdit = (attendance) => {
		setFormData({
			attendanceId: attendance._id,
			studentId: attendance.studentId,
			classId: attendance.classId,
			date: formatDateForm(attendance.date),
			status: attendance.status,
		});
		setEditMode(true);
		setShowForm(true);
	};

	// Fetch all attendance records
	useEffect(() => {
		const fetchAttendance = async () => {
			try {
				const response = await fetch(API_URI);
				if (!response.ok)
					throw new Error("Network response was not ok");

				const attendanceData = await response.json();
				setAttendanceRecords(attendanceData.attendance || []);
				setFilteredAttendance(attendanceData.attendance || []);

				// Fetch students
				const studentResponse = await fetch(STD_API_URI);
				if (!studentResponse.ok)
					throw new Error("Network response was not ok");
				const studentData = await studentResponse.json();
				console.log("Fetched students:", studentData); // Log class data for debugging

				setStudents(studentData.students || []);
				setFilteredStudents(studentData.students || []);

				// Fetch classes
				const classResponse = await fetch(CLASS_API_URI);
				if (!classResponse.ok)
					throw new Error("Network response was not ok");
				const classData = await classResponse.json();
				console.log("Fetched classes:", classData); // Log class data for debugging
				setClasses(classData.classes || []);
			} catch (error) {
				setErrorMessage(
					error.message.includes("Failed to fetch")
						? "Network error. Please check your connection."
						: "Unable to fetch attendance records. Please try again later."
				);
				console.error("Error fetching attendance records:", error);
			}
		};
		fetchAttendance();
	}, [attendanceRecords]);

	// Filter students by search query
	useEffect(() => {

		if (attendanceRecords.length === 0) return;

		try {
			const lowerCaseQuery = searchQuery.toLowerCase();
			const filtered = attendanceRecords.filter((attendance) => {
				const stdId = attendance.studentId || "";

				return (
					stdId.toLowerCase().includes(lowerCaseQuery) 
				);
			});
			setFilteredAttendance(filtered);
		} catch (error) {
			setErrorMessage(
				"Error filtering student data. Please try again later."
			);
			console.error(error);
		}
	}, [searchQuery, attendanceRecords]);

	// Set default date on component mount
	useEffect(() => {
		const today = new Date();
		const formattedDate = today.toISOString().split("T")[0]; // Format as YYYY-MM-DD
		setFormData((prevFormData) => ({
			...prevFormData,
			date: formattedDate, // Set default date
		}));
	}, []);

	const getClassDetails = (classId) => {
		const clas = classes.find((c) => c._id === classId);
		return clas ? clas.className : "Unknown";
	};

	// Function to format date
	const formatDateTable = (isoDate) => {
		const date = new Date(isoDate);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const formatDateForm = (dateString) => {
		const date = new Date(dateString);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	};

	const handleChange = (e) => {
			const { name, value } = e.target;
			setFormData((prevFormData) => ({
				...prevFormData,
				[name]: value,
			}));
	};
	// Pagination
	const totalPages = Math.ceil(filteredAttendance.length / itemsPerPage);
	const paginatedAttendance = filteredAttendance.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	return (
		<div className="container mx-auto p-6 animate__animated animate__fadeIn">
			<h1 className="text-3xl font-bold text-center mb-6 text-gray-1000">
				Attendance Management
			</h1>

			{errorMessage && (
				<div className="bg-red-100 text-red-700 p-4 mb-4 rounded-lg shadow-md animate__animated animate__fadeIn">
					{errorMessage}
				</div>
			)}
			{successMessage && (
				<div className="bg-green-100 text-green-700 p-4 mb-4 rounded-lg shadow-md animate__animated animate__fadeIn">
					{successMessage}
				</div>
			)}

			{/* Attendance */}
			<button
				onClick={() => setShowForm(true)}
				className="bg-blue-700 text-white px-6 py-3 rounded-lg mb-4 hover:bg-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105"
			>
				Attendance
			</button>

			{/* Search Section */}
			<div className="mb-4">
				<input
					type="text"
					placeholder="Search by student ID..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="w-full px-4 py-2 rounded-lg shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			{/* Attendance Table */}
			<div className="max-w-7xl mx-auto mt-10 p-6 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-xl border border-gray-800 overflow-x-auto">
				<table className="min-w-full table-auto bg-gray-800 text-white rounded-lg">
					<thead>
						<tr className="bg-gray-700 text-xs font-semibold text-gray-300 uppercase tracking-wider">
							<th className="py-3 px-4 text-left hidden">
								Attendance ID
							</th>
							<th className="py-3 px-4 text-left">Student ID</th>
							<th className="py-3 px-4 text-left">Class ID</th>
							<th className="py-3 px-4 text-left">Date</th>
							<th className="py-3 px-4 text-left">Status</th>
							<th className="py-3 px-4 text-center" colSpan="2">
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						{paginatedAttendance.length > 0 ? (
							paginatedAttendance.map((record) => (
								<tr
									key={record._id}
									className="hover:bg-gray-700 text-sm"
								>
									{" "}
									<td className="py-3 px-4 hidden">
										{record._id}
									</td>
									<td className="py-3 px-4">
										{record.studentId}
									</td>
									<td className="py-3 px-4">
										{getClassDetails(record.classId)}
									</td>
									<td className="py-3 px-4">
										{formatDateTable(record.date)}
									</td>
									<td className="py-3 px-4">
										{record.status}
									</td>
									<td className="py-3 px-4">
										<button
											onClick={() => handleEdit(record)}
											className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-200"
										>
											Edit
										</button>
										<button
											onClick={() =>
												handleDeleteAttendance(
													record._id
												)
											}
											className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200"
										>
											Delete
										</button>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td
									colSpan="6"
									className="py-3 px-4 text-center"
								>
									No attendance records found.
								</td>
							</tr>
						)}
					</tbody>
				</table>

				{/* Pagination */}
				<div className="flex justify-center mt-6">
					<button
						onClick={() => paginate(currentPage - 1)}
						disabled={currentPage === 1}
						className="px-6 py-2 bg-gray-700 text-white rounded-lg mr-2 hover:bg-gray-600 transition-all duration-200"
					>
						Prev
					</button>
					{Array.from({ length: totalPages }).map((_, index) => (
						<button
							key={index}
							onClick={() => paginate(index + 1)}
							className={`px-6 py-2 rounded-lg ${
								currentPage === index + 1
									? "bg-blue-600 text-white"
									: "bg-gray-700 text-white hover:bg-gray-600"
							} transition-all duration-200`}
						>
							{index + 1}
						</button>
					))}
					<button
						onClick={() => paginate(currentPage + 1)}
						disabled={currentPage === totalPages}
						className="px-6 py-2 bg-gray-700 text-white rounded-lg ml-2 hover:bg-gray-600 transition-all duration-200"
					>
						Next
					</button>
				</div>
			</div>

			{/* Add/Edit Attendance Form */}
			{showForm && (
				<div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
					<div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
						<h2 className="text-2xl font-semibold mb-4">
							{editMode ? "Edit Attendance" : "Add Attendance"}
						</h2>
						<form onSubmit={handleSubmit}>
							<div className="mb-4">
								<label
									htmlFor="date"
									className="block mb-2 text-gray-700"
								>
									Student Id
								</label>
								<input
									type="text"
									id="studentId"
									name="studentId"
									value={formData.studentId}
									onChange={handleChange}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg"
									required
								/>
							</div>

							<div className="mb-4">
								<label
									htmlFor="classId"
									className="block mb-2 text-gray-700"
								>
									Class ID
								</label>
								<select
									id="classId"
									name="classId"
									value={formData.classId}
									onChange={handleChange}
									className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
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
							</div>
							<div className="mb-4">
								<label
									htmlFor="date"
									className="block mb-2 text-gray-700"
								>
									Date
								</label>
								<input
									type="date"
									id="date"
									name="date"
									value={formData.date}
									onChange={handleChange}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg"
									required
								/>
							</div>
							<div className="mb-4">
								<label
									htmlFor="status"
									className="block mb-2 text-gray-700"
								>
									Status
								</label>
								<select
									id="status"
									name="status"
									value={formData.status}
									onChange={handleChange}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg"
								>
									<option value="">Select a status</option>
									<option value="Present">Present</option>
									<option value="Absent">Absent</option>
									<option value="Late">Late</option>
									<option value="Excused">Excused</option>
								</select>
							</div>
							<div className="flex justify-between">
								<button
									type="button"
									onClick={() => setShowForm(false)}
									className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
								>
									{editMode ? "Update" : "Add"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default AttendancePage;
