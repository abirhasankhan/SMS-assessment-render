import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../store/authStore";


const Navbar = () => {
	const [dropdownOpen, setDropdownOpen] = useState(false);


	const toggleDropdown = () => {
		setDropdownOpen(!dropdownOpen);
	};

        const { logout } = useAuthStore();

		const handleLogout = () => {
			logout();
		};


	return (
		<div className="fixed top-0 left-0 w-full bg-gray-800 text-white flex items-center justify-between px-4 py-2 shadow-md z-50">
			<h1 className="text-xl font-bold">School Management</h1>

			<nav className="flex items-center gap-4">
				{/* Profile Dropdown */}
				<div className="relative">
					<button
						onClick={toggleDropdown}
						className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-700"
					>
						<span className="text-2xl font-bold mb-2 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">
							Profile
						</span>

						<svg
							xmlns="http://www.w3.org/2000/svg"
							className={`h-5 w-5 transform ${
								dropdownOpen ? "rotate-180" : "rotate-0"
							}`}
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</button>

					{/* Dropdown Menu */}
					{dropdownOpen && (
						<div className="absolute bg-gray-900 bg-opacity-80 right-0 mt-2 w-40  text-gray-800 rounded shadow-md z-50 ">
							<NavLink
								to="/profile"
								className="block px-4 py-2 hover:bg-gray-100 font-semibold text-green-400 mb-3"
								onClick={() => setDropdownOpen(false)}
							>
								View Profile
							</NavLink>
							<button
								className="block w-full text-left px-4 py-2 hover:bg-gray-100 font-semibold text-green-400 mb-3"
								onClick={handleLogout}
							>
								Logout
							</button>
						</div>
					)}
				</div>
			</nav>
		</div>
	);
};

export default Navbar;
