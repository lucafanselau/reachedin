export interface ReadabilityScores {
  // Ranges in US School Levels. The automated readability index (ARI) is a readability test for English texts, designed to gauge the understandability of a text
  automatedReadabilityIndex: number;
  // Ranges in US School Levels. Coleman–Liau relies on characters instead of syllables per word.
  colemanLiauIndex: number;
  // Number between 0 and 100 where 0 is lowest readability (scientific paper) and 100 is 5th grade school
  fleschKincaidGrade: number;
  // Number between 0 and 100 where 0 is lowest readability (scientific paper) and 100 is 5th grade school
  fleschReadingEase: number;
  // has to be trial and errored
  linsearWriteFormula: number;
  medianGrade: number;
  // in seconds / minutes?
  readingTime: number;
  // measure readability based on letter counting. They don't use the syllable counting method of many other formulas
  rix: number;
  // Simple Measure of Gobbledygook -
  smogIndex: number;
}

export const scoreRanges = {
  automatedReadabilityIndex: [1, 14],
  colemanLiauIndex: [0, 11],
  fleschKincaidGrade: [0, 100],
  fleschReadingEase: [0, 100],
  linsearWriteFormula: [0, 100],
  medianGrade: [0, 14],
  rix: [0, 56],
  smogIndex: [5, 18],
} as const;

export const defaultScores: ReadabilityScores = {
  automatedReadabilityIndex: 1,
  colemanLiauIndex: 0,
  fleschKincaidGrade: 0,
  fleschReadingEase: 0,
  linsearWriteFormula: 0,
  medianGrade: 0,
  rix: 0,
  smogIndex: 5,
  readingTime: 0,
};

/**
 * inspired by https://github.com/sahava/readability-score-javascript/blob/master/readability.js
 *
 */
const getScores = (text: string) => {
  /*
   * To speed the script up, you can set a sampling rate in words. For example, if you set
   * sampleLimit to 1000, only the first 1000 words will be parsed from the input text.
   * Set to 0 to never sample.
   */
  const sampleLimit = 1000;

  // Manual rewrite of the textstat Python library (https://github.com/shivam5992/textstat/)

  /*
   * Regular expression to identify a sentence. No, it's not perfect.
   * Fails e.g. with abbreviations and similar constructs mid-sentence.
   */
  const sentenceRegex = new RegExp("[.?!]\\s[^a-z]", "g");

  /*
   * Regular expression to identify a syllable. No, it's not perfect either.
   * It's based on English, so other languages with different vowel / consonant distributions
   * and syllable definitions need a rewrite.
   * Inspired by https://bit.ly/2VK9dz1
   */
  const syllableRegex = new RegExp("[aiouy]+e*|e(?!d$|ly).|[td]ed|le$", "g");

  // Baseline for FRE - English only
  const freBase = {
    base: 206.835,
    sentenceLength: 1.015,
    syllablesPerWord: 84.6,
    syllableThreshold: 3,
  };

  const cache: any = {};

  const punctuation = [
    "!",
    '"',
    "#",
    "$",
    "%",
    "&",
    "'",
    "(",
    ")",
    "*",
    "+",
    ",",
    "-",
    ".",
    "/",
    ":",
    ";",
    "<",
    "=",
    ">",
    "?",
    "@",
    "[",
    "]",
    "^",
    "_",
    "`",
    "{",
    "|",
    "}",
    "~",
  ];

  const legacyRound = (number: number, precision?: number) => {
    var k = Math.pow(10, precision || 0);
    return Math.floor(number * k + 0.5 * Math.sign(number)) / k;
  };

  const charCount = (text: string) => {
    if (cache.charCount) return cache.charCount;
    if (sampleLimit > 0) text = text.split(" ").slice(0, sampleLimit).join(" ");
    text = text.replace(/\s/g, "");
    return (cache.charCount = text.length);
  };

  const removePunctuation = (text: string) => {
    return text
      .split("")
      .filter(function (c) {
        return punctuation.indexOf(c) === -1;
      })
      .join("");
  };

  const letterCount = (text: string) => {
    if (sampleLimit > 0) text = text.split(" ").slice(0, sampleLimit).join(" ");
    text = text.replace(/\s/g, "");
    return removePunctuation(text).length;
  };

  const lexiconCount = (text: string, useCache: any, ignoreSample?: any) => {
    if (useCache && cache.lexiconCount) return cache.lexiconCount;
    if (ignoreSample !== true && sampleLimit > 0)
      text = text.split(" ").slice(0, sampleLimit).join(" ");
    text = removePunctuation(text);
    var lexicon = text.split(" ").length;
    return useCache ? (cache.lexiconCount = lexicon) : lexicon;
  };

  const getWords = (text: string, useCache?: any) => {
    if (useCache && cache.getWords) return cache.getWords;
    if (sampleLimit > 0) text = text.split(" ").slice(0, sampleLimit).join(" ");
    text = text.toLowerCase();
    text = removePunctuation(text);
    const words = text.split(" ");
    return useCache ? (cache.getWords = words) : words;
  };

  const syllableCount = (text: string, useCache?: any) => {
    if (useCache && cache.syllableCount) return cache.syllableCount;
    const syllables = getWords(text, useCache).reduce(function (a, c) {
      return a + (c.match(syllableRegex) || [1]).length;
    }, 0);
    return useCache ? (cache.syllableCount = syllables) : syllables;
  };

  const polySyllableCount = (text: string, useCache?: any) => {
    let count = 0;
    getWords(text, useCache).forEach((word: string) => {
      const syllables = syllableCount(word);
      if (syllables >= 3) {
        count += 1;
      }
    });
    return count;
  };

  const sentenceCount = (text: string, useCache?: any) => {
    if (useCache && cache.sentenceCount) return cache.sentenceCount;
    if (sampleLimit > 0) text = text.split(" ").slice(0, sampleLimit).join(" ");
    let ignoreCount = 0;
    const sentences = text.split(sentenceRegex);
    sentences.forEach(function (s) {
      if (lexiconCount(s, true, false) <= 2) {
        ignoreCount += 1;
      }
    });
    var count = Math.max(1, sentences.length - ignoreCount);
    return useCache ? (cache.sentenceCount = count) : count;
  };

  const avgSentenceLength = (text: string) => {
    const avg = lexiconCount(text, true) / sentenceCount(text, true);
    return legacyRound(avg, 2);
  };

  const avgSyllablesPerWord = (text: string) => {
    const avg = syllableCount(text, true) / lexiconCount(text, true);
    return legacyRound(avg, 2);
  };

  const avgCharactersPerWord = (text: string) => {
    const avg = charCount(text) / lexiconCount(text, true);
    return legacyRound(avg, 2);
  };

  const avgLettersPerWord = (text: string) => {
    const avg = letterCount(text) / lexiconCount(text, true);
    return legacyRound(avg, 2);
  };

  const avgSentencesPerWord = (text: string) => {
    const avg = sentenceCount(text, true) / lexiconCount(text, true);
    return legacyRound(avg, 2);
  };

  const fleschReadingEase = (text: string) => {
    const sentenceLength = avgSentenceLength(text);
    const syllablesPerWord = avgSyllablesPerWord(text);
    return legacyRound(
      freBase.base -
        freBase.sentenceLength * sentenceLength -
        freBase.syllablesPerWord * syllablesPerWord,
      2
    );
  };

  const fleschKincaidGrade = (text: string) => {
    const sentenceLength = avgSentenceLength(text);
    const syllablesPerWord = avgSyllablesPerWord(text);
    return legacyRound(
      0.39 * sentenceLength + 11.8 * syllablesPerWord - 15.59,
      2
    );
  };

  const smogIndex = (text: string) => {
    const sentences = sentenceCount(text, true);
    if (sentences >= 3) {
      const polySyllables = polySyllableCount(text, true);
      const smog =
        1.043 * Math.pow(polySyllables * (30 / sentences), 0.5) + 3.1291;
      return legacyRound(smog, 2);
    }
    return 0.0;
  };

  const colemanLiauIndex = (text: string) => {
    const letters = legacyRound(avgLettersPerWord(text) * 100, 2);
    const sentences = legacyRound(avgSentencesPerWord(text) * 100, 2);
    const coleman = 0.0588 * letters - 0.296 * sentences - 15.8;
    return legacyRound(coleman, 2);
  };

  const automatedReadabilityIndex = (text: string) => {
    const chars = charCount(text);
    const words = lexiconCount(text, true);
    const sentences = sentenceCount(text, true);
    const a = chars / words;
    const b = words / sentences;
    var readability =
      4.71 * legacyRound(a, 2) + 0.5 * legacyRound(b, 2) - 21.43;
    return legacyRound(readability, 2);
  };

  const linsearWriteFormula = (text: string) => {
    let easyWord = 0;
    let difficultWord = 0;
    const roughTextFirst100 = text.split(" ").slice(0, 100).join(" ");
    const plainTextListFirst100 = getWords(text, true).slice(0, 100);
    plainTextListFirst100.forEach((word: string) => {
      if (syllableCount(word) < 3) {
        easyWord += 1;
      } else {
        difficultWord += 1;
      }
    });
    let number =
      (easyWord + difficultWord * 3) / sentenceCount(roughTextFirst100);
    if (number <= 20) {
      number -= 2;
    }
    return legacyRound(number / 2, 2);
  };

  const rix = (text: string) => {
    const words = getWords(text, true);
    const longCount = words.filter(function (word) {
      return word.length > 6;
    }).length;
    const sentencesCount = sentenceCount(text, true);
    return legacyRound(longCount / sentencesCount, 2);
  };

  const readingTime = (text: string) => {
    const wordsPerSecond = 4.17;
    // To get full reading time, ignore cache and sample
    return legacyRound(lexiconCount(text, false, true) / wordsPerSecond, 2);
  };

  // Build textStandard
  let grade: any = [];
  const scores: ReadabilityScores = {
    automatedReadabilityIndex: 0,
    colemanLiauIndex: 0,
    fleschKincaidGrade: 0,
    fleschReadingEase: 0,
    linsearWriteFormula: 0,
    medianGrade: 0,
    readingTime: 0,
    rix: 0,
    smogIndex: 0,
  };

  (function () {
    // FRE
    const fre = (scores.fleschReadingEase = fleschReadingEase(text));
    if (fre < 100 && fre >= 90) {
      grade.push(5);
    } else if (fre < 90 && fre >= 80) {
      grade.push(6);
    } else if (fre < 80 && fre >= 70) {
      grade.push(7);
    } else if (fre < 70 && fre >= 60) {
      grade.push(8);
      grade.push(9);
    } else if (fre < 60 && fre >= 50) {
      grade.push(10);
    } else if (fre < 50 && fre >= 40) {
      grade.push(11);
    } else if (fre < 40 && fre >= 30) {
      grade.push(12);
    } else {
      grade.push(13);
    }

    // FK
    const fk = (scores.fleschKincaidGrade = fleschKincaidGrade(text));
    grade.push(Math.floor(fk));
    grade.push(Math.ceil(fk));

    // SMOG
    const smog = (scores.smogIndex = smogIndex(text));
    grade.push(Math.floor(smog));
    grade.push(Math.ceil(smog));

    // CL
    const cl = (scores.colemanLiauIndex = colemanLiauIndex(text));
    grade.push(Math.floor(cl));
    grade.push(Math.ceil(cl));

    // ARI
    const ari = (scores.automatedReadabilityIndex =
      automatedReadabilityIndex(text));
    grade.push(Math.floor(ari));
    grade.push(Math.ceil(ari));

    // LWF
    const lwf = (scores.linsearWriteFormula = linsearWriteFormula(text));
    grade.push(Math.floor(lwf));
    grade.push(Math.ceil(lwf));

    // RIX
    const rixScore = (scores.rix = rix(text));
    if (rixScore >= 7.2) {
      grade.push(13);
    } else if (rixScore < 7.2 && rixScore >= 6.2) {
      grade.push(12);
    } else if (rixScore < 6.2 && rixScore >= 5.3) {
      grade.push(11);
    } else if (rixScore < 5.3 && rixScore >= 4.5) {
      grade.push(10);
    } else if (rixScore < 4.5 && rixScore >= 3.7) {
      grade.push(9);
    } else if (rixScore < 3.7 && rixScore >= 3.0) {
      grade.push(8);
    } else if (rixScore < 3.0 && rixScore >= 2.4) {
      grade.push(7);
    } else if (rixScore < 2.4 && rixScore >= 1.8) {
      grade.push(6);
    } else if (rixScore < 1.8 && rixScore >= 1.3) {
      grade.push(5);
    } else if (rixScore < 1.3 && rixScore >= 0.8) {
      grade.push(4);
    } else if (rixScore < 0.8 && rixScore >= 0.5) {
      grade.push(3);
    } else if (rixScore < 0.5 && rixScore >= 0.2) {
      grade.push(2);
    } else {
      grade.push(1);
    }

    // Find median grade
    grade = grade.sort(function (a, b) {
      return a - b;
    });
    const midPoint = Math.floor(grade.length / 2);
    const medianGrade = legacyRound(
      grade.length % 2
        ? grade[midPoint]
        : (grade[midPoint - 1] + grade[midPoint]) / 2.0
    );
    scores.medianGrade = medianGrade;
  })();

  scores.readingTime = readingTime(text);

  return scores;
};

export default getScores;
