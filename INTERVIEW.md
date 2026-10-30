# Interview Corner - Git & Asynchronous JavaScript

Short, punchy answers tailored for technical interviews. Each answer is kept under 80 words.

---

### 1. Explain microtasks vs macrotasks, and predict the snippet output

**Question:**
> Explain microtasks vs macrotasks, and predict the output of:
> `setTimeout(() => log(1)); Promise.resolve().then(() => log(2)); log(3);`

**Answer:**
Microtasks (`Promise.then`, `queueMicrotask`) have priority over macrotasks (`setTimeout`, `setInterval`, I/O). The JavaScript engine runs synchronous code first, completely exhausts the microtask queue, and only then executes the next queued macrotask.

**Output:** `3`, `2`, `1`

**Why:** `log(3)` runs synchronously on the call stack. The Promise resolution queues microtask `log(2)`, while `setTimeout` queues macrotask `log(1)`. Once the stack empties, the microtask queue drains first (`2`), followed by the macrotask (`1`).

---

### 2. When would you use `Promise.allSettled` instead of `Promise.all`?

**Answer:**
Use `Promise.all` when operations are co-dependent and require an "all-or-nothing" guarantee—a single rejection aborts the whole batch immediately. 

Use `Promise.allSettled` when tasks are independent, like fetching separate dashboard widgets, batch email notifications, or aggregate metrics. It never short-circuits; it waits for all promises to complete and returns an array of status objects (`fulfilled` or `rejected`), enabling resilient partial-success handling.

---

### 3. Difference: `git merge` vs `git rebase`, and `git reset` vs `git revert`

**Answer:**
- **Merge vs Rebase:** `git merge` preserves non-linear branch history by creating a two-parent merge commit. `git rebase` rewrites history by replaying feature commits on top of the target branch to maintain a flat, linear commit log.
- **Reset vs Revert:** `git reset` moves branch pointers backward, altering commit history (destructive on shared remotes). `git revert` safely records a new inverse commit that undoes prior changes without rewriting existing public history.
