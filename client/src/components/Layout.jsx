import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = () => {
	return (
		<div className="flex">
			<Sidebar />
			<div className="flex-1 ml-64 flex flex-col min-h-screen">
				<Navbar />
				<main className="flex-grow flex items-center justify-normal p-4">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default Layout;
