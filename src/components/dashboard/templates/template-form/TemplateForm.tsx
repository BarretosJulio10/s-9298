import { Form } from "@/components/ui/form";
import { TemplateNameField } from "./TemplateNameField";
import { TemplateFormActions } from "./TemplateFormActions";
import { SubtemplateList } from "./SubtemplateList";
import { useTemplateForm } from "../hooks/useTemplateForm";
import { useSubtemplates } from "./hooks/useSubtemplates";
import { useTemplateSubmit } from "./hooks/useTemplateSubmit";

interface TemplateFormProps {
  template?: {
    id: string;
    name: string;
    type: string;
    content: string;
  } | null;
  onCancel: () => void;
}

export function TemplateForm({ template, onCancel }: TemplateFormProps) {
  const { form, isSubmitting } = useTemplateForm({ template, onCancel });
  const { subtemplates, handleContentChange, handleImageChange } = useSubtemplates(template?.id);
  const { handleSubmit: submitTemplate } = useTemplateSubmit();

  const handleSubmit = async (values: any) => {
    const success = await submitTemplate(values, subtemplates);
    if (success) {
      onCancel();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="space-y-2">
          <TemplateNameField form={form} />
        </div>

        <SubtemplateList
          subtemplates={subtemplates}
          onContentChange={handleContentChange}
          onImageChange={handleImageChange}
        />

        <TemplateFormActions 
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          isEditing={!!template}
        />
      </form>
    </Form>
  );
}