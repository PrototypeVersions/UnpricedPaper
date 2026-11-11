// Build the Word edition from paper/unpriced-paper.md.
//
// The Markdown file is the single source for the website and this document.
// Run from the repository root, after tools/build_site.py has written
// index.html and a figure image has been captured from it:
//
//   node tools/build_docx.js <figure-1.png> <output.docx>
//
// Requires pandoc (3.x) and the `docx` npm package.

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const {
  Document, Packer, Paragraph, TextRun, ExternalHyperlink, HeadingLevel,
  Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle, ImageRun,
  AlignmentType, Footer, PageNumber, LevelFormat, PageBreak,
} = require("docx");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "paper", "unpriced-paper.md");
const [figurePath, outPath] = process.argv.slice(2);
if (!figurePath || !outPath) {
  console.error("usage: node tools/build_docx.js <figure-1.png> <output.docx>");
  process.exit(1);
}

const ast = JSON.parse(execFileSync("pandoc", [SRC, "-f", "markdown", "-t", "json"], { maxBuffer: 1 << 26 }));

const INK = "1D2230", MUTED = "566176", BLUE = "1F4FD1", LINE = "C9D1E0", HEAD = "E8ECF5";
const BODY_FONT = "Cambria", HEAD_FONT = "Calibri";
const CONTENT_WIDTH = 9360; // US Letter with 1-inch margins

// ---------- inlines ----------
function metaText(m) {
  if (!m) return "";
  const c = m.c;
  if (m.t === "MetaString") return c;
  return plainText(c);
}
function plainText(inlines) {
  return inlines.map((i) => {
    switch (i.t) {
      case "Str": return i.c;
      case "Space": case "SoftBreak": return " ";
      case "Quoted": return (i.c[0].t === "DoubleQuote" ? "“" : "‘") + plainText(i.c[1]) + (i.c[0].t === "DoubleQuote" ? "”" : "’");
      case "Strong": case "Emph": return plainText(i.c);
      case "Link": return plainText(i.c[1]);
      case "Code": return i.c[1];
      default: return "";
    }
  }).join("");
}
function runs(inlines, style = {}) {
  const out = [];
  for (const i of inlines) {
    switch (i.t) {
      case "Str": out.push(new TextRun({ text: i.c, ...style })); break;
      case "Space": case "SoftBreak": out.push(new TextRun({ text: " ", ...style })); break;
      case "Strong": out.push(...runs(i.c, { ...style, bold: true })); break;
      case "Emph": out.push(...runs(i.c, { ...style, italics: true })); break;
      case "Quoted": {
        const dq = i.c[0].t === "DoubleQuote";
        out.push(new TextRun({ text: dq ? "“" : "‘", ...style }));
        out.push(...runs(i.c[1], style));
        out.push(new TextRun({ text: dq ? "”" : "’", ...style }));
        break;
      }
      case "Link":
        out.push(new ExternalHyperlink({
          link: i.c[2][0],
          children: runs(i.c[1], { ...style, color: "2452C4", underline: {} }),
        }));
        break;
      case "Code": out.push(new TextRun({ text: i.c[1], font: "Consolas", ...style })); break;
      default: break;
    }
  }
  return out;
}

// ---------- blocks ----------
const children = [];

function para(inlines, opts = {}) {
  return new Paragraph({ children: runs(inlines, opts.run || {}), spacing: { after: 140, line: 288 }, ...opts.para });
}

function table(t) {
  const [, , colspecs, head, bodies] = t.c;
  const ncol = colspecs.length;
  let fracs = colspecs.map((cs) => (cs[1].t === "ColWidth" ? cs[1].c : 1 / ncol));
  const sum = fracs.reduce((a, b) => a + b, 0);
  const widths = fracs.map((f) => Math.round((f / sum) * CONTENT_WIDTH));
  widths[widths.length - 1] += CONTENT_WIDTH - widths.reduce((a, b) => a + b, 0);
  const border = { style: BorderStyle.SINGLE, size: 4, color: LINE };
  const borders = { top: border, bottom: border, left: border, right: border };
  const cellParas = (blocks, bold) => blocks.map((b) => new Paragraph({
    children: runs(b.c, { font: HEAD_FONT, size: 18, bold }),
    spacing: { before: 0, after: 40, line: 252 },
  }));
  const mkRow = (row, isHead) => new TableRow({
    tableHeader: isHead,
    cantSplit: true,
    children: row[1].map((cell, k) => new TableCell({
      width: { size: widths[k], type: WidthType.DXA },
      borders,
      shading: isHead ? { type: ShadingType.CLEAR, fill: HEAD, color: "auto" } : undefined,
      margins: { top: 70, bottom: 70, left: 100, right: 100 },
      children: cellParas(cell[4].length ? cell[4] : [{ t: "Plain", c: [] }], isHead),
    })),
  });
  const rows = [];
  for (const r of head[1]) rows.push(mkRow(r, true));
  for (const body of bodies) for (const r of body[3]) rows.push(mkRow(r, false));
  return new Table({ width: { size: CONTENT_WIDTH, type: WidthType.DXA }, columnWidths: widths, rows });
}

function block(b) {
  switch (b.t) {
    case "Header": {
      const level = b.c[0];
      const text = plainText(b.c[2]);
      const heading = [HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3][level - 1];
      children.push(new Paragraph({ heading, children: [new TextRun({ text })] }));
      break;
    }
    case "Para": case "Plain": {
      const next = ast.blocks[ast.blocks.indexOf(b) + 1];
      const keepNext = next && (next.t === "Table" || next.t === "BulletList");
      children.push(para(b.c, { para: { keepNext } }));
      break;
    }
    case "BulletList":
      for (const item of b.c) {
        item.forEach((ib, j) => {
          children.push(new Paragraph({
            children: runs(ib.c),
            numbering: j === 0 ? { reference: "bullets", level: 0 } : undefined,
            indent: j === 0 ? undefined : { left: 720 },
            spacing: { after: 80, line: 288 },
          }));
        });
      }
      children.push(new Paragraph({ children: [], spacing: { after: 40 } }));
      break;
    case "Table":
      children.push(table(b));
      children.push(new Paragraph({ children: [], spacing: { after: 120 } }));
      break;
    case "Figure": {
      const caption = b.c[1][1].flatMap((cb) => cb.c);
      const png = fs.readFileSync(figurePath);
      const w = png.readUInt32BE(16), h = png.readUInt32BE(20);
      const widthPx = 600, heightPx = Math.round((h / w) * widthPx);
      children.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 120, after: 80 },
        children: [new ImageRun({ type: "png", data: png, transformation: { width: widthPx, height: heightPx },
          altText: { title: "Figure 1", description: plainText(caption), name: "figure-1" } })],
      }));
      children.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 220 },
        children: runs(caption, { italics: true, size: 19, color: MUTED }),
      }));
      break;
    }
    case "Div":
      // The "About this version" note is placed on the cover instead.
      break;
    default:
      console.warn("unhandled block", b.t);
  }
}

// ---------- cover ----------
const meta = ast.meta;
const provisional = ast.blocks.find((b) => b.t === "Div");
const cover = [
  new Paragraph({ children: [], spacing: { before: 2400 } }),
  new Paragraph({ children: [new TextRun({ text: metaText(meta.title), font: HEAD_FONT, size: 64, bold: true, color: "1C2537" })], spacing: { after: 120 } }),
  new Paragraph({ children: [new TextRun({ text: metaText(meta.subtitle), font: HEAD_FONT, size: 34, color: BLUE })], spacing: { after: 360 } }),
  new Paragraph({ children: [new TextRun({ text: metaText(meta.tagline), italics: true, size: 26 })], spacing: { after: 720, line: 320 } }),
  new Paragraph({ children: [new TextRun({ text: metaText(meta.date), font: HEAD_FONT, size: 20, color: MUTED })], spacing: { after: 240 } }),
];
for (const [label, url] of [
  ["Stock Lab: ", "https://prototypeversions.github.io/UnpricedX/"],
  ["Risk Lab: ", "https://prototypeversions.github.io/UnpricedZ/"],
  ["Record and grading: ", "https://prototypeversions.github.io/UnpricedHub/"],
  ["This paper online: ", "https://prototypeversions.github.io/UnpricedPaper/"],
]) {
  cover.push(new Paragraph({ spacing: { after: 40 }, children: [
    new TextRun({ text: label, font: HEAD_FONT, size: 18, color: MUTED }),
    new ExternalHyperlink({ link: url, children: [new TextRun({ text: url, font: HEAD_FONT, size: 18, color: "2452C4", underline: {} })] }),
  ] }));
}
if (provisional) {
  const note = provisional.c[1][0].c;
  cover.push(new Paragraph({
    spacing: { before: 480, after: 240, line: 276 },
    border: { left: { style: BorderStyle.SINGLE, size: 18, color: BLUE, space: 10 } },
    indent: { left: 200 },
    shading: { type: ShadingType.CLEAR, fill: "F3F6FB", color: "auto" },
    children: runs(note, { font: HEAD_FONT, size: 19 }),
  }));
}
cover.push(new Paragraph({ children: [new TextRun({ text: "Research and paper trading only. Nothing here is investment advice.", italics: true, size: 18, color: MUTED })] }));
cover.push(new Paragraph({ children: [new PageBreak()] }));
children.push(...cover);

for (const b of ast.blocks) block(b);

const doc = new Document({
  creator: "Unpriced",
  title: "Unpriced — An open laboratory for market prediction",
  description: "Project paper, provisional version, November 11, 2026",
  styles: {
    default: { document: { run: { font: BODY_FONT, size: 21, color: INK } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { font: HEAD_FONT, size: 32, bold: true, color: "1C2537" },
        paragraph: { spacing: { before: 420, after: 160 }, keepNext: true, keepLines: true, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { font: HEAD_FONT, size: 26, bold: true, color: BLUE },
        paragraph: { spacing: { before: 280, after: 110 }, keepNext: true, keepLines: true, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { font: HEAD_FONT, size: 22, bold: true, color: "242D42" },
        paragraph: { spacing: { before: 200, after: 70 }, keepNext: true, keepLines: true, outlineLevel: 2 } },
    ],
  },
  numbering: { config: [{ reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•",
    alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }] },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }, titlePage: true },
    footers: {
      default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
        new TextRun({ text: "Unpriced · ", size: 16, color: MUTED }),
        new TextRun({ children: [PageNumber.CURRENT], size: 16, color: MUTED })] })] }),
      first: new Footer({ children: [new Paragraph({ children: [] })] }),
    },
    children,
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(outPath, buf);
  console.log(`Wrote ${outPath} (${buf.length.toLocaleString()} bytes)`);
});
