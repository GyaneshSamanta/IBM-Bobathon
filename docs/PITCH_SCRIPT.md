# KAAVALU (ಕಾವಲು) — Pitch Script

> **Challenge:** IBM Bobathon: Build for Bengaluru
> **Theme:** Theme 3: Safer Communities, Stronger Futures
> **Target timing:** 2 minutes 30 seconds
> **Synchronised with:** the 45-second built-in guided demo (Pitch button)

All figures below come from the generated data in `src/data/bengaluruCorridors.ts` and the README. watsonx is future scope only and is not part of the build. Do not claim it.

---

## Timeline

| Timestamp | Phase | On screen | Key message |
| :--- | :--- | :--- | :--- |
| 0:00 – 0:30 | The problem | Landing screen | People who finish late shifts guess whether the way home is safe |
| 0:30 – 0:55 | Two routes | Demo 1–2: search types, both routes appear | Shortest vs. safest, with the numbers |
| 0:55 – 1:25 | No signal | Demo 3–4: walk starts, outage banner | It all keeps working offline |
| 1:25 – 1:45 | Reaching a haven | Demo 5: arrival | Point people to places that are open and staffed |
| 1:45 – 2:15 | Honest build story | Corridors, limitations | Real OSM data, built with Bob, what is assumed |
| 2:15 – 2:30 | What's next | Roadmap | Shift-aware advice, then watsonx |

---

## Script

### [0:00 – 0:30] The problem
> "Good evening. This started at a momo stall. My favourite momo vendor told me the part of his day he dreads is the trip home. A worker at a shoe shop told me the same. They work in retail and food service, they close when the shop closes, and nobody gives them a cab.
>
> I asked how they decide whether the way home is safe. They look at their shift. They look at the day of the week, because Fridays are later and busier. Then they guess.
>
> A maps app does not help. It picks the shortest route, and at 11 pm the shortest route is the unlit lane. So I built **KAAVALU**, which picks the route by how well lit it is and how close it is to a place that is open and staffed, and keeps working with no signal. I built it with IBM Bob."

### [0:30 – 0:55] Two routes (demo steps 1 and 2)
*(Press the Pitch button. The search card is spotlighted. Origin and destination type themselves.)*

> "Here is a real walk: Indiranagar Metro to Defence Colony. The shortest route is the red dashed line, 1.5 kilometres, but only 46% of it is lit. The safe route is 1.96 kilometres and 98% lit. That is about six extra minutes.
>
> Unlit walking drops from 832 metres to 39. Across the six corridors I mapped, it drops 82%, from 4.6 kilometres to 0.8, for an average of 4.5 extra minutes. The street geometry and lighting tags are real OpenStreetMap data, not drawings."

### [0:55 – 1:25] No signal (demo steps 3 and 4)
*(Walk begins. The outage banner appears and the HUD turns red.)*

> "Now the signal drops, like it does under a flyover. Nothing on this screen needed the internet. The routes are stored on the phone. The assistant that reads a distress message in English, Kannada, Hindi or Nepali is a small set of rules, not a cloud model. If the walker stops for three minutes, or strays 35 metres off the route, a 30-second countdown starts and then the siren sounds. The SOS button opens the phone's own SMS app with the location, nearest haven and battery level already written. The user presses send. Nothing is sent without them."

### [1:25 – 1:45] Reaching a haven (demo step 5)
*(Puck reaches the haven. Chime plays.)*

> "The route points you toward a place that is open: a police station, or somewhere OpenStreetMap tags as 24/7 or emergency. Here it is Healing Hands Clinic. I kept this list short on purpose. A smaller list of places I can stand behind is better than a long one I cannot."

### [1:45 – 2:15] How it was built, and what is honest about it
> "Bob was my pair programmer. It helped me find a real bug: my 'shortest' route was sometimes not the shortest, because my hand-drawn data had segments shorter than the straight line between their ends, which breaks the search. Fixing that led me to throw out the hand-made data and write a generator that pulls real streets and lighting tags from OpenStreetMap.
>
> That also showed me a limit. Of eight candidate areas, Electronic City and Manyata had no real difference between lit and unlit streets, so I dropped them instead of faking it. And where OpenStreetMap has no lighting tag, I assume main roads are lit and small lanes are not. That is written down in the README. The next step is ground-truth lighting."

### [2:15 – 2:30] What's next
> "Next is shift-aware advice: closing time and day of the week, so Friday night gets a different answer from Tuesday. After that, IBM watsonx for natural-language help and for summarising lighting reports from the community. KAAVALU means guard. It is for the people who are guarding the city's last hour and have nobody guarding the way home. Thank you."

---

## Judges Q&A

### Q1: How do you know a haven is open at 2 am?
"I only keep police stations and places that OpenStreetMap explicitly tags as 24/7 or emergency-capable. That is a strict filter, and it means some corridors show few havens: Indiranagar has two on the route, Whitefield one, and the other four have none within 85 metres. I would rather show nothing than show a pharmacy that has closed. The next step is community check-ins to confirm hours."

### Q2: What happens with no internet?
"The six corridors are stored in IndexedDB on the phone, and routing, the assistant, stop detection, the siren and the SMS link all run locally. A startup self-check verifies those five parts. The honest gap is the map background: tiles come from OpenStreetMap and are not cached yet, so with no signal the route and markers still work but the street background may be blank. Caching tiles is on the list."

### Q3: Why is there no watsonx in the build?
"I chose to ship something that works with no keys, servers or budget, and that does not send a person's location to anyone. The assistant is rule-based on purpose. watsonx is where I would take natural-language understanding and community-report summarising next, behind an explicit opt-in, with the rule-based version kept as the fallback."

### Q4: How is the lighting data validated?
"Partly. Between 0% and 63% of segment length on each corridor has an explicit lit tag in OpenStreetMap; Koramangala has none. Everywhere else it is a rule: main roads and mapped sidewalks are lit, other streets are not. So the 82% figure is only as good as that assumption. I say so in the README, and crowd-verified lighting is the fix."

### Q5: What about privacy?
"Location stays on the device. There is no account and no server. The SOS button never sends anything by itself: it opens the user's own SMS app and the user decides whether to send."

### Q6: Why not just use Google Maps?
"It optimises for time. KAAVALU optimises for lighting and nearby open places, and shows the time cost beside it, so the walker can choose with the numbers in front of them."
