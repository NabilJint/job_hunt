import { AlertCircle, CheckCircle2 } from "lucide-react"

export function CompletionIndicator({ completion = 0, missingFields = ["Phone", "Location", "Education"] }: { completion: number; missingFields: string[] }) {
  const isComplete = completion >= 100;

  return (
    <div className={`border rounded-2xl p-6 flex items-center justify-between shadow-sm relative overflow-hidden ${isComplete ? "bg-surface border-accent/20" : "bg-surface border-error/20"}`}>
      <div className={`absolute inset-0 pointer-events-none ${isComplete ? "bg-accent/5" : "bg-error/5"}`} />
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          {isComplete ? (
            <CheckCircle2 className="w-5 h-5 text-accent" />
          ) : (
            <AlertCircle className="w-5 h-5 text-error" />
          )}
          <h2 className="text-text-primary text-base font-semibold">
            {isComplete ? "Profile is complete" : "Profile needs attention"}
          </h2>
        </div>
        <p className="text-text-secondary text-sm">
          {isComplete
            ? "Your profile is fully filled out. You're ready for tailored matches and resume generation."
            : "Complete the missing fields to improve your chance of getting tailored matches and generating quality resumes."
          }
        </p>
        {!isComplete && missingFields.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {missingFields.map((field) => (
              <span key={field} className="bg-error/10 text-error px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider">{field}</span>
            ))}
          </div>
        )}
      </div>
      
      {/* Circular Progress Ring */}
      <div className="relative z-10 w-24 h-24 shrink-0 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" className="stroke-border-light fill-none" strokeWidth="8" />
          <circle 
            cx="50" cy="50" r="40" 
            className={isComplete ? "stroke-accent fill-none" : "stroke-error fill-none"}
            strokeWidth="8" 
            strokeDasharray="251.2" 
            strokeDashoffset={251.2 * (1 - completion / 100)}
            strokeLinecap="round" 
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-text-primary">{completion}%</span>
        </div>
      </div>
    </div>
  )
}
