'use client';

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import DatePicker from "@/components/DatePicker";
import { useState } from "react";

// Define the form fields with their expected types
type FormData = {
  title: string;
  file: FileList;
};

export default function UploadPage() {
  // Initialize react-hook-form for form validation and submission handling
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  // State to hold the selected date from the calendar
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Handle form submission
  const onSubmit = (data: FormData) => {
    const file = data.file[0]; // Get the first uploaded file
    if (!file) {
      alert("Please select a file");
      return;
    }

    // Simulate a file upload with selected date
    alert(`Uploaded "${data.title}" with file "${file.name}" on ${selectedDate?.toDateString()}`);
    
    // You can replace this with your actual upload logic
    // For example, sending form data to an API endpoint
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white shadow-md rounded-xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Upload Notes</h1>

      {/* Form begins here */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        {/* Title input */}
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

        {/* File upload input */}
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

        {/* Calendar date picker */}
        <div>
          <Label>Date of Upload</Label>
          <DatePicker onDateChange={(date) => setSelectedDate(date)} />
        </div>

        {/* Submit button */}
        <Button type="submit" className="w-full">
          Upload
        </Button>
      </form>
    </div>
  );
}
