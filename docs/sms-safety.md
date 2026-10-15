# Signup SMS delivery and cost protection

## Before deploying

Run this once against the same PostgreSQL database used by the production web service:

```sh
npm run migrate:sms-safety
```

The migration is idempotent. It creates `sms_send_attempts` and an index; it does not send SMS or modify existing users. Use your usual database environment variables. The command loads the root `.env` locally; on Render, environment variables supply the configuration.

Set an explicit, strong, persistent `JWT_SECRET` on every replica. Do not commit it. The SMS budget uses it to HMAC phone numbers, account names and client IP addresses. Replicas must use the same secret and database. Changing the secret changes the identity hashes; plan any rotation because per-phone, per-account and per-IP history will no longer match. The global daily counter still counts all reservations.

The application refuses to send if the safety table/database is unavailable, if `JWT_SECRET` is missing, or if `SMS_DAILY_LIMIT` is invalid. Deploy the database migration before the new application code.

## Shared limits

Registration, explicit resend and phone-number correction use one shared budget before calling Twilio. All reservations count, including pending requests and provider failures. A failed provider response or app restart does not reset the budget.

Opening the page, restoring an unfinished registration, signing in, and the countdown reaching zero do not send SMS. The resend capability is issued only after account/password checks and cannot be used as a login token. Phone correction requires the account password. Twilio SDK automatic retries are explicitly disabled; an uncertain provider response is counted and left for the user to retry after the cooldown.

| Scope | Limit |
| --- | --- |
| Same phone number or account | At least 60 seconds between attempts |
| Each phone number | 5 attempts per rolling hour; 10 per rolling 24 hours |
| Each account, including changing its phone number | 5 attempts per rolling hour; 10 per rolling 24 hours |
| Each client IP | 20 attempts per rolling hour; 60 per rolling 24 hours |
| Entire application | 200 attempts per rolling 24 hours by default |

To choose a lower global cap, set a positive integer in the Render environment, for example:

```dotenv
SMS_DAILY_LIMIT=100
```

This is a count of send attempts, not a dollar budget. A multipart SMS may have multiple billable segments. This cap covers the protected signup endpoints using this database; it cannot cap messages sent by another application, another database, a compromised Twilio credential, or other Twilio products. Genuine users may temporarily be blocked if someone exhausts the shared cap.

To stop signup SMS sends entirely, set this Render environment variable:

```dotenv
SMS_ENABLED=false
```

This application-level kill switch does not disable messages sent directly from other applications or the Twilio Console.

The application takes a shared PostgreSQL transaction advisory lock before checking and inserting the reservation. This prevents concurrent requests and separate Render replicas from all spending the same remaining slot. There is no in-memory or database-error fallback that grants a send. Unknown/malformed IP addresses share an `unknown` bucket, and phone/account/global limits still apply even if the client IP cannot be trusted. IP limits are an extra layer, not the only protection. The send routes use the socket address, not untrusted `X-Forwarded-For` headers. Behind a reverse proxy, several visitors may share that socket address and therefore the conservative IP cap. A trusted-proxy configuration should only be introduced after verifying the hosting network boundaries.

Reservations older than seven days are deleted during budget checks. Records contain only the timestamp, HMAC identity hashes, sanitized provider status, Twilio verification SID and numeric error code. They do not contain OTP codes, passwords, raw phone numbers, raw IP addresses or full provider errors.

## Delivery troubleshooting

A successful Twilio API response means the provider accepted the request; it does not prove the phone received the message. The application must not report SMS success when Twilio is unconfigured. Users can explicitly retry after the cooldown, or correct their phone number, subject to the same limits.

To inspect the most recent provider attempts without exposing credentials or codes:

```sql
SELECT id, created_at, provider_status, provider_sid, provider_error_code
FROM sms_send_attempts
ORDER BY created_at DESC
LIMIT 50;
```

An attempt can remain `pending` if the application stopped after reserving a slot; Twilio Verify also uses `pending` for a verification awaiting approval. It still counts toward the limits because the provider might have accepted the message before an interruption. Use its verification SID when available to inspect the verification attempt and errors in Twilio Console. The local audit stores the immediate API result, not proof of delivery or successful verification.

## Twilio account protection

In addition to this application cap:

- This application uses Twilio Verify v2 for signup OTP. Review and enable the appropriate [Verify Fraud Guard](https://www.twilio.com/docs/verify/preventing-toll-fraud/sms-fraud-guard) protection for its Verify Service.
- Restrict [Verify Geo Permissions](https://www.twilio.com/docs/verify/preventing-toll-fraud/verify-geo-permissions) to destination countries actually served by the business. Review country-specific blocking settings in Twilio Console.
- If the Twilio account also sends direct Programmable Messaging SMS elsewhere, review that separate application's [SMS Geo Permissions](https://www.twilio.com/docs/messaging/guides/sms-geo-permissions) and [SMS Pumping Protection](https://www.twilio.com/docs/messaging/features/sms-pumping-protection-programmable-messaging) as well; those sends are outside this signup budget.

These are Twilio account/service settings and are not enabled by this migration. Twilio's [fraud prevention guidance](https://www.twilio.com/docs/messaging/guides/preventing-messaging-fraud) describes the provider-side controls.

## Isolated verification

```sh
node --test server/services/smsSendBudget.test.js server/api/users.test.js
```

These tests use a transactional database fake and mocked API dependencies. They never connect to a real database or send SMS. They cover phone/account/IP/global thresholds and expiry, concurrent reservations from two service instances, persistent state across service creation, lowered caps, database failures, safe audit fields and retention. API tests also cover verification capabilities, password-confirmed phone changes, provider failures, missing Twilio configuration and the removal of local/mock verification success.
