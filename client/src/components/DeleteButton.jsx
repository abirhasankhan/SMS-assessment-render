import React from "react";
import { motion } from "framer-motion";

const DeleteButton = ({ onDelete }) => {
	const handleDelete = () => {
		onDelete(); // Trigger the parent's function to delete a student
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
				onClick={handleDelete}
				className="w-full py-3 px-4 bg-gradient-to-r from-red-500 to-pink-600 text-white 
        font-bold rounded-lg shadow-lg hover:from-red-600 hover:to-pink-700
        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
			>
				Delete Student
			</motion.button>
		</motion.div>
	);
};

export default DeleteButton;
