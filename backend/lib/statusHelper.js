// Compute reservation-level status
export const getReservationStatus = (reservation) => {
  const amountDue = Number(reservation.amountDue ?? 0);
  const completed = Boolean(reservation.completed);
  const delivered = Boolean(reservation.delivered);

  if (completed) return "completed";
  if (delivered && amountDue === 0) return "completed";
  if (delivered && amountDue > 0) return "deliveredNotPaid";
  if (!completed && amountDue === 0 && !delivered) return "paidNotDelivered";
  if (!completed && amountDue > 0 && !delivered) return "reserved";

  return "pending";
};


// Compute client-level status from reservations
export const getClientStatus = (reservations = []) => {
  if (!reservations.length) return "none";

  const allCompleted = reservations.every((r) => r.status === "completed");
  if (allCompleted) return "completed";

  const hasReserved = reservations.some((r) => r.status === "reserved");
  if (hasReserved) return "reserved";

  const hasInProgress = reservations.some(
    (r) => r.status === "deliveredNotPaid" || r.status === "paidNotDelivered"
  );
  if (hasInProgress) return "inProcess";

  return "none";
};

