import { Navigate, Route, Routes } from "react-router-dom";
import FloatingShape from "./components/FloatingShape"
import {Toaster} from "react-hot-toast"
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import LoadingSpinner from "./components/loadingSpinner";

import Layout from "./components/Layout";


import {
	StudentPage,
	TeacherPage,
	ClassPage,
	AttendancePage,
	FeePage,
	ExamPage,
	ResultPage,
	HomePage,
	ProfilePage,
	SignUpPage,
	LoginPage,
	EmailVerifactionpgae,
	ForgotPasswordPage,
	ResetPasswordPage,
} from "./pages";



// protect routes that need authentication
const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if(!isAuthenticated){
		return <Navigate to="/login" replace />;
	}

	if(!user.isVerified){
		return <Navigate to="/verify-email" replace />;
	}

	return children;
}


// redirect authenticated users to home page
const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();
	
	if (isAuthenticated && user.isVerified) {
		return <Navigate to="/" replace />;
	}

	return children;
};

function App() {

	const { isChecking, checkAuth, isAuthenticated, user } = useAuthStore();


	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	// console.log("isAuthenticated", isAuthenticated);
	// console.log("user", user);

	if(isChecking) return <LoadingSpinner />
	



	return (
		<>
			<div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
				<FloatingShape
					color="bg-green-500"
					size="w-64 h-64"
					top="-5%"
					left="10%"
					delay={0}
				/>
				<FloatingShape
					color="bg-green-500"
					size="w-48 h-48"
					top="70%"
					left="80%"
					delay={5}
				/>
				<FloatingShape
					color="bg-green-500"
					size="w-32 h-32"
					top="40%"
					left="-10%"
					delay={2}
				/>
				<Routes>
					<Route
						element={
							<ProtectedRoute>
								<Layout />
							</ProtectedRoute>
						}
					>
						<Route path="/" element={<HomePage />} />
						<Route path="/profile" element={<ProfilePage />} />

						<Route path="/students" element={<StudentPage />} />
						<Route path="/teachers" element={<TeacherPage />} />
						<Route path="/classes" element={<ClassPage />} />
						<Route
							path="/attendance"
							element={<AttendancePage />}
						/>

						<Route path="/fees" element={<FeePage />} />
						<Route path="/exams" element={<ExamPage />} />
						<Route path="/results" element={<ResultPage />} />

						{/* Add other protected routes here */}
					</Route>

					<Route
						path="/signup"
						element={
							<RedirectAuthenticatedUser>
								<SignUpPage />
							</RedirectAuthenticatedUser>
						}
					/>
					<Route
						path="/login"
						element={
							<RedirectAuthenticatedUser>
								<LoginPage />
							</RedirectAuthenticatedUser>
						}
					/>
					<Route
						path="/forgot-password"
						element={
							<RedirectAuthenticatedUser>
								<ForgotPasswordPage />
							</RedirectAuthenticatedUser>
						}
					/>
					<Route
						path="/reset-password/:token"
						element={
							<RedirectAuthenticatedUser>
								<ResetPasswordPage />
							</RedirectAuthenticatedUser>
						}
					/>
					<Route
						path="/verify-email"
						element={<EmailVerifactionpgae />}
					/>
				</Routes>

				<Toaster />
			</div>
		</>
	);
}

export default App
