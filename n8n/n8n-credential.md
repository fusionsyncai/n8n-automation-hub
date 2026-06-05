# n8n Credentials

Reusable credential IDs for n8n workflows. The n8n public API cannot list
credentials, so we track known IDs here for reuse.

## Header Auth (`httpHeaderAuth`)

| Credential ID      | Name | Notes                        |
| ------------------ | ---- | ---------------------------- |
| `axIx5Q6orHCeiiNZ` | TBD  | Default Header Auth for webhooks |

## Google Gemini (`googlePalmApi`)

| Credential ID      | Name        | Notes                          |
| ------------------ | ----------- | ------------------------------ |
| `xEdXDIPxkqE6OLxQ` | Harsh Gemini | Gemini chat model (used by Simple Chatbot) |

## Usage

- Default Header Auth credential for new Webhook nodes: `axIx5Q6orHCeiiNZ`.
- Before creating a webhook, ask whether to reuse an existing credential from
  this file or provide a new one.
