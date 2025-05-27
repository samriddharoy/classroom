'use client';

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type FormData = {
  title: string;
  file: FileList;
};

export default function UploadPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    const file = data.file[0];
    if (!file) {
      alert("Please select a file");
      return;
    }

    alert(`Uploaded "${data.title}" with file "${file.name}"`);
    // Uploading  logic  here
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white shadow-md rounded-xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Upload Notes</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Enter note title"
            {...register("title", { required: true })}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">Title is required</p>
          )}
        </div>

        <div>
          <Label htmlFor="file">Upload File</Label>
          <Input
            id="file"
            type="file"
            accept=".pdf,.doc,.docx"
            {...register("file", { required: true })}
          />
          {errors.file && (
            <p className="text-red-500 text-sm mt-1">File is required</p>
          )}
        </div>

        <Button type="submit" className="w-full">Upload</Button>
      </form>
    </div>
  );
}
