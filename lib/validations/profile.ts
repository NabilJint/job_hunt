import { z } from "zod";

export const profileSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedin_url: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  portfolio: z.string().url("Invalid URL").optional().or(z.literal("")),
  work_auth: z.enum(["citizen", "permanent_resident", "visa_required"]),
  
  current_job_title: z.string().optional(),
  current_company: z.string().optional(),
  current_start_date: z.string().optional(),
  current_end_date: z.string().optional(),
  current_is_active: z.boolean().default(true),
  current_responsibilities: z.string().optional(),
  
  highest_degree: z.enum(["high_school", "bachelors", "masters", "phd"]),
  field_of_study: z.string().optional(),
  institution: z.string().optional(),
  graduation_year: z.string().regex(/^\d{4}$/, "Must be a valid year").optional(),
  
  seeking_titles: z.string().optional(),
  remote_preference: z.enum(["any", "remote", "hybrid", "onsite"]),
  salary_expectation: z.string().optional(),
  preferred_locations: z.string().optional(),
  
  skills: z.array(z.string()).default([]),
});

export type ProfileValues = z.infer<typeof profileSchema>;
