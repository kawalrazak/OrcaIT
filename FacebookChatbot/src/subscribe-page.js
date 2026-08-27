import dotenv from "dotenv";

dotenv.config();

const pageId = process.env.FACEBOOK_PAGE_ID || "1208194479052501";
const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

if (!token) {
  console.error(
    "Set FACEBOOK_PAGE_ACCESS_TOKEN in FacebookChatbot/.env first.\n" +
      "Get it from developers.facebook.com → your app → Messenger → API Setup → generate token for the Orcait page.",
  );
  process.exit(1);
}

const fields = ["messages", "messaging_postbacks", "messaging_optins"].join(",");
const url = `https://graph.facebook.com/v21.0/${pageId}/subscribed_apps?subscribed_fields=${encodeURIComponent(fields)}&access_token=${encodeURIComponent(token)}`;

const response = await fetch(url, { method: "POST" });
const body = await response.json();

if (!response.ok || body.success !== true) {
  console.error("Could not subscribe the Orcait Page to this chatbot:");
  console.error(JSON.stringify(body, null, 2));
  process.exit(1);
}

console.log(`Orcait Page ${pageId} is now subscribed to Messenger webhooks.`);
console.log("People can message https://www.facebook.com/profile.php?id=61593126667939 and the bot will reply.");
