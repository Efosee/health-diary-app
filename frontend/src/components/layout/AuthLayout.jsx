import styles from './authLayout.module.scss';

const AuthLayout = ({children}) => {

	return(
		<div className={styles.authLayout}>
			{children}
		</div>
	)
}

export default AuthLayout;