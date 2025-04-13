import { promises as fs } from "fs";
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("db", "contacts.json");

// Отримати всі контакти
async function listContacts() {
  const data = await fs.readFile(contactsPath, "utf8");
  return JSON.parse(data);
}

// Отримати контакт за id
async function getContactById(contactId) {
  const contacts = await listContacts();
  const result = contacts.find((contact) => contact.id === contactId);
  return result || null;
}

// Видалити контакт за id
async function removeContact(contactId) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) return null;

  const [removedContact] = contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return removedContact;
}

// Додати новий контакт
async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

// Оновити контакт за id
async function updateContact(contactId, updatedData) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) return null;

  const updatedContact = { ...contacts[index], ...updatedData };
  contacts[index] = updatedContact;

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return updatedContact;
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
