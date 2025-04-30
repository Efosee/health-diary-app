import React, { useEffect, useRef, useState } from 'react';
import {
	Box,
	Container,
	Typography,
	Grid,
	Card,
	CardContent,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	CircularProgress,
} from '@mui/material';
import {
	LocationOn as LocationIcon,
	Phone as PhoneIcon,
	Fax as FaxIcon,
	Email as EmailIcon,
	Schedule as ScheduleIcon,
	AccessTime,
} from '@mui/icons-material';

const Contacts = () => {
	const mapContainerRef = useRef(null);
	const [mapLoaded, setMapLoaded] = useState(false);
	const [mapError, setMapError] = useState(false);
	const scriptAddedRef = useRef(false);
	const [containerWidth, setContainerWidth] = useState(670); // Изначальная ширина для десктопа

	// Функция для получения текущей ширины контейнера
	const updateContainerWidth = () => {
		if (mapContainerRef.current) {
			const width = mapContainerRef.current.offsetWidth;
			setContainerWidth(width);
		}
	};

	// Отслеживание изменения размеров контейнера
	useEffect(() => {
		updateContainerWidth(); // Инициализация ширины

		const resizeObserver = new ResizeObserver(() => {
			updateContainerWidth();
		});

		if (mapContainerRef.current) {
			resizeObserver.observe(mapContainerRef.current);
		}

		return () => {
			if (mapContainerRef.current) {
				resizeObserver.unobserve(mapContainerRef.current);
			}
		};
	}, []);

	// Загрузка скрипта карты при изменении ширины
	useEffect(() => {
		if (!mapContainerRef.current || scriptAddedRef.current) return;

		// Создаём <script> элемент с динамической шириной
		const script = document.createElement('script');
		script.type = 'text/javascript';
		script.async = true;
		script.src = `https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A29f6a31298f1d14f64aa2e417b9184f60703fd551f8532394f4115eafc0d14b8&width=${containerWidth}&height=400&lang=ru_RU&scroll=true`;

		script.onload = () => setMapLoaded(true);
		script.onerror = () => setMapError(true);

		mapContainerRef.current.appendChild(script);
		scriptAddedRef.current = true;

		return () => {
			if (mapContainerRef.current) {
				mapContainerRef.current.innerHTML = '';
				scriptAddedRef.current = false;
			}
		};
	}, [containerWidth]); // Перезагружаем скрипт при изменении ширины

	return (
		<Box
			sx={{
				py: 4,
				bgcolor: 'white',
				minHeight: '100vh',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			<Container >
				<Typography
					variant="h4"
					align="center"
					gutterBottom
					sx={{ fontWeight: 'bold', color: '#1a237e', mb: 4, fontSize: { "xs": "25px", "md": "32px" } }}
				>
					Контактная информация
				</Typography>
				<Grid container spacing={3} justifyContent="center">
					{/* Контактная информация */}
					<Grid item xs={12} sm={12} md={12}>
						<Card
							sx={{
								boxShadow: 2,
								borderRadius: 2,
								bgcolor: 'white',
								height: '100%',
							}}
						>
							<CardContent>
								<Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium', color: '#1a237e' }}>
									Москомспорт
								</Typography>
								<List>
									<ListItem>
										<ListItemIcon>
											<LocationIcon sx={{ color: '#1976d2' }} />
										</ListItemIcon>
										<ListItemText
											primary="Фактический адрес"
											secondary="Россия, Москва, ул. Ефремова, д. 5, стр. 36"
										/>
									</ListItem>
									<ListItem>
										<ListItemIcon>
											<PhoneIcon sx={{ color: '#1976d2' }} />
										</ListItemIcon>
										<ListItemText
											primary="Телефон единой справочной службы города Москвы (круглосуточно)"
											secondary={
												<a href="tel:+74957777777" style={{ color: '#1976d2' }}>
													+7 (495) 777-77-77
												</a>
											}
										/>
									</ListItem>
									<ListItem>
										<ListItemIcon>
											<ScheduleIcon sx={{ color: '#1976d2' }} />
										</ListItemIcon>
										<ListItemText
											primary="Время работы"
											secondary={
												<>
													<Typography variant="body2" display="block">Пн-Чт 08:00 - 17:00</Typography>
													<Typography variant="body2" display="block">Пт 08:00 - 15:45</Typography>
													<Typography variant="body2" display="block" color="text.secondary">
														Сб-Вс <span style={{color: "#d32f2f"}}>Выходной</span>
													</Typography>
												</>
											}
										/>
									</ListItem>
									<ListItem>
										<ListItemIcon>
											<FaxIcon sx={{ color: '#1976d2' }} />
										</ListItemIcon>
										<ListItemText
											primary="Факс"
											secondary="+7 (495) 623-54-71"
										/>
									</ListItem>
									<ListItem>
										<ListItemIcon>
											<EmailIcon sx={{ color: '#1976d2' }} />
										</ListItemIcon>
										<ListItemText
											primary="Email"
											secondary={
												<a href="mailto:depsport@mos.ru" style={{ color: '#1976d2' }}>
													depsport@mos.ru
												</a>
											}
										/>
									</ListItem>
								</List>
							</CardContent>
						</Card>
					</Grid>

					{/* Контейнер для карты */}
					<Grid item xs={12} sm={12} md={12}>
						<Box
							id="map"
							ref={mapContainerRef}
							sx={{
								width: { xs: '100%', md: '670px' },
								height: '400px',
								borderRadius: 2,
								boxShadow: 2,
								border: '1px solid #e0e0e0',
								bgcolor: '#f5f5f5',
								mx: 'auto',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								position: 'relative',
								overflow: 'hidden',
							}}
						>
							{!mapLoaded && !mapError && (
								<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
									<CircularProgress sx={{ color: '#1976d2' }} />
									<Typography color="textSecondary" sx={{ mt: 2 }}>
										Загрузка карты...
									</Typography>
								</Box>
							)}
							{mapError && (
								<Typography color="error" sx={{ textAlign: 'center' }}>
									Не удалось загрузить карту. Попробуйте позже.
								</Typography>
							)}
						</Box>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
};

export default Contacts;