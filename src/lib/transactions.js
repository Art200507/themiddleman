const toIsoString = (value) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
};

const parseFraudAnalysis = (value) => {
  if (!value) return null;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const serializeTransaction = (row) => ({
  id: row.id,
  transactionId: row.transaction_id,
  title: row.title,
  description: row.description,
  price: Number(row.price),
  fileURL: row.file_url,
  fileName: row.file_name,
  sellerId: row.seller_id,
  sellerName: row.seller_name,
  sellerEmail: row.seller_email,
  status: row.status,
  createdAt: toIsoString(row.created_at),
  paidAt: toIsoString(row.paid_at),
  completedAt: toIsoString(row.completed_at),
  buyerId: row.buyer_id,
  buyerName: row.buyer_name,
  buyerEmail: row.buyer_email,
  disputeRaisedAt: toIsoString(row.dispute_raised_at),
  disputeReason: row.dispute_reason,
  disputeDescription: row.dispute_description,
  disputeRaisedBy: row.dispute_raised_by,
  disputeRaisedByName: row.dispute_raised_by_name,
  paymentIntentId: row.payment_intent_id,
  escrowReleaseTime: toIsoString(row.escrow_release_time),
  fraudAnalysis: parseFraudAnalysis(row.fraud_analysis),
  fraudCheckedAt: toIsoString(row.fraud_checked_at)
});
