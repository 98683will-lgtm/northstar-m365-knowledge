# Microsoft 365 integration

## Pilot scope

Start with one SharePoint site and two Teams channels owned by a single pilot group. Do not begin with tenant-wide ingestion.

1. Register a single-tenant Entra ID application.
2. Use the narrowest Microsoft Graph application permissions that support the pilot sources.
3. Store credentials in Azure Key Vault and use managed identity between Azure services.
4. Subscribe to supported change notifications and queue ingestion work through Service Bus.
5. Fetch the complete source object, including thread context and current permissions.
6. Distill conversations into question, summary, resolution, systems, people, and references.
7. Upsert normalized artifacts and their access-control metadata into Azure AI Search.
8. Filter every query by the signed-in user’s Entra principals before any evidence reaches the answer model.

## Connector choices

- Use native Microsoft 365 indexing when native Copilot behavior is sufficient.
- Use synchronized connectors for stable external content that can be copied into the Microsoft index.
- Use federated or live API tools for highly dynamic data that should remain in its source system.
- Use a custom Azure ingestion path when thread distillation, code chunking, retrieval tuning, or audit evidence is required.

## Rollout gates

- Positive access test: a pilot member receives an authorized source.
- Negative access test: a nonmember cannot retrieve, cite, or infer that source.
- Deletion test: removed source content disappears within the agreed service level.
- Permission-change test: revoked access is reflected before the next answer.
- Evidence test: every factual answer maps to a retrievable source excerpt.
