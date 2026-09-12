function DistributorSelector({
  distributors,
  selectedDistributor,
  onChange,
}) {
  return (
    <div className="form-group">
      <label htmlFor="distributor">Distributor</label>

      <select
        id="distributor"
        value={selectedDistributor}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">Select a distributor</option>

        {distributors.map((distributor) => (
          <option key={distributor.id} value={distributor.id}>
            {distributor.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default DistributorSelector;