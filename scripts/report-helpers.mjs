#!/usr/bin/env node

import { google } from 'googleapis';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const TOKEN_PATH = join(homedir(), '.config/google-docs-mcp/token.json');

function markdownToPlainText(md) {
  return md
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`{1,3}[^`]*`{1,3}/g, m => m.replace(/`/g, ''))
    .replace(/^[-*]\s+/gm, '  - ')
    .replace(/^\d+\.\s+/gm, (m) => '  ' + m.trim() + ' ')
    .replace(/[—–]/g, ' - ')
    .replace(/\|/g, ' ')
    .replace(/^---+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function getOAuth2Client() {
  const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);
  if (existsSync(TOKEN_PATH)) {
    const token = JSON.parse(readFileSync(TOKEN_PATH, 'utf8'));
    oauth2Client.setCredentials({ refresh_token: token.refresh_token });
  }
  return oauth2Client;
}

async function sendEmail(to, subject, body) {
  const auth = getOAuth2Client();
  const gmail = google.gmail({ version: 'v1', auth });

  const email = [
    `To: ${to}`,
    'From: me',
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset=utf-8',
    '',
    body
  ].join('\r\n');

  const encodedMessage = Buffer.from(email)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const res = await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw: encodedMessage }
  });

  console.log(`Email sent: ${res.data.id}`);
  return res.data.id;
}

async function createDoc(title) {
  const auth = getOAuth2Client();
  const docs = google.docs({ version: 'v1', auth });

  const doc = await docs.documents.create({
    requestBody: { title }
  });

  console.log(`Document created: ${doc.data.documentId}`);
  return doc.data.documentId;
}

async function appendToDoc(documentId, markdown) {
  const auth = getOAuth2Client();
  const docs = google.docs({ version: 'v1', auth });

  const doc = await docs.documents.get({ documentId });
  const content = doc.data.body.content;
  const endIndex = content[content.length - 1].endIndex - 1;

  const requests = [{
    insertText: {
      location: { index: endIndex },
      text: '\n\n' + markdown
    }
  }];

  await docs.documents.batchUpdate({
    documentId,
    requestBody: { requests }
  });

  console.log(`Appended to document: ${documentId}`);
}

async function main() {
  const [,, command, ...args] = process.argv;

  switch (command) {
    case 'send-email': {
      const [to, subject, bodyFile] = args;
      const raw = bodyFile && existsSync(bodyFile)
        ? readFileSync(bodyFile, 'utf8')
        : args.slice(2).join(' ');
      await sendEmail(to, subject, markdownToPlainText(raw));
      break;
    }
    case 'create-doc': {
      const title = args.join(' ');
      const docId = await createDoc(title);
      console.log(docId);
      break;
    }
    case 'append-doc': {
      const [docId, bodyFile] = args;
      const body = bodyFile && existsSync(bodyFile)
        ? readFileSync(bodyFile, 'utf8')
        : args.slice(2).join(' ');
      await appendToDoc(docId, body);
      break;
    }
    default:
      console.error('Usage: node report-helpers.mjs <send-email|create-doc|append-doc> [args...]');
      process.exit(1);
  }
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
