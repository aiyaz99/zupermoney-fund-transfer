function DateFilters({
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  onApply,
  onClear,
}) {
  return (
    <div className="date-filters">
      <div className="date-field">
        <label htmlFor="fromDate">From</label>

        <input
          id="fromDate"
          type="date"
          value={fromDate}
          onChange={(event) => setFromDate(event.target.value)}
        />
      </div>

      <div className="date-field">
        <label htmlFor="toDate">To</label>

        <input
          id="toDate"
          type="date"
          value={toDate}
          onChange={(event) => setToDate(event.target.value)}
        />
      </div>

      <div className="filter-actions">
        <button type="button" onClick={onApply}>
          Apply Filters
        </button>

        <button type="button" onClick={onClear}>
          Clear
        </button>
      </div>
    </div>
  );
}

export default DateFilters;