import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.client_id,
  process.env.private_key
);

// generate a url that asks permissions for Blogger and Google Calendar scopes
const scopes = [
  'https://www.googleapis.com/auth/blogger',
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/spreadsheets',
];

const url = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',

  // If you only need one scope you can pass it as a string
  scope: scopes,
});

const sheets = google.sheets({
  auth: url,
  version: 'v4',
});
