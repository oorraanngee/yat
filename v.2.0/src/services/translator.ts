// Local translator using algorithmic rules, root dictionaries, and available dictionary parts.

let dictionary: Set<string> | null = null;
let isLoading = false;
let loadingPromise: Promise<void> | null = null;

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
  'бѣд', 'лѣт', 'человѣк', 'тѣн', 'нѣб', 'надѣ', 'аптѣк', 'вѣн', 'сомнѣ'
];

const keepOgoList = [
  'его', 'него', 'кого', 'чего', 'самого', 'моего', 'твоего', 'своего', 'нашего', 'вашего', 'всего', 'ничего',
  'этого', 'того', 'много', 'немного', 'другого', 'самогó'
];

const exactWordMap: Record<string, string> = {
  // Overrides based on user feedback (strictly no yat)
  'петь': 'пѣть',
  'песни': 'пѣсни',
  'песня': 'пѣсня',
  'песен': 'пѣсенъ',
  'пел': 'пѣлъ',
  'пела': 'пѣла',
  'пели': 'пѣли',
  'пело': 'пѣло',
  'иметь': 'имѣть',
  'имеет': 'имѣетъ',
  'имеют': 'имѣютъ',
  'зреть': 'зрѣть',
  'зреет': 'зрѣетъ',
  'зреют': 'зрѣютъ',
  'созрел': 'созрѣлъ',
  'неужели': 'неужели',
  'неужелиъ': 'неужели',
  'который': 'коій',
  'которого': 'коего',
  'которому': 'коему',
  'которым': 'коимъ',
  'котором': 'коемъ',
  'которые': 'кои',
  'которых': 'коихъ',
  'которыми': 'коими',
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
  'арсений': 'Арсеньевъ', // Corrected name structure
  'арсеньев': 'Арсеньевъ',
  'алексей': 'Алексѣй',
  'алексея': 'Алексѣя',
  'алексеем': 'Алексѣемъ',
  'алексею': 'Алексѣю',
  'алексее': 'Алексѣе',
  'небо': 'небо',
  'неба': 'неба',
  'небу': 'небу',
  'небом': 'небомъ',
  'небе': 'нѣбѣ',
  'небеса': 'небеса',
  'небесах': 'небесахъ',
  'синее': 'синее',
  'синія': 'синія',
  'море': 'море',
  'полёт': 'полетъ',
  'полет': 'полетъ',
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
  'деготь': 'дѣготь',
  'дёготь': 'дѣготь',
  'мед': 'мёдъ',
  'мёд': 'мёдъ',
  'лекарь': 'лѣкарь',

  // Semantics and exceptions
  'есть': 'есть', 
  'ест': 'ѣстъ', 
  'все': 'всѣ',
  'всех': 'всѣхъ',
  'всем': 'всѣмъ',
  'всеми': 'всѣми',
  'те': 'тѣ',
  'тем': 'тѣмъ', 
  'мне': 'мнѣ',
  'тебе': 'тебѣ',
  'себе': 'себѣ',
  'где': 'гдѣ',
  'здесь': 'здѣсь',
  'нет': 'нѣтъ',
  'две': 'двѣ',
  'вместе': 'вмѣстѣ',
  'федор': 'Ѳедоръ',
  'федора': 'Ѳедора',
  'фёдор': 'Ѳедоръ',
  'фёдора': 'Ѳедора',
  'арифметике': 'ариѳметикѣ',
  'арифметика': 'ариѳметика',
  'после': 'послѣ',
  'вену': 'Вѣну',
  'вена': 'Вѣна',
  'сердце': 'сердце',
  'музыке': 'музыкѣ',
  'музыки': 'музыки',
  'музыка': 'музыка'
};

export async function initDictionary() {
  if (dictionary) return;
  if (isLoading) return loadingPromise || Promise.resolve();
  
  isLoading = true;
  loadingPromise = (async () => {
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
        results.push(...(await Promise.all(promises)));
      } else {
        const fs = await import('fs');
        const path = await import('path');
        const cwd = process.cwd();
        const possiblePaths = [
          path.join(cwd, 'public', 'dictionaries', 'ru-petr1708-hunspell-3.1', 'ru_petr1708'),
          path.join(cwd, 'dictionaries', 'ru-petr1708-hunspell-3.1', 'ru_petr1708'),
        ];
        for (let i = 1; i <= 29; i++) {
          const fileName = `part_${i}.txt`;
          for (const basePath of possiblePaths) {
            const filePath = path.join(basePath, fileName);
            if (fs.existsSync(filePath)) {
              results.push(fs.readFileSync(filePath, 'utf-8'));
              break;
            }
          }
        }
      }
      for (const text of results) {
        if (!text) continue;
        for (let word of text.split(/[\r\n]+/)) {
          const trimmed = word.trim().toLowerCase();
          if (trimmed) dictionary.add(trimmed);
        }
      }
    } catch (error) {
      console.error("Failed to load dictionary:", error);
    } finally {
      isLoading = false;
      loadingPromise = null;
    }
  })();
  return loadingPromise;
}

function matchCase(original: string, translated: string): string {
  if (original === original.toUpperCase() && original.length > 1) return translated.toUpperCase();
  if (original[0] === original[0].toUpperCase()) return translated.charAt(0).toUpperCase() + translated.slice(1);
  return translated;
}

function getBaseForms(word: string): string[] {
  const forms = new Set<string>();
  let res = word;
  res = res.replace(/и([аеёиоуыэюяйѣіѵ])/g, 'і$1');
  res = res.replace(/^бес(?=[пфктшсчщцх])/g, 'без');
  res = res.replace(/^рас(?=[пфктшсчщцх])/g, 'раз');
  res = res.replace(/^вос(?=[пфктшсчщцх])/g, 'воз');
  res = res.replace(/^нис(?=[пфктшсчщцх])/g, 'низ');
  res = res.replace(/^черес(?=[пфктшсчщцх])/g, 'через');
  if (/[бвгджзклмнпрстфхцшщч]$/.test(res)) res += 'ъ';
  forms.add(res);
  
  let adjRes = res;
  // Neuter singular nouns ending in -ie should NOT be changed to -ia
  const neuterSingularEnding = /([а-яё])іеъ?$/i.test(adjRes);
  const isPronoun = ['его', 'него', 'егоъ', 'негоъ', 'того', 'кого', 'чего', 'самогó', 'самого'].includes(adjRes);

  if (!isPronoun && !neuterSingularEnding) {
    if (adjRes.endsWith('огоъ')) adjRes = adjRes.replace(/огоъ$/, 'агоъ');
    else if (adjRes.endsWith('ого')) adjRes = adjRes.replace(/ого$/, 'аго');
    if (adjRes.endsWith('егоъ')) adjRes = adjRes.replace(/егоъ$/, 'ягоъ');
    else if (adjRes.endsWith('его')) adjRes = adjRes.replace(/его$/, 'яго');
  }
  
  // Plural Adjectives/Participial forms: non-masculine
  if (!neuterSingularEnding) {
    if (adjRes.endsWith('ые')) adjRes = adjRes.replace(/ые$/, 'ыя');
    if (adjRes.endsWith('іе')) adjRes = adjRes.replace(/іе$/, 'ія');
    if (adjRes.endsWith('ие')) adjRes = adjRes.replace(/ие$/, 'ія');
  }
  
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
    for (const rp of restPerms) result.push(v + rp);
  }
  return result;
}

export async function translateToPreRevolutionary(text: string): Promise<string> {
  if (!text.trim()) return "";
  if (!dictionary) await initDictionary();
  const tokens = text.split(/([а-яА-ЯёЁіІiI\u0456\u0406\u0472\u0473]+)/);
  const translatedTokens = tokens.map((token, index) => {
    if (!/[а-яА-ЯёЁіІiI\u0456\u0406\u0472\u0473]/.test(token)) return token;
    const lowerToken = token.toLowerCase();
    const normalizedToken = lowerToken.replace(/[iIіІ\u0456\u0406]/g, 'и');

    const prevWord = (index >= 2) ? tokens[index - 2].toLowerCase() : '';
    const prevWord2 = (index >= 4) ? tokens[index - 4].toLowerCase() : '';
    const nextWord = (index + 2 < tokens.length) ? tokens[index + 2].toLowerCase() : '';

    if (normalizedToken === 'чем' || normalizedToken === 'чём') {
      return matchCase(token, 'чѣмъ');
    }

    if (normalizedToken === 'есть') {
      const eatContext = ['хочу', 'хочетъ', 'хотятъ', 'хотимъ', 'желаю', 'буду', 'будетъ', 'будемъ', 'люблю', 'любитъ', 'дайте', 'давай', 'даш', 'совет', 'совѣт', 'надо', 'нужно', 'приказ', 'проси', 'меньше', 'мѣньш', 'больше'];
      const isEat = eatContext.some(word => prevWord.includes(word) || prevWord2.includes(word));
      return matchCase(token, isEat ? 'ѣсть' : 'есть');
    }

    if (['синее', 'море', 'морем', 'морю', 'моря', 'синему', 'синим', 'синем'].includes(normalizedToken)) {
      let r = normalizedToken;
      if (/[бвгджзклмнпрстфхцшщ]$/.test(r)) r += 'ъ';
      return matchCase(token, r);
    }

    if (['мир', 'мира', 'миру', 'миром', 'мире', 'миры', 'миров'].includes(normalizedToken)) {
      const worldContext = ['в', 'въ', 'во', 'над', 'по', 'весь', 'всего', 'всему', 'всем', 'всѣмъ', 'этом', 'этомъ', 'тот', 'тотъ', 'о', 'об', 'через', 'созданіе', 'твореніе', 'конец', 'концѣ', 'сторона', 'страна', 'государство', 'населеніе', 'люди', 'война', 'и', 'или', 'поэт', 'поэты', 'поэтовъ', 'художник', 'писатель', 'творец', 'человѣкъ', 'образованіе', 'наука'];
      let isWorld = worldContext.includes(prevWord) || worldContext.includes(nextWord) || worldContext.includes(prevWord2);
      const fullPhrase = (prevWord + ' ' + normalizedToken + ' ' + nextWord).trim();
      if (fullPhrase.includes('во всем мире') || fullPhrase.includes('во всемъ мире') || fullPhrase.includes('во всемъ міре') || fullPhrase.includes('в этом мире')) isWorld = true;
      if (fullPhrase.includes('мир во всем') || fullPhrase.includes('миръ во всемъ')) isWorld = false;
      let res = isWorld ? 'мір' : 'мир';
      if (normalizedToken === 'мир') res += 'ъ';
      else if (normalizedToken === 'мире') res += 'ѣ';
      else if (normalizedToken === 'миром') res += 'омъ';
      else if (normalizedToken === 'миров') res += 'овъ';
      else res += normalizedToken.slice(3);
      return matchCase(token, res);
    }

    if (lowerToken === 'чем' || lowerToken === 'чём') {
      if (['с', 'съ', 'о', 'об', 'за', 'перед', 'пред', 'над', 'надъ', 'при'].includes(prevWord)) return matchCase(token, 'чѣмъ');
      return matchCase(token, 'чемъ');
    }
    if (lowerToken === 'кем') return matchCase(token, 'кѣмъ');
    if (exactWordMap[lowerToken]) return matchCase(token, exactWordMap[lowerToken]);

    const baseForms = getBaseForms(normalizedToken);
    const isLocativeContext = ['в', 'въ', 'на', 'о', 'об', 'объ', 'при'].includes(prevWord) || (['в', 'въ', 'на', 'о', 'об', 'объ', 'при'].includes(prevWord2) && (prevWord.endsWith('ом') || prevWord.endsWith('омъ') || prevWord.endsWith('ой') || prevWord.endsWith('ей')));
    const isEnievSurname = lowerToken.endsWith('еньев') || lowerToken.endsWith('еньева') || lowerToken.endsWith('еньеву') || lowerToken.endsWith('еньевом') || lowerToken.endsWith('еньеве');

    if (isLocativeContext && lowerToken.length > 2 && !isEnievSurname) {
      for (let i = 0; i < baseForms.length; i++) {
        const b = baseForms[i];
        if (b.endsWith('е') && !b.endsWith('ие') && !b.endsWith('ье')) baseForms.push(b.slice(0, -1) + 'ѣ');
      }
    }

    if (dictionary && dictionary.size > 0) {
      const allCandidates = new Set<string>();
      for (const base of baseForms) {
        if (isEnievSurname) {
          const root = base.slice(0, -6);
          const suffix = base.slice(-6);
          for (const p of getPermutations(root)) allCandidates.add(p + suffix);
        } else {
          for (const p of getPermutations(base)) allCandidates.add(p);
        }
      }
      const scoredCandidates = Array.from(allCandidates).map(c => {
        let score = 0;
        let rootMatch = false;
        for (const root of yatRoots) {
          if (c.includes(root)) { rootMatch = true; score += 50; break; }
        }
        score += (c.match(/[ѣѳіѵ]/g) || []).length * 10;
        if (c.endsWith('ыя') || c.endsWith('ія') || c.endsWith('аго') || c.endsWith('яго')) score += 5;
        if (c.endsWith('ъ')) score += 1;
        if (c.endsWith('ѣ') && !isLocativeContext) score -= 100;
        if (c.includes('ѣт') && !rootMatch) score -= 40;
        if (c.startsWith('прѣ') && !rootMatch) score -= 100; // Penalize prefix-like Yat if not in roots
        return { text: c, score };
      }).sort((a,b) => b.score - a.score);
      for (const cand of scoredCandidates) {
        if (dictionary.has(cand.text)) return matchCase(token, cand.text);
      }
    }

    let fallback = baseForms[baseForms.length - 1];
    if (keepOgoList.includes(lowerToken)) fallback = baseForms[0];
    if (isLocativeContext && fallback.endsWith('е') && fallback.length > 2 && !fallback.endsWith('ие') && !fallback.endsWith('ье')) fallback = fallback.slice(0, -1) + 'ѣ';
    if (fallback.endsWith('ее') && fallback.length > 4) fallback = fallback.slice(0, -2) + 'ѣе';

    for (const root of yatRoots) {
      const m = root.replace(/ѣ/g, 'е');
      if (fallback.includes(m)) fallback = fallback.replace(new RegExp(m, 'g'), root);
    }
    for (const root of greekRootsFita) {
      const m = root.replace(/ѳ/g, 'ф');
      if (fallback.includes(m)) fallback = fallback.replace(new RegExp(m, 'g'), root);
    }
    return matchCase(token, fallback);
  });
  return translatedTokens.join('');
}

export async function translateToModern(text: string): Promise<string> {
  if (!text.trim()) return "";
  let res = text;
  const reverseExactMap: Record<string, string> = {
    'Ѳедоръ': 'Фёдор', 'Ѳедора': 'Фёдора', 'Ѳедору': 'Фёдору', 'Ѳедоромъ': 'Фёдором', 'Ѳедорѣ': 'Фёдоре',
    'Алексѣй': 'Алексей', 'Алексѣя': 'Алексея', 'Арсѣній': 'Арсений', 'Сергѣй': 'Сергей', 'Андрѣй': 'Андрей', 'Матвѣй': 'Матвей',
    'Глѣбъ': 'Глеб', 'Глѣба': 'Глеба', 'Филиппъ': 'Филипп', 'Ѳаддей': 'Фаддей', 'ариѳметика': 'арифметика', 'орѳографія': 'орфография',
    'эѳиръ': 'эфир', 'яго': 'его', 'ея': 'её', 'всѣ': 'все', 'тѣ': 'те', 'нѣтъ': 'нет', 'коій': 'который',
    'коего': 'которого', 'коему': 'которому', 'коимъ': 'которым', 'коемъ': 'котором', 'кои': 'которые',
    'коихъ': 'которых', 'коими': 'которыми', 'кафэ': 'кафе', 'ѣли': 'ели'
  };
  const tokens = res.split(/([а-яА-ЯёЁіІѣѢѳѲѵѴъЪ]+)/);
  res = tokens.map(token => {
    if (reverseExactMap[token]) return reverseExactMap[token];
    const lower = token.toLowerCase();
    if (reverseExactMap[lower]) return matchCase(token, reverseExactMap[lower]);
    return token;
  }).join('');
  res = res.replace(/([бвгджзклмнпрстфхцшщ])ъ+(?![а-яёіѣѳѵ])/gi, '$1');
  const preps: Record<string, string> = { 'въ': 'в', 'съ': 'с', 'къ': 'к', 'изъ': 'из', 'отъ': 'от', 'подъ': 'под', 'надъ': 'над', 'предъ': 'пред', 'объ': 'об', 'безъ': 'без', 'чрезъ': 'через', 'черезъ': 'через' };
  res = res.replace(/\b(въ|съ|къ|изъ|отъ|подъ|надъ|предъ|объ|безъ|чрезъ|черезъ)\b/gi, (m) => matchCase(m, preps[m.toLowerCase()] || m));
  res = res.replace(/([бвгджзклмнпрстфхцшщ])яго(?![а-яёіѣѳѵ])/gi, '$1его');
  res = res.replace(/([бвгджзклмнпрстфхцшщ])аго(?![а-яёіѣѳѵ])/gi, '$1ого');
  res = res.replace(/ыя(?![а-яёіѣѳѵ])/gi, 'ые');
  res = res.replace(/ія(?![а-яёіѣѳѵ])/gi, 'ие');
  const mapping: Record<string, string> = { 'і': 'и', 'І': 'И', 'ѣ': 'е', 'Ѣ': 'Е', 'ѳ': 'ф', 'Ѳ': 'Ф', 'ѵ': 'и', 'Ѵ': 'И' };
  res = res.replace(/[іІѣѢѳѲѵѴ]/g, (match) => mapping[match] || match);
  res = res.replace(/ъ\b/gi, '');
  return res;
}
