# PixelVoice Agent Architecture Rules

## Stack
React 19, Vite, Electron, Tailwind v4

## Module 1 (Local STT)
We use @xenova/transformers with Xenova/whisper-tiny.en locally. ZERO audio goes to the cloud. Do NOT suggest cloud STT APIs.

## Module 2 (Agent Brain)
We send local transcriptions to the Gemma 4 API (Gemini) to act strictly as a JSON parser for extracting tasks/notes.

## Design
Apple Design System principles (fluid typography, critically damped springs, neutral focus states).

## Package Manager
pnpm exclusively.