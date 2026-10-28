# Security Policy

## Supported versions

This repository is the open-source release of the first version of 7aba. It receives security fixes on a best-effort basis on the `main` branch only.

## Reporting a vulnerability

**Please do not open a public issue for security problems.**

Report it privately through [GitHub's private vulnerability reporting](https://github.com/ta9in-oss/sellingpage/security/advisories/new), or email **support@ta9in.com**. Include:

- what the issue is and where (file, route or endpoint),
- steps to reproduce or a proof of concept,
- the impact you think it has.

You'll get an acknowledgement within a few days. We'll keep you updated while we work on a fix and credit you in the advisory unless you'd rather stay anonymous.

## Secrets

Never commit credentials. Every push and pull request is scanned with gitleaks. If you find a credential in this repository, report it as above.
