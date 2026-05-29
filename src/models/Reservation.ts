// ==========================================
// Reservation Model
// ==========================================
import mongoose, { Schema, Document } from "mongoose";

export interface IReservation extends Document {
  userId?: mongoose.Types.ObjectId;
  customerName: string;
  email: string;
  phone: string;
  guestCount: number;
  reservationDate: Date;
  reservationTime: string;
  specialRequests?: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  tableNumber?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReservationSchema = new Schema<IReservation>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    customerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    guestCount: { type: Number, required: true, min: 1, max: 20 },
    reservationDate: { type: Date, required: true, index: true },
    reservationTime: { type: String, required: true },
    specialRequests: { type: String },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    tableNumber: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.models.Reservation ||
  mongoose.model<IReservation>("Reservation", ReservationSchema);
