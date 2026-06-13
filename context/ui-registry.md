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
