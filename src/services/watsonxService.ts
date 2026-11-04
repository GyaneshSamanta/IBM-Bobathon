import { AgentAssessmentResult, TelemetryContext } from '../types/copilot';
import { evaluateOfflineCopilot } from './mockWatsonxCopilot';

interface CachedToken {
  token: string;
  expiresAt: number;
}

let cachedIamToken: CachedToken | null = null;

async function getIamBearerToken(apiKey: string): Promise<string> {
  if (cachedIamToken && Date.now() < cachedIamToken.expiresAt - 60000) {
    return cachedIamToken.token;
  }

  // Use Vite proxy endpoint in dev or direct endpoint in prod
  const tokenUrl = import.meta.env.DEV ? '/api/ibm-iam/identity/token' : 'https://iam.cloud.ibm.com/identity/token';

  const params = new URLSearchParams();
  params.append('grant_type', 'urn:ibm:params:oauth:grant-type:apikey');
  params.append('apikey', apiKey);

  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: params.toString(),
  });

  if (!res.ok) {
    throw new Error(`IBM IAM authentication failed: ${res.statusText}`);
  }

  const data = await res.json();
  const token = data.access_token;
  const expiresIn = data.expires_in || 3600;

  cachedIamToken = {
    token,
    expiresAt: Date.now() + expiresIn * 1000,
  };

  return token;
}

export async function assessThreatSituation(
  userDistressText: string,
  context: TelemetryContext,
  isOnline: boolean = true
): Promise<AgentAssessmentResult> {
  const apiKey = import.meta.env.VITE_WATSONX_API_KEY;
  const projectId = import.meta.env.VITE_WATSONX_PROJECT_ID;
  const forceMock = import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true';

  // 1. If Offline or Mock explicitly forced or API keys not present: Use Deterministic Offline Copilot
  if (!isOnline || forceMock || !apiKey || !projectId) {
    console.log('[KAAVALU Copilot] Engaging 70% Deterministic Offline Intelligence Core.');
    return evaluateOfflineCopilot(userDistressText, context);
  }

  // 2. Online IBM watsonx.ai Granite Call
  try {
    const bearerToken = await getIamBearerToken(apiKey);
    const serviceUrl = import.meta.env.DEV
      ? '/api/watsonx/ml/v1/text/generation?version=2023-05-29'
      : `${import.meta.env.VITE_WATSONX_SERVICE_URL || 'https://us-south.ml.cloud.ibm.com'}/ml/v1/text/generation?version=2023-05-29`;

    const modelId = import.meta.env.VITE_WATSONX_MODEL_ID || 'ibm/granite-3-8b-instruct';

    const systemPrompt = `You are KAAVALU (ಕಾವಲು), an agentic night transit guardian for women in Bengaluru.
The user is walking alone at night and has reported a situational observation.
Active Telemetry:
- Location: ${context.currentPosition.lat.toFixed(4)}, ${context.currentPosition.lng.toFixed(4)}
- Nearest Sanctuaries: ${context.nearestSanctuaries.map((s) => `${s.name} (${s.type}, lit: ${s.lightingRating}/5)`).join('; ')}
- Preferred Language: ${context.preferredLanguage}

Respond ONLY in valid JSON matching this schema:
{
  "threatLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "threatCategory": "suspicious_vehicle" | "unlit_road" | "physical_pursuit" | "general_fear" | "medical_distress",
  "spokenAdvice": "Calming, direct advice in the user's preferred language (${context.preferredLanguage})",
  "tacticalAction": "Direct physical action instructing user to proceed towards the nearest sanctuary",
  "targetSanctuaryId": "${context.nearestSanctuaries[0]?.id || null}",
  "recommendedAction": "divert_to_sanctuary" | "continue_on_corridor" | "sound_alarm_and_sos",
  "structuredDispatchBrief": "Structured brief for family or emergency services",
  "confidenceScore": 0.95
}`;

    const promptInput = `${systemPrompt}\n\nUser distress report: "${userDistressText}"\nJSON Output:`;

    const response = await fetch(serviceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${bearerToken}`,
      },
      body: JSON.stringify({
        model_id: modelId,
        project_id: projectId,
        input: promptInput,
        parameters: {
          decoding_method: 'greedy',
          max_new_tokens: 350,
          temperature: 0.1,
          repetition_penalty: 1.05,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`watsonx API call returned ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.results?.[0]?.generated_text || '';

    // Extract JSON block
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]) as AgentAssessmentResult;
      parsed.timestamp = new Date().toISOString();
      return parsed;
    }

    throw new Error('Could not parse JSON from watsonx response');
  } catch (err) {
    console.warn('[KAAVALU Copilot] watsonx online call encountered error, falling back to local deterministic model:', err);
    return evaluateOfflineCopilot(userDistressText, context);
  }
}
