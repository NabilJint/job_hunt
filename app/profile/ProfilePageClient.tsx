"use client";

import { useState, useCallback } from "react";
import { CompletionIndicator } from "@/components/profile/CompletionIndicator";
import { ResumeUpload } from "@/components/profile/ResumeUpload";
import { ProfileForm } from "@/components/profile/ProfileForm";

const SECTIONS = [
  { label: "Phone", check: (v: Record<string, any>) => isFilled(v.phone) },
  { label: "Location", check: (v: Record<string, any>) => isFilled(v.location) },
  { label: "LinkedIn", check: (v: Record<string, any>) => isFilled(v.linkedin_url) },
  { label: "Portfolio", check: (v: Record<string, any>) => isFilled(v.portfolio) },
  { label: "Experience", check: (v: Record<string, any>) => isFilled(v.current_job_title) || isFilled(v.current_company) },
  { label: "Education", check: (v: Record<string, any>) => isFilled(v.highest_degree) || isFilled(v.field_of_study) || isFilled(v.institution) || isFilled(v.graduation_year) },
  { label: "Target Roles", check: (v: Record<string, any>) => isFilled(v.seeking_titles) },
  { label: "Salary", check: (v: Record<string, any>) => isFilled(v.salary_expectation) },
  { label: "Locations", check: (v: Record<string, any>) => isFilled(v.preferred_locations) },
  { label: "Skills", check: (v: Record<string, any>) => v.skills && v.skills.length > 0 },
];

function isFilled(val: any): boolean {
  if (val === null || val === undefined) return false;
  if (typeof val === "string") return val.trim() !== "";
  return true;
}

function computeCompletion(values: Record<string, any> | null) {
  if (!values) return { percentage: 0, missingFields: SECTIONS.map(s => s.label) };

  const filled = SECTIONS.map(s => s.check(values));
  const filledCount = filled.filter(Boolean).length;
  const percentage = Math.round((filledCount / SECTIONS.length) * 100);
  const missingFields = SECTIONS.filter((_, i) => !filled[i]).map(s => s.label);

  return { percentage, missingFields };
}

export function ProfilePageClient() {
  const [formValues, setFormValues] = useState<Record<string, any> | null>(null);
  const [extractedData, setExtractedData] = useState<Record<string, unknown> | null>(null);

  const handleValuesChange = useCallback((values: Record<string, any>) => {
    setFormValues(values);
  }, []);

  const handleExtracted = useCallback((data: Record<string, unknown>) => {
    setExtractedData(data);
  }, []);

  const { percentage, missingFields } = computeCompletion(formValues);

  return (
    <>
      <CompletionIndicator completion={percentage} missingFields={missingFields} />
      <ResumeUpload onExtracted={handleExtracted} />
      <ProfileForm onValuesChange={handleValuesChange} extractedData={extractedData} />
    </>
  );
}
