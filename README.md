# Unpriced — An Open Laboratory for Market Prediction

This repository hosts the web edition of the Unpriced project paper: https://prototypeversions.github.io/UnpricedPaper/

**Current version:** provisional revision, November 11, 2026. It narrows the November 5 paper (`UnpricedProjectPaper_v3.docx`) to the research itself: business possibilities are set aside, the record-keeping site (UnpricedHub) is described as a methods section, several claims are softened, and combining the Stock Lab and Risk Lab is presented as the first planned experiment. A fuller revision will follow the first graded results.

## One source, two editions

| File | What it is |
| --- | --- |
| [`paper/unpriced-paper.md`](paper/unpriced-paper.md) | The paper's text. Edit this, not `index.html`. |
| [`tools/build_site.py`](tools/build_site.py) | Builds `index.html` from the Markdown (needs pandoc 3 and BeautifulSoup 4). |
| [`tools/build_docx.js`](tools/build_docx.js) | Builds the Word edition from the same Markdown (needs pandoc 3 and the `docx` npm package). |
| [`tools/style.css`](tools/style.css) | The site's stylesheet. |
| [`paper/figure-1.png`](paper/figure-1.png) | Figure 1 for the Word edition, captured from the web page. |

```
python3 tools/build_site.py
node tools/build_docx.js paper/figure-1.png UnpricedProjectPaper_v4.docx
```

If the figure changes on the web page, recapture `paper/figure-1.png` from the rendered `figure.architecture` element before building the Word edition.

## Publishing

The [deployment workflow](.github/workflows/publish.yml) publishes `main` through GitHub Actions. Pages must be enabled once under **Settings → Pages → Build and deployment → GitHub Actions**.

The document is research and paper trading only, not investment advice.
