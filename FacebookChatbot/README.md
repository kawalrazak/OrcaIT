# Facebook Messenger chatbot — Orca IT Page

This bot is wired to the **Orcait** Page:

[https://www.facebook.com/profile.php?id=61593126667939](https://www.facebook.com/profile.php?id=61593126667939)

Page ID: `61593126667939`

Only you can finish the Meta login steps below. The code cannot log into Facebook for you.

## 1. Create a Meta app (once)

1. Open [Meta for Developers](https://developers.facebook.com/apps/).
2. Create an app → type **Business**.
3. Add the **Messenger** product.
4. Copy **App Secret** (App settings → Basic) into `FACEBOOK_APP_SECRET` in `.env`.

## 2. Connect *this* Page and get a token

1. In the app: **Messenger → API Setup** (or Messenger Settings).
2. Under **Access Tokens**, add / generate a token for the Page named **Orcait** (ID `61593126667939`).
3. Paste that token into `FACEBOOK_PAGE_ACCESS_TOKEN` in `FacebookChatbot/.env`.
4. Request these permissions for the app (development mode is enough while you test as a Page admin):
   - `pages_messaging`
   - `pages_manage_metadata`
   - `pages_show_list`

Official webhook docs: [Meta Webhooks for Messenger](https://developers.facebook.com/documentation/business-messaging/messenger-platform/webhooks)

## 3. Point Facebook at this chatbot

The bot must be reachable on **HTTPS**.

**Production (after Docker deploy):**

Callback URL:

`https://orcait.com.au/facebook-webhook/webhook`

Verify token (must match `.env`):

`orcait-fb-webhook-verify`

**Local testing:** start the bot, then expose it with ngrok:

```bash
cd FacebookChatbot
npm run dev
```

Use `https://YOUR-NGROK-HOST/webhook` as the callback URL.

In Meta: Messenger → Webhooks → add the callback URL + verify token. Subscribe to `messages` and `messaging_postbacks`.

## 4. Subscribe the Orcait Page

After the token is in `.env`:

```bash
cd FacebookChatbot
npm run subscribe-page
```

That calls Graph API:

`POST /61593126667939/subscribed_apps`

## 5. Test

Open [the Orcait Page](https://www.facebook.com/profile.php?id=61593126667939) → **Message**. Send “book” from a Facebook account that is an admin of the Page (required while the app is in Development mode).

Until Meta **App Review** is approved, the bot can only talk to Page admins/testers, not every public visitor.
