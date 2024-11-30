import { NavLink } from "react-router-dom";


const Sidebar = () => {
	return (
		<div className="fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white flex flex-col p-4">
			<nav className="flex flex-col gap-4 mt-20">
				<NavLink
					to="/"
					className={({ isActive }) =>
						`block px-4 py-2 rounded ${
							isActive ? "bg-green-500" : "hover:bg-gray-700"
						}`
					}
				>
					Home
				</NavLink>

				<NavLink
					to="/students"
					className={({ isActive }) =>
						`block px-4 py-2 rounded ${
							isActive ? "bg-green-500" : "hover:bg-gray-700"
						}`
					}
				>
					Students
				</NavLink>
				<NavLink
					to="/teachers"
					className={({ isActive }) =>
						`block px-4 py-2 rounded ${
							isActive ? "bg-green-500" : "hover:bg-gray-700"
						}`
					}
				>
					Teachers
				</NavLink>
				<NavLink
					to="/classes"
					className={({ isActive }) =>
						`block px-4 py-2 rounded ${
							isActive ? "bg-green-500" : "hover:bg-gray-700"
						}`
					}
				>
					Classes
				</NavLink>
				<NavLink
					to="/attendance"
					className={({ isActive }) =>
						`block px-4 py-2 rounded ${
							isActive ? "bg-green-500" : "hover:bg-gray-700"
						}`
					}
				>
					Attendance
				</NavLink>
				<NavLink
					to="/fees"
					className={({ isActive }) =>
						`block px-4 py-2 rounded ${
							isActive ? "bg-green-500" : "hover:bg-gray-700"
						}`
					}
				>
					Fees
				</NavLink>
				<NavLink
					to="/exams"
					className={({ isActive }) =>
						`block px-4 py-2 rounded ${
							isActive ? "bg-green-500" : "hover:bg-gray-700"
						}`
					}
				>
					Exams
				</NavLink>
				<NavLink
					to="/results"
					className={({ isActive }) =>
						`block px-4 py-2 rounded ${
							isActive ? "bg-green-500" : "hover:bg-gray-700"
						}`
					}
				>
					Results
				</NavLink>
			</nav>
		</div>
	);
};

export default Sidebar;
