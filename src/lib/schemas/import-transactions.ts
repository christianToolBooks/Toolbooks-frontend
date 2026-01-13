import { z } from "zod";

export type UploadFormValues = z.infer<typeof uploadTransactionFormSchema>;

export const uploadTransactionFormSchema = z.object({
    file: z
        .instanceof(File, { message: "You must select a file." })
        .refine((file) => file.size > 0, "The file cannot be empty.")
        .refine(
            (file) => file.size <= 5 * 1024 * 1024,
            `The maximum file size is 5 MB.`,
        )
        .refine(
            (file) =>
                ["application/pdf", "image/png", "image/jpeg"].includes(file.type),
            "Only PDF, PNG, and JPG files are accepted."
        ),
});         