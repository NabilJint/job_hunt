"use client";

import { useState, useEffect } from "react";
import { CloudUpload, FileText, Loader2, CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { insforge } from "@/lib/insforge-client";

export function ResumeUpload({
  onExtracted,
}: {
  onExtracted?: (data: Record<string, unknown>) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; url: string; key: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadExisting() {
      try {
        const client = insforge();
        const { data: { user } } = await client.auth.getCurrentUser();
        if (!user) return;

        const { data, error } = await client
          .database
          .from("profiles")
          .select("resume_url, resume_key")
          .eq("id", user.id)
          .maybeSingle();

        if (error) throw error;
        if (data?.resume_url && data?.resume_key) {
          const name = data.resume_key.split("/").pop() || "Resume";
          setUploadedFile({ name, url: data.resume_url, key: data.resume_key });
        }
      } catch (err) {
        console.error("Error loading resume:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadExisting();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit.");
      return;
    }

    setIsUploading(true);
    try {
      const client = insforge();
      const { data: { user } } = await client.auth.getCurrentUser();
      if (!user) throw new Error("Not authenticated");

      const filePath = `resumes/${user.id}/${Date.now()}-${file.name}`;
      
      const { data: uploadData, error: uploadError } = await client.storage
        .from("resumes")
        .upload(filePath, file);

      if (uploadError) throw uploadError;
      if (!uploadData) throw new Error("Upload failed - no data returned");

      // Check if profile exists before updating
      const { data: existingProfile } = await client
        .database
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      const { error: profileError } = existingProfile
        ? await client.database.from("profiles").update({ resume_url: uploadData.url, resume_key: uploadData.key }).eq("id", user.id)
        : await client.database.from("profiles").insert([{ id: user.id, resume_url: uploadData.url, resume_key: uploadData.key }]);

      if (profileError) throw profileError;

      setUploadedFile({ name: file.name, url: uploadData.url, key: uploadData.key });
      toast.success("Resume uploaded successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload resume");
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerateResume = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/resume/generate", { method: "POST" });
      const json = await res.json();

      if (!json.success) {
        toast.error(json.error || "Failed to generate resume");
        return;
      }

      setUploadedFile({
        name: "Generated Resume",
        url: json.resumeUrl,
        key: json.resumeKey,
      });
      toast.success("Resume generated successfully");
    } catch {
      toast.error("Failed to generate resume. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExtract = async () => {
    if (!uploadedFile) return;
    setIsExtracting(true);
    try {
      const res = await fetch("/api/resume/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeKey: uploadedFile.key }),
      });
      const json = await res.json();

      if (!json.success) {
        toast.error(json.error || "Extraction failed");
        return;
      }

      toast.success("Profile data extracted — review below");
      onExtracted?.(json.data);
    } catch {
      toast.error("Extraction failed. Please try again.");
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col gap-6 shadow-sm">
      <div className="flex flex-col gap-1">
        <h2 className="text-text-primary text-base font-semibold">Resume</h2>
        <p className="text-text-secondary text-sm">
          Upload an existing resume to auto-fill the profile, or generate a new tailored one from your details below.
        </p>
      </div>

      <div className="border border-dashed border-border-muted rounded-xl bg-surface-secondary/50 p-8 flex flex-col items-center justify-center text-center gap-4">
        {isLoading ? (
          <Loader2 className="w-6 h-6 animate-spin text-text-muted" />
        ) : uploadedFile ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-accent-light text-accent flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-text-primary text-sm font-medium">{uploadedFile.name}</p>
              <p className="text-text-muted text-xs">Successfully uploaded</p>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Button variant="outline" size="sm" asChild>
                <a href={`/api/resume/view?key=${encodeURIComponent(uploadedFile.key)}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                  View Resume
                </a>
              </Button>
              <Button
                size="sm"
                onClick={handleExtract}
                disabled={isExtracting}
              >
                {isExtracting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Extracting...</>
                ) : (
                  "Extract from Resume"
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUploadedFile(null)}
              >
                Change File
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-accent-light text-accent flex items-center justify-center mb-2">
              <CloudUpload className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-text-primary text-sm font-medium">Click to upload or drag and drop</p>
              <p className="text-text-muted text-xs">PDF formatting only. Maximum file size 5MB.</p>
            </div>
            <div className="relative">
              <input 
                type="file" 
                accept=".pdf" 
                onChange={handleFileChange} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline" disabled={isUploading}>
                {isUploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : "Select Resume"}
              </Button>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <p className="text-text-secondary text-sm">Need a fresh document based on the fields below?</p>
        <Button 
          className="w-full sm:w-auto gap-2" 
          disabled={isGenerating} 
          onClick={handleGenerateResume}
        >
          {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><FileText className="w-4 h-4" /> Generate Resume from Profile</>}
        </Button>
      </div>
    </div>
  )
}
