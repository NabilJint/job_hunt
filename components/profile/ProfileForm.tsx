"use client";

import { useState, useEffect } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { profileSchema, type ProfileValues } from "@/lib/validations/profile";
import { insforge } from "@/lib/insforge-client";

const FORM_FIELDS = Object.keys(profileSchema.shape) as (keyof ProfileValues)[];

const DEFAULT_VALUES: Partial<ProfileValues> = {
  skills: [],
  work_auth: "citizen",
  highest_degree: "bachelors",
  remote_preference: "any",
  current_is_active: true,
};

export function ProfileForm({
  onValuesChange,
  extractedData,
}: {
  onValuesChange?: (values: Record<string, any>) => void;
  extractedData?: Record<string, unknown> | null;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [hasProfile, setHasProfile] = useState(false);
  const [userData, setUserData] = useState<{ id: string; email: string } | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema) as any,
    defaultValues: DEFAULT_VALUES,
  });

  const skills = useWatch({ control, name: "skills" }) || [];
  const currentIsActive = useWatch({ control, name: "current_is_active" });

  useEffect(() => {
    const sub = watch((values) => {
      onValuesChange?.(values as Record<string, any>);
    });
    return () => sub.unsubscribe();
  }, [watch, onValuesChange]);

  useEffect(() => {
    async function loadProfile() {
      try {
        const client = insforge();
        const { data: { user } } = await client.auth.getCurrentUser();
        if (!user) return;
        setUserData({ id: user.id, email: user.email || "" });

        const { data, error } = await client
          .database
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (error) throw error;

        setHasProfile(!!data);

        const dbToForm = (row: Record<string, any>) => {
          const values: Record<string, any> = {};
          for (const key of FORM_FIELDS) {
            if (key in row) values[key] = (row as any)[key];
          }
          return values;
        };

        if (data) {
          reset({
            ...DEFAULT_VALUES,
            ...dbToForm(data),
            email: data.email || user.email || "",
          });
        } else {
          reset({
            ...DEFAULT_VALUES,
            email: user.email || "",
          });
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, [reset]);

  useEffect(() => {
    if (!extractedData) return;
    const currentValues = watch();
    const filtered = Object.fromEntries(
      Object.entries(extractedData).filter(
        ([, v]) => v !== "" && v !== null && v !== undefined
      )
    );
    reset({ ...currentValues, ...filtered } as ProfileValues);
  }, [extractedData, reset, watch]);

  const handleAddSkill = () => {
    const value = skillInput.trim();
    if (!value) return;
    
    if (!skills.includes(value)) {
      setValue("skills", [...skills, value]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    const newSkills = skills.filter((_, i) => i !== index);
    setValue("skills", newSkills);
  };

  const onSubmit = async (data: ProfileValues) => {
    setIsSaving(true);
    try {
      if (!userData) throw new Error("Not authenticated");

      const client = insforge();
      const payload: Record<string, any> = { updated_at: new Date().toISOString() };
      for (const key of FORM_FIELDS) {
        payload[key] = data[key];
      }

      const { error } = hasProfile
        ? await client.database.from("profiles").update(payload).eq("id", userData.id)
        : await client.database.from("profiles").insert([{ id: userData.id, ...payload }]);

      if (error) throw error;

      setHasProfile(true);
      toast.success("Profile updated successfully");
    } catch (err: any) {
      console.error("Save error:", err);
      toast.error(err?.message || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col items-center justify-center min-h-[400px] shadow-sm">
        <Loader2 className="w-6 h-6 animate-spin text-text-muted" />
        <p className="text-text-secondary text-sm mt-2">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col shadow-sm">
      <div className="flex flex-col gap-1 mb-8">
        <h2 className="text-text-primary text-base font-semibold">Profile Information</h2>
        <p className="text-text-secondary text-sm">
          This context is used to accurately represent you in agent interactions.
        </p>
      </div>

      <form className="flex flex-col gap-10" onSubmit={handleSubmit(onSubmit)}>
        {/* Personal Info */}
        <div className="flex flex-col gap-6">
          <h3 className="text-text-primary font-semibold text-sm">Personal Info</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Full Name</label>
              <Input {...register("full_name")} placeholder="John Doe" />
              {errors.full_name && <span className="text-[10px] text-red-500">{errors.full_name.message}</span>}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Email</label>
              <Input {...register("email")} placeholder="john@example.com" disabled />
              {errors.email && <span className="text-[10px] text-red-500">{errors.email.message}</span>}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Phone Number</label>
              <Input {...register("phone")} placeholder="+1 (555) 000-0000" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Location</label>
              <Input {...register("location")} placeholder="City, Country" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">LinkedIn URL</label>
              <Input {...register("linkedin_url")} placeholder="https://linkedin.com/in/..." />
              {errors.linkedin_url && <span className="text-[10px] text-red-500">{errors.linkedin_url.message}</span>}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Portfolio / GitHub</label>
              <Input {...register("portfolio")} placeholder="https://github.com/..." />
              {errors.portfolio && <span className="text-[10px] text-red-500">{errors.portfolio.message}</span>}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Work Authorization</label>
              <Select {...register("work_auth")}>
                <option value="citizen">Citizen</option>
                <option value="permanent_resident">Permanent Resident</option>
                <option value="visa_required">Visa Required</option>
              </Select>
            </div>
          </div>
        </div>

        <hr className="border-border" />

        {/* Professional Info */}
        <div className="flex flex-col gap-6">
          <h3 className="text-text-primary font-semibold text-sm">Professional Info</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Current/Recent Job Title</label>
              <Input {...register("current_job_title")} placeholder="Frontend Engineer" />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Company</label>
              <Input {...register("current_company")} placeholder="E.g. Vercel" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Start Date</label>
              <Input type="month" {...register("current_start_date")} />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">End Date</label>
                <label className="flex items-center gap-2 text-xs text-text-primary font-medium cursor-pointer">
                  <Checkbox 
                    {...register("current_is_active")} 
                    checked={currentIsActive}
                    onChange={(e) => setValue("current_is_active", e.target.checked)}
                  /> Currently working here
                </label>
              </div>
              <Input 
                type="text" 
                {...register("current_end_date")} 
                disabled={currentIsActive} 
                placeholder="YYYY-MM"
                className={currentIsActive ? "bg-surface-secondary text-text-muted text-center border-dashed" : ""} 
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Key Responsibilities</label>
              <Textarea {...register("current_responsibilities")} placeholder="Describe your responsibilities and achievements..." />
            </div>
          </div>
        </div>

        <hr className="border-border" />

        {/* Skills Tagging */}
        <div className="flex flex-col gap-6">
          <h3 className="text-text-primary font-semibold text-sm">Skills & Expertise</h3>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <Input 
                value={skillInput} 
                onChange={(e) => setSkillInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                placeholder="Add a skill (e.g. TypeScript)" 
              />
              <Button type="button" onClick={handleAddSkill} className="px-4">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill: string, index: number) => (
                <div key={index} className="flex items-center gap-1 px-3 py-1 bg-accent-light text-accent text-xs font-medium rounded-full border border-accent/20">
                  {skill}
                  <button type="button" onClick={() => handleRemoveSkill(index)} className="hover:text-red-500 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <hr className="border-border" />

        {/* Education */}
        <div className="flex flex-col gap-6">
          <h3 className="text-text-primary font-semibold text-sm">Education</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Highest Degree</label>
              <Select {...register("highest_degree")}>
                <option value="high_school">High School</option>
                <option value="bachelors">Bachelor's</option>
                <option value="masters">Master's</option>
                <option value="phd">Ph.D.</option>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Field of Study</label>
              <Input {...register("field_of_study")} placeholder="Computer Science" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Institution Name</label>
              <Input {...register("institution")} placeholder="E.g. State University" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Graduation Year</label>
              <Input {...register("graduation_year")} placeholder="YYYY" />
              {errors.graduation_year && <span className="text-[10px] text-red-500">{errors.graduation_year.message}</span>}
            </div>
          </div>
        </div>

        <hr className="border-border" />

        {/* Job Preferences */}
        <div className="flex flex-col gap-6">
          <h3 className="text-text-primary font-semibold text-sm">Job Preferences</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Job Titles Seeking</label>
              <Input {...register("seeking_titles")} placeholder="Frontend Engineer, React Developer" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Remote Preference</label>
              <Select {...register("remote_preference")}>
                <option value="any">Any</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-site</option>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Salary Expectation (Optional)</label>
              <Input {...register("salary_expectation")} placeholder="E.g. k+" />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Preferred Locations (Optional)</label>
              <Input {...register("preferred_locations")} placeholder="E.g. New York, London" />
            </div>
          </div>
        </div>

        <Button 
          size="lg" 
          className="w-full mt-4 py-6 text-base shadow-md flex items-center justify-center gap-2"
          disabled={isSaving}
          type="submit"
        >
          {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : "Save Profile"}
        </Button>
      </form>
    </div>
  );
}
