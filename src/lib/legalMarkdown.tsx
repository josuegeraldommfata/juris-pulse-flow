import { cn } from '@/lib/utils';

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function renderInlineMarkdown(text: string) {
  let out = escapeHtml(text);
  out = out.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');
  out = out.replace(/\*(.+?)\*/g, '<em>$1</em>');
  return out;
}

function parseTableCells(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

function isTableSeparator(line: string): boolean {
  const cells = parseTableCells(line);
  return cells.length > 0 && cells.every((cell) => /^:?-{2,}:?$/.test(cell));
}

function isTableRow(line: string): boolean {
  const trimmed = line.trim();
  return trimmed.startsWith('|') && trimmed.includes('|', 1);
}

type Block =
  | { type: 'paragraph'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'heading'; level: number; text: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'hr' };

export function parseMarkdownBlocks(content: string): Block[] {
  const lines = content.split(/\r?\n/);
  const blocks: Block[] = [];
  let currentUl: string[] | null = null;
  let currentOl: string[] | null = null;
  let tableHeaders: string[] | null = null;
  let tableRows: string[][] = [];

  const flushUl = () => {
    if (currentUl?.length) blocks.push({ type: 'ul', items: currentUl });
    currentUl = null;
  };

  const flushOl = () => {
    if (currentOl?.length) blocks.push({ type: 'ol', items: currentOl });
    currentOl = null;
  };

  const flushTable = () => {
    if (tableHeaders && tableRows.length) {
      blocks.push({ type: 'table', headers: tableHeaders, rows: tableRows });
    }
    tableHeaders = null;
    tableRows = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (isTableRow(line)) {
      flushUl();
      flushOl();

      if (isTableSeparator(line)) continue;

      const cells = parseTableCells(line);
      if (!tableHeaders) {
        tableHeaders = cells;
      } else {
        tableRows.push(cells);
      }
      continue;
    }

    flushTable();

    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      flushUl();
      flushOl();
      blocks.push({ type: 'heading', level: headingMatch[1].length, text: headingMatch[2] });
      continue;
    }

    if (/^[-*_]{3,}$/.test(line.trim())) {
      flushUl();
      flushOl();
      blocks.push({ type: 'hr' });
      continue;
    }

    const ulMatch = line.match(/^\s*[-*•]\s+(.+)\s*$/);
    const olMatch = line.match(/^\s*(\d+)[.)]\s+(.+)\s*$/);

    if (ulMatch) {
      flushOl();
      if (!currentUl) currentUl = [];
      currentUl.push(ulMatch[1]);
      continue;
    }

    if (olMatch) {
      flushUl();
      if (!currentOl) currentOl = [];
      currentOl.push(olMatch[2]);
      continue;
    }

    flushUl();
    flushOl();

    if (line.trim().length === 0) continue;
    blocks.push({ type: 'paragraph', text: line });
  }

  flushUl();
  flushOl();
  flushTable();

  return blocks;
}

export function LegalMarkdownContent({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const blocks = parseMarkdownBlocks(content);

  return (
    <div className={cn('space-y-2.5 leading-relaxed', className)}>
      {blocks.map((block, idx) => {
        if (block.type === 'heading') {
          const Tag = block.level === 1 ? 'h3' : block.level === 2 ? 'h4' : 'h5';
          return (
            <Tag
              key={idx}
              className={cn(
                'font-semibold text-foreground border-l-2 border-primary pl-2.5 mt-3 first:mt-0',
                block.level === 1 && 'text-base',
                block.level === 2 && 'text-sm',
                block.level === 3 && 'text-sm text-muted-foreground'
              )}
              dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(block.text) }}
            />
          );
        }

        if (block.type === 'ul') {
          return (
            <ul key={idx} className="list-disc pl-5 space-y-1.5 marker:text-primary/70">
              {block.items.map((item, j) => (
                <li
                  key={j}
                  className="text-sm"
                  dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(item) }}
                />
              ))}
            </ul>
          );
        }

        if (block.type === 'ol') {
          return (
            <ol key={idx} className="list-decimal pl-5 space-y-1.5 marker:text-primary marker:font-medium">
              {block.items.map((item, j) => (
                <li
                  key={j}
                  className="text-sm pl-1"
                  dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(item) }}
                />
              ))}
            </ol>
          );
        }

        if (block.type === 'table') {
          return (
            <div key={idx} className="overflow-x-auto rounded-lg border border-border/60 my-2">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="bg-primary/10 border-b border-primary/20">
                    {block.headers.map((header, j) => (
                      <th
                        key={j}
                        className="px-3 py-2 text-left font-semibold text-primary"
                        dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(header) }}
                      />
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, ri) => (
                    <tr
                      key={ri}
                      className={cn(
                        'border-b border-border/40 last:border-0',
                        ri % 2 === 0 ? 'bg-background/40' : 'bg-muted/20'
                      )}
                    >
                      {row.map((cell, ci) => (
                        <td
                          key={ci}
                          className="px-3 py-2 align-top text-foreground/90"
                          dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(cell) }}
                        />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (block.type === 'hr') {
          return <hr key={idx} className="border-border/50 my-3" />;
        }

        return (
          <p
            key={idx}
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(block.text ?? '') }}
          />
        );
      })}
    </div>
  );
}
