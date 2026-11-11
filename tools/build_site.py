"""Build index.html from paper/unpriced-paper.md.

The Markdown file is the single source for both the website and the Word
edition. Run from the repository root:

    python3 tools/build_site.py

Requires pandoc (3.x) and BeautifulSoup 4.
"""

import pathlib
import re
import subprocess

from bs4 import BeautifulSoup

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "paper" / "unpriced-paper.md"
OUT = ROOT / "index.html"
CSS = (ROOT / "tools" / "style.css").read_text()

X = "https://prototypeversions.github.io/UnpricedX/"
Z = "https://prototypeversions.github.io/UnpricedZ/"
HUB = "https://prototypeversions.github.io/UnpricedHub/"


def site_link(url, text):
    return (f'<a class="site-reference" href="{url}" target="_blank" '
            f'rel="noopener noreferrer" title="Open {text} in a new tab">{text}</a>')


FIGURE = f"""<figure class="architecture" role="group" aria-label="Unpriced design: public data supplies the Stock Lab and the Risk Lab, which freeze forecasts before the open; a separate record-keeping process saves copies and grades them">
<div class="data-source">Public data: Yahoo daily prices · Nasdaq symbol list · SEC EDGAR filings and XBRL fundamentals</div>
<div class="source-arrows" aria-hidden="true"><span>↓</span><span>↓</span></div>
<div class="lab-pair">
<section class="lab-card stock"><h3>Stock Lab ({site_link(X, "UnpricedX")})</h3><p>Ranks ~1,000 US stocks for the next 5 sessions</p><p>History: 20 years of walk-forward tests, ledger, gates</p><p>Live: champion, challengers, simple benchmark, AI reader</p><p>Frozen nightly, hash-chained, before the open</p><p>Built by Claude</p><div class="portfolio-pill">$1,000 stock portfolio (fixed rules)</div></section>
<div class="cross-review" aria-hidden="true">↔<small>read-only review</small><small class="planned">planned: risk to size stocks</small></div>
<section class="lab-card risk"><h3>Risk Lab ({site_link(Z, "UnpricedZ")})</h3><p>Forecasts swings and falls for SPY + 9 sector funds</p><p>EWMA, HAR, GARCH variance; drawdown odds</p><p>Registered protocol, its own live record</p><p>Frozen nightly before the open</p><p>Built by GPT</p><div class="portfolio-pill">$1,000 sector-fund portfolio (fixed rules)</div></section></div>
<div class="export-arrows" aria-hidden="true"><span>↘ <small>ranks</small></span><span><small>variance, fall odds</small> ↙</span></div>
<div class="hub-card"><h3>Record and grading ({site_link(HUB, "UnpricedHub")})</h3><p>Saves its own copy and receipt time before the open</p><p>Grades matured forecasts with its own price download</p><p>Never edits a lab, never picks a model</p></div><figcaption>{{caption}}</figcaption></figure>"""


def main():
    md = SRC.read_text()
    meta = dict(re.findall(r"^(\w+): (.*)$", md.split("---")[1], re.M))
    body_html = subprocess.run(
        ["pandoc", str(SRC), "-f", "markdown", "-t", "html5", "--section-divs",
         "--shift-heading-level-by=1", "--wrap=none"],
        check=True, capture_output=True, text=True).stdout
    soup = BeautifulSoup(body_html, "html.parser")

    # Top-level sections: class names and heading anchors.
    toc = []
    for sec in soup.find_all("section", recursive=False):
        sid = sec.get("id")
        h2 = sec.find("h2")
        if sid == "at-a-glance":
            sec["class"] = ["glance"]
            continue
        sec["class"] = ["paper-section"]
        toc.append((sid, h2.get_text()))
        a = soup.new_tag("a", attrs={"class": "anchor", "aria-label": "Link to this section", "href": f"#{sid}"})
        a.string = "#"
        h2.append(a)
    # Nested sections become plain containers; keep heading ids.
    for sec in soup.select("section.level3, section.level4"):
        heading = sec.find(["h3", "h4"])
        if heading is not None and sec.get("id"):
            heading["id"] = sec["id"]
        sec.unwrap()

    # Tables: wrapper, scope, data-labels for the stacked mobile layout.
    for table in soup.find_all("table"):
        for cg in table.find_all("colgroup"):
            cg.decompose()
        for attr in ("class", "style"):
            table.attrs.pop(attr, None)
        heads = [th.get_text() for th in table.select("thead th")]
        for th in table.select("thead th"):
            th.attrs = {"scope": "col"}
        for tr in table.select("tbody tr"):
            tr.attrs = {}
            for label, td in zip(heads, tr.find_all("td")):
                td.attrs = {"data-label": label}
        wrap = soup.new_tag("div", attrs={"class": "table-wrap"})
        table.wrap(wrap)

    # Lists in the body get the paper's list style.
    for ul in soup.select("section.paper-section ul"):
        ul["class"] = ["paper-list"]

    # Links to the three sites and other external pages open in a new tab.
    for a in soup.find_all("a", href=True):
        if a["href"].startswith("http"):
            a["target"] = "_blank"
            a["rel"] = "noopener noreferrer"
            if a["href"] in (X, Z, HUB):
                a["class"] = ["site-reference"]

    # The design figure is drawn in HTML on the website.
    fig = soup.find("figure", id="fig-design") or soup.find("img", src="figure-1.png").find_parent("figure")
    caption = fig.find("figcaption").get_text()
    fig.replace_with(BeautifulSoup(FIGURE.replace("{caption}", caption), "html.parser"))

    provisional = soup.find("div", class_="provisional")
    provisional_html = str(provisional)
    provisional.decompose()

    toc_html = "\n".join(f'<a href="#{sid}">{text}</a>' for sid, text in toc)
    description = ("Unpriced: an open laboratory for market prediction. Two public labs freeze AI stock "
                   "and risk forecasts before the open, have them graded separately, and test whether "
                   "the forecasts improve decisions.")
    page = f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#ffffff"><meta name="description" content="{description}"><meta property="og:title" content="Unpriced — An Open Laboratory for Market Prediction"><meta property="og:description" content="{description}"><meta property="og:type" content="article"><link rel="icon" type="image/svg+xml" sizes="any" href="assets/favicon.svg"><link rel="icon" type="image/png" sizes="32x32" href="assets/favicon-32.png"><link rel="apple-touch-icon" sizes="180x180" href="assets/favicon-180.png"><meta name="apple-mobile-web-app-title" content="Unpriced"><meta property="og:site_name" content="Unpriced"><meta property="og:url" content="https://prototypeversions.github.io/UnpricedPaper/"><meta property="og:image" content="https://prototypeversions.github.io/UnpricedPaper/assets/social-preview.png"><meta property="og:image:secure_url" content="https://prototypeversions.github.io/UnpricedPaper/assets/social-preview.png"><meta property="og:image:type" content="image/png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Unpriced — An open laboratory for market prediction"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="Unpriced — An Open Laboratory for Market Prediction"><meta name="twitter:description" content="Discover on history. Prove live. Keep the score separately."><meta name="twitter:image" content="https://prototypeversions.github.io/UnpricedPaper/assets/social-preview.png"><title>Unpriced — An Open Laboratory for Market Prediction</title><style>{CSS}</style></head><body><a class="skip-link" href="#at-a-glance" style="position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden" onfocus="this.style.left='10px';this.style.top='60px';this.style.width='auto';this.style.height='auto'">Skip to paper</a><nav class="topbar"><div class="topbar-inner"><a class="brand" href="#top">UNPRICED</a><div class="top-actions"><a href="#at-a-glance">At a glance</a><a href="#section-9">Planned experiment</a><a href="#references">References</a></div></div><details class="toc-panel"><summary>JUMP TO SECTION</summary><div class="toc-grid">{toc_html}</div></details></nav><main class="paper" role="main"><header class="paper-cover" id="top"><div class="cover-rule"></div><h1>{meta["title"]}</h1><p class="cover-subtitle">{meta["subtitle"]}</p><p class="cover-tagline">{meta["tagline"]}</p><div class="cover-details"><p class="cover-date">{meta["date"]}</p><div class="project-links-heading">Explore the research sites</div><nav class="project-links" aria-label="Explore Unpriced research sites"><div class="project-link"><a href="{X}" target="_blank" rel="noopener noreferrer">Visit the Stock Lab (UnpricedX) <span class="project-link-arrow" aria-hidden="true">↗</span></a><span class="project-link-description">Stock rankings, forecasting models, and live comparisons</span></div><div class="project-link"><a href="{Z}" target="_blank" rel="noopener noreferrer">Visit the Risk Lab (UnpricedZ) <span class="project-link-arrow" aria-hidden="true">↗</span></a><span class="project-link-description">Market and sector risk forecasts</span></div><div class="project-link"><a href="{HUB}" target="_blank" rel="noopener noreferrer">Visit the record and grading site (UnpricedHub) <span class="project-link-arrow" aria-hidden="true">↗</span></a><span class="project-link-description">Forecast receipts and separately computed grades</span></div></nav>{provisional_html}<p class="disclaimer">Research and paper trading only. Nothing here is investment advice.</p></div></header>
{soup}
<footer class="page-footer">Unpriced · Project paper · November 11, 2026 · Provisional revision<br>Research and paper trading only. Nothing here is investment advice.</footer></main></body></html>
"""
    OUT.write_text(page)
    print(f"Wrote {OUT.relative_to(ROOT)} ({len(page):,} bytes)")


if __name__ == "__main__":
    main()
