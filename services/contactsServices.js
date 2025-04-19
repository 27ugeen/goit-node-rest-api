import Contact from "../models/contact.js";

// GET /api/contacts
export async function listContacts() {
  return await Contact.findAll();
}

// GET /api/contacts/:id
export async function getContactById(contactId) {
  return await Contact.findByPk(contactId);
}

// DELETE /api/contacts/:id
export async function removeContact(contactId) {
  const contact = await getContactById(contactId);
  if (!contact) return null;
  await contact.destroy();
  return contact;
}

// POST /api/contacts
export async function addContact(name, email, phone) {
  return await Contact.create({ name, email, phone });
}

// PUT /api/contacts/:id
export async function updateContact(contactId, updatedData) {
  const contact = await getContactById(contactId);
  if (!contact) return null;
  await contact.update(updatedData);
  return contact;
}

// PATCH /api/contacts/:id/favorite
export async function updateStatusContact(contactId, body) {
  const contact = await getContactById(contactId);
  if (!contact) return null;
  await contact.update(body);
  return contact;
}
