import { INTENTS, type Intent, type KAction, type Lang } from '../data/knowledge';

/**
 * Local retrieval engine for the portfolio agent.
 * - normalizes accents/punctuation, tolerates typos (edit distance ≤ 1–2)
 * - scores every intent, can answer two topics in one reply
 * - keeps context: "y en Azure?", "más detalles", "tell me more"
 */

export interface AgentReply {
  text: string;
  sources: string[];
  followups: { label: string; ask: string }[];
  actions: KAction[];
  intentIds: string[];
}

export const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[¿?¡!,;:()"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const STOP = new Set(
  'el la los las un una de del y o a en que es tu tus su sus mi me te se lo por para con como cual cuales sobre the a an of and or to in on is are your you do does what which how about with for my me i'.split(' ')
);

const lev = (a: string, b: string) => {
  if (Math.abs(a.length - b.length) > 2) return 3;
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length][b.length];
};

const tokenMatch = (tok: string, kw: string) => {
  if (tok === kw) return 2;
  if (kw.length >= 5 && tok.length >= 5 && (tok.startsWith(kw.slice(0, -1)) || kw.startsWith(tok.slice(0, -1)))) return 1.6;
  if (kw.length >= 5 && lev(tok, kw) <= (kw.length >= 8 ? 2 : 1)) return 1.3;
  return 0;
};

const scoreIntent = (intent: Intent, text: string, tokens: string[]) => {
  let score = 0;
  for (const kw of intent.keywords) {
    if (kw.includes(' ') || kw.includes('.')) {
      if (` ${text} `.includes(` ${kw} `) || text.includes(kw)) score += 3;
    } else {
      let best = 0;
      for (const t of tokens) best = Math.max(best, tokenMatch(t, kw));
      score += best;
    }
  }
  return score;
};

const FOLLOW_UP = /\b(mas|more|detalle|detalles|details|ejemplo|example|profundiza|elaborate|explica|explain|y eso|and that|cuentame mas|tell me more|amplia|continua|go on)\b/;
const CONTINUATION = /^(y|and|tambien|also|what about|y en|y con|and in|and with|y el|y la)\b/;

const byId = (id: string) => INTENTS.find((i) => i.id === id);

export const runAgent = (raw: string, lang: Lang, lastIntentIds: string[]): AgentReply => {
  const text = normalize(raw);
  const tokens = text.split(' ').filter((t) => t && !STOP.has(t));

  const ranked = INTENTS.map((intent) => ({ intent, score: scoreIntent(intent, text, tokens) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  const last = lastIntentIds.map(byId).filter(Boolean) as Intent[];

  // "tell me more" about whatever we were discussing
  if (last.length && FOLLOW_UP.test(text) && (!ranked.length || ranked[0].score < 2.5)) {
    const target = last[0];
    if (target.more) return build([target], lang, true);
    const next = (target.followups ?? []).map(byId).filter(Boolean) as Intent[];
    if (next.length) return build([next[0]], lang);
  }

  if (!ranked.length) {
    return {
      text:
        lang === 'es'
          ? 'No tengo ese dato en mi base de conocimiento, y prefiero no inventarlo. Puedo contarte sobre los agentes de IA de Brandon, su stack en Azure y GCP, sus proyectos o su disponibilidad.'
          : "I don't have that in my knowledge base, and I'd rather not make it up. I can tell you about Brandon's AI agents, his Azure and GCP stack, his projects or his availability.",
      sources: [],
      followups: ['eafit', 'tech', 'availability'].map((id) => chip(byId(id)!, lang)),
      actions: [],
      intentIds: [],
    };
  }

  const best = ranked[0];
  // Short continuation ("y en azure?") stays in context by preferring a related intent
  if (CONTINUATION.test(text) && last.length) {
    const related = ranked.find((r) => last[0].followups?.includes(r.intent.id));
    if (related && related.score >= best.score * 0.7) return build([related.intent], lang);
  }

  const picks = [best.intent];
  const second = ranked[1];
  if (
    second &&
    second.score >= 1.3 &&
    second.score >= best.score * 0.35 &&
    !['greeting', 'thanks'].includes(second.intent.id) &&
    !['greeting', 'thanks'].includes(best.intent.id)
  ) {
    picks.push(second.intent);
  }
  // A greeting plus a real question: answer the question
  if (best.intent.id === 'greeting' && second && second.score >= 2) picks.splice(0, 1, second.intent);

  return build(picks, lang);
};

const chip = (i: Intent, lang: Lang) => ({ label: i.chip[lang], ask: i.ask[lang] });

const build = (intents: Intent[], lang: Lang, deep = false): AgentReply => {
  const text = intents.map((i) => (deep && i.more ? i.more[lang] : i.answer[lang])).join('\n\n');
  const used = new Set(intents.map((i) => i.id));
  const followIds = intents.flatMap((i) => i.followups ?? []).filter((id) => !used.has(id));
  const followups = [...new Set(followIds)]
    .slice(0, 3)
    .map(byId)
    .filter(Boolean)
    .map((i) => chip(i as Intent, lang));
  if (!deep && intents[0].more) followups.unshift({ label: lang === 'es' ? 'Más detalle' : 'More detail', ask: lang === 'es' ? 'Cuéntame más' : 'Tell me more' });
  const actions = intents.flatMap((i) => i.actions ?? []).filter((a, idx, arr) => arr.findIndex((b) => b.kind === a.kind && b.target === a.target) === idx);
  return { text, sources: intents.map((i) => i.source[lang]), followups: followups.slice(0, 3), actions: actions.slice(0, 3), intentIds: intents.map((i) => i.id) };
};

/** Plan steps shown while the agent "works" — derived from the matched intents. */
export const planSteps = (reply: AgentReply, lang: Lang) => {
  const es = lang === 'es';
  const steps = [es ? 'Entendiendo la pregunta' : 'Understanding the question'];
  if (reply.sources.length) steps.push((es ? 'Consultando: ' : 'Retrieving: ') + reply.sources.join(', '));
  steps.push(es ? 'Redactando respuesta' : 'Writing the answer');
  return steps;
};
