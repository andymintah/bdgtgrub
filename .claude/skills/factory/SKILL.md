---
name: factory
description: Run the software factory. Turns a feature request into a spec, builds it on its own branch and worktree, reviews it from four angles, and merges it to main or hands it to a human. Use for "/factory <feature>", "/factory next", "/factory approve <job-id>" and "/factory rework <job-id> <note>".
argument-hint: <feature> | next | approve <job-id> | rework <job-id> <note>
---

You are the orchestrator. You run the loop below, spawn every agent, and are the
only writer of `job.json`. You do not write specs, code, reviews or decisions
yourself; agents do. Keep the user posted with one short line per stage change.

## Paths

- `REPO`: the main checkout (`git rev-parse --show-toplevel` from the session's
  directory, on `main`). Job state lives here, never in a worktree.
- `JOB`: `REPO/factory/jobs/<job-id>/` (gitignored runtime state).
- `WT`: `REPO/../budgetgrub-factory/<job-id>/`, a git worktree on branch
  `factory/<job-id>`. All code changes happen here.

Always give agents absolute paths for `REPO`, `JOB` and `WT`.

## job.json

`JOB/job.json` drives `factory/dashboard.html`. Rewrite the whole file on every
change:

```json
{ "id": "004-empty-state", "feature": "<one-line feature text>",
  "branch": "factory/004-empty-state", "worktree": "<abs WT>", "port": 3104,
  "stage": "review", "round": 1,
  "reviews": { "security": "pending", "ux": "PASS", "ui": "pending", "code": "CHANGES" } }
```

`stage` is one of `spec`, `build`, `review`, `approve`, `merged`, `needs-human`.
`round` is 0 until the first review round starts. `reviews` holds the current
round only; on a new round reset all four to `pending`.

## Commands

### `/factory <feature>`

1. **Create the job.** The id is `NNN-slug`: NNN is one more than the highest
   number in `REPO/factory/jobs/` (zero-padded to 3), and slug is 2-4 kebab-case
   words from the feature. Port is `3100 + NNN`. Create `JOB/` and write
   `job.json` with stage `spec`, round 0, all reviews `pending`.
2. **Worktree.** From `REPO`:
   `git worktree add ../budgetgrub-factory/<id> -b factory/<id> main`, then run
   `npm install` in `WT`.
3. **Spec.** Spawn `spec-writer` with the feature text, `REPO`, `WT` and `JOB`.
   Wait for `JOB/spec.md`.
4. **Build.** Set stage `build`. Spawn `builder` with the name `builder-<id>`,
   giving it `WT`, `JOB`, the port and the branch. Wait for `JOB/build.md`. If
   its first line is `STATUS: BLOCKED`, set stage `needs-human` and stop.
5. **Review round N** (N starts at 1). Set stage `review`, round N, reviews all
   `pending`. Spawn the four reviewers **in parallel, in one message**:
   `reviewer-security`, `reviewer-ux`, `reviewer-ui`, `reviewer-code`. Tell each
   one `WT`, `JOB`, the port, and its output file
   `JOB/round-N/review-<key>.md`. As each one finishes, read the first line of
   its file and update `reviews.<key>` to `PASS` or `CHANGES`.
   **WAIT FOR ALL:** the round is done only when all four files exist. Never
   resume the builder mid-round.
6. **Decide on the round.**
   - Any `CHANGES` and N < 3: resume `builder-<id>` with SendMessage, pointing
     it at `JOB/round-N/`. If it can't be resumed, spawn a new `builder` and tell
     it to read `JOB/spec.md`, `JOB/build.md` and `JOB/round-N/` first. Set
     stage `build`, wait for the updated `build.md`, then go to step 5 with N+1.
     (That's at most two rework rounds.)
   - Any `CHANGES` and N = 3: set stage `needs-human` and stop.
   - All `PASS`: go on to step 7.
7. **Approve.** Set stage `approve`. Spawn `approver` with `WT`, `JOB` and the
   branch. Wait for `JOB/decision.md`.
   - `ESCALATE`: set stage `needs-human` and stop. Tell the user why, in one
     line, and give them the `approve` and `rework` commands.
   - `APPROVE`: go to **Merge**.

### Merge

Run from `REPO`:

1. Check `REPO` is on `main`. If the merge would touch files that have
   uncommitted changes in `REPO`, stop and ask the user. Don't stash or discard
   their work.
2. `git merge --no-ff factory/<id> -m "Merge factory/<id>: <feature>"`. On a
   conflict, run `git merge --abort`, set stage `needs-human`, and tell the user.
3. Run `git worktree remove ../budgetgrub-factory/<id>` and
   `git branch -d factory/<id>`.
4. Set stage `merged`. If the feature came from the backlog, check it off.
5. Don't push.

### `/factory next`

Take the first `- [ ]` item in `REPO/factory/backlog.md` and run it as
`/factory <item text>`. Once the job id exists, change that line to
`- [x] <item text> (<job-id>)` so parallel sessions don't pick the same item.
If the job ends in `needs-human`, leave it checked: the job id shows where it
went.

### `/factory approve <job-id>`

The job must be in stage `needs-human`, and `JOB/decision.md` must exist (it can
say `ESCALATE`). Run **Merge**. A human approving overrides the approver.

### `/factory rework <job-id> <note>`

The job must be in stage `needs-human`. Write the note to `JOB/rework-K.md`,
where K is the next free number. Resume `builder-<id>`, or spawn a new
`builder` told to read `spec.md`, `build.md`, all the rounds and the rework
file. Set stage `build`. When `build.md` is updated, run step 5 with round
number (current round + 1), and continue the loop with a fresh limit of two
rework rounds counted from there.

## Rules

- Agents get their context from files, not this conversation. Each prompt you
  write is a few lines: the paths, the port, the round, and which file to write.
- Each agent writes only its own file. If an agent's file is missing or its
  first line is malformed, re-run that agent once. If it fails again, set stage
  `needs-human`.
- Never change code in `WT` or `REPO` yourself, and never force-push or delete
  branches that aren't `factory/<id>`.
