import React from "react";

function FeePage() {
	return (
		<div className="flex flex-col items-center justify-center  bg-gray-100 text-center px-4 sm:px-6 lg:px-8">
			<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
				Page Under Construction
			</h1>
			<p className="text-base sm:text-lg text-gray-600 mt-4">
				We are working hard to bring this page to you soon. Stay tuned!
			</p>
			<div className="mt-8">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="w-16 h-16 sm:w-24 sm:h-24 text-yellow-500 animate-bounce"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth={2}
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M12 8v4m0 4h.01m-6.938 4h13.856C18.232 19.162 19 17.147 19 15c0-4.418-3.582-8-8-8s-8 3.582-8 8c0 2.147.768 4.162 2.082 5.623z"
					/>
				</svg>
			</div>
		</div>
	);
}

export default FeePage;
