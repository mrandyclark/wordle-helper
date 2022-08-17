import Button from '../components/Button';
import Head from 'next/head'
import Typography from '../components/Typography';
import WordleInput from '../components/WordleInput';
import { getWords } from '../services/words';
import { useState } from 'react';

export default function Home() {

	const [addWordError, setAddWordError] = useState('');
	const [newWord, setNewWord] = useState({ word: '' });
	const [nextWords, setNextWords] = useState();
	const [userWords, setUserWords] = useState([]);

	const [preferences, setPreferences] = useState({
		includeDuplicateLetters: false,
		ignorePastWords: false,
		useAllNewLetters: false,
		useClusterBonus: false
	});

	const addUserWord = (word) => {
		if (word.length !== 5) {
			setAddWordError('New word must be 5 characters.');
			return;
		}

		setAddWordError('');
		
		const defaultLetter = {
			status: 'incorrect'
		};

		const newUserWords = [ ...userWords ];

		const split = word.split('');
		newUserWords.push({
			letters: split.map((l) => {
				return { letter: l.toLowerCase(), ...defaultLetter }
			})
		});

		setUserWords(newUserWords);
		setNewWord({ word: '' });
		setNextWords(undefined);
	};

	const clearUserWords = () => {
		setUserWords([]);
	};
	
	const getNextWord = () => {
		const words = getWords(preferences, userWords);
		setNextWords(words.slice(0, 5));
	};
	
	const handlePreferenceChange = (event) => {
		let newPreferences = { ...preferences };
		newPreferences[event.target.name] = event.target.checked;
		setPreferences(newPreferences);
	};

	const updateNewWord = (event) => {
		const newNewWord = { word: event.target.value };
		setNewWord(newNewWord);
	};

	const updateUserWord = (wordIndex, letterIndex, newStatus) => {
		const newUserWords = [ ...userWords ];
		
		const wordToUpdate = { ...newUserWords[wordIndex] };
		wordToUpdate.letters[letterIndex].status = newStatus;
		
		newUserWords[wordIndex] = wordToUpdate;
		setUserWords(newUserWords);
	};

	const useGeneratedWord = (word) => {
		addUserWord(word);
	};

	return (
		<div>
			<Head>
				<title>Help My Wordle</title>
				<meta name="description" content="Simple tool to help you guess the wordle quickly." />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="container max-w-xl p-8">
				<div className="mb-8">
					<Typography className="text-center" variant="h1">
						Help My Wordle!
					</Typography>
					<Typography className="italic text-center" variant="body">
						Add your words using the text field, update the letter statuses by clicking them before getting the next word.
					</Typography>
				</div>
				
				<WordleInput 
					updateUserWord={updateUserWord}
					words={userWords}
				/>

				<div className="border-2 my-4 p-2 rounded-lg">
					<input
						className="border-2 mb-2 p-2 w-full"
						value={newWord.word} 
						onChange={(event) => {
							updateNewWord(event);
						}}
					/>
					<Button
						className="bg-blue-500 hover:bg-blue-700"
						onClick={() => { addUserWord(newWord.word) }}
						text="Add Word"
					/>
					{addWordError && addWordError != '' && (
						<Typography
							className="bg-red-100 mt-4 p-2 text-center"
							component="div"
						>
							{addWordError}
						</Typography>
					)}
				</div>

				<div className="border-2 my-4 p-2 rounded-lg">
					<label className="block mb-2">
						<input
							className="mr-2"
							name="useAllNewLetters"
							onChange={(event) => {
								handlePreferenceChange(event)
							}}
							type="checkbox" />
						Use All New Letters
					</label>
					<label className="block mb-2">
						<input
							className="mr-2"
							name="includeDuplicateLetters"
							onChange={(event) => {
								handlePreferenceChange(event)
							}}
							type="checkbox" />
						Include Duplicate Letters
					</label>
					<label className="block mb-2">
						<input
							className="mr-2"
							name="ignorePastWords"
							onChange={(event) => {
								handlePreferenceChange(event)
							}}
							type="checkbox" />
						Ignore Past Words (updated 2022-08-16)
					</label>
					<label className="block mb-2">
						<input
							className="mr-2"
							name="useClusterBonus"
							onChange={(event) => {
								handlePreferenceChange(event)
							}}
							type="checkbox" />
						Use Cluster Bonus
					</label>
					<Button
						className="bg-green-500 hover:bg-green-700"
						onClick={() => { getNextWord() }}
						text="Get Next Word"
					/>
					<div className="my-4">
						{nextWords && nextWords.length > 0 && (
							<ul>
								{nextWords.map((nextWord, i) => {
									return (
										<li
											className="flex p-2"
											key={i}
										>
											<Typography
												className="flex flex-grow items-center" 
												component="div"
												variant="h4"
											>
												{nextWord.word}
											</Typography>
											<Button
												className="bg-gray-500 flex-1"
												onClick={() => {
													// eslint-disable-next-line react-hooks/rules-of-hooks
													useGeneratedWord(nextWord.word)
												}}
												text="Use"
											/>
										</li>
									);
								})}
							</ul>
						)}
						{nextWords && nextWords.length === 0 && (
							<Typography className="text-center" component="div">No words found.</Typography>
						)}
					</div>
				</div>

				<div className="border-2 my-4 p-2 rounded-lg">
					<Button
						className="bg-red-700 hover:bg-red-900"
						onClick={() => { clearUserWords() }}
						text="Clear Words"
					/>
				</div>
			</main>
		</div>
	);
}
