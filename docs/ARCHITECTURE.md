# Architecture

## Demo implementation

The browser contains synthetic Microsoft 365-style records and a deterministic retrieval pipeline. Search scores exact token overlap, high-signal keywords, and freshness. Project and role filters are applied before answer synthesis. This makes the key product behavior demonstrable without credentials or company data.

## Production implementation

```text
Teams / SharePoint / Outlook / Azure DevOps / business systems
                           |
                 Microsoft Graph + connectors
                           |
              change notifications + Service Bus
                           |
         Azure Functions: normalize, distill, and chunk
                           |
       Azure AI Search: BM25 + vectors + RRF + reranking
                           |
         permission-filtered retrieval API / MCP tools
                           |
          planner -> parallel retrieval -> synthesis
                           |
                Teams, Copilot, or web application
```

Use separate indexes for conversation artifacts, document sections, code, and people expertise when their ranking and update patterns differ. Normalize all results into a common evidence schema before synthesis.

## Evidence contract

Every evidence row should include source ID, canonical URL, source type, timestamps, project IDs, sensitivity labels, permitted Entra principals, retrieval scores, and the exact excerpt presented to the model. Answers should cite only rows in that evidence bundle.
