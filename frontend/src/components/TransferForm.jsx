function TransferForm({
  amount,
  setAmount,
  type,
  setType,
  remarks,
  setRemarks,
  onSubmit,
  submitting,
}) {
  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="amount">Amount</label>

        <input
          id="amount"
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="Enter amount"
        />
      </div>

      <div className="form-group">
        <p>Transaction Type</p>

        <div className="type-options">
          <label>
            <input
              type="radio"
              value="credit"
              checked={type === "credit"}
              onChange={(event) => setType(event.target.value)}
            />
            Credit
          </label>

          <label>
            <input
              type="radio"
              value="debit"
              checked={type === "debit"}
              onChange={(event) => setType(event.target.value)}
            />
            Debit
          </label>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="remarks">Remarks</label>

        <input
          id="remarks"
          type="text"
          value={remarks}
          onChange={(event) => setRemarks(event.target.value)}
          placeholder="Optional remarks"
        />
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? "Processing..." : "Transfer"}
      </button>
    </form>
  );
}

export default TransferForm;