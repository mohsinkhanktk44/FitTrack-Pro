const ADMIN_EMAILS = [
  'uskaritel@gmail.com',
  'shoaib.mangal222@gmail.com'
];

export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export function getAdminEmails(): string[] {
  return ADMIN_EMAILS;
} 