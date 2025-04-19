import Contact from "../models/contact.js";

// GET /api/contacts
export async function listContacts(ownerId) {
  return await Contact.findAll({ where: { owner: ownerId } });
}

// GET /api/contacts/:id
export async function getContactById(contactId, ownerId) {
  return await Contact.findOne({ where: { id: contactId, owner: ownerId } });
}

// DELETE /api/contacts/:id
export async function removeContact(contactId, ownerId) {
  const contact = await getContactById(contactId, ownerId);
  if (!contact) return null;
  await contact.destroy();
  return contact;
}

// POST /api/contacts
export async function addContact(name, email, phone, ownerId) {
  return await Contact.create({ name, email, phone, owner: ownerId });
}

// PUT /api/contacts/:id
export async function updateContact(contactId, updatedData, ownerId) {
  const contact = await getContactById(contactId, ownerId);
  if (!contact) return null;
  await contact.update(updatedData);
  return contact;
}

// PATCH /api/contacts/:id/favorite
export async function updateStatusContact(contactId, body, ownerId) {
  const contact = await getContactById(contactId, ownerId);
  if (!contact) return null;
  await contact.update(body);
  return contact;
}

// POST /api/contacts/bulk
export async function bulkAddContacts(contactsArray, ownerId) {
  const withOwner = contactsArray.map((contact) => ({
    ...contact,
    owner: ownerId,
  }));

  return await Contact.bulkCreate(withOwner, {
    ignoreDuplicates: true,
  });
}
