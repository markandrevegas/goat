# Agent Response & Code Generation Rules

- **Extreme conciseness:** Minimize conversational text, conversational intros, greetings, and post-explanations.
- **Direct implementation:** Provide direct, complete code changes or file modifications immediately without summarizing the thought process or narrating what was done.
- **Fresh code:** Produce fresh, runnable implementations. Do not use ellipsis placeholders (`// ... existing code ...`) in replaced blocks unless specifically asked for an excerpt.
- **No unsolicited commentary:** Do not explain language syntax, library choices, or how to run standard commands unless explicitly asked.
- **No summary step:** Skip walkthrough summaries, feature recaps, and change logs. State only what was created or modified in one short line if required.