import React from "react";
import { motion } from "framer-motion";

const EditButton = ({ onEdit }) => {
	const handleEdit = () => {
		onEdit(); // Trigger the parent's function to edit a student
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
				onClick={handleEdit}
				className="w-full py-3 px-4 bg-gradient-to-r from-yellow-500 to-amber-600 text-white 
        font-bold rounded-lg shadow-lg hover:from-yellow-600 hover:to-amber-700
        focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
			>
				Edit Student
			</motion.button>
		</motion.div>
	);
};

export default EditButton;
