# Northstar

Northstar is a demo-ready MVP for a permission-aware enterprise knowledge assistant built around Microsoft 365. It shows how employees could search Teams, SharePoint, Outlook, Azure DevOps, and Power BI through one grounded answer experience.

The repository ships with synthetic records, so it is safe to demo without connecting a company tenant. The interface demonstrates:

- project-scoped search;
- permission trimming for employee, operations, and leadership roles;
- hybrid retrieval signals and freshness weighting;
- cited answers with visible source evidence;
- connector health and retrieval analytics;
- a production architecture handoff for Microsoft Graph, Azure AI Search, Entra ID, and Purview.

## Run the demo

Requirements: Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Demo script

1. Ask **How do I request production access?** as an Employee.
2. Ask **What is the latest incident playbook?** first as an Employee, then as Operations, to show permission trimming.
3. Ask **Why did the Contoso renewal forecast drop?** as an Employee, then switch to Leadership to reveal authorized evidence.
4. Open **Architecture** to explain the Microsoft 365 and Azure production path.
5. Open **Connect Microsoft 365** to show the controlled pilot rollout.

## Validation

```bash
npm test
npm run lint
```

## Production path

This is a functional product demo, not a production connector or compliance certification. Replace the seeded records with a server-side ingestion and retrieval layer before using real company content.

See:

- [Architecture](docs/ARCHITECTURE.md)
- [Microsoft 365 integration](docs/MICROSOFT_365_INTEGRATION.md)
- [Security boundaries](docs/SECURITY.md)

## License

MIT
