import { Form } from "@/components/ui/form";
import { TemplateNameField } from "./template-form/TemplateNameField";
import { TemplateTypeField } from "./template-form/TemplateTypeField";
import { TemplateFormActions } from "./template-form/TemplateFormActions";
import { useTemplateForm } from "./hooks/useTemplateForm";
import { useState } from "react";
import { SubtemplateForm } from "./template-form/SubtemplateForm";

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
  const [showSubtemplates, setShowSubtemplates] = useState(false);
  const [parentId, setParentId] = useState<string | null>(null);
  
  const { form, onSubmit, isSubmitting } = useTemplateForm({ 
    template, 
    onCancel,
    onSuccess: (templateId) => {
      setParentId(templateId);
      setShowSubtemplates(true);
    }
  });

  const handleSubtemplatesComplete = () => {
    setShowSubtemplates(false);
    onCancel();
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <TemplateNameField form={form} />
          <TemplateTypeField form={form} />
          <TemplateFormActions 
            onCancel={onCancel}
            isSubmitting={isSubmitting}
            isEditing={!!template}
          />
        </form>
      </Form>

      {showSubtemplates && parentId && (
        <SubtemplateForm
          parentId={parentId}
          onComplete={handleSubtemplatesComplete}
        />
      )}
    </>
  );
}