import Container from "../ui/Container/Container";
import { Paper } from "@mui/material";
const ProfileLayout = ({children}) => {
	
	return(
		<Container>
			<Paper elevation="4" sx={{
				m:{
					"xs": "8px",
					"md": "20px",
					"lg": "50px"
				},
				mt: "3vmin",
				p:{
					"xs": "0 10px 25px 10px",
					"md": "0 50px 40px 50px",
					"lg": "0 80px 40px 80px"
				},
				width: {
					"xs": "95%",
					"md": "min(95%, 800px)",
					"lg": "800px"
				}
			}}> 
				{children}
			</Paper>
		</Container>
	)
}

export default ProfileLayout;