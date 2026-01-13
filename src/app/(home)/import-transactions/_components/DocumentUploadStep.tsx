// app/(home)/import-transactions/_components/DocumentUploadStep.tsx
'use client';

import { useRef } from 'react';

//Schema, type and service
import { NewDocumentImportData } from '@/src/types/document-import';

import useDocumentUpload from '../_hooks/useDocumentUpload';
//UI Implements
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Progress } from '@/src/components/ui/progress';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';

export interface DocumentUploadStepProps {
  status: (status: boolean) => void;
  onUploadSuccessAction?: (
    data: NewDocumentImportData,
    filname: string
  ) => void;
  setCurrentFilname: React.Dispatch<React.SetStateAction<string>>;
  onCancelAction: () => void;
}

export default function DocumentUploadStep({
  onUploadSuccessAction,
  onCancelAction,
  setCurrentFilname,
}: DocumentUploadStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadProgress, form, onSubmit, uploadMutation } = useDocumentUpload({
    onUploadSuccessAction,
  });

  const handleButtonSelectFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current?.click();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 1: Upload Document</CardTitle>

        <CardDescription>
          Select bank statement in PDF format to review.
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-1">
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="file"
              render={({
                field: { onChange: onFileChange, value, ...rest },
              }) => (
                <FormItem>
                  <FormLabel>Extract File (PDF, PNG or JPG)</FormLabel>

                  <FormControl>
                    <Input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={e => {
                        const file = e.target.files?.[0] || null;

                        if (file) {
                          onFileChange(file);
                          setCurrentFilname(file.name);
                        }
                      }}
                      {...rest}
                      disabled={uploadMutation.isPending}
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                    />
                  </FormControl>

                  {/* Own button for an input file */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleButtonSelectFileClick}
                    disabled={uploadMutation.isPending}
                  >
                    Select File
                  </Button>

                  {value && (
                    <p className="mt-2 text-sm text-gray-500">{value.name}</p>
                  )}

                  <FormDescription>
                    Structured PDFs only. Max. 5 MB.
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            {uploadMutation.isPending && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="w-full" />

                <p className="text-sm text-muted-foreground text-center">
                  Analyzing extract... This may take a moment.
                </p>
              </div>
            )}

            {form.formState.errors.file && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.file.message}
              </p>
            )}
          </CardContent>

          <CardFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancelAction}
              disabled={uploadMutation.isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={uploadMutation.isPending || !form.formState.isValid}
            >
              {uploadMutation.isPending ? 'Analyzing...' : 'Analyze Extract'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
