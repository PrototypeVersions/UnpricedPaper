# Unpriced — An Open Laboratory for Market Prediction

This repository hosts the **complete, single-page web edition** of the Unpriced project paper (revised November 5, 2026), based on `UnpricedProjectPaper_v3.docx`.

The full paper—including its 15 numbered sections, architecture figure, data tables, references, glossary, and methodology—is in [`index.html`](index.html). The page is responsive for desktop and mobile. Tables become readable stacked cards on narrow screens, and the architecture diagram rearranges vertically.

**Intended public URL:** https://prototypeversions.github.io/UnpricedPaper/

## Turn on GitHub Pages (one-time)

The included [deployment workflow](.github/workflows/publish.yml) publishes the latest `main` branch automatically through GitHub Actions. GitHub requires the repository owner to enable Pages once:

1. Open **Settings → Pages** for this repository: https://github.com/PrototypeVersions/UnpricedPaper/settings/pages
2. Under **Build and deployment**, choose **GitHub Actions** as the source.
3. In the **Actions** tab, open **Publish Unpriced paper** and choose **Run workflow** (or push an update). The workflow will then deploy.
4. Once the workflow succeeds, open https://prototypeversions.github.io/UnpricedPaper/.

The document is research and paper trading only, not investment advice.
