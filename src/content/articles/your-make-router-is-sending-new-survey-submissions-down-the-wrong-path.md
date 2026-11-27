---
title: "Your Make Router Is Sending New Survey Submissions Down the Wrong Path"
description: "An inherited Survey123 → Make → Google Sheets → Calendar scenario routes new records to the update path and fails silently. Here is a reader-centred troubleshooting guide for fixing router fallback logic, validating rowNumber, and debugging Survey123 webhook false successes."
publishDate: 2026-11-28
category: automation
tags: ["Make", "Integromat", "Survey123", "Google Sheets", "router", "troubleshooting", "no-code automation"]
author: "Prismbyte Editorial Team"
featuredImage: "https://raw.githubusercontent.com/victorikaraoha23/prismbyte/main/public/images/generated/prismbyte-your-make-router-is-sending-new-survey-submissions-down-the-wron-2026-11-27T23-04-06-718Z.png"
featuredImageAlt: "Editorial image illustrating the article topic: Your Make Router Is Sending New Survey Submissions Down the Wrong Path."
imageSource: "AI-generated with Cloudflare Workers AI — FLUX.1 Schnell; stored on the production main branch"
draft: false
sources:
  - https://www.reddit.com/r/automation/comments/1npcxz2/help_make_scenario_not_working_properly
  - https://community.make.com/t/fallback-option-on-a-router-triggers-even-though-the-other-route-triggered-first/63622
  - https://community.make.com/t/google-sheets-search-rows-returns-0-bundles-router-cannot-route-new-member-path/114041
  - https://community.make.com/t/survey123-scenario-for-edits/113006
  - https://community.make.com/t/google-sheets-update-row-or-add-new-row-if-doesnt-exist/17704
affiliateDisclosure: false
---

# Your Make Router Is Sending New Survey Submissions Down the Wrong Path

You inherited a Make scenario. It was working—until it wasn’t. New Survey123 submissions stop appearing in Google Calendar and Google Sheets. Make’s execution history shows the submission going down the “edit” path, Search Rows comes back empty, Update Row throws a missing `rowNumber` error, and the Add Row fallback never fires. To make it worse, Survey123 tells the submitter “sent successfully,” so nobody knows data is disappearing until an appointment is missed.

If that sounds like your week, you are not alone. This is a common failure mode in inherited no-code automations, and it is usually fixable without rebuilding the whole scenario.

## What is likely happening

A Reddit user in r/automation described an inherited Survey123 → Make → Google Sheets → Calendar setup that matches your situation almost exactly: new submissions are routed to the update path (`editData`), Search Rows returns nothing, Update Row fails on a missing `rowNumber`, the Add Row fallback never runs, and Survey123 still reports “sent successfully” ([Reddit discussion](https://www.reddit.com/r/automation/comments/1npcxz2/help_make_scenario_not_working_properly)).

Here is the chain of failure as described by practitioners:

1. A new Survey123 submission arrives in Make.
2. Make runs **Search Rows** in Google Sheets. For a brand-new record, the search finds nothing and returns **0 bundles**. One Make Community practitioner reported this precisely: when testing with a completely new email, Search Rows returned 0 bundles and the Add a Row module did not execute ([Make Community thread](https://community.make.com/t/google-sheets-search-rows-returns-0-bundles-router-cannot-route-new-member-path/114041)).
3. Because Search Rows returns no bundles, the Router has nothing meaningful to evaluate—or it evaluates a stale `editData` flag and sends the submission down the edit/update path anyway.
4. **Update Row** then fails because `rowNumber` is empty.
5. The **Add Row** fallback never runs, or runs inconsistently.
6. Survey123 may say “sent successfully” because it only confirms the form submission reached Survey123’s webhook endpoint, not that Make processed it. This is based on your report and the Reddit snippet; it has not been independently verified beyond those sources.

## Why the router matches editData for a brand-new submission

Router filters are often built around flags like `editData` rather than the actual search result. When Search Rows returns zero bundles, there is no row to update, but the router may still send the bundle down the update path if the filter condition is poorly constructed or if the scenario was originally designed for edits only.

There is genuine disagreement in the Make community about how router “fallback” routes behave. Some users expect fallback to mean “only if no other route matched,” but practitioners report that both paths can activate when the first route triggers, and they needed additional filters to stop the fallback from running ([Make Community discussion](https://community.make.com/t/fallback-option-on-a-router-triggers-even-though-the-other-route-triggered-first/63622)). In other words, toggling fallback on is not, by itself, a reliable safety net.

## Step-by-step fix

If you have permission to edit filters and router settings—but not to move modules or change Google Sheets access—start here. If you cannot reorder modules at all, you may need to ask whoever owns the scenario to make the structural change, or work within the existing order using filters only.

### 1. Place Search Rows before the Router (or confirm it already is)

The recommended architecture is to put a Search module between Survey123 and the Router, then route update versus create based on the search result. One Make Community practitioner suggested using a unique ID such as `GlobalId` rather than relying on `editData` flags ([Make Community thread](https://community.make.com/t/survey123-scenario-for-edits/113006)).

If you cannot move modules, check whether Search Rows already sits before the Router. If it sits after, the Router is making decisions before it knows whether a row exists.

### 2. Build router filters on bundle count, not editData flags

Use the Search Rows output as the decision point:

- **0 bundles** → this is a new record → route to the **Add Row** path.
- **Greater than 0 bundles** → this is an existing record → route to the **Update Row** path.

This is the approach practitioners recommend for distinguishing new from existing records when Search Rows returns 0 bundles for new emails ([Make Community thread](https://community.make.com/t/google-sheets-search-rows-returns-0-bundles-router-cannot-route-new-member-path/114041)).

### 3. Add a validation filter between Search Rows and Update Row

Before Update Row runs, add a filter that requires `rowNumber` to exist and be non-empty. If `rowNumber` is missing, do not send the bundle to Update Row. Instead, route it to Add Row.

This directly addresses the missing `rowNumber` validation error you are seeing.

### 4. Make Add Row a true fallback with explicit filters

Because community users report that fallback routes can fire even when another route already matched, do not rely on the Router’s fallback toggle alone ([Make Community discussion](https://community.make.com/t/fallback-option-on-a-router-triggers-even-though-the-other-route-triggered-first/63622)). Add an explicit filter to the Add Row route so it only runs when:

- Search Rows returned 0 bundles, **and**
- `rowNumber` is missing or empty.

One beginner described a similar update-or-add pattern using a unique key and a separate route for adding a row with a filter ([Make Community thread](https://community.make.com/t/google-sheets-update-row-or-add-new-row-if-doesnt-exist/17704)).

### 5. Test side by side

Run two tests:

1. A known-new submission (no matching row in Google Sheets).
2. A known-existing submission (a row already present).

Check the execution history for each to confirm which route the bundle actually took. Do not assume the fix works based on one test.

## How to debug event-type values and data flow

Open Make’s scenario history and click into the failed execution. Inspect the **input and output bundles** at each module:

- **Survey123 module:** What event-type values are being sent? Confirm the payload contains the unique ID you are searching on.
- **Search Rows module:** Did it return 0 bundles or 1+ bundles?
- **Router:** Which route did the bundle enter, and why?
- **Update Row / Add Row:** Did the module receive the expected fields?

If the bundle count from Search Rows is 0 for a new submission, that confirms the router is being asked to route on missing data. If Survey123 sends an event type you do not recognize, that may explain why the router is matching the wrong path.

## Why Survey123 says “sent successfully” when Make receives nothing

Survey123’s “sent successfully” message generally confirms that the form submission was accepted by Survey123, not that Make successfully received or processed the webhook payload. If Make never receives the data—or receives it but fails before completing—the submitter still sees a success screen. This creates silent data loss: appointments never reach Google Calendar or Sheets, and nobody is alerted.

To make these failures visible, add error handling or a webhook response check so that when Make cannot process a submission, the failure shows up in Make’s execution logs instead of disappearing. The exact module or directive depends on your scenario’s permissions and structure; start by reviewing Make’s scenario history for executions that stopped without completing.

## How to prevent this from breaking again

Inherited scenarios often arrive without documentation, which makes new owners afraid to touch filters or router settings. A few practical safeguards:

- **Clone the scenario before editing.** Test changes on the clone first so you cannot break the live workflow.
- **Document the router logic.** Write down which route handles new records, which handles updates, and what the fallback is supposed to do.
- **Use a unique key.** Search on a stable identifier (such as `GlobalId` or submission ID) rather than a flag that can change between submissions.
- **Monitor execution logs.** Periodically check for failed Update Row executions or 0-bundle Search Rows results.
- **Limit who can edit filters.** If multiple people have access, agree on a change process so router logic is not altered without testing.

## When a simpler approach makes sense

If your submission volume is low and edits are rare, it may be sensible to enter new records manually rather than maintain a fragile automation. If you cannot change module order, lack permissions to adjust Google Sheets access, or are unsure what a filter does, doing nothing is safer than guessing. In that case, ask the person who built the scenario—or someone with full Make and Google Workspace permissions—to review the router logic before you make changes.

## Your next steps

1. Open the failing execution in Make scenario history and confirm Search Rows returns 0 bundles for new submissions.
2. Move Search Rows before the Router if you have permission; otherwise, ask the scenario owner to do so.
3. Replace `editData`-based router filters with bundle-count filters: 0 bundles → Add Row, greater than 0 → Update Row.
4. Add a validation filter before Update Row requiring `rowNumber` to exist and be non-empty.
5. Add explicit filters to the Add Row route so it does not run when the update route already succeeded.
6. Test with one known-new and one known-existing submission side by side.
7. Review Survey123 webhook behavior and add error handling so failed Make executions are visible in logs.

---

### Sources

- [Reddit: Help! Make scenario not working properly](https://www.reddit.com/r/automation/comments/1npcxz2/help_make_scenario_not_working_properly)
- [Make Community: Fallback Option on a Router triggers, even though the other route triggered first](https://community.make.com/t/fallback-option-on-a-router-triggers-even-though-the-other-route-triggered-first/63622)
- [Make Community: Google Sheets Search Rows returns 0 bundles — Router cannot route new-member path](https://community.make.com/t/google-sheets-search-rows-returns-0-bundles-router-cannot-route-new-member-path/114041)
- [Make Community: Survey123 scenario for edits](https://community.make.com/t/survey123-scenario-for-edits/113006)
- [Make Community: Google Sheets Update Row or Add New Row if Doesn't Exist](https://community.make.com/t/google-sheets-update-row-or-add-new-row-if-doesnt-exist/17704)