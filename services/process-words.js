import { getScores } from '../services/letter-scores';

const clusterBonuses = ['sc', 'sh', 'sp', 'st'];
const clusterBonusValue = 25;

const processWord = (scores, word) => {
	let scoreBase = 0;
	let hasClusterBonus = false;
	let hasDuplicates = false;

	for (var i = 0; i < word.length; i++) {

		// base score is the frequency of the letter added together
		const letter = word.charAt(i).toLowerCase()
		scoreBase += scores[letter];

		// the word has the same letter twice
		const matches = word.match(new RegExp(letter, "g")) || []
		if (matches.length > 1) {
			hasDuplicates = true;
		}

		for(let a = 0; a < clusterBonuses.length; a++) {
			if (word.indexOf(clusterBonuses[i]) > -1) {
				hasClusterBonus = true
			}
		}
	}

	let scoreBonus = scoreBase;
	
	if(hasClusterBonus) {
		scoreBonus += clusterBonusValue;
	}

	return {
		hasClusterBonus,
		hasDuplicates,
		scoreBase,
		scoreBonus,
		word,
	};
}

const processWords = () => {
	const scores = getScores();

	const processed = words.map((word) => {
		return processWord(scores, word.word);
	})

	console.log(JSON.stringify(processed));
};

module.exports = {
	processWords
};