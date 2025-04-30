import { Box, Typography, Button } from "@mui/material";
import { memo, useState, useEffect } from "react";
import useHttp from "../../../hooks/useHttp";

import NameField from "../Field/NameField";
import BirthDateField from "../Field/BirthDateField";
import GenderField from "../Field/GenderField";
import EmailField from "../Field/EmailField";

const Profile = memo(({ ...props }) => {
	const [user, setUser] = useState({});
	const [changeFlag, setChangeFlag] = useState(false);
	const { getUser, putUser } = useHttp();

	useEffect(() => {
		getUser().then(userData => setUser(userData));
	}, [getUser]);

	const changeUserData = async (e) => {
		e.preventDefault();
		try {
			const formData = new FormData(e.target);
			const userData = await putUser(formData);
			console.log(userData);
			setUser(userData);
			setChangeFlag((flag) => !flag);

		} catch (error) {
			console.log(error)
		}
	}



	return (
		<Box component="form" onSubmit={changeUserData}
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: "35px"
			}}>
			<Typography sx={{
				textAlign: "center",
				display: "block",
				mb: "30px",
				pt: "20px"
			}}>
				{user?.is_admin ? "Профиль администрации" : "Профиль пользователя"}
			</Typography>

			<NameField name={user?.full_name} {...(!changeFlag && { disabled: true })} />
			<BirthDateField date={user?.birth_date} {...(!changeFlag && { disabled: true })} />
			<GenderField gender={user?.gender} {...(!changeFlag && { disabled: true })} />
			<EmailField email={user?.email} {...(!changeFlag && { disabled: true })} />

			{!changeFlag ?
				(<Button
					onClick={() => setChangeFlag((flag) => !flag)}
					variant="contained">
					Изменить
				</Button>) :
				(
					<Box sx={{
						display: "flex",
						justifyContent: "center",
						gap: "20px"
					}}>
						<Button
							onClick={() => setChangeFlag((flag) => !flag)}
							variant="contained">
							Отмена
						</Button>
						<Button
							type="submit"
							variant="contained">
							Сохранить изменнения
						</Button>
					</Box>
				)
			}
		</Box >
	);
});

export default Profile;
