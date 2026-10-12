// Page settings. Edit these two values; nothing else in the page needs to change.
window.CARLTON_CONFIG = {
  // URL that receives lead submissions (POST, JSON).
  // "/api/leads" works on Vercel and when the page is served by our own backend (npm start).
  // If the page is hosted on its own (cPanel, S3, etc.), use the backend's full URL, e.g. "https://api.example.com/api/leads",
  // or "" to send nothing (the thank-you screen still shows, but leads are NOT sent).
  formEndpoint: "/api/leads",

  // Meta Pixel ID, to track PageView + Lead events for the ads.
  metaPixelId: ""
};
