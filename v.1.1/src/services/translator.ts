// Local translator using algorithmic rules, root dictionaries, and available dictionary parts.

let dictionary: Set<string> | null = null;
let isLoading = false;

// Determine environment
const isBrowser = typeof window !== 'undefined';

// Common Greek roots for Ѳ (Fita)
const greekRootsFita = ['арифмет', 'федор', 'афин', 'орфограф', 'миф', 'эфир', 'пафос', 'кафолич', 'акафист', 'голгоф', 'марафон', 'рифм', 'тимофе', 'марф', 'агаф'];

// Common roots with Ѣ (Yat)
const yatRoots = [
  'лѣс', 'видѣ', 'сидѣ', 'вѣст', 'послѣ', 'бѣг', 'бѣл', 'вѣд', 'вѣр', 
  'вѣт', 'гнѣв', 'грѣх', 'дѣл', 'дѣт', 'жѣл', 'звѣр', 'мѣр', 'мѣс', 'мѣст', 
  'нѣт', 'пѣн', 'пѣс', 'рѣк', 'рѣч', 'рѣш', 'сѣв', 'сѣм', 'сѣн', 'тѣл', 
  'цвѣт', 'цѣл', 'цѣн', 'ѣзд', 'ѣх', 'хлѣб', 'свѣт', 'снѣг', 'обѣд', 'отвѣт', 'привѣт',
  'совѣт', 'завѣт', 'вѣк', 'рѣдк', 'крѣпк', 'лѣв', 'мѣд', 'плѣн', 'тѣсн', 'цѣп',
  'лѣкар', 'лѣч', 'стрѣл', 'дѣгот', 'вѣтр', 'зрѣ', 'мѣн', 'тѣлег', 'свѣж', 'сосѣд',
  'бѣд', 'лѣт', 'человѣк', 'тѣн', 'нѣб', 'надѣ'
];

const keepOgoList = [
  'этого', 'того', 'кого', 'чего', 'самого', 'моего', 'твоего', 'своего', 'нашего', 'вашего', 'всего', 'много',
  'большого', 'такого', 'какого', 'другого', 'любого', 'второго', 'простого', 'пустого', 'чужого', 'святого',
  'слепого', 'глухого', 'немого', 'родного', 'больного', 'золотого', 'молодого', 'морского', 'городского',
  'дорогого', 'живого', 'дурного', 'худого', 'крутого', 'сухого', 'сырого', 'прямого', 'кривого', 'косого',
  'густого', 'частого', 'людского', 'мужского', 'женского', 'лесного', 'ночного', 'дневного', 'земного'
];

const exactWordMap: Record<string, string> = {
  // Overrides based on user feedback (strictly no yat)
  'петь': 'петь',
  'песни': 'песни',
  'песня': 'песня',
  'песен': 'песенъ',
  'пел': 'пелъ',
  'пела': 'пела',
  'пели': 'пели',
  'пело': 'пело',
  'иметь': 'имѣть', // User didn't ban иметь
  'имеет': 'имѣетъ',
  'имеют': 'имѣютъ',
  'зреть': 'зрѣть',
  'зреет': 'зрѣетъ',
  'зреют': 'зрѣютъ',
  'созрел': 'созрѣлъ',
  'тех': 'техъ',
  'лебедь': 'лебедь',
  'лебедя': 'лебедя',
  'лебедю': 'лебедю',
  'лебедем': 'лебедемъ',
  'лебеде': 'лебеде',
  'лебеди': 'лебеди',
  'лебедей': 'лебедей',
  'велел': 'велелъ',
  'велела': 'велела',
  'велело': 'велело',
  'велели': 'велели',
  'село': 'село',
  'села': 'села',
  'селу': 'селу',
  'селом': 'селомъ',
  'селе': 'селе',
  'цвел': 'цвелъ',
  'цвела': 'цвела',
  'цвело': 'цвело',
  'цвели': 'цвели',
  'весь': 'весь',
  'вся': 'вся',
  'всю': 'всю',
  'всей': 'всей',
  'берег': 'берегъ',
  'берега': 'берега',
  'берегу': 'берегу',
  'берегом': 'берегомъ',
  'береге': 'береге',
  'берегах': 'берегахъ',
  'лети': 'лети',
  'летит': 'летитъ',
  'летят': 'летятъ',
  'лететь': 'летѣть',
  'летел': 'летелъ',
  'летела': 'летѣла',
  'летели': 'летѣли',
  'разлетелась': 'разлетѣлась',
  'разлетелись': 'разлетѣлись',
  'его': 'его',
  'него': 'него',
  'её': 'её',
  'неё': 'неё',
  'нем': 'немъ',
  'ел': 'ѣлъ',
  'ела': 'ѣла',
  'ело': 'ѣло',
  'ели': 'ѣли',
  'теплее': 'теплѣе',
  'арсений': 'Арсѣній',
  'арсения': 'Арсѣнія',
  'арсению': 'Арсѣнію',
  'арсением': 'Арсѣніемъ',
  'арсении': 'Арсѣніи',
  'алексей': 'Алексѣй',
  'алексея': 'Алексѣя',
  'алексеем': 'Алексѣемъ',
  'алексею': 'Алексѣю',
  'алексее': 'Алексѣе',
  'сергей': 'Сергѣй',
  'сергея': 'Сергѣя',
  'сергеем': 'Сергѣемъ',
  'сергею': 'Сергѣю',
  'матвей': 'Матвѣй',
  'матвея': 'Матвѣя',
  'матвеем': 'Матвѣемъ',
  'андрей': 'Андрѣй',
  'андрея': 'Андрѣя',
  'андреем': 'Андрѣемъ',
  'глеб': 'Глѣбъ',
  'глеба': 'Глѣба',
  'глебом': 'Глѣбомъ',
  'глебу': 'Глѣбу',
  // Words with yat that might be missed or don't need suffix processing
  'деготь': 'дѣготь',
  'дёготь': 'дѣготь',
  'мед': 'мёдъ',
  'мёд': 'мёдъ',
  'лекарь': 'лѣкарь',

  // Semantics and exceptions
  'есть': 'есть', // Is/exists (not eating)
  'ест': 'ѣстъ', // Eats
  'этого': 'этого', // Pronouns don't change -ого to -аго
  'того': 'того',
  'кого': 'кого',
  'чего': 'чего',
  'самого': 'самого',
  'моего': 'моего',
  'твоего': 'твоего',
  'своего': 'своего',
  'нашего': 'нашего',
  'вашего': 'вашего',
  'всего': 'всего',
  'много': 'много',
  'все': 'всѣ',
  'всех': 'всѣхъ',
  'всем': 'всѣмъ',
  'всеми': 'всѣми',
  'те': 'тѣ',
  'тем': 'тѣмъ', // Unless pronoun (handled below if needed, but defaults to ѣ)
  'мне': 'мнѣ',
  'тебе': 'тебѣ',
  'себе': 'себѣ',
  'где': 'гдѣ',
  'здесь': 'здѣсь',
  'нет': 'нѣтъ',
  'две': 'двѣ',
  'вместе': 'вмѣстѣ',
  'федор': 'Ѳеодоръ',
  'федора': 'Ѳеодора',
  'фёдор': 'Ѳеодоръ',
  'фёдора': 'Ѳеодора',
  'арифметике': 'ариѳметикѣ',
  'арифметика': 'ариѳметика',
  'после': 'послѣ'
};

export async function initDictionary() {
  if (dictionary || isLoading) return;
  isLoading = true;
  dictionary = new Set();

  try {
    const results: string[] = [];
    
    if (isBrowser) {
      const promises = [];
      for (let i = 1; i <= 29; i++) {
        promises.push(
          fetch(`/dictionaries/ru-petr1708-hunspell-3.1/ru_petr1708/part_${i}.txt`)
            .then(res => res.ok ? res.text() : "")
            .catch(() => "")
        );
      }
      const texts = await Promise.all(promises);
      results.push(...texts);
    } else {
      // Node.js environment - use dynamic imports for fs/path
      const fs = await import('fs');
      const path = await import('path');
      for (let i = 1; i <= 29; i++) {
        const filePath = path.join(process.cwd(), 'public', 'dictionaries', 'ru-petr1708-hunspell-3.1', 'ru_petr1708', `part_${i}.txt`);
        if (fs.existsSync(filePath)) {
          results.push(fs.readFileSync(filePath, 'utf-8'));
        }
      }
    }

    for (const text of results) {
      if (!text) continue;
      const words = text.split(/[\r\n]+/);
      for (const word of words) {
        const trimmed = word.trim().toLowerCase();
        if (trimmed) {
          dictionary.add(trimmed);
        }
      }
    }
    console.log(`Loaded ${dictionary.size} words into the dictionary.`);
  } catch (error) {
    console.error("Failed to load dictionary parts:", error);
  } finally {
    isLoading = false;
  }
}

function matchCase(original: string, translated: string): string {
  if (original === original.toUpperCase() && original.length > 1) {
    return translated.toUpperCase();
  }
  if (original[0] === original[0].toUpperCase()) {
    return translated.charAt(0).toUpperCase() + translated.slice(1);
  }
  return translated;
}

function getBaseForms(word: string): string[] {
  const forms = new Set<string>();
  
  let res = word;
  
  // 1. 'и' -> 'і' before vowels and 'й'
  // ѣ, і, ѵ are vowels. But usually words like 'имѣть' don't get 'і' because 'м' is consonant.
  res = res.replace(/и([аеёиоуыэюяйѣіѵ])/g, 'і$1');

  // 2. Prefixes
  res = res.replace(/^бес([пфктшсчщцх])/g, 'без$1');
  res = res.replace(/^рас([пфктшсчщцх])/g, 'раз$1');
  res = res.replace(/^вос([пфктшсчщцх])/g, 'воз$1');
  res = res.replace(/^нис([пфктшсчщцх])/g, 'низ$1');
  res = res.replace(/^черес([пфктшсчщцх])/g, 'через$1');

  // 3. Hard sign
  if (/[бвгджзклмнпрстфхцшщ]$/.test(res)) {
    res += 'ъ';
  }

  forms.add(res);

  // 4. Adjective endings variants (we generate both to let the dictionary decide if it's an adjective or noun)
  let adjRes = res;
  if (!['его', 'него', 'егоъ', 'негоъ'].includes(adjRes)) {
    if (adjRes.endsWith('огоъ')) adjRes = adjRes.replace(/огоъ$/, 'агоъ');
    else if (adjRes.endsWith('ого')) adjRes = adjRes.replace(/ого$/, 'аго');
    
    if (adjRes.endsWith('егоъ')) adjRes = adjRes.replace(/егоъ$/, 'ягоъ');
    else if (adjRes.endsWith('его')) adjRes = adjRes.replace(/его$/, 'яго');
  }
  
  if (adjRes.endsWith('ые')) adjRes = adjRes.replace(/ые$/, 'ыя');
  if (adjRes.endsWith('іе')) adjRes = adjRes.replace(/іе$/, 'ія'); // 'ие' became 'іе'

  forms.add(adjRes);

  return Array.from(forms);
}

function getPermutations(str: string): string[] {
  if (str.length === 0) return [''];
  const firstChar = str[0];
  const restPerms = getPermutations(str.slice(1));
  
  const variants = [firstChar];
  if (firstChar === 'е') variants.push('ѣ');
  if (firstChar === 'ф') variants.push('ѳ');

  const result: string[] = [];
  for (const v of variants) {
    for (const rp of restPerms) {
      result.push(v + rp);
    }
  }
  return result;
}

export async function translateToPreRevolutionary(text: string): Promise<string> {
  if (!text.trim()) return "";
  
  if (!dictionary) {
    await initDictionary();
  }

  const tokens = text.split(/([а-яА-ЯёЁіІiI\u0456\u0406\u0472\u0473]+)/);
  
  const translatedTokens = tokens.map((token, index) => {
    if (!/[а-яА-ЯёЁіІiI\u0456\u0406\u0472\u0473]/.test(token)) {
      return token;
    }

    const lowerToken = token.toLowerCase();
    const normalizedToken = lowerToken.replace(/[iIіІ\u0456\u0406]/g, 'и');

    // Contextual homophones
    const prevWord = (index >= 2) ? tokens[index - 2].toLowerCase() : '';
    const prevWord2 = (index >= 4) ? tokens[index - 4].toLowerCase() : '';
    const nextWord = (index + 2 < tokens.length) ? tokens[index + 2].toLowerCase() : '';

    if (['мир', 'мира', 'миру', 'миром', 'мире', 'миры', 'миров'].includes(normalizedToken)) {
      // By default, assuming "world/society" is slightly more common in texts about the world,
      // but 'peace' is historically very common.
      const isWorldTrigger = ['в', 'въ', 'над', 'по', 'весь', 'этом', 'этомъ', 'о', 'об'].includes(prevWord);
      const isPeaceTrigger = ['сохранить', 'иметь', 'имѣть', 'заключить', 'война', 'нет', 'нѣтъ', 'хочет', 'хочетъ', 'хотят', 'хотятъ', 'нужен', 'нуженъ', 'жаждет', 'жаждетъ'].includes(prevWord) || 
                             ['верит', 'вѣритъ', 'хочет', 'хочетъ'].includes(prevWord2) ||
                             ['в', 'въ', 'с', 'съ', 'и'].includes(nextWord) && !isWorldTrigger;
                             
      let isPeace = isPeaceTrigger || (!isWorldTrigger && normalizedToken === 'мир' && prevWord === ''); // heuristic
      
      // Specifically catch "мир во всем мире" -> "миръ" + "мірѣ"
      const nextWord2 = (index + 4 < tokens.length) ? tokens[index + 4].toLowerCase() : '';
      if (normalizedToken === 'мир' && (nextWord === 'во' || nextWord === 'во') && ['всем', 'всём'].includes(nextWord2)) {
         isPeace = true;
      }
      if (normalizedToken === 'мире' && ['всем', 'всём'].includes(prevWord)) {
         // usually refers to the world in "во всем мире"
         isPeace = false;
      }

      let res = isPeace ? 'мир' : 'мір';
      if (normalizedToken === 'мир') res += 'ъ';
      else if (normalizedToken === 'мире') res += 'ѣ';
      else if (normalizedToken === 'миром') res += 'омъ';
      else if (normalizedToken === 'миров') res += 'овъ';
      else res += normalizedToken.slice(3); // -а, -у, -ы

      return matchCase(token, res);
    }

    if (lowerToken === 'чем' || lowerToken === 'чём') {
      // If preceded by a preposition, it's a pronoun (чѣмъ). Otherwise it's a conjunction (чемъ).
      if (['с', 'съ', 'о', 'об', 'за', 'перед', 'пред', 'над', 'надъ', 'при'].includes(prevWord)) {
        return matchCase(token, 'чѣмъ');
      }
      return matchCase(token, 'чемъ');
    }
    
    if (lowerToken === 'кем') return matchCase(token, 'кѣмъ');
    
    // 1. Exact map for semantics and pronouns
    if (exactWordMap[lowerToken]) {
      return matchCase(token, exactWordMap[lowerToken]);
    }

    // 2. Generate base forms (handling 'і', prefixes, 'ъ', and optional adjective endings)
    const baseForms = getBaseForms(lowerToken);
    
    const isLocative = ['в', 'въ', 'на', 'о', 'об', 'объ', 'при'].includes(prevWord);
    if (isLocative && lowerToken.length > 2) {
      const baseFormCount = baseForms.length;
      for (let i = 0; i < baseFormCount; i++) {
        if (baseForms[i].endsWith('е')) {
          baseForms.push(baseForms[i].slice(0, -1) + 'ѣ');
        }
      }
    }
    
    if (dictionary && dictionary.size > 0) {
      const allCandidates = new Set<string>();
      
      // Generate all permutations of 'е'->'ѣ' and 'ф'->'ѳ' for all base forms
      for (const base of baseForms) {
        const perms = getPermutations(base);
        for (const p of perms) allCandidates.add(p);
      }
      
      const candidates = Array.from(allCandidates);
      
      // Sort candidates to prioritize historical spellings (ѣ, ѳ, і)
      candidates.sort((a, b) => {
        const aScore = (a.match(/[ѣѳі]/g) || []).length;
        const bScore = (b.match(/[ѣѳі]/g) || []).length;
        return bScore - aScore;
      });

      // Find the first candidate that exists in the dictionary
      for (const candidate of candidates) {
        if (dictionary.has(candidate)) {
          return matchCase(token, candidate);
        }
      }
    }

    // 3. Fallback if dictionary fails or word is missing
    // We use the base form with adjective endings applied, unless it's a known pronoun or stressed -ого
    let fallback = baseForms[baseForms.length - 1]; 
    
    const keepOgoList = [
      'этого', 'того', 'кого', 'чего', 'самого', 'моего', 'твоего', 'своего', 'нашего', 'вашего', 'всего', 'много',
      'большого', 'такого', 'какого', 'другого', 'любого', 'второго', 'простого', 'пустого', 'чужого', 'святого',
      'слепого', 'глухого', 'немого', 'родного', 'больного', 'золотого', 'молодого', 'морского', 'городского',
      'дорогого', 'живого', 'дурного', 'худого', 'крутого', 'сухого', 'сырого', 'прямого', 'кривого', 'косого',
      'густого', 'частого', 'людского', 'мужского', 'женского', 'лесного', 'ночного', 'дневного', 'земного'
    ];
    
    if (keepOgoList.includes(lowerToken)) {
      fallback = baseForms[0]; // Revert adjective endings for pronouns and stressed -ого
    }

    if (isLocative && fallback.endsWith('е') && fallback.length > 2) {
      fallback = fallback.slice(0, -1) + 'ѣ';
    }
    
    // Attempt comparative forms -ее -> -ѣе (simple heuristic if length > 4)
    if (fallback.endsWith('ее') && fallback.length > 4 && !['более', 'менее', 'далее'].includes(fallback)) {
       // Wait, более, менее, далее have ѣ: болѣе, менѣе, далѣе.
       // So actually, just do this for all fallback > 4?
       // e.g. теплее -> теплѣе.
       // Actually 'более' is 'болѣе'. 
       fallback = fallback.slice(0, -2) + 'ѣе';
    }

    // Apply heuristic root replacements
    for (const root of yatRoots) {
      const modernRoot = root.replace(/ѣ/g, 'е');
      if (fallback.includes(modernRoot)) {
        fallback = fallback.replace(new RegExp(modernRoot, 'g'), root);
      }
    }
    for (const root of greekRootsFita) {
      if (fallback.includes(root)) {
        fallback = fallback.replace(new RegExp(root.replace('ф', 'ф'), 'g'), root.replace('ф', 'ѳ'));
      }
    }
    
    return matchCase(token, fallback);
  });

  return translatedTokens.join('');
}
