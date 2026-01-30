# POC: AI Meeting Action Extraction

## Purpose

Define the proof-of-concept plan for AI-powered extraction of action items from meeting transcripts and notes.

---

## POC Goals

### Primary Objective
- TBD: What we're trying to prove
- TBD: Success metrics
- TBD: Minimum viable accuracy

### Secondary Objectives
- TBD: Learning goals
- TBD: Technical validation needs

### Non-Goals (for POC)
- TBD: What we're explicitly NOT doing yet

---

## Input Sources

### Supported Input Types
- TBD: Plain text notes
- TBD: Meeting transcripts (which formats?)
- TBD: Audio transcription integration (future?)

### Sample Inputs
- TBD: Collect sample meeting transcripts
- TBD: Sample meeting notes
- TBD: Edge cases to test

---

## Output Format

### Action Item Structure
```
TBD: Define action item schema
- Description
- Assignee (if mentioned)
- Due date (if mentioned)
- Priority (inferred?)
- Confidence score
- Source quote
```

### Linking to Tasks
- TBD: How actions become tasks
- TBD: Review/approval flow
- TBD: Bulk vs individual creation

→ See: [data-model.md](./data-model.md)

---

## AI Implementation

### Model Selection
- TBD: Which LLM to use
- TBD: API vs self-hosted
- TBD: Cost considerations

### Prompt Engineering
- TBD: Base prompt structure
- TBD: Few-shot examples
- TBD: Instruction tuning needs

### Processing Pipeline
1. TBD: Input preprocessing
2. TBD: Chunking strategy (for long transcripts)
3. TBD: LLM call
4. TBD: Output parsing
5. TBD: Confidence scoring
6. TBD: Deduplication

---

## API Design

### Endpoint
- TBD: `POST /ai/extract-actions`
- TBD: Request format
- TBD: Response format
- TBD: Async vs sync processing

→ See: [api-spec.md](./api-spec.md)

---

## Testing Plan

### Test Cases
- TBD: Short meeting notes
- TBD: Long transcript
- TBD: Multiple speakers
- TBD: Ambiguous assignments
- TBD: No action items present
- TBD: Non-English (if relevant)

### Evaluation Metrics
- TBD: Precision (are extracted items real actions?)
- TBD: Recall (did we miss actions?)
- TBD: Assignment accuracy
- TBD: Date extraction accuracy

---

## POC Timeline

### Phase 1: Setup
- TBD: Environment setup
- TBD: API integration
- TBD: Basic prompt

### Phase 2: Iteration
- TBD: Prompt refinement
- TBD: Test case expansion
- TBD: Edge case handling

### Phase 3: Evaluation
- TBD: Metrics collection
- TBD: Stakeholder review
- TBD: Go/no-go decision

---

## Demo Integration

→ See: [demo-scenario.md](./demo-scenario.md) for how this features in the IOM Gov demo

---

## Related Documents

- [API Spec](./api-spec.md) - Endpoint definition
- [Data Model](./data-model.md) - Action item entity
- [Demo Scenario](./demo-scenario.md) - Demo requirements
