import React, { useState, useEffect } from "react";

// Set the API base URI
const API_URI = "/api/teachers";


const TeacherPage = () => {
	const [teachers, setTeachers] = useState([]); // Ensure it's an empty array initially
	const [showForm, setShowForm] = useState(false);
	const [editTeacher, setEditTeacher] = useState(null); // To handle editing a teacher
	const [formData, setFormData] = useState({
		teacherId: "", // Add teacherId field
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		subject: "",
		remarks: "",
	});
	const [errorMessage, setErrorMessage] = useState(""); // Error message state
	const [successMessage, setSuccessMessage] = useState(""); // Success message state
	const [currentPage, setCurrentPage] = useState(1); // Pagination state
	const [itemsPerPage] = useState(3); // Items per page
	//search
	const [searchQuery, setSearchQuery] = useState("");
	const [filteredTeachers, setFilteredTeachers] = useState([]);

	// Add a new teacher to the state
	const handleAddTeacher = (newTeacher) => {

		try {
			// Update teachers and filteredTeachers
			setTeachers((prevTeachers) => {
				const updatedTeachers = [...prevTeachers, newTeacher];
				setFilteredTeachers(updatedTeachers); // Sync filtered list
				return updatedTeachers;
			});

			// Display success message
			setSuccessMessage("Teacher added successfully!");
			setTimeout(() => setSuccessMessage(""), 2000);

		} catch (error) {
			console.error("Error adding teacher:", error);
			setErrorMessage(
				"An error occurred while adding the teacher. Please try again."
			);
			setTimeout(() => setErrorMessage(""), 2000); // Clear error message after 2 seconds
		}
		setTeachers([...teachers, newTeacher]);
		setSuccessMessage("Teacher added successfully!");

		// Clear success message after 2 seconds
		setTimeout(() => setSuccessMessage(""), 2000);
	};

	// Update a teacher in the state
	const handleUpdateTeacher = (updatedTeacher) => {
		setTeachers(
			teachers.map((teacher) =>
				teacher.teacherId === updatedTeacher.teacherId
					? updatedTeacher
					: teacher
			)
		);
		setSuccessMessage("Teacher updated successfully!");

		// Clear success message after 5 seconds
		setTimeout(() => setSuccessMessage(""), 2000);
	};

	// Delete a teacher from the state
	const handleDeleteTeacher = async (teacherId) => {
		try {
			const response = await fetch(`${API_URI}/${teacherId}`, {
				method: "DELETE",
			});

			if (response.ok) {
				setTeachers(
					teachers.filter(
						(teacher) => teacher.teacherId !== teacherId
					)
				);
				setSuccessMessage("Teacher deleted successfully!");

				// Clear success message after 2 seconds
				setTimeout(() => setSuccessMessage(""), 2000);
			} else {
				setErrorMessage("Error deleting teacher. Please try again.");

				// Clear error message after 5 seconds
				setTimeout(() => setErrorMessage(""), 2000);
			}
		} catch (error) {
			setErrorMessage("Error deleting teacher. Please try again.");

			// Clear error message after 5 seconds
			setTimeout(() => setErrorMessage(""), 2000);
		}
	};

	// Handle form submission (both add and update)
	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const method = editTeacher ? "PUT" : "POST"; // Determine the method based on whether we're adding or updating
			const url = editTeacher
				? `${API_URI}/${editTeacher.teacherId}`
				: API_URI;

			const response = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const teacher = await response.json();

			if (!response.ok) {
				throw new Error(
					teacher.message || "Failed to submit teacher data."
				);
			}

			if (editTeacher) {
				handleUpdateTeacher(teacher); // Update teacher in the state
			} else {
				handleAddTeacher(teacher); // Add new teacher to the state
			}

			// Set success message
			setSuccessMessage(
				editTeacher
					? "Teacher updated successfully!"
					: "Teacher added successfully!"
			);

			// Automatically clear success message after 2 seconds
			setTimeout(() => {
				setSuccessMessage("");
			}, 2000);

			setShowForm(false); // Close the form after submitting
			setEditTeacher(null); // Reset edit mode
			setFormData({
				teacherId: "", // Reset teacherId
				firstName: "",
				lastName: "",
				email: "",
				phone: "",
				subject: "",
				remarks: "",
			}); // Reset form data
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

	// Handle form field change
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	// Open the form in edit mode with the teacher's data
	const handleEdit = (teacher) => {
		setFormData({
			teacherId: teacher.teacherId, // Use teacherId when editing
			firstName: teacher.firstName,
			lastName: teacher.lastName,
			email: teacher.email,
			phone: teacher.phone,
			subject: teacher.subject,
			remarks: teacher.remarks,
		});
		setEditTeacher(teacher); // Set the teacher being edited
		setShowForm(true); // Show the form
	};

	// Fetch teachers from the API
	useEffect(() => {
		const fetchTeachers = async () => {
			try {
				const response = await fetch(API_URI);
				if (!response.ok) throw new Error("Failed to fetch teachers");
				const data = await response.json();
				setTeachers(data.teachers || []);
				setFilteredTeachers(data.teachers || []);
			} catch (error) {
				setErrorMessage(
					error.message.includes("Failed to fetch")
						? "Network error. Please check your connection."
						: "Unable to fetch teachers. Please try again later."
				);
				console.error(error);
			}
		};

		fetchTeachers();
	}, [teachers]);



	// Filter teachers by search query
	useEffect(() => {
		if (teachers.length === 0) return; // Skip filtering if no teachers are available

		try {
			const lowerCaseQuery = searchQuery.toLowerCase();
			const filtered = teachers.filter((teacher) => {
				const firstName = teacher.firstName || ""; // Default to empty string if undefined
				const lastName = teacher.lastName || ""; // Default to empty string if undefined
				const teacherId = teacher.teacherId || ""; // Default to empty string if undefined

				return (
					firstName.toLowerCase().includes(lowerCaseQuery) ||
					lastName.toLowerCase().includes(lowerCaseQuery) ||
					teacherId.toLowerCase().includes(lowerCaseQuery)
				);
			});
			setFilteredTeachers(filtered);
		} catch (error) {
			setErrorMessage(
				"Error filtering teachers data. Please try again later."
			);
			console.error(error); // Log the error for debugging purposes
		}
	}, [searchQuery, teachers]);


	// Pagination Logic
	const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
	const paginatedTeachers = filteredTeachers.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const paginate = (pageNumber) => setCurrentPage(pageNumber);


	return (
		<div className="container mx-auto p-6 animate__animated animate__fadeIn">
			<h1 className="text-3xl font-bold text-center mb-6 text-gray-1000">
				Manage Teachers
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
				Add Teacher
			</button>

			{/* Search Bar */}
			<div className="mb-4">
				<input
					type="text"
					placeholder="Search by name or teacher ID..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="w-full px-4 py-2 rounded-lg shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			{/* Teacher Table */}
			<div className="max-w-7xl mx-auto mt-10 p-6 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-xl border border-gray-800 overflow-x-auto">
				<table className="min-w-full table-auto bg-gray-800 text-white rounded-lg">
					<thead>
						<tr className="bg-gray-700 text-xs font-semibold text-gray-300 uppercase tracking-wider">
							<th className="py-3 px-4 text-left">Teacher ID</th>
							<th className="py-3 px-4 text-left">Name</th>
							<th className="py-3 px-4 text-left">Email</th>
							<th className="py-3 px-4 text-left">Phone</th>
							<th className="py-3 px-4 text-left">Subject</th>
							<th className="py-3 px-4 text-center" colSpan="2">
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						{paginatedTeachers.length > 0 ? (
							paginatedTeachers.map((teacher) => (
								<tr
									key={teacher.teacherId}
									className="hover:bg-gray-700 text-sm"
								>
									<td className="py-3 px-4">
										{teacher.teacherId}
									</td>
									<td className="py-3 px-4">
										{teacher.firstName} {teacher.lastName}
									</td>
									<td className="py-3 px-4">
										{teacher.email}
									</td>
									<td className="py-3 px-4">
										{teacher.phone}
									</td>
									<td className="py-3 px-4">
										{teacher.subject}
									</td>
									<td className="py-3 px-4 text-center">
										<button
											onClick={() => handleEdit(teacher)}
											className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-200"
										>
											Edit
										</button>
									</td>
									<td className="py-3 px-4 text-center">
										<button
											onClick={() =>
												handleDeleteTeacher(
													teacher.teacherId
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
									colSpan="5"
									className="text-center py-4 text-white"
								>
									No teachers available.
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

			{/* Add/Edit Teacher Form */}
			{showForm && (
				<div className="fixed top-10 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
					<div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
						<h2 className="text-2xl font-semibold mb-4 text-center">
							{editTeacher ? "Edit Teacher" : "Add Teacher"}
						</h2>
						<form
							onSubmit={handleSubmit}
							className="max-w-screen-lg mx-auto p-4"
						>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="mb-4">
									<label
										htmlFor="teacherId"
										className="block mb-2 text-gray-700"
									>
										Teacher ID
									</label>
									<input
										type="text"
										id="teacherId"
										name="teacherId"
										value={formData.teacherId}
										onChange={handleChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg"
										required
									/>
								</div>

								<div className="mb-4">
									<label
										htmlFor="firstName"
										className="block mb-2 text-gray-700"
									>
										First Name
									</label>
									<input
										type="text"
										id="firstName"
										name="firstName"
										value={formData.firstName}
										onChange={handleChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg"
										required
									/>
								</div>

								<div className="mb-4">
									<label
										htmlFor="lastName"
										className="block mb-2 text-gray-700"
									>
										Last Name
									</label>
									<input
										type="text"
										id="lastName"
										name="lastName"
										value={formData.lastName}
										onChange={handleChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg"
										required
									/>
								</div>

								<div className="mb-4">
									<label
										htmlFor="email"
										className="block mb-2 text-gray-700"
									>
										Email
									</label>
									<input
										type="email"
										id="email"
										name="email"
										value={formData.email}
										onChange={handleChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg"
										required
									/>
								</div>

								<div className="mb-4">
									<label
										htmlFor="phone"
										className="block mb-2 text-gray-700"
									>
										Phone
									</label>
									<input
										type="tel"
										id="phone"
										name="phone"
										value={formData.phone}
										onChange={handleChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg"
										required
									/>
								</div>

								<div className="mb-4">
									<label
										htmlFor="subject"
										className="block mb-2 text-gray-700"
									>
										Subject
									</label>
									<input
										type="text"
										id="subject"
										name="subject"
										value={formData.subject}
										onChange={handleChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg"
										required
									/>
								</div>

								<div className="mb-4">
									<label
										htmlFor="remarks"
										className="block mb-2 text-gray-700"
									>
										Remarks
									</label>
									<textarea
										id="remarks"
										name="remarks"
										value={formData.remarks}
										onChange={handleChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg"
									/>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex justify-end space-x-4 mt-6">
								<button
									type="button"
									onClick={() => {
										setShowForm(false);
										setEditTeacher(null);
										setFormData({
											teacherId: "",
											firstName: "",
											lastName: "",
											email: "",
											phone: "",
											subject: "",
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
									{editTeacher ? "Update" : "Add"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default TeacherPage;
