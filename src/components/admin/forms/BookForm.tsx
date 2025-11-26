"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createBook, updateBook } from "@/lib/admin/actions/book";
import { bookSchema } from "@/lib/validations";
import ColorPicker from "../ColorPicker";

interface Props {
  type?: "create" | "update";
  book?: Book;
}

const BookForm = ({ type = "create", book }: Props) => {
  const isUpdate = type === "update" && book;

  // local state for uploaded cover preview
  const [imageUrl, setImageUrl] = useState<string | null>(
    book?.coverUrl || null,
  );
  const router = useRouter();

  type FormValues = z.infer<typeof bookSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: isUpdate
      ? {
          title: book.title,
          description: book.description,
          author: book.author,
          genre: book.genre,
          rating: book.rating,
          totalCopies: book.totalCopies,
          coverUrl: book.coverUrl,
          coverColor: book.coverColor,
          videoUrl: book.videoUrl,
          summary: book.summary,
        }
      : {
          title: "",
          description: "",
          author: "",
          genre: "",
          rating: 1,
          totalCopies: 1,
          coverUrl: "",
          coverColor: "#012B48",
          videoUrl: "",
          summary: "",
        },
  });

  const onSubmit = async (values: FormValues) => {
    if (isUpdate) {
      const result = await updateBook(book.id, values);

      if (result.success) {
        toast.success("Book updated successfully");
        router.push("/admin/books");
      } else {
        toast.error(result.error || "Something went wrong");
      }
    } else {
      const result = await createBook(values);

      if (result.success) {
        toast.success("Book created successfully");
        router.push("/admin/books");
      } else {
        toast.error(result.message || "Something went wrong");
      }
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup>
        {/* Title */}
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="title" className="text-dark-500">
                Book Title
              </FieldLabel>
              <Input
                {...field}
                id="title"
                placeholder="Enter book title"
                aria-invalid={fieldState.invalid}
                className="book-form_input"
              />
              <FieldDescription>
                The title of the book as it appears on the cover.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Author */}
        <Controller
          name="author"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="author" className="text-dark-500">
                Author
              </FieldLabel>
              <Input
                {...field}
                id="author"
                placeholder="Enter author name"
                aria-invalid={fieldState.invalid}
                className="book-form_input"
              />
              <FieldDescription>
                The full name of the book&apos;s author.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Genre */}
        <Controller
          name="genre"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="genre" className="text-dark-500">
                Genre
              </FieldLabel>
              <Input
                {...field}
                id="genre"
                placeholder="e.g., Fiction, Science, History"
                aria-invalid={fieldState.invalid}
                className="book-form_input"
              />
              <FieldDescription>
                The primary genre or category of the book.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Rating & Total Copies - Side by side */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Controller
            name="rating"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="rating" className="text-dark-500">
                  Rating
                </FieldLabel>
                <Input
                  {...field}
                  id="rating"
                  type="number"
                  min={1}
                  max={5}
                  placeholder="1-5"
                  aria-invalid={fieldState.invalid}
                  className="book-form_input"
                />
                <FieldDescription>Rating from 1 to 5 stars.</FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="totalCopies"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="totalCopies" className="text-dark-500">
                  Total Copies
                </FieldLabel>
                <Input
                  {...field}
                  id="totalCopies"
                  type="number"
                  min={1}
                  max={10000}
                  placeholder="Number of copies"
                  aria-invalid={fieldState.invalid}
                  className="book-form_input"
                />
                <FieldDescription>
                  Total number of copies in the library.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        {/* Cover Image */}
        <Controller
          name="coverUrl"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-dark-500">
                Book Cover Image
              </FieldLabel>
              <FieldContent>
                <FileUpload
                  endpoint="imageUploader"
                  renderPreview={false}
                  onUploadComplete={(uploadedFileUrl) => {
                    setImageUrl(uploadedFileUrl);
                    field.onChange(uploadedFileUrl);
                    toast.success("Cover image uploaded");
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(`Upload failed: ${error.message}`);
                  }}
                />
                {imageUrl && (
                  <div className="mt-4 relative">
                    <Image
                      src={imageUrl}
                      alt="Book cover preview"
                      height={200}
                      width={150}
                      className="rounded-lg border border-slate-200 object-cover"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        setImageUrl(null);
                        field.onChange("");
                      }}
                    >
                      Remove Image
                    </Button>
                  </div>
                )}
                <FieldDescription>
                  Upload a cover image for the book (JPEG, PNG, WebP).
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
            </Field>
          )}
        />

        {/* Cover Color */}
        <Controller
          name="coverColor"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-dark-500">
                Primary Cover Color
              </FieldLabel>
              <FieldContent>
                <ColorPicker
                  onPickerChange={field.onChange}
                  value={field.value}
                />
                <FieldDescription>
                  Select the primary color of the book cover for UI accents.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
            </Field>
          )}
        />

        {/* Description */}
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="description" className="text-dark-500">
                Book Description
              </FieldLabel>
              <Textarea
                {...field}
                id="description"
                placeholder="Enter a detailed description of the book..."
                rows={6}
                aria-invalid={fieldState.invalid}
                className="book-form_input"
              />
              <FieldDescription>
                A compelling description to help readers understand what the
                book is about (10-1000 characters).
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Video URL */}
        <Controller
          name="videoUrl"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-dark-500">
                Book Trailer Video
              </FieldLabel>
              <FieldContent>
                <FileUpload
                  uploadType="video"
                  placeholder="Upload a book trailer"
                  variant="light"
                  endpoint="videoUploader"
                  onUploadComplete={(url) => {
                    field.onChange(url);
                    toast.success("Video uploaded");
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(`Video upload failed: ${error.message}`);
                  }}
                />
                {field.value && (
                  <div className="mt-2">
                    <video
                      src={field.value}
                      controls
                      className="max-w-md rounded-lg"
                    >
                      <track kind="captions" />
                    </video>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => field.onChange("")}
                    >
                      Remove Video
                    </Button>
                  </div>
                )}
                <FieldDescription>
                  Optional: Upload a short trailer or promotional video.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
            </Field>
          )}
        />

        {/* Summary */}
        <Controller
          name="summary"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="summary" className="text-dark-500">
                Book Summary
              </FieldLabel>
              <Textarea
                {...field}
                id="summary"
                placeholder="Enter a brief summary..."
                rows={4}
                aria-invalid={fieldState.invalid}
                className="book-form_input"
              />
              <FieldDescription>
                A brief summary that appears on the book detail page.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      {/* Submit Button */}
      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="min-h-12"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="book-form_btn text-white flex-1"
          disabled={form.formState.isSubmitting}
          aria-busy={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting
            ? isUpdate
              ? "Updating..."
              : "Adding..."
            : isUpdate
              ? "Update Book"
              : "Add Book to Library"}
        </Button>
      </div>
    </form>
  );
};

export default BookForm;
