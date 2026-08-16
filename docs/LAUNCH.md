# Launch Readiness

Working checklist for taking this site live, from `Phases.md` §12.

> **Final rule:** do not launch a page just because the route exists. Launch
> when the content is accurate, useful and supported by evidence.

## 1. Automated checks

```bash
npm run verify     # typecheck → lint → build → launch gate
```

`npm run check:launch` is a gate, not advice. With
`NEXT_PUBLIC_APP_ENV=production` it exits non-zero when:

- any `[CLIENT TO PROVIDE]` placeholder appears in rendered build output;
- `NEXT_PUBLIC_SITE_URL` is missing, still `localhost`, or not `https`;
- Supabase URL / anon key / service-role key is missing;
- the email provider or its recipient list is missing;
- a service-role key is exposed through a `NEXT_PUBLIC_` variable.

It warns (without failing) about GA4 and the WhatsApp number, which are optional.

## 2. Configuration

- [ ] `NEXT_PUBLIC_APP_ENV=production` on the production deployment.
- [ ] Official domain configured, SSL active, `www` / apex redirect chosen.
- [ ] `NEXT_PUBLIC_SITE_URL` matches the live origin exactly (no trailing slash).
- [ ] Supabase project provisioned and every migration in `supabase/migrations`
      applied in filename order.
- [ ] Service-role key stored as a server-only secret.
- [ ] Transactional email domain verified; `MAIL_ENQUIRY_RECIPIENTS` set to real
      internal mailboxes.
- [ ] GA4 property created; Search Console verified; sitemap submitted.
- [ ] At least one `admin_users` row exists with role `super_admin`.

## 3. Content the company must verify

Nothing in this repository is invented, so **every** item below starts empty and
must be supplied and checked before launch.

- [ ] Legal company name, CIN, GST, PAN, drug licence number.
- [ ] Registered and corporate addresses, official email, phone, WhatsApp.
- [ ] Grievance officer name, email and phone.
- [ ] Governing jurisdiction for the Terms, and the CV retention period for the
      Privacy Policy (both currently render as placeholders).
- [ ] Legal pages reviewed and approved by the company's legal adviser.
- [ ] Certificates: name, issuing body, number, validity and document uploaded.
      Nothing that has expired is presented as current.
- [ ] Product records: composition, strength, pack, prescribing information —
      each checked against the approved pack.
- [ ] Leadership and board profiles with **authentic** photographs.
- [ ] Manufacturing facts and figures, each with a source reference.
- [ ] Network coverage entered state by state and country by country.
- [ ] Distributor entries only where the partner has consented to publication.
- [ ] Testimonials only with recorded consent and a named person.
- [ ] Founding year set, so the snapshot strip can show years in operation.

## 4. Functional testing

- [ ] Each enquiry form submits, stores a row and sends the notification:
      general, business, product, partner, grievance.
- [ ] Adverse event / product complaint form submits and is visible only to the
      quality role.
- [ ] Career application uploads a CV, and the CV opens from the admin through a
      signed link and nowhere else.
- [ ] Rate limiting triggers on repeated submissions.
- [ ] Failure states are shown when the database or mail provider is
      unavailable, and no submission is silently lost.
- [ ] Admin sign-in works; each role sees only its own sections.
- [ ] Draft content is invisible on public pages.

## 5. Pre-launch review

- [ ] 404 page tested on a real missing URL.
- [ ] Mobile layout checked on a small device, not only a resized window.
- [ ] Keyboard-only pass through the header, mobile menu, product filters and one
      full form.
- [ ] `robots.txt` allows indexing (it blocks everything unless
      `NEXT_PUBLIC_APP_ENV=production`).
- [ ] `sitemap.xml` lists the pages that actually have content.
- [ ] No stock photograph is presented as a company facility, person or product.
- [ ] No claim on the site lacks a source the company can produce.

## 6. Deliberately absent

These are absent by design, not by omission (`Rules.md` §3, §4, PRD §19):

- ROI or earnings calculator, margin or income projection.
- Territory availability checker, "only N territories left", countdown timer.
- Buy Now, Add to Cart, prices, discounts, coupons, stock indicators.
- Animated statistic counters or live lead counters.
- "Become a Distributor" in the header or homepage hero.
- Find-a-Pharmacy, which has no route until genuine pharmacy data exists.
