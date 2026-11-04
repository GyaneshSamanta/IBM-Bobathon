# Task 5: IBM watsonx.ai Agentic Copilot Integration

## Context
When connected, KAAVALU engages its **30% Agentic AI Copilot** powered by **IBM watsonx.ai** and the **IBM Granite-3B** foundation model.
The agent performs:
1. Multi-lingual situational threat assessment (understands natural spoken Kannada, English, Hindi, and Nepali).
2. Dynamic Sanctuary Rerouting (directs the user to the nearest open, lit, staffed sanctuary).
3. Contextual Incident Dispatch composition.
4. **Deterministic Offline Fallback Engine** ensuring 100% uptime during Airplane Mode demos or when operating without an API key.

## Objective
Author the IBM watsonx.ai REST client, structured JSON output schema, multi-lingual prompt template, and resilient offline fallback engine.

---

## Prompt to Give to IBM Bob

```markdown
You are building Phase 5 of KAAVALU (ಕಾವಲು): IBM watsonx.ai Agentic Copilot.

Please implement the AI service in `src/services/watsonxCopilot.ts`:

1. Define Agent Types in `src/types/copilot.ts`:
   - `ThreatSeverity`: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
   - `AgentAssessmentResult`:
     - threatLevel: ThreatSeverity
     - threatCategory: 'suspicious_vehicle' | 'unlit_road' | 'physical_pursuit' | 'general_fear' | 'medical_distress'
     - spokenAdvice: string // Spoken back to user in their chosen language
     - tacticalAction: string // Specific physical instruction (e.g., "Enter Shell forecourt 50m right")
     - targetSanctuaryId: string | null
     - recommendedAction: 'divert_to_sanctuary' | 'continue_on_corridor' | 'sound_alarm_and_sos'
     - structuredDispatchBrief: string // Pre-composed summary for emergency contacts
     - confidenceScore: number

2. Author the System Prompt & Guardrails in `src/services/watsonxPrompts.ts`:
   - Prompt context: You are KAAVALU, an agentic civic safety sentinel for Bengaluru.
   - Guardrails:
     - Always return pure, valid JSON conforming to `AgentAssessmentResult`.
     - Output concise, calming, direct tactical advice (maximum 2 sentences). Never panic the user.
     - Support inputs in Kannada (ಕನ್ನಡ), English, Hindi (हिंदी), and Nepali (नेपाली).
     - Provide the `spokenAdvice` in the EXACT same language the user spoke or according to their active UI language.
     - Inject active telemetry into prompt: user coordinates, active corridor, nearest 3 sanctuaries from the local database.

3. Implement the IBM watsonx API Client in `src/services/watsonxService.ts`:
   - Environment variables:
     - `VITE_WATSONX_API_KEY`
     - `VITE_WATSONX_PROJECT_ID`
     - `VITE_WATSONX_SERVICE_URL` (default: `https://us-south.ml.cloud.ibm.com`)
     - `VITE_WATSONX_MODEL_ID` (default: `ibm/granite-3-8b-instruct`)
     - `VITE_ENABLE_MOCK_FALLBACK` (boolean)
   - Token Management:
     - Exchange IAM API key with `https://iam.cloud.ibm.com/identity/token` for Bearer token.
     - Cache the Bearer token in memory with expiry time.
     - Use proxy routes `/api/ibm-iam` and `/api/watsonx` in development to avoid CORS.
   - Text Generation Call:
     - Send prompt to `/ml/v1/text/generation?version=2023-05-29`.
     - Parameters: `decoding_method: "greedy"`, `max_new_tokens: 250`, `temperature: 0.1`.
     - Parse JSON output safely with regex extraction.

4. Implement Deterministic Offline Simulator Fallback in `src/services/mockWatsonxCopilot.ts`:
   - Must execute when:
     - Network is offline (`!navigator.onLine`).
     - Or `VITE_ENABLE_MOCK_FALLBACK === 'true'`.
     - Or API credentials are not set.
   - Realistic situational scenarios:
     - Trailing auto / vehicle (Kannada: "ಆಟೋ ಹಿಂದೆ ಬರ್ತಾ ಇದೆ" / Nepali: "गाडी पछ्याइरहेको छ" / Hindi: "ऑटो पीछे आ रहा है").
     - Unlit stretch ahead ("ಕತ್ತಲೆ ಇದೆ" / "अंधेरा है" / "dark road ahead").
     - Group of loiterers ("ಹುಡುಗರು ನಿಂತಿದ್ದಾರೆ" / "लोग खड़े हैं").
   - Returns the exact same structured `AgentAssessmentResult` within 200ms without making any HTTP request.
   - This ensures your live Airplane Mode hackathon demo NEVER fails.

5. Export the Unified Method:
   - `assessThreatSituation(userSpeechOrText: string, currentContext: TelemetryContext): Promise<AgentAssessmentResult>`
   - Automatically detects offline status or API availability and routes seamlessly.
```

---

## Verification Criteria
- [ ] `assessThreatSituation` handles Kannada, Nepali, Hindi, and English inputs.
- [ ] Returns valid `AgentAssessmentResult` with threat level, spoken advice, and tactical action.
- [ ] Seamlessly falls back to deterministic simulator when in Airplane Mode or when offline.
- [ ] Structured dispatch brief includes user location, battery, and sanctuary details.
