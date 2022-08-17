import Typography from "./Typography";
import classNames from "../utils/class-names";

const Button = ({ className = '', onClick, text}) => {
	return (
		<button
			className={classNames(
				// "align-center flex p-2 rounded-lg w-full",
				"font-bold text-white px-4 py-2 rounded w-full",
				className
			)}
			onClick={onClick}
		>
			{text}
		</button>
	);
};

export default Button;