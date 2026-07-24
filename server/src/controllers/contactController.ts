import type { Request, Response, NextFunction } from 'express';
import { ContactModel } from '../models/index.js';
import { sendContactNotification } from '../services/index.js';
import { paginate } from '../services/index.js';

export async function submitContact(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { name, email, subject, message } = req.body;

    const contact = await ContactModel.create({
      name,
      email,
      subject,
      message,
    });

    await sendContactNotification({ name, email, subject, message }).catch(
      () => {
        console.warn('[Contact] Email notification failed');
      },
    );

    res.status(201).json({ success: true, data: contact });
  } catch (error) {
    next(error);
  }
}

export async function getMessages(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await paginate(
      ContactModel,
      req,
      {},
      ['name', 'email', 'subject', 'message'],
    );
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getMessageById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const message = await ContactModel.findById(req.params.id);
    if (!message) {
      res.status(404).json({ success: false, message: 'Message not found' });
      return;
    }
    res.json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
}

export async function markMessageAsRead(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const message = await ContactModel.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true },
    );
    if (!message) {
      res.status(404).json({ success: false, message: 'Message not found' });
      return;
    }
    res.json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
}

export async function markMessageAsUnread(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const message = await ContactModel.findByIdAndUpdate(
      req.params.id,
      { read: false },
      { new: true },
    );
    if (!message) {
      res.status(404).json({ success: false, message: 'Message not found' });
      return;
    }
    res.json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
}

export async function deleteMessage(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const message = await ContactModel.findByIdAndDelete(req.params.id);
    if (!message) {
      res.status(404).json({ success: false, message: 'Message not found' });
      return;
    }
    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    next(error);
  }
}

export async function bulkDeleteMessages(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({ success: false, message: 'ids array is required' });
      return;
    }
    const result = await ContactModel.deleteMany({ _id: { $in: ids } });
    res.json({ success: true, message: `${result.deletedCount} messages deleted` });
  } catch (error) {
    next(error);
  }
}