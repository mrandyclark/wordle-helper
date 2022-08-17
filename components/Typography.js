import PropTypes from 'prop-types';

const defaultComponentMapping = {
	body: 'p',
	default: 'span',
	h1: 'h1',
	h2: 'h2',
	h3: 'h3',
	h4: 'h4',
};

const defaultClassMapping = {
	body: 'text-base',
	h1: 'text-3xl font-bold',
	h2: 'text-2xl font-bold',
	h3: 'text-xl font-bold',
	h4: 'text-lg font-bold',
};

const Typography = ({ children, variant, component, className, ...other }) => {
	// catch for dynamic data not rendering a component
	if (!children) {
		return null;
	}

	let variantClasses = defaultClassMapping[variant] || '';

	const Component =
		component || defaultComponentMapping[(variant && variant.split('-')[0]) || 'default'];

	if (className) {
		variantClasses += ` ${className}`;
	}

	return (
		<Component className={variantClasses} {...other}>
			{children}
		</Component>
	);
};

Typography.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.element,
		PropTypes.string,
		PropTypes.array,
		PropTypes.number,
	]),
	className: PropTypes.string,
	component: PropTypes.string,
	variant: PropTypes.oneOf(Object.keys(defaultClassMapping)),
};

export default Typography;
