import PropTypes from 'prop-types';
import Typography from './Typography';
import classNames from '../utils/class-names';

const statuses = [
	'incorrect',
	'wrong-slot',
	'correct',
];

const Letter = ({letterIndex, letter, updateLetterStatus}) => {

	return (
		<Typography component="div" variant="h4"
			className={classNames(
				"select-none text-center py-4 w-1/5",
				letter.status === 'incorrect' && 'bg-gray-200',
				letter.status === 'wrong-slot' && 'bg-yellow-300',
				letter.status === 'correct' && 'bg-green-400'
			)}
			onClick={() => {
				const statusIndex = statuses.indexOf(letter.status);
				const newStatusIndex = (statusIndex > (statuses.length - 2))
					? 0
					: statusIndex + 1;

				updateLetterStatus(statuses[newStatusIndex]);
			}}
		>
			{letter.letter.toUpperCase()}
		</Typography>
	);
}
const WordleInput = ({ updateUserWord, words }) => {

	return (
		<>
			{words.map((word, wordIndex) => {
				return (
					<div className="flex mb-4" key={wordIndex}>
						{word.letters.map((letter, letterIndex) => {
							return (
								<Letter
									key={letterIndex}
									letter={letter}
									letterIndex={letterIndex}
									updateLetterStatus={(newStatus) => {
										updateUserWord(wordIndex, letterIndex, newStatus)
									}}
								/>
							);
						})}
					</div>
				);
			})}
		</>
	);
};

WordleInput.propTypes = {
	
};

export default WordleInput;
