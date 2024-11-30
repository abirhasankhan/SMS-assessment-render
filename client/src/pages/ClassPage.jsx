import React, { useState, useEffect } from "react";

const API_URI = "/api/classes"; // Update the API endpoint for classes
const TEACHER_API_URI = "/api/teachers"; // Endpoint to fetch teachers

const ClassPage = () => {
	const [classes, setClasses] = useState([]);
	const [teachers, setTeachers] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [editClass, setEditClass] = useState(null);
	const [formData, setFormData] = useState({
		className: "",
		teacherId: "", // Store selected teacher's ID
		remarks: "",
	});
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(3);
	const [searchQuery, setSearchQuery] = useState("");
	const [filteredClasses, setFilteredClasses] = useState([]);
	const [showTeacherDetails, setShowTeacherDetails] = useState(false);
	const [selectedTeacher, setSelectedTeacher] = useState(null);

	const handleAddClass = (newClass) => {
		setClasses([...classes, newClass]);
		setSuccessMessage("Class added successfully!");
		setTimeout(() => setSuccessMessage(""), 2000);
	};

	const handleUpdateClass = (updatedClass) => {
		setClasses(
			classes.map((classItem) =>
				classItem._id === updatedClass._id ? updatedClass : classItem
			)
		);
		setSuccessMessage("Class updated successfully!");
		setTimeout(() => setSuccessMessage(""), 2000);
	};

	const handleDeleteClass = async (classId) => {
		try {
			const response = await fetch(`${API_URI}/${classId}`, {
				method: "DELETE",
			});

			if (response.ok) {
				setClasses(
					classes.filter((classItem) => classItem._id !== classId)
				);
				setSuccessMessage("Class deleted successfully!");
				setTimeout(() => setSuccessMessage(""), 2000);
			} else {
				setErrorMessage("Error deleting class. Please try again.");
				setTimeout(() => setErrorMessage(""), 2000);
			}
		} catch (error) {
			setErrorMessage("Error deleting class. Please try again.");
			setTimeout(() => setErrorMessage(""), 2000);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const method = editClass ? "PUT" : "POST";
			const url = editClass ? `${API_URI}/${editClass._id}` : API_URI;

			const response = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const classData = await response.json();

			if (!response.ok) {
				throw new Error(
					classData.message || "Failed to submit class data."
				);
			}

			if (editClass) {
				handleUpdateClass(classData);
			} else {
				handleAddClass(classData);
			}

			setSuccessMessage(
				editClass
					? "Class updated successfully."
					: "Class added successfully."
			);

			// Automatically clear success message after 2 seconds
			setTimeout(() => {
				setSuccessMessage("");
			}, 2000);

			setShowForm(false);
			setEditClass(null);
			setFormData({ className: "", teacherId: "", remarks: "" });
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

	const handleEdit = (classItem) => {
		setFormData({
			className: classItem.className,
			teacherId: classItem.teacherId, // assuming teacherId is the id for the teacher
			remarks: classItem.remarks,
		});
		setEditClass(classItem);
		setShowForm(true);
	};

	const handleTeacherClick = (teacherId) => {
		const teacher = teachers.find((t) => t._id === teacherId);
		setSelectedTeacher(teacher);
		setShowTeacherDetails(true);
	};

	useEffect(() => {
		const fetchClassesAndTeachers = async () => {
			try {
				// Fetch classes
				const classResponse = await fetch(API_URI);
				if (!classResponse.ok)
					throw new Error("Network response was not ok");
				const classData = await classResponse.json();
				console.log("Fetched classes:", classData); // Log class data for debugging
				setClasses(classData.classes || []);
				setFilteredClasses(classData.classes || []);

				// Fetch teachers
				const teacherResponse = await fetch(TEACHER_API_URI);
				if (!teacherResponse.ok)
					throw new Error("Network response was not ok");
				const teacherData = await teacherResponse.json();
				setTeachers(teacherData.teachers || []);
			} catch (error) {
				setErrorMessage("Error fetching data. Please try again later.");
				console.error(error);
			}
		};

		fetchClassesAndTeachers();
	}, [classes, teachers]); // Empty dependency array to fetch data only once on component mount

    useEffect(() => {
        if (classes.length === 0 || teachers.length === 0) return; // Skip filtering if no classes or teachers are available

        try {
            const lowerCaseQuery = searchQuery.toLowerCase();
            const filteredClasses = classes.filter((classItem) => {
				
            	const className = classItem.className || ""; // Default to empty string if undefined

                // Find the teacher object based on teacherId
                const teacher = teachers.find(
                    (teacher) => teacher._id === classItem.teacherId
                );
                const teacherId = teacher ? teacher.teacherId : ""; // Use teacher name if found, else empty string

                return (
					className.toLowerCase().includes(lowerCaseQuery) ||
					teacherId.toLowerCase().includes(lowerCaseQuery)
				);
            });
            setFilteredClasses(filteredClasses);
        } catch (error) {
            setErrorMessage(
                "Error filtering classes data. Please try again later. in search"
            );
            console.error(error);
        }
    }, [searchQuery, classes, teachers]);


	// Get teacher details from teachers list based on teacherId
	const getTeacherId = (teacherId) => {
		const teacher = teachers.find((t) => t._id === teacherId);
		return teacher ? teacher.teacherId : "Unknown"; // Return teacherId if teacher exists
	};

	const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
	const paginatedClasses = filteredClasses.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-3xl font-bold text-center mb-6">
				Manage Classes
			</h1>

			{errorMessage && (
				<div className="bg-red-100 text-red-700 p-4 mb-4">
					{errorMessage}
				</div>
			)}
			{successMessage && (
				<div className="bg-green-100 text-green-700 p-4 mb-4">
					{successMessage}
				</div>
			)}

			<button
				onClick={() => setShowForm(true)}
				className="bg-blue-700 text-white px-6 py-3 rounded-lg mb-4 hover:bg-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105"
			>
				Add Class
			</button>

			<div className="mb-4">
				<input
					type="text"
					placeholder="Search by class name..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="w-full px-4 py-2 rounded-lg shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<div className="max-w-7xl mx-auto mt-10 p-6 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-xl border border-gray-800">
				<table className="min-w-full table-auto bg-gray-800 text-white rounded-lg">
					<thead>
						<tr className="bg-gray-700 text-xs font-semibold text-gray-300 uppercase tracking-wider">
							<th className="py-3 px-4 text-left">Class Name</th>
							<th className="py-3 px-4 text-left">
								Teacher ID
							</th>{" "}
							{/* Changed to Teacher ID */}
							<th className="py-3 px-4" colSpan="2">
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						{paginatedClasses.map((classItem) => (
							<tr
								key={classItem._id}
								className="hover:bg-gray-700 text-sm"
							>
								<td className="py-3 px-4">
									{classItem.className}
								</td>
								<td
									className="py-3 px-4 cursor-pointer text-blue-500"
									onClick={() =>
										handleTeacherClick(classItem.teacherId)
									}
								>
									{getTeacherId(classItem.teacherId)}{" "}
									{/* Teacher ID clickable */}
								</td>
								<td className="py-3 px-4">
									<button
										onClick={() => handleEdit(classItem)}
										className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-200"
									>
										Edit
									</button>
								</td>
								<td className="py-3 px-4">
									<button
										onClick={() =>
											handleDeleteClass(classItem._id)
										}
										className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200"
									>
										Delete
									</button>
								</td>
							</tr>
						))}
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

			{/* Teacher Details Modal */}
			{showTeacherDetails && selectedTeacher && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
					<div className="bg-white p-6 rounded-lg shadow-lg">
						<h2 className="text-2xl font-bold mb-4">
							Teacher Details
						</h2>
						<p>
							Name: {selectedTeacher.firstName}{" "}
							{selectedTeacher.lastName}
						</p>
						<p>Email: {selectedTeacher.email}</p>
						<p>Phone: {selectedTeacher.phone}</p>
						<p>Subject: {selectedTeacher.subject}</p>
						{/* Add more details if needed */}
						<button
							onClick={() => setShowTeacherDetails(false)}
							className="mt-4 px-4 py-2 bg-gray-700 text-white"
						>
							Close
						</button>
					</div>
				</div>
			)}

			{/* Form for adding/editing classes */}
			{showForm && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
					<form
						onSubmit={handleSubmit}
						className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full"
					>
						<h2 className="text-2xl font-bold mb-4">
							{editClass ? "Edit Class" : "Add Class"}
						</h2>

						<div className="mb-4">
							<label htmlFor="className" className="block mb-2">
								Class Name
							</label>
							<input
								type="text"
								id="className"
								name="className"
								value={formData.className}
								onChange={handleChange}
								className="w-full px-4 py-2 border rounded-lg"
								required
							/>
						</div>

						<div className="mb-4">
							<label htmlFor="teacherId" className="block mb-2">
								Teacher ID
							</label>
							<select
								id="teacherId"
								name="teacherId"
								value={formData.teacherId}
								onChange={handleChange}
								className="w-full px-4 py-2 border rounded-lg"
								required
							>
								<option value="">Select a teacher</option>
								{teachers.map((teacher) => (
									<option
										key={teacher._id}
										value={teacher._id}
									>
										{teacher.teacherId}
									</option>
								))}
							</select>
						</div>

						<div className="mb-4">
							<label htmlFor="remarks" className="block mb-2">
								Remarks
							</label>
							<textarea
								id="remarks"
								name="remarks"
								value={formData.remarks}
								onChange={handleChange}
								className="w-full px-4 py-2 border rounded-lg"
							/>
						</div>

						<div className="flex justify-between">
							<button
								type="button"
								onClick={() => setShowForm(false)}
								className="px-6 py-2 bg-gray-700 text-white"
							>
								Cancel
							</button>
							<button
								type="submit"
								className="px-6 py-2 bg-blue-700 text-white"
							>
								{editClass ? "Update Class" : "Add Class"}
							</button>
						</div>
					</form>
				</div>
			)}
		</div>
	);
};

export default ClassPage;
