import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FORM_FIELDS, SECTION_LABELS, type FormFieldDef } from '@/config/documentFields';
import { getDocumentById } from '@/config/documentCatalog';
import { Users, Briefcase, Scale, FileText, ClipboardList } from 'lucide-react';

const SECTION_ICON_MAP = {
  cliente: Users,
  advogado: Briefcase,
  processo: Scale,
  partes: Users,
  conteudo: FileText,
  especifico: ClipboardList,
};

interface DocumentDynamicFormProps {
  documentId: string;
  values: Record<string, string>;
  onChange: (fieldId: string, value: string) => void;
}

function renderField(
  field: FormFieldDef,
  value: string,
  onChange: (fieldId: string, value: string) => void,
) {
  const common = {
    id: field.id,
    value: value ?? '',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(field.id, e.target.value),
  };

  if (field.type === 'textarea') {
    return (
      <Textarea
        {...common}
        placeholder={field.placeholder}
        rows={field.rows ?? 3}
        className="resize-none"
      />
    );
  }

  if (field.type === 'select' && field.options) {
    return (
      <Select value={value || undefined} onValueChange={(v) => onChange(field.id, v)}>
        <SelectTrigger>
          <SelectValue placeholder={field.placeholder ?? 'Selecione...'} />
        </SelectTrigger>
        <SelectContent>
          {field.options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Input
      {...common}
      type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'}
      placeholder={field.placeholder}
    />
  );
}

export function DocumentDynamicForm({ documentId, values, onChange }: DocumentDynamicFormProps) {
  const doc = getDocumentById(documentId);
  if (!doc) return null;

  const sections = new Map<FormFieldDef['section'], FormFieldDef[]>();

  for (const fieldId of doc.fields) {
    const base = FORM_FIELDS[fieldId];
    if (!base) continue;
    const override = doc.fieldOverrides?.[fieldId];
    const field: FormFieldDef = {
      ...base,
      label: override?.label ?? base.label,
      placeholder: override?.placeholder ?? base.placeholder,
      required: override?.required ?? base.required,
    };
    const list = sections.get(field.section) ?? [];
    list.push(field);
    sections.set(field.section, list);
  }

  const sectionOrder: FormFieldDef['section'][] = [
    'cliente', 'advogado', 'processo', 'partes', 'especifico', 'conteudo',
  ];

  return (
    <div className="space-y-6">
      {sectionOrder.map((sectionKey) => {
        const fields = sections.get(sectionKey);
        if (!fields?.length) return null;
        const Icon = SECTION_ICON_MAP[sectionKey];

        return (
          <Card key={sectionKey}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Icon className="h-5 w-5 text-primary" />
                {SECTION_LABELS[sectionKey]}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map((field) => (
                  <div
                    key={field.id}
                    className={field.type === 'textarea' ? 'md:col-span-2' : ''}
                  >
                    <Label htmlFor={field.id}>
                      {field.label}
                      {field.required ? ' *' : ''}
                    </Label>
                    {renderField(field, values[field.id] ?? '', onChange)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export function validateDocumentForm(
  documentId: string,
  values: Record<string, string>,
): string[] {
  const doc = getDocumentById(documentId);
  if (!doc) return ['Documento não encontrado.'];
  const errors: string[] = [];
  for (const fieldId of doc.fields) {
    const field = FORM_FIELDS[fieldId];
    const override = doc.fieldOverrides?.[fieldId];
    const required = override?.required ?? field?.required;
    if (required && !values[fieldId]?.trim()) {
      errors.push(field?.label ?? fieldId);
    }
  }
  return errors;
}
