import { Form } from "@/components/ui/form";
import { TemplateNameField } from "./template-form/TemplateNameField";
import { TemplateTypeField } from "./template-form/TemplateTypeField";
import { TemplateContentField } from "./template-form/TemplateContentField";
import { TemplateFormActions } from "./template-form/TemplateFormActions";
import { useTemplateForm } from "./hooks/useTemplateForm";

interface TemplateFormProps {
  template?: {
    id: string;
    name: string;
    type: string;
    content: string;
  };
  onCancel: () => void;
}

export function TemplateForm({ template, onCancel }: TemplateFormProps) {
  const { form, onSubmit, isSubmitting } = useTemplateForm({ template, onCancel });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <TemplateNameField form={form} />
        <TemplateTypeField form={form} />
        <TemplateContentField form={form} />
        <TemplateFormActions 
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          isEditing={!!template}
        />
      </form>
    </Form>
  );
}