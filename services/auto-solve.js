import { getFormattedUserWord, getWords } from '../services/words';

import { DEFAULT_PREFERENCES } from './preferences';
import { WORDS } from './data/all-words';

const autoSolver = (userWord) => {

	if (!userWord || typeof userWord !== 'string' || userWord.length !== 5) {
		return { error: 'word must be 5 characters.'}
	}
	
	const exists = WORDS.find((word) => {
		return word.word === userWord;
	})

	if(!exists) {
		return { error: 'unknown word.' };
	}

	let guesses = [];
	let preferences = { ...DEFAULT_PREFERENCES };
	let lastGuess;
	let safety = 20;
	let noLuck = false;

	const splitUserWord = userWord.split('');

	while(lastGuess !== userWord) {
		let words = getWords(preferences, guesses);

		if(words.length === 0 && preferences.includeDuplicateLetters === false) {
			preferences.includeDuplicateLetters = true;
			words = getWords(preferences, guesses);
		}
		
		if(words.length === 0) {
			return { error: `could not get ${userWord}.`}
		}

		lastGuess = words[0].word;
		
		let formattedGuess = getFormattedUserWord(words[0].word)
		
		formattedGuess.letters.forEach((letter, i) => {
			if(letter.letter === splitUserWord[i]) {
				letter.status = 'correct';
				return;
			}

			if(splitUserWord.includes(letter.letter)) {
				letter.status = 'wrong-slot';
				return;
			}

			letter.status = 'incorrect';
		})

		guesses.push(formattedGuess);
		
		safety--;
		if(safety === 0) {
			noLuck = true;
			break;
		}
	}

	if(noLuck === true) {
		return { error: `could not get ${userWord}.`}
	}

	return {
		guesses,
		preferences
	};
};

module.exports = {
	autoSolver
};