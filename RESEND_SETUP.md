# Resend Setup — Quick & Simple Guide ✅

Goal: Get email sending working using Resend (simple steps you can follow right now).

---

## 1) Sign up & get your API key
- Go to https://resend.com and sign up.
- In the Resend dashboard, create an API key and copy it. It looks like: `re_********`.

## 2) Put the key in your local env
- Open your project's `.env.local` (it is gitignored).
- Add these lines (replace the example key):

```
RESEND_API_KEY=re_your_api_key_here
FROM_EMAIL=noreply@yourdomain.com
```

- Save the file and restart your dev server (`npm run dev` or `npm run build` / redeploy).

## 3) Confirm the app uses Resend (already implemented in this project)
- This repo uses `lib/email.ts` which calls Resend when `RESEND_API_KEY` is set.
- Relevant files:
  - `lib/email.ts` (the send functions)
  - `app/api/auth/send-otp/route.ts` (sends OTP using `sendOtpEmail`)

## 4) Quick local test options
- Use the app UI: open `/auth` and request a code/verification. Check your inbox.
- Or run a cURL test to confirm Resend accepts your key:

```bash
curl -s -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer $RESEND_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"from":"noreply@yourdomain.com","to":"enjayjerey@example.com","subject":"Test","html":"Hello"}'
```
- A successful response means Resend will accept messages from your app.

## 5) Deploying (Vercel or other hosts)
- Add the same `RESEND_API_KEY` and `FROM_EMAIL` to your host's environment variables.
  - For Vercel: go to your Project → Settings → Environment Variables → add `RESEND_API_KEY` and `FROM_EMAIL`.
- Redeploy the site after adding the variables.

## 6) Troubleshooting quick tips
- 401 Unauthorized → Wrong API key. Re-copy the key from the dashboard.
- 422 Invalid sender → `FROM_EMAIL` is not allowed. Try a verified sender or `noreply@yourdomain.com`.
- 429 Too many requests → You hit rate limits. Wait or check plan limits.
- No emails in inbox → Check the Resend Dashboard (sent logs) and server logs (Next.js console). The dashboard shows status and reasons for failures.
- Local dev note: If your app sends links that include `NEXTAUTH_URL`, make sure `NEXTAUTH_URL` is set correctly (e.g., `http://localhost:3000`) so links in emails point to your dev site.

## 7) Security
- Do NOT commit your API keys. Keep them in `.env.local` (gitignored) and in your host environment settings.
- Rotate keys if you believe they were exposed.

## 8) Extra help
- Resend docs: https://resend.com/docs
- If you want, I can add a small endpoint that sends a test email from the app so you can click a button to verify — say the word and I’ll add it.

---

If you want this even shorter (2–3 lines), I can make a 1-minute checklist version — tell me which format you prefer.