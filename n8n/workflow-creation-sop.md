# n8n Workflow Creation SOP

Standard operating procedure for creating and maintaining n8n workflows in this
repo. Follow every step, in order, for each new workflow.

## Folder layout

```
n8n/
├── workflow-creation-sop.md      # this file
├── n8n-credential.md             # tracked reusable credential IDs
└── workflows/
    └── <workflow-slug>/          # one subfolder per workflow
        └── workflow.json         # exact exported workflow JSON
```

- Every workflow gets its own subfolder under `n8n/workflows/`, named with a
  kebab-case slug derived from the workflow name (e.g. `echo-name-email`).
- The exact workflow JSON is committed as `workflow.json` inside that subfolder.

## Steps

1. **Confirm the n8n instance is reachable** — run `n8n_health_check`.
2. **Look up node specs** — use `get_node` (or `search_nodes`) to get the
   correct `type`, latest `typeVersion`, and parameter names before building.
3. **Header Auth on Webhook nodes (required)** — per
   `.cursor/rules/n8n-webhook-auth.mdc`, every Webhook node uses Header Auth.
   - ASK the user whether to reuse a credential listed in `n8n/n8n-credential.md`
     or provide a new one.
   - Set `parameters.authentication: "headerAuth"` and attach the
     `httpHeaderAuth` credential via the node's `credentials` field.
   - If the user provides a new credential ID, append it to
     `n8n/n8n-credential.md`.
4. **Create the workflow** — call `n8n_create_workflow` with `name`, `nodes`,
   and `connections`.
5. **Validate** — run `n8n_validate_workflow` and fix all errors.
   - Webhook nodes using `responseMode: "responseNode"` require
     `onError: "continueRegularOutput"`.
6. **Save the JSON to the repo** — fetch the saved workflow with
   `n8n_get_workflow` and write the exact JSON to
   `n8n/workflows/<workflow-slug>/workflow.json`.
7. **Activation** — workflows are created inactive. Ask the user before
   activating.

## Keeping the repo in sync

- Whenever a workflow is updated in n8n, re-export it and overwrite its
  `workflow.json` so the repo always reflects the live definition.
