import TelegramIcon from '@mui/icons-material/Telegram';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import { useEffect, useState } from 'react';

import Container from "../../ui/Container/Container";
import { NavLink, Outlet } from "react-router";
import styles from './nav.module.scss';

const Nav = () => {
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	// Адаптивные размеры иконок
	const getIconSize = () => {
		if (windowWidth <= 480) return 20;
		if (windowWidth <= 768) return 24;
		return 28;
	};

	return (
		<>
			<nav className={styles.nav}>
				<Container>
					<ul className={styles.list}>
						{/* Левая группа - только кнопка выхода */}
						<li className={styles.navGroup + ' ' + styles.left}>
							<NavLink to="/auth" className={({ isActive }) => (isActive ? styles.active : '')}>
								<LogoutIcon sx={{ fontSize: getIconSize(), color: '#1976d2' }} />
							</NavLink>
						</li>
						
						{/* Центральная группа - основная часть навигации */}
						<li className={styles.navGroup + ' ' + styles.center}>
							{/* Верхний ряд - ДНЕВНИКИ */}
							<div className={styles.navRowTop}>
								<NavLink to="/" className={({ isActive }) => (isActive || window.location.pathname === '/event' ? styles.diary_active : styles.diary)}>
									<span className={styles.diaryHeader}>ДНЕВНИКИ</span>
								</NavLink>
							</div>
							
							{/* Средний ряд - личный и мероприятий */}
							<div className={styles.navRowBottom}>
								<NavLink to="/" className={({ isActive }) => (isActive ? styles.active + ' ' + styles.subItem : styles.subItem)}>
									личный
								</NavLink>
								<NavLink to="/event" className={({ isActive }) => (isActive ? styles.active + ' ' + styles.subItem : styles.subItem)}>
									мероприятий
								</NavLink>
							</div>
						</li>
						
						{/* История и аналитика группа */}
						<li className={styles.navGroup + ' ' + styles.history}>
							<div className={styles.historyGroup}>
								<NavLink to="/history" className={({ isActive }) => (isActive ? styles.active : '')}>
									<span className={styles.subItem}>ИСТОРИЯ</span>
								</NavLink>
								<NavLink to="/analytics" className={({ isActive }) => (isActive ? styles.active : '')}>
									<span className={styles.subItem}>АНАЛИТИКА</span>
								</NavLink>
							</div>
						</li>
						
						{/* Правая группа - иконки меню */}
						<li className={styles.navGroup + ' ' + styles.right}>
							<NavLink to="/profile" className={({ isActive }) => (isActive ? styles.active : '')}>
								<PersonIcon sx={{ fontSize: getIconSize(), color: '#1976d2' }} />
							</NavLink>
							<NavLink to="/health" className={({ isActive }) => (isActive ? styles.active : '')}>
								<FavoriteIcon sx={{ fontSize: getIconSize(), color: 'red' }} />
							</NavLink>
							<NavLink to="/notifications" className={({ isActive }) => (isActive ? styles.active : '')}>
								<NotificationsIcon sx={{ fontSize: getIconSize(), color: '#ff9800' }} />
							</NavLink>
							<NavLink to="/contacts" className={({ isActive }) => (isActive ? styles.active : '')}>
								<TelegramIcon sx={{ fontSize: getIconSize(), color: '#1976d2' }} />
							</NavLink>
						</li>
					</ul>
				</Container>
			</nav>

			<Outlet />
		</>
	);
};

export default Nav;