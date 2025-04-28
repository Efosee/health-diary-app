import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router'

import PersonalDiaryPage from './pages/PersonalDiaryPage';
import EventDiaryPage from './pages/EventDiaryPage';
import ProfilePage from './pages/ProfilePage';
import ContactsPage from './pages/ContactsPage';
import HealthPage from './pages/HealthPage';
import HistoryPage from './pages/HistoryPage';
import NotificationsPage from './pages/NotificationsPage';
import Nav from './components/features/nav/Nav';
import AuthPage from './pages/AuthPage';
import AnalyticsPage from './pages/AnalyticsPage';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/features/Route/PrivateRoute';

import './App.css'


function App() {
	return (
		<Router>
			<AuthProvider>
				<Routes>
					<Route path="/auth" element={<AuthPage />} /> {/* Позже замените на <AuthPage /> */}
					<Route element={<PrivateRoute />}>
						<Route path="/" element={<Nav />}>
							<Route index element={<PersonalDiaryPage />} /> {/* index для корневого пути */}
							<Route path='analytics' element={<AnalyticsPage />} />
							<Route path="event" element={<EventDiaryPage />} />
							<Route path="profile" element={<ProfilePage />} />
							<Route path="history" element={<HistoryPage />} />
							<Route path="health" element={<HealthPage />} />
							<Route path="contacts" element={<ContactsPage />} />
							<Route path="notifications" element={<NotificationsPage />} />
							<Route path="*" element={<div>Not found 404</div>} />
						</Route>
					</Route>
				</Routes>
			</AuthProvider>
		</Router>
	);
}

export default App
