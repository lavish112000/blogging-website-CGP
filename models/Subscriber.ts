import { Schema, model, models } from 'mongoose';

export type SubscriberStatus = 'pending' | 'active' | 'unsubscribed';

const SubscriberSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'active', 'unsubscribed'],
      default: 'pending',
      index: true,
    },
    confirmedAt: {
      type: Date,
      required: false,
    },
    unsubscribedAt: {
      type: Date,
      required: false,
    },
    confirmTokenHash: {
      type: String,
      required: false,
      index: true,
    },
    confirmTokenExpiresAt: {
      type: Date,
      required: false,
      index: true,
    },
    lastConfirmationSentAt: {
      type: Date,
      required: false,
    },
    source: {
      type: String,
      required: false,
      default: 'form',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent recompilation of model in development
const Subscriber = models.Subscriber || model('Subscriber', SubscriberSchema);

export default Subscriber;
