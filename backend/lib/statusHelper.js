// Compute reservation-level status
export const getReservationStatus = (reservation) => {
  if (reservation.completed) return "completed";
  if (reservation.delivered && reservation.amountDue > 0) return "deliveredNotPaid";
  if (!reservation.completed && reservation.amountDue === 0) return "paidNotDelivered";
  if (!reservation.completed && reservation.amountDue > 0 && !reservation.delivered) return "reserved";
  return "pending";
};

// Compute client-level status from reservations
export const getClientStatus = (reservations = []) => {
  if (!reservations.length) return "None";

  const allCompleted = reservations.every((r) => r.status === "completed");
  if (allCompleted) return "Completed";

  const allReserved = reservations.every((r) => r.status === "reserved");
  if (allReserved) return "Reserved";

  const hasInProgress = reservations.some(
    (r) => r.status === "deliveredNotPaid" || r.status === "paidNotDelivered"
  );
  if (hasInProgress) return "In Progress";

  return "None";
};
