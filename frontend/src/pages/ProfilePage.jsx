import { useEffect } from "react";
import useHttp from "../hooks/useHttp";

const ProfilePage = () => {
	const {getUser} = useHttp();
	useEffect(() => {
		getUser().then(res => console.log(res));
	}, []);

	return (
		<>
			<div>А тут будет профиль пользователя</div>
		</>
	)
}

export default ProfilePage; 