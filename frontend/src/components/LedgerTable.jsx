function LedgerTable({
  transfers,
  loading,
  currentPage,
  lastPage,
  onPrevious,
  onNext,
}) {
  if (loading) {
    return <p>Loading ledger...</p>;
  }

  if (transfers.length === 0) {
    return <p>No transactions found.</p>;
  }

  return (
    <>
      <div className="ledger-wrapper">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Balance After</th>
              <th>Remarks</th>
            </tr>
          </thead>

          <tbody>
            {transfers.map((transfer) => (
              <tr key={transfer.id}>
                <td>
                  {new Date(transfer.created_at).toLocaleString()}
                </td>

                <td>
                  {transfer.type}
                </td>

                <td>
                  ₹{Number(transfer.amount).toFixed(2)}
                </td>

                <td>
                  ₹{Number(transfer.balance_after).toFixed(2)}
                </td>

                <td>
                  {transfer.remarks || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          type="button"
          disabled={currentPage === 1 || loading}
          onClick={onPrevious}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {lastPage}
        </span>

        <button
          type="button"
          disabled={currentPage === lastPage || loading}
          onClick={onNext}
        >
          Next
        </button>
      </div>
    </>
  );
}

export default LedgerTable;