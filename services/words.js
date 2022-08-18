import { PAST_WORDS } from './data/past-words';
import { WORDS } from './data/all-words';

const getWords = (preferences, userWords) => {	
	const slots = [
		{ no: [] },
		{ no: [] },
		{ no: [] },
		{ no: [] },
		{ no: [] }
	];

	const cantInclude = [];
	const correctLetters = [];
	const mustInclude = [];
	
	userWords.forEach((word) => {
		word.letters.forEach((letter, i) => {
			if (preferences.useAllNewLetters === true && !cantInclude.includes(letter.letter)) {
				cantInclude.push(letter.letter);
				return;
			}
			
			// if a letter is correct, it must exist in this slot
			if (letter.status === 'correct') {
				slots[i]['yes'] = letter.letter;
				correctLetters.push(letter.letter);
				return;
			}
			
			// if a letter is in the wrong slot, it cant
			// exist in this slot and must exist in another slot
			if (letter.status === 'wrong-slot') {
				if (!mustInclude.includes(letter.letter)) {
					mustInclude.push(letter.letter);
				}

				if (!slots[i].no.includes(letter.letter)) {
					slots[i].no.push(letter.letter);
				}

				return;
			}

			// if a letter is incorrect, it cant exist in any slot
			if (
				letter.status === 'incorrect' &&
				!cantInclude.includes(letter.letter) &&
				!mustInclude.includes(letter.letter)
			) {
				cantInclude.push(letter.letter);
				return;
			} 
		});
	});
		
	const log = (word, message) => {
		// if(word === 'gruel') {
		// 	console.log(message);
		// }
	};

	const filtered = WORDS.filter((word) => {
		if (preferences.includeDuplicateLetters === false && word.hasDuplicates === true) {
			log(word.word, 'duplicate letters exit');
			return false;
		}

		if (preferences.ignorePastWords === true && PAST_WORDS.includes(word.word.toUpperCase())) {
			log(word.word, 'past words exit');
			return false;
		}

		const split = word.word.split('');
		
		// if a letter that can't exist exists, weed those out
		for (let cantIndex = 0; cantIndex < split.length; cantIndex++) {
			if(cantInclude.includes(split[cantIndex])) {
				log(word.word, `weeding out ${word.word} because it has cant letters`);
				return false;
			}
		}

		// if the word doesn't have all of the letters in 'mustInclude', weed those out
		for (let mustIndex = 0; mustIndex < mustInclude.length; mustIndex++) {
			if(!split.includes(mustInclude[mustIndex])) {
				log(word.word, `weeding out ${word.word} because it doesnt have must letters`);
				return false;
			}
		}

		// match the letters in slots
		for (let slotIndex = 0; slotIndex < slots.length; slotIndex++) {
			if (slots[slotIndex].yes && split[slotIndex] !== slots[slotIndex].yes) {
				log(word.word, `weeding out ${word.word} because it doesnt has wrong yes letters`);
				return false;
			}

			if (slots[slotIndex].no.includes(split[slotIndex])) {
				log(word.word, `weeding out ${word.word} because it has no letters`);
				return false;
			}
		}

		return true;
	});

	const scoreKey = preferences.useClusterBonus === true
		? 'scoreBonus'
		: 'scoreBase';
		
	return filtered.sort((a, b) => (a[scoreKey] > b[scoreKey]) ? -1 : 1)
};

module.exports = {
	getWords
};