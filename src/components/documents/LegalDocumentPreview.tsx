import { cn } from '@/lib/utils';
import { Scale } from 'lucide-react';

type DocSection = {
  kind: 'header' | 'title' | 'section' | 'clause' | 'paragraph' | 'signature' | 'separator';
  text: string;
};

function parseLegalDocument(content: string): DocSection[] {
  const lines = content.split(/\r?\n/);
  const sections: DocSection[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (/^_{3,}$/.test(line) || /^-{3,}$/.test(line)) {
      sections.push({ kind: 'separator', text: line });
      continue;
    }

    if (
      /^(EXCELENTÍSSIMO|ILUSTRÍSSIMO|CONTRATO DE|PROCURAÇÃO|DECLARAÇÃO|APELAÇÃO|CONTESTAÇÃO|RECURSO)/i.test(line) ||
      (line === line.toUpperCase() && line.length > 20 && !line.startsWith('CLÁUSULA'))
    ) {
      sections.push({ kind: 'header', text: line });
      continue;
    }

    if (/^(AÇÃO |CONTESTAÇÃO|PROCURAÇÃO$|DECLARAÇÃO$|APELAÇÃO$)/i.test(line)) {
      sections.push({ kind: 'title', text: line });
      continue;
    }

    if (/^(I{1,3}|IV|V|VI|VII|VIII|IX|X)\s*[-–—]\s*/i.test(line)) {
      sections.push({ kind: 'section', text: line });
      continue;
    }

    if (/^CLÁUSULA\s/i.test(line)) {
      sections.push({ kind: 'clause', text: line });
      continue;
    }

    if (
      /^Termos em que/i.test(line) ||
      /^Pede deferimento/i.test(line) ||
      /^OAB\//i.test(line) ||
      (/^\[.+\]$/.test(line) && sections.length > 3)
    ) {
      sections.push({ kind: 'signature', text: line });
      continue;
    }

    sections.push({ kind: 'paragraph', text: line });
  }

  return sections;
}

export function LegalDocumentPreview({
  content,
  documentType,
  clientName,
}: {
  content: string;
  documentType?: string;
  clientName?: string;
}) {
  const sections = parseLegalDocument(content);

  return (
    <div className="rounded-xl border border-border/60 overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-primary/15 via-primary/5 to-transparent px-5 py-4 border-b border-primary/20">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/15 flex items-center justify-center ring-1 ring-primary/25">
            <Scale className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-primary">
              Documento Jurídico
            </p>
            <p className="text-sm font-semibold text-foreground">
              {documentType?.replace(/_/g, ' ') || 'Peça Processual'}
              {clientName ? ` — ${clientName}` : ''}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[hsl(var(--background))] p-6 sm:p-8 max-h-[520px] overflow-y-auto">
        <article className="mx-auto max-w-prose space-y-3 font-serif text-[13px] sm:text-sm leading-[1.75] text-foreground/90">
          {sections.map((section, idx) => {
            if (section.kind === 'header') {
              return (
                <p
                  key={idx}
                  className="text-center text-xs sm:text-sm font-bold uppercase tracking-wide text-primary/90 leading-relaxed mb-4"
                >
                  {section.text}
                </p>
              );
            }

            if (section.kind === 'title') {
              return (
                <p
                  key={idx}
                  className="text-center text-sm sm:text-base font-bold uppercase tracking-widest text-foreground border-y border-primary/20 py-3 my-4"
                >
                  {section.text}
                </p>
              );
            }

            if (section.kind === 'section') {
              return (
                <div key={idx} className="mt-5 mb-2">
                  <p className="font-bold text-foreground text-sm uppercase tracking-wide border-l-4 border-primary pl-3 py-0.5 bg-primary/5 rounded-r-md">
                    {section.text}
                  </p>
                </div>
              );
            }

            if (section.kind === 'clause') {
              return (
                <p
                  key={idx}
                  className="font-semibold text-primary/90 text-sm mt-4 mb-1"
                >
                  {section.text}
                </p>
              );
            }

            if (section.kind === 'signature') {
              return (
                <p
                  key={idx}
                  className={cn(
                    'text-muted-foreground text-xs sm:text-sm',
                    /^OAB\//i.test(section.text) && 'font-medium text-foreground/70'
                  )}
                >
                  {section.text}
                </p>
              );
            }

            if (section.kind === 'separator') {
              return <div key={idx} className="border-t border-dashed border-border my-4" />;
            }

            return (
              <p key={idx} className="text-justify indent-6 first:indent-0">
                {section.text}
              </p>
            );
          })}
        </article>
      </div>
    </div>
  );
}
