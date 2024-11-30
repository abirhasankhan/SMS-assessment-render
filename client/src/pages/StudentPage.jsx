import React, { useState, useEffect } from "react";

const API_URI = "/api/students"; // API endpoint for students
const CLASS_API_URI = "/api/classes"; // Endpoint to fetch classes

const StudentPage = () => {
	const [students, setStudents] = useState([]);
	const [classes, setClasses] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [editStudent, setEditStudent] = useState(null);
	const [formData, setFormData] = useState({
		studentId: "",
		firstName: "",
		lastName: "",
		dob: "",
		email: "",
		phone: "",
		address: "",
		classId: "",
		medicalHistory: "",
		remarks: "",
	});
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(5);
	const [searchQuery, setSearchQuery] = useState("");
	const [filteredStudents, setFilteredStudents] = useState([]);


	const handleAddStudent = (newStudent) => {
		try {
			// Update students and filteredStudents
			setStudents((prevStudents) => {
				const updatedStudents = [...prevStudents, newStudent];
				setFilteredStudents(updatedStudents); // Sync filtered list
				return updatedStudents;
			});

			// Display success message
			setSuccessMessage("Student added successfully!");
			setTimeout(() => setSuccessMessage(""), 2000);
		} catch (error) {
			console.error("Error adding student:", error);
			setErrorMessage(
				"An error occurred while adding the student. Please try again."
			);
			setTimeout(() => setErrorMessage(""), 2000); // Clear error message after 2 seconds
		}
	};


	const handleUpdateStudent = (updatedStudent) => {
		setStudents(
			students.map((student) =>
				student.studentId === updatedStudent.studentId
					? updatedStudent
					: student
			)
		);
		setSuccessMessage("Student updated successfully!");
		setTimeout(() => setSuccessMessage(""), 2000);
	};

	const handleDeleteStudent = async (studentId) => {
		try {
			const response = await fetch(`${API_URI}/${studentId}`, {
				method: "DELETE",
			});

			if (response.ok) {
				setStudents(
					students.filter(
						(student) => student.studentId !== studentId
					)
				);
				setSuccessMessage("Student deleted successfully!");

				// Clear success message after 2 seconds
				setTimeout(() => setSuccessMessage(""), 2000);
			} else {
				setErrorMessage("Error deleting student. Please try again.");
				setTimeout(() => setErrorMessage(""), 2000);
			}
		} catch (error) {
			setErrorMessage("Error deleting student. Please try again.");
			setTimeout(() => setErrorMessage(""), 2000);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const method = editStudent ? "PUT" : "POST";
			const url = editStudent
				? `${API_URI}/${editStudent.studentId}`
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
					result.message || "Failed to submit student data."
				);
			}

			if (editStudent) {
				handleUpdateStudent(result); // Update existing student
			} else {
				handleAddStudent(result); // Add new student
			}

			// Set success message
			setSuccessMessage(
				editStudent
					? "Student updated successfully!"
					: "Student added successfully!"
			);

			// Automatically clear success message after 2 seconds
			setTimeout(() => {
				setSuccessMessage("");
			}, 2000);

			// Reset form and state
			setShowForm(false);
			setEditStudent(null);
			setFormData({
				studentId: "",
				firstName: "",
				lastName: "",
				dob: "",
				email: "",
				phone: "",
				address: "",
				classId: "",
				medicalHistory: "",
				remarks: "",
			});
		} catch (error) {
			// Set error message
			setErrorMessage(error.message);

			// Automatically clear error message after 2 seconds
			setTimeout(() => {
				setErrorMessage("");
			}, 2000);

			console.error(error);
		}
	};



	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	// Open the form in edit mode with the student's data
	const handleEdit = (student) => {
		setFormData({
			studentId: student.studentId,
			firstName: student.firstName,
			lastName: student.lastName,
			dob: formatDateForm(student.dob), // Format the dob to 'YYYY-MM-DD'
			email: student.email,
			phone: student.phone,
			address: student.address,
			classId: student.classId,
			medicalHistory: student.medicalHistory,
			remarks: student.remarks,
		});
		setEditStudent(student); // Set the student to be edited
		setShowForm(true); // Show the form
	};


	// Fetch students and classes from the API
	useEffect(() => {
		const fetchStudents = async () => {
			try {
				// Fetch students
				const response = await fetch(API_URI);
				if (!response.ok)
					throw new Error("Network response was not ok");
				const studentData = await response.json();
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
						: "Unable to fetch teachers. Please try again later."
				);
				console.error(error);
			}
		};

		fetchStudents();
	}, [students]);

	// Filter students by search query
	useEffect(() => {
		if (students.length === 0) return; // Skip filtering if no students are available

		try {
			const lowerCaseQuery = searchQuery.toLowerCase();
			const filtered = students.filter((student) => {
				const firstName = student.firstName || ""; // Default to empty string if undefined
				const lastName = student.lastName || ""; // Default to empty string if undefined
				const studentId = student.studentId || ""; // Default to empty string if undefined

				return (
					firstName.toLowerCase().includes(lowerCaseQuery) ||
					lastName.toLowerCase().includes(lowerCaseQuery) ||
					studentId.toLowerCase().includes(lowerCaseQuery)
				);
			});
			setFilteredStudents(filtered);
		} catch (error) {
			setErrorMessage(
				"Error filtering student data. Please try again later."
			);
			console.error(error); // Log the error for debugging purposes
		}
	}, [searchQuery, students]);

	// Get class details from classes list based on classId
	const getClassDetails = (classId) => {
		const clas = classes.find((c) => c._id === classId);
		return clas ? clas.className : "Unknown"; // Return className if class exists, else "Unknown"
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


	const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
	const paginatedStudents = filteredStudents.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	return (
		<div className="container mx-auto p-6 animate__animated animate__fadeIn">
			<h1 className="text-3xl font-bold text-center mb-6 text-gray-1000">
				Manage Students
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

			<button
				onClick={() => setShowForm(true)}
				className="bg-blue-700 text-white px-6 py-3 rounded-lg mb-4 hover:bg-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105"
			>
				Add Student
			</button>

			<div className="mb-4">
				<input
					type="text"
					placeholder="Search by name or student ID..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="w-full px-4 py-2 rounded-lg shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			{/* Students Table */}
			<div className="max-w-7xl mx-auto mt-10 p-6 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-xl border border-gray-800 overflow-x-auto">
				<table className="min-w-full table-auto bg-gray-800 text-white rounded-lg">
					<thead>
						<tr className="bg-gray-700 text-xs font-semibold text-gray-300 uppercase tracking-wider">
							<th className="py-3 px-4 text-left">Student ID</th>
							<th className="py-3 px-4 text-left">Name</th>
							<th className="py-3 px-4 text-left">
								Date of Birth
							</th>
							<th className="py-3 px-4 text-left">Email</th>
							<th className="py-3 px-4 text-left">Phone</th>
							<th className="py-3 px-4 text-left">Address</th>
							<th className="py-3 px-4 text-left">Class</th>
							<th className="py-3 px-4 text-left">
								Medical History
							</th>
							<th className="py-3 px-4 text-left">Remarks</th>
							<th className="py-3 px-4 text-center" colSpan="2">
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						{paginatedStudents.length > 0 ? (
							paginatedStudents.map((student) => (
								<tr
									key={student._id}
									className="hover:bg-gray-700 text-sm"
								>
									<td className="py-3 px-4">
										{student.studentId}
									</td>
									<td className="py-3 px-4">
										{student.firstName} {student.lastName}
									</td>
									<td className="py-3 px-4">
										{formatDateTable(student.dob)}
									</td>
									<td className="py-3 px-4">
										{student.email}
									</td>
									<td className="py-3 px-4">
										{student.phone}
									</td>
									<td className="py-3 px-4">
										{student.address}
									</td>
									<td className="py-3 px-4">
										{getClassDetails(student.classId)}
									</td>
									<td className="py-3 px-4">
										{student.medicalHistory}
									</td>
									<td className="py-3 px-4">
										{student.remarks}
									</td>
									<td className="py-3 px-4">
										<button
											onClick={() => handleEdit(student)}
											className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-200"
										>
											Edit
										</button>
									</td>
									<td className="py-3 px-4">
										<button
											onClick={() =>
												handleDeleteStudent(
													student.studentId
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
									colSpan="10"
									className="text-center py-4 text-white"
								>
									No students available.
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

			{showForm && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
					<div
						className="bg-white p-6 rounded-lg shadow-lg"
						onClick={(e) => e.stopPropagation()}
					>
						<h2 className="text-2xl font-bold mb-4">
							{editStudent ? "Edit Student" : "Add Student"}
						</h2>
						<form
							onSubmit={handleSubmit}
							className="max-w-screen-lg mx-auto p-4"
						>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{/* Student ID */}
								<div className="mb-4">
									<label
										htmlFor="studentId"
										className="block mb-2 text-gray-700"
									>
										Student ID
									</label>
									<input
										type="text"
										id="studentId"
										name="studentId"
										value={formData.studentId}
										onChange={handleChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
										required
									/>
								</div>

								{/* First Name */}
								<div className="mb-4">
									<label className="block text-sm font-medium text-gray-700">
										First Name
									</label>
									<input
										type="text"
										name="firstName"
										value={formData.firstName}
										onChange={handleChange}
										className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
										required
									/>
								</div>

								{/* Last Name */}
								<div className="mb-4">
									<label className="block text-sm font-medium text-gray-700">
										Last Name
									</label>
									<input
										type="text"
										name="lastName"
										value={formData.lastName}
										onChange={handleChange}
										className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
										required
									/>
								</div>

								{/* Date of Birth */}
								<div className="mb-4">
									<label className="block text-sm font-medium text-gray-700">
										Date of Birth
									</label>
									<input
										type="date"
										name="dob"
										value={formData.dob}
										onChange={handleChange}
										className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
										required
									/>
								</div>

								{/* Email */}
								<div className="mb-4">
									<label className="block text-sm font-medium text-gray-700">
										Email
									</label>
									<input
										type="email"
										name="email"
										value={formData.email}
										onChange={handleChange}
										className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
										required
									/>
								</div>

								{/* Phone */}
								<div className="mb-4">
									<label className="block text-sm font-medium text-gray-700">
										Phone
									</label>
									<input
										type="text"
										name="phone"
										value={formData.phone}
										onChange={handleChange}
										className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
										required
									/>
								</div>

								{/* Address */}
								<div className="mb-4">
									<label className="block text-sm font-medium text-gray-700">
										Address
									</label>
									<input
										type="text"
										name="address"
										value={formData.address}
										onChange={handleChange}
										className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
										required
									/>
								</div>

								{/* Class Name */}
								<div className="mb-4">
									<label
										htmlFor="classId"
										className="block mb-2 text-sm font-medium text-gray-700"
									>
										Class Name
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

								{/* Medical History */}
								<div className="mb-4">
									<label className="block text-sm font-medium text-gray-700">
										Medical History
									</label>
									<input
										type="text"
										name="medicalHistory"
										value={formData.medicalHistory}
										onChange={handleChange}
										className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>
								{/* Remarks */}
								<div className="mb-4">
									<label className="block text-sm font-medium text-gray-700">
										Remarks
									</label>
									<input
										type="text"
										name="remarks"
										value={formData.remarks}
										onChange={handleChange}
										className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex justify-end space-x-4 mt-6">
								<button
									type="button"
									onClick={() => {
										setShowForm(false);
										setEditStudent(null);
										setFormData({
											studentId: "",
											firstName: "",
											lastName: "",
											dob: "",
											email: "",
											phone: "",
											address: "",
											classId: "",
											medicalHistory: "",
											remarks: "",
										});
									}}
									className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
								>
									{editStudent ? "Update" : "Add"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default StudentPage;
