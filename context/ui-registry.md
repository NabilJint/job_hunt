# UI Registry

Living document. Updated after every component is built. Read this before building any new component — match existing patterns exactly before inventing new ones.

---

## How to Use

Before building any component:

1. Check if a similar component already exists here
2. If yes — match its exact classes
3. If no — build it following ui-rules.md and ui-tokens.md, then add it here

After building any component — update this file with the component name, file path, and exact classes used.

---

## Components

### Button — `components/ui/button.tsx`

```
usage:      <Button variant="default|destructive|outline|ghost|link" size="default|sm|lg|icon" asChild>
classes:    bg-accent text-accent-foreground hover:bg-accent-dark
variant:    default  → bg-accent text-accent-foreground hover:bg-accent-dark
            destructive → bg-error text-error-foreground hover:bg-error-dark
            outline   → border border-border bg-surface text-text-primary hover:bg-surface-secondary
            ghost     → text-text-secondary hover:bg-surface-secondary
            link      → text-accent underline-offset-4 hover:text-accent-dark
size:       default   → px-4 py-2 text-sm
            sm        → px-3 py-1.5 text-xs
            lg        → px-8 py-3 text-base
            icon      → h-9 w-9
shared:     inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium
            transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent
            disabled:pointer-events-none disabled:opacity-50
```

### Navbar — `components/layout/Navbar.tsx`

```
usage:      <Navbar />
structure:  h-16 w-full bg-surface px-6 flex items-center justify-between border-b border-border
logo:       flex items-center gap-2; text-text-darkest font-bold text-[19px] leading-[28px]
nav items:  hidden md:flex items-center gap-8; text-text-dark font-medium text-[14px] leading-[20px]
            hover:text-accent transition-colors
cta btn:    bg-accent text-accent-foreground rounded-md px-4 py-2 text-[14px] font-medium
```

### Footer — `components/layout/Footer.tsx`

```
usage:      <Footer />
structure:  w-full bg-surface-secondary border-t border-border py-12 px-6
inner:      max-w-[1440px] mx-auto
cols:       grid grid-cols-2 md:grid-cols-3 gap-12
col title:  text-text-primary font-semibold text-[14px]
col link:   text-text-secondary hover:text-accent text-[14px]
bottom bar: max-w-[1440px] mx-auto mt-12 pt-8 border-t border-border
            flex flex-col md:flex-row justify-between items-center gap-4
muted text: text-text-muted text-[12px]
```

### Hero — `components/homepage/Hero.tsx`

```
usage:      <Hero />
structure:  relative w-full pt-20 pb-32 px-6 overflow-hidden
inner:      max-w-[1440px] mx-auto flex flex-col items-center text-center gap-6
headline:   text-text-darkest text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight max-w-4xl
accent:     text-accent (span within headline)
subtitle:   text-text-secondary text-lg md:text-xl max-w-2xl leading-relaxed
ctas:       flex flex-wrap justify-center gap-4 mt-4
            primary:   bg-accent text-accent-foreground rounded-md px-8 py-6 text-lg font-medium
            secondary: border-border text-text-primary rounded-md px-8 py-6 text-lg font-medium
                       hover:bg-surface-secondary transition-colors
demo img:   relative mt-16 w-full max-w-5xl aspect-video rounded-2xl border border-border
            shadow-2xl overflow-hidden bg-surface
```

### HowItWorks — `components/homepage/HowItWorks.tsx`

```
usage:      <HowItWorks />
structure:  w-full py-24 px-6 bg-surface-secondary
inner:      max-w-[1440px] mx-auto
heading:    text-text-primary text-3xl font-bold mb-4
subtitle:   text-text-secondary max-w-2xl mx-auto text-lg
grid:       grid grid-cols-1 md:grid-cols-3 gap-8
card:       bg-surface p-8 rounded-2xl border border-border flex flex-col items-center text-center
            gap-6 hover:shadow-md transition-shadow
icon wrap:  w-16 h-16 rounded-full flex items-center justify-center overflow-hidden
            (color classes vary per step — see step.color)
card title: text-text-primary text-xl font-semibold
card body:  text-text-secondary leading-relaxed
```

### Features — `components/homepage/Features.tsx`

```
usage:      <Features />
structure:  w-full py-24 px-6 bg-surface
inner:      max-w-[1440px] mx-auto
grid:       grid grid-cols-1 md:grid-cols-3 gap-12
icon box:   w-12 h-12 bg-accent-muted rounded-lg flex items-center justify-center
            inner: w-6 h-6 bg-accent rounded-sm
title:      text-text-primary text-xl font-bold
body:       text-text-secondary leading-relaxed
highlight:  text-accent font-medium text-sm (with → arrow)
```

### CTA — `components/homepage/CTA.tsx`

```
usage:      <CTA />
structure:  w-full py-24 px-6 bg-accent text-accent-foreground text-center
inner:      max-w-3xl mx-auto flex flex-col items-center gap-6
headline:   text-4xl md:text-6xl font-bold leading-tight
subtitle:   text-accent-light text-lg md:text-xl opacity-90
button:     bg-surface text-accent font-bold rounded-md px-10 py-6 text-lg
            hover:bg-surface-secondary transition-colors
```

### Login Page — `app/(auth)/login/page.tsx`

```
usage:      <LoginPage /> (authed users redirected to /dashboard)
page bg:    min-h-screen flex flex-col bg-background
top nav:    h-16 w-full bg-surface px-6 flex items-center border-b border-border
card:       w-full max-w-sm text-center
heading:    text-text-primary text-2xl font-bold mb-2
subtitle:   text-text-secondary text-sm
oauth btn:  w-full flex items-center justify-center gap-3 px-4 py-2.5
            border border-border rounded-md bg-surface
            hover:bg-surface-secondary transition-colors
            text-sm font-medium text-text-primary
icon:       w-5 h-5 (inline SVG)
tos text:   text-text-muted text-xs text-center mt-8
```

### Auth Callback — `app/(auth)/callback/page.tsx`

```
usage:      <AuthCallbackPage /> — OAuth redirect target
page bg:    min-h-screen flex items-center justify-center bg-background
            text-center
spinner:    w-8 h-8 border-2 border-accent border-t-transparent
            rounded-full animate-spin mx-auto mb-4
loading:    text-text-secondary text-sm
error msg:  text-error text-sm mb-4
error btn:  text-accent text-sm font-medium hover:text-accent-dark transition-colors
```

### Dashboard Placeholder — `app/dashboard/page.tsx`

```
usage:      <DashboardPage /> — placeholder until phase 5
page bg:    min-h-screen flex flex-col bg-background
header:     h-16 bg-surface border-b border-border flex items-center justify-between px-6
title:      text-lg font-bold text-text-primary
user email: text-sm text-text-secondary
sign out:   text-sm text-text-secondary hover:text-text-primary transition-colors
content:    text-text-secondary (centered placeholder)
```

### Input

File: `components/ui/input.tsx`
Last updated: 2026-06-13

| Property         | Class           |
| ---------------- | --------------- |
| Background       | `bg-surface` |
| Border           | `border border-border` |
| Border radius    | `rounded-md` |
| Text — primary   | `text-text-primary text-sm` |
| Text — muted     | `placeholder:text-text-muted` |
| Spacing          | `px-3 py-2` |
| Hover/Focus      | `focus-visible:ring-1 focus-visible:ring-accent` |

**Pattern notes:**
Standard text input. Follows shadcn-style ring focus.

### Textarea

File: `components/ui/textarea.tsx`
Last updated: 2026-06-13

| Property         | Class           |
| ---------------- | --------------- |
| Background       | `bg-surface` |
| Border           | `border border-border` |
| Border radius    | `rounded-md` |
| Text — primary   | `text-text-primary text-sm` |
| Text — muted     | `placeholder:text-text-muted` |
| Spacing          | `px-3 py-2 min-h-[80px]` |
| Hover/Focus      | `focus-visible:ring-1 focus-visible:ring-accent` |

**Pattern notes:**
Matches `Input` exactly, with `min-h-[80px]`.

### Select

File: `components/ui/select.tsx`
Last updated: 2026-06-13

| Property         | Class           |
| ---------------- | --------------- |
| Background       | `bg-surface` |
| Border           | `border border-border` |
| Border radius    | `rounded-md` |
| Text — primary   | `text-text-primary text-sm` |
| Spacing          | `px-3 py-2` |
| Hover/Focus      | `focus-visible:ring-1 focus-visible:ring-accent` |

**Pattern notes:**
Native select with `appearance-none` styled to match `Input`. Custom SVG caret.

### Checkbox

File: `components/ui/checkbox.tsx`
Last updated: 2026-06-13

| Property         | Class           |
| ---------------- | --------------- |
| Background       | `checked:bg-accent` |
| Border           | `border border-accent checked:border-accent` |
| Border radius    | `rounded-sm` |
| Spacing          | `h-4 w-4 shrink-0` |
| Hover/Focus      | `focus-visible:ring-2 focus-visible:ring-accent` |

**Pattern notes:**
Custom styling using CSS pseudo-elements to mimic shadcn/Radix checkbox natively.

### CompletionIndicator

File: `components/profile/CompletionIndicator.tsx`
Last updated: 2026-06-13

| Property         | Class           |
| ---------------- | --------------- |
| Background       | `bg-surface` |
| Border           | `border border-error/20` |
| Border radius    | `rounded-2xl` |
| Text — primary   | `text-text-primary text-base font-semibold` |
| Text — secondary | `text-text-secondary text-sm` |
| Spacing          | `p-6 gap-4` |
| Accent usage     | `text-error` for icon, tags `bg-error/10 text-error` |

**Pattern notes:**
Card designed to grab attention. Uses a soft error background layer (`bg-error/5`) absolute positioned inside the card.

### ResumeUpload

File: `components/profile/ResumeUpload.tsx`
Last updated: 2026-06-14

| Property         | Class           |
| ---------------- | --------------- |
| Background       | `bg-surface` |
| Border           | `border border-border` |
| Border radius    | `rounded-2xl` |
| Text — primary   | `text-text-primary text-base font-semibold` |
| Text — secondary | `text-text-secondary text-sm` |
| Spacing          | `p-6 gap-6` |
| Drop area        | `bg-surface-secondary/50 border-dashed border-border-muted p-8 rounded-xl` |
| Button row       | `flex items-center gap-2 mt-2` (after upload success) |
| Bottom row       | `flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2` |

**Pattern notes:**
Uses standard `rounded-2xl` profile section card container. After upload, action buttons use `Button size="sm"` with default variant (primary) and outline variant side by side. Bottom row (Generate Resume) uses responsive flex with gap.

### ProfileForm

File: `components/profile/ProfileForm.tsx`
Last updated: 2026-06-13

| Property         | Class           |
| ---------------- | --------------- |
| Background       | `bg-surface` |
| Border           | `border border-border` |
| Border radius    | `rounded-2xl` |
| Text — primary   | `text-text-primary font-semibold text-sm` (section title) |
| Text — secondary | `text-text-secondary text-xs font-medium uppercase tracking-wider` (label) |
| Spacing          | `p-6 gap-10` |

**Pattern notes:**
Primary data entry card. Input labels use the specific uppercase tracking style for cleanliness. Inner section containers (like Work Experience) use `border border-border rounded-xl p-6 bg-surface`.

### SearchControls — `components/find-jobs/SearchControls.tsx`

```
usage:      <SearchControls onSearch={fn} isSearching={bool} searchResult={obj} error={str} />
structure:  bg-surface border border-border rounded-2xl p-6 shadow-[...]
labels:     text-text-secondary text-xs font-medium uppercase tracking-wider
inputs:     Standard Input with Search icon (lucide) as prefix
button:     bg-accent text-accent-foreground hover:bg-accent-dark rounded-md px-6 py-2 text-sm font-medium
success:    bg-success-lightest border border-success/20 rounded-lg px-4 py-3
            text-success-dark text-sm font-medium with Sparkles icon
error:      bg-error/10 border border-error/20 rounded-lg px-4 py-3
            text-error text-sm font-medium
```

### JobFilters — `components/find-jobs/JobFilters.tsx`

```
usage:      <JobFilters filterText={} onFilterTextChange={fn} matchFilter={} onMatchFilterChange={fn} sortBy={} onSortByChange={fn} />
structure:  flex flex-col sm:flex-row items-start sm:items-center gap-3
text input: Standard input with Search icon prefix, w-full flex-1
selects:    appearance-none bg-surface border border-border rounded-md px-3 py-2 pr-8 text-sm
            with ChevronDown icon suffix
```

### JobsTable — `components/find-jobs/JobsTable.tsx`

```
usage:      <JobsTable jobs={Job[]} />
empty:      p-12 flex flex-col items-center justify-center gap-4
            Search icon (w-10 h-10 text-text-muted)
            text-text-muted text-sm text-center
structure:  bg-surface border border-border rounded-2xl shadow-[...] overflow-hidden
table:      w-full with thead border-b border-border
headers:    text-text-secondary text-xs font-medium uppercase tracking-wider px-6 py-3
rows:       border-b border-border last:border-b-0 hover:bg-surface-secondary transition-colors
company:    flex items-center gap-3 with Building2 icon in w-9 h-9 bg-surface-secondary border border-border rounded-lg
score bar:  w-24 h-1 bg-border-light rounded-full overflow-hidden
            fill: bg-success (80+), bg-info (60-79), bg-warning (<60)
salary:     text-sm text-text-secondary
date:       text-sm text-text-muted
```

### JobsPagination — `components/find-jobs/JobsPagination.tsx`

```
usage:      <JobsPagination currentPage={} totalPages={} totalResults={} pageSize={} onPageChange={fn} />
structure:  flex items-center justify-between
info:       text-sm text-text-secondary with bold spans for numbers
page btns:  flex items-center gap-1
active:     w-8 h-8 bg-accent text-accent-foreground rounded-md
inactive:   w-8 h-8 text-text-secondary border border-border bg-surface hover:bg-surface-secondary rounded-md
prev/next:  px-3 py-1.5 text-sm font-medium text-text-secondary border border-border rounded-md bg-surface
ellipsis:   px-2 py-1.5 text-sm text-text-muted
```

### JobInfo — `components/job-details/JobInfo.tsx`

```
usage:      <JobInfo job={jobRow} />
card:       bg-surface border border-border rounded-2xl shadow-[...] p-6
logo:       w-12 h-12 bg-surface-secondary border border-border rounded-xl
title:      text-xl font-semibold text-text-primary
company:    text-sm text-text-secondary
score:      inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
            score >= 90: bg-success-lightest text-success
            score >= 70: bg-success-light text-success
            score >= 50: bg-warning/10 text-warning
            < 50:        bg-surface-secondary text-text-muted
view btn:   bg-accent text-accent-foreground rounded-md px-4 py-2 text-sm
info grid:  grid grid-cols-2 sm:grid-cols-4 gap-4
info card:  bg-surface-secondary rounded-xl px-4 py-3
info label: text-xs text-text-muted font-medium
info value: text-sm font-medium text-text-primary
```

### MatchScore — `components/job-details/MatchScore.tsx`

```
usage:      <MatchScore job={jobRow} />
card:       bg-surface border border-border rounded-2xl shadow-[...] p-6
heading:    text-base font-semibold text-text-primary
score bar:  h-2 bg-border-light rounded-full
            fill >= 80: bg-success, >= 60: bg-info, < 60: bg-warning
percent:    text-lg font-semibold text-text-primary tabular-nums
label:      text-sm font-medium text-text-secondary
reason:     text-sm text-text-primary leading-relaxed
skill tag:  inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
matched:    bg-success-lightest text-success-foreground
missing:    bg-accent-muted text-accent
```

### JobDescription — `components/job-details/JobDescription.tsx`

```
usage:      <JobDescription job={jobRow} />
card:       bg-surface border border-border rounded-2xl shadow-[...] p-6
heading:    text-base font-semibold text-text-primary
subhead:    text-sm font-semibold text-text-primary
body:       text-sm text-text-primary leading-relaxed
empty:      text-sm text-text-muted
bullet:     items-start gap-2, dot w-1.5 h-1.5 rounded-full bg-text-muted
```

### CompanyResearch — `components/job-details/CompanyResearch.tsx`

```
usage:      <CompanyResearch jobId={str} companyResearch={obj|null} />
card:       bg-surface border border-border rounded-2xl shadow-[...] p-6
### Empty state
icon wrap:  w-12 h-12 bg-accent-muted rounded-xl
icon:       w-6 h-6 text-accent
heading:    text-base font-semibold text-text-primary
desc:       text-sm text-text-muted
btn:        bg-accent text-accent-foreground rounded-md px-4 py-2 text-sm
            disabled:opacity-50 disabled:cursor-not-allowed
### Dossier view
subhead:    text-sm font-semibold text-text-primary
overview:   text-sm text-text-primary leading-relaxed
tech tag:   bg-surface-secondary text-text-primary border border-border rounded-full
culture:    dot w-1.5 h-1.5 rounded-full bg-accent
your edge:  dot w-1.5 h-1.5 rounded-full bg-success
gaps:       dot w-1.5 h-1.5 rounded-full bg-warning
questions:  dot w-1.5 h-1.5 rounded-full bg-info
prep:       dot w-1.5 h-1.5 rounded-full bg-accent
sources:    text-xs text-text-muted
```

### JobActions — `components/job-details/JobActions.tsx`

```
usage:      <JobActions externalApplyUrl={str|null} />
container:  flex justify-center
btn:        bg-accent text-accent-foreground rounded-md px-8 py-3 text-base
            inline-flex items-center gap-2
```

### StatsBar — `components/dashboard/StatsBar.tsx`

```
usage:      <StatsBar totalJobs={num} avgMatchRate={num} companiesResearched={num} jobsThisWeek={num} />
structure:  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4
card:       bg-surface border border-border rounded-2xl p-6
            shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]
label:      text-text-secondary text-[14px] font-medium leading-[20px]
value:      text-text-primary text-[30px] font-semibold leading-[36px] tabular-nums
trend:      inline-block px-2 py-0.5 text-success-darker text-[12px] font-medium
            bg-success-lightest rounded
subtitle:   text-text-muted text-[12px] font-normal leading-[16px]
```

### RecentActivity — `components/dashboard/RecentActivity.tsx`

```
usage:      <RecentActivity activities={ActivityItem[]} />
structure:  bg-surface border border-border rounded-2xl p-6 h-full
heading:    text-text-primary text-[16px] font-semibold leading-[24px]
item:       flex items-start gap-3
dot outer:  w-4 h-4 rounded-full (green: bg-success-light, blue: bg-info-light)
dot inner:  w-2 h-2 rounded-full (green: bg-success-alt, blue: bg-info)
text:       text-text-primary text-[14px] font-medium leading-[20px]
timestamp:  text-text-muted text-[12px] font-normal leading-[16px]
empty:      text-text-muted text-[14px]
```

### CompanyResearchChart — `components/dashboard/CompanyResearchChart.tsx`

```
usage:      <CompanyResearchChart />
structure:  bg-surface border border-border rounded-2xl p-6 h-full
chart:      recharts BarChart, bar fill #61A8FF (info), radius [4,4,0,0]
grid:       strokeDasharray 3 3, stroke #E7EAF3, vertical false
axis:       axisLine false, tickLine false, tick fontSize 12 fill #9CA3AF
```

### JobsOverTimeChart — `components/dashboard/JobsOverTimeChart.tsx`

```
usage:      <JobsOverTimeChart />
structure:  bg-surface border border-border rounded-2xl p-6 h-full
chart:      recharts AreaChart, stroke #7C5CFC (accent), strokeWidth 3
gradient:   linearGradient id "colorJobs" — accent with 0.2→0 opacity
grid:       strokeDasharray 3 3, stroke #E7EAF3, vertical false
axis:       axisLine false, tickLine false, tick fontSize 12 fill #9CA3AF
```

### MatchScoreChart — `components/dashboard/MatchScoreChart.tsx`

```
usage:      <MatchScoreChart />
structure:  bg-surface border border-border rounded-2xl p-6 h-full
chart:      recharts BarChart, bar fill #10B981 (success), radius [4,4,0,0]
grid:       strokeDasharray 3 3, stroke #E7EAF3, vertical false
axis:       axisLine false, tickLine false, tick fontSize 12 fill #9CA3AF
```
