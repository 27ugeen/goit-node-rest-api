import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact as updateContactService,
  updateStatusContact,
  bulkAddContacts,
} from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

// GET /api/contacts
export const getAllContacts = async (req, res, next) => {
  try {
    const result = await listContacts(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// GET /api/contacts/:id
export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await getContactById(id, req.user.id);
    if (!contact) throw HttpError(404);
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/contacts/:id
export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const removed = await removeContact(id, req.user.id);
    if (!removed) throw HttpError(404);
    res.status(200).json(removed);
  } catch (error) {
    next(error);
  }
};

// POST /api/contacts
export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const newContact = await addContact(name, email, phone, req.user.id);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};
// PUT /api/contacts/:id
export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedContact = await updateContactService(
      id,
      req.body,
      req.user.id
    );
    if (!updatedContact) throw HttpError(404);
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/contacts/:id/favorite
export const updateFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedContact = await updateStatusContact(id, req.body, req.user.id);
    if (!updatedContact) throw HttpError(404);
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};

// POST /api/contacts/bulk
export const createManyContacts = async (req, res, next) => {
  try {
    const result = await bulkAddContacts(req.body, req.user.id);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
