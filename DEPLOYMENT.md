# Welcome Back: deployment checklist

## Putting it online

1. Put this folder in a GitHub repository (for example by uploading its contents on
   github.com). Leave out `node_modules`, `.next` and `out` if you have built it locally; the
   zip does not include them.
2. In Vercel, **Add New > Project**, import the repository. Vercel recognises Next.js; the
   default settings work (`npm run build`, which exports the static site).
3. Before the first deploy, add the environment variables below.
4. Once the site is live, the repository can be made private. Vercel keeps deploying from a
   private repository through its GitHub connection.

Do the environment step every time you create a **new** Vercel project. A fresh project starts
with no environment variables, and nothing warns you when they are missing.

## Why this matters

The site still builds and looks completely normal without these. There is no error
message. What silently breaks:

- Google Analytics collects nothing at all.
- The Lobby visitor counter shows an unoffset number around 48,000 instead of a small one.

These are `NEXT_PUBLIC_` variables baked into the build **at build time**, and the site is
a static export, so they are compiled into the JavaScript. Adding them changes nothing
until a new build runs.

## The variables

| Name | Value |
|---|---|
| `NEXT_PUBLIC_GA_ID` | `G-K54BC6K7HL` |
| `NEXT_PUBLIC_COUNTER_URL` | `https://api.counterapi.dev/v2/molly-curtiss-team-5572/first-counter-5572` |
| `NEXT_PUBLIC_COUNTER_OFFSET` | `48158` (recalculate, see step 4) |
| `NEXT_PUBLIC_SITE_URL` | Optional. Only if you use your own domain, e.g. `https://welcomeback.com`. Without it the link preview uses Vercel's production address automatically. |

## Steps

1. In Vercel, open the project and go to **Settings > Environment Variables**. This is NOT
   the page called "Environments", which manages deployment lifecycles and is a different
   thing.
2. Add the first three variables above (the fourth only if you use your own domain). Tick all
   three environments (Production, Preview, Development) for every one.
3. Redeploy. Go to Deployments, open the most recent one, and use the ... menu >
   Redeploy. Variables only reach the app on a new build.
4. Open the live Lobby page, look at the visitor counter, then follow the next section.

## Step 4: fixing the counter number

The counter is live and shared across every deployment, so the real count keeps climbing
whether or not you are working on the site. The offset is a fixed subtraction that made it
read about 52 on the day it was set, when the raw count was roughly 48,210.

That means the displayed number drifts upward over time. Nothing is broken if it does, but
if you want it to read a specific number on launch day, recalculate:

**New offset = 48158 + (number shown) - (number you want)**

Example: it shows 442 and you want it to show 52.

    48158 + 442 - 52 = 48548

Put that new value in `NEXT_PUBLIC_COUNTER_OFFSET` and redeploy once more.

Alternatively, leave it alone and let the counter show however many visits the site has
genuinely had. That is arguably the more honest answer for a visitor counter.

## How to confirm it worked

- **Counter:** the Lobby shows a small number that goes up when you visit again in a new
  browser session.
- **Analytics:** open the live site, then check GA4 Realtime. You should appear as an
  active user within a minute.
- If the counter is **blank** rather than wrong, `NEXT_PUBLIC_COUNTER_URL` did not reach
  the build.

## Housekeeping

- Delete old Vercel projects periodically. They stay live on their own URLs, so stale
  versions of the site remain reachable to anyone with the link.
- For local builds, copy `.env.example` to `.env.local` and fill in the values. `.env.local`
  is not in the zip and is gitignored, so it never ends up on GitHub; Vercel's settings are the
  source of truth.
- The code has `48158` hardcoded as a fallback, so a missing offset variable will not zero
  out the counter. It will just use the original value.
- Both values above are `NEXT_PUBLIC_`, so they are already compiled into the shipped
  JavaScript and visible to anyone who views source. Putting them in this file does not
  expose anything new, but it is worth knowing if the repository is public.

## Link preview

Sharing the link in a text, Slack, LinkedIn or similar shows `public/og.jpg` (the room with the
computer on) with the title and description from `app/layout.tsx`. Those sites cache previews, so
if an old or blank one shows after a change, LinkedIn's Post Inspector
(linkedin.com/post-inspector) refreshes it.
