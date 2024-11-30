import React from "react";
import { motion } from "framer-motion";

const AddButton = ({ onAdd }) => {
	const handleAdd = () => {
		onAdd(); // Trigger the parent's function to add a student
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.6 }}
			className="mt-4"
		>
			<motion.button
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				onClick={handleAdd}
				className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white 
        font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-cyan-700
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
			>
				Add Student
			</motion.button>
		</motion.div>
	);
};

export default AddButton;
