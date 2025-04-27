import TelegramIcon from '@mui/icons-material/Telegram';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import NotificationsIcon from '@mui/icons-material/Notifications';

import Container from "../../ui/Container/Container";
import { NavLink, Outlet } from "react-router";
import styles from './nav.module.scss';

const Nav = () => {
	return (
		<>
			<nav className={styles.nav}>
				<Container>
					<ul className={styles.list}>
						<li>
							<NavLink to="/contacts" className={({ isActive }) => (isActive ? styles.active : '')}>
								<TelegramIcon color="primary" sx={{ fontSize: 40, color: '#1976d2' }} />
							</NavLink>
						</li>
						<li className={styles.diaryLi}>
							<NavLink to="/" className={({ isActive }) => (isActive || window.location.pathname === '/event' ? styles.diary_active : styles.diary)}>
								ДНЕВНИКИ
							</NavLink>
						</li>
						<li>
							<NavLink to="/" className={({ isActive }) => (isActive ? styles.active : '')}>
								личный
							</NavLink>
						</li>
						<li>
							<NavLink to="/event" className={({ isActive }) => (isActive ? styles.active : '')}>
								мероприятий
							</NavLink>
						</li>
						<li className={styles.diaryLi}>
							<NavLink to="/history" className={({ isActive }) => (isActive ? styles.diary_active : styles.diary)}>
								ИСТОРИЯ
							</NavLink>
						</li>
						<li className={styles.diaryLi}>
							<NavLink to="/analystic" className={({ isActive }) => (isActive ? styles.diary_active : styles.diary)}>
								АНАЛИТИКА
							</NavLink>
						</li>
						<li>
							<NavLink to="/profile" className={({ isActive }) => (isActive ? styles.active : '')}>
								<PersonIcon sx={{ fontSize: 40, color: '#1976d2' }} />
							</NavLink>
						</li>
						<li>
							<NavLink to="/health" className={({ isActive }) => (isActive ? styles.active : '')}>
								<FavoriteIcon sx={{ fontSize: 40, color: 'red' }} />
							</NavLink>
						</li>
						<li>
							<NavLink to="/notifications" className={({ isActive }) => (isActive ? styles.active : '')}>
								<NotificationsIcon sx={{ fontSize: 40, color: '#ff9800' }} />
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