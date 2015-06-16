# Contributing to Famous Framework

## Workflow

We use a Git `rebase`-based workflow approach:

- Locally, create a `feature-branch`. Make commits on the `feature-branch`.
    - **DO NOT** make local commits on to `master` or `develop`. Doing so will force a `merge` whenever you pull down from the remote `master`/`develop`, which is what we would like to avoid.
- When ready to push up your `feature-branch`:
    - `git checkout develop`
    - `git pull origin develop`
    - `git checkout feature-branch`
    - `git rebase develop` (fix any conflicts)
    - `git checkout develop`
    - `git merge feature-branch`
    - `git push origin develop`
- When ready, one of the team members will take responsibility for merging `develop` into `master` and cutting a new semver, ensuring that `master` always remains in a stable, documented state.
- Never `merge` `master` into `develop`
- Never `merge` `master`/`develop` into a `feature-branch`
- Always `rebase` if you are further along in the "git river"
- If you accidently end up with a merge commit, deal with the issue locally and make sure it is resolved before pushing up to up to `origin`.
