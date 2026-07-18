# Security boundaries

Northstar must enforce authorization in the retrieval service, not in the prompt.

## Required controls

- Entra ID authentication and group resolution.
- Source-level ACL capture at ingestion and security filters at query time.
- Least-privilege Microsoft Graph permissions.
- Managed identities and Key Vault for service credentials.
- Sensitivity labels, retention, DLP, and audit through Microsoft Purview.
- Logs for query, project scope, tools called, evidence IDs, access-filter outcomes, answer status, and latency.
- Refusal when evidence is missing, inaccessible, stale beyond policy, or conflicting.
- Evaluation sets containing both authorized and deliberately unauthorized questions.

## Claims boundary

This repository is a product demonstration. It is not certified for CUI, classified data, HIPAA, PCI, or any other regulated workload. Compliance depends on the selected Microsoft cloud boundary, tenant configuration, data classification, identity controls, operating procedures, and formal authorization.
