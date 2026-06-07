const Groq = require('groq-sdk');

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY não configurada no backend (.env).');
  }
  return new Groq({ apiKey });
}

/**
 * Gera resposta usando Groq.
 * Retorna texto puro.
 */
async function chatCompletion({
  model,
  message,
  temperature,
  max_completion_tokens,
  timeoutMs,
}) {
  const client = getGroqClient();

  const effectiveTimeoutMs = Number(timeoutMs ?? process.env.GROQ_TIMEOUT_MS ?? 30000);

  // Evitar 413 / rate_limit_exceeded por excesso de tokens
  // (Groq pode bloquear por TPM e "Requested" maior que o limite do modelo na tier on_demand)
  const maxChars = Number(process.env.GROQ_MAX_PROMPT_CHARS ?? 6000);
  const safeMessage = typeof message === 'string' ? message.slice(0, maxChars) : '';

  let timeoutHandle;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new Error(`Timeout ao chamar Groq após ${effectiveTimeoutMs}ms.`));
    }, effectiveTimeoutMs);
  });

  try {
    const completion = await Promise.race([
      client.chat.completions.create({
        model: model || 'openai/gpt-oss-120b',
        messages: [{ role: 'user', content: safeMessage }],
        temperature: temperature ?? 1,
        // Reduzir default para diminuir risco de ultrapassar limites de tokens/tpm
        max_completion_tokens: max_completion_tokens ?? Number(process.env.GROQ_MAX_COMPLETION_TOKENS ?? 2048),
      }),
      timeoutPromise,
    ]);

    const text = completion?.choices?.[0]?.message?.content;
    if (!text) {
      throw new Error('Resposta inválida da IA (sem content na escolha[0]).');
    }

    return text;
  } finally {
    if (timeoutHandle) clearTimeout(timeoutHandle);
  }
}


module.exports = {
  chatCompletion,
};

