export const Section = ({ title, children }) => {
	return (
		<section className='flex flex-col gap-6'>
			<h3 className='text-2xl font-medium'>{title}</h3>
			{children}
		</section>
	);
};