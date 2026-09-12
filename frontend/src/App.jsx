import { useEffect, useState } from "react";

import DistributorSelector from "./components/DistributorSelector";
import TransferForm from "./components/TransferForm";
import DateFilters from "./components/DateFilters";
import LedgerTable from "./components/LedgerTable";
import Login from "./components/Login";

import {
  getDistributors,
  getFundTransfers,
  createFundTransfer,
  logout,
} from "./api";

import "./App.css";

function App() {
  const [user, setUser] = useState(() => {
  const token = localStorage.getItem("auth_token");

  return token ? true : false;
});
  const [distributors, setDistributors] = useState([]);
  const [selectedDistributor, setSelectedDistributor] = useState("");

  const [amount, setAmount] = useState("");
  const [type, setType] = useState("credit");
  const [remarks, setRemarks] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [ledgerLoading, setLedgerLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [transfers, setTransfers] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalTransfers, setTotalTransfers] = useState(0);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");


  const handleLogout = async () => {
  try {
    await logout();
  } catch (err) {
    console.error("Logout request failed:", err);
  } finally {
    localStorage.removeItem("auth_token");
    setUser(false);
  }
};

  // Load distributors when the application starts
  useEffect(() => {
  if (!user) {
    setLoading(false);
    return;
  }

  setLoading(true);

  getDistributors()
    .then((data) => {
      setDistributors(data.data ?? data);
    })
    .catch((err) => {
      setError(
        err.message || "Could not load distributors."
      );
    })
    .finally(() => {
      setLoading(false);
    });
}, [user]);

  // Find the currently selected distributor
  const distributor = distributors.find(
    (item) =>
      String(item.id) === String(selectedDistributor)
  );

  // Load ledger
  const fetchLedger = async (
    distributorId,
    page = 1,
    from = fromDate,
    to = toDate
  ) => {
    if (!distributorId) {
      setTransfers([]);
      setCurrentPage(1);
      setLastPage(1);
      setTotalTransfers(0);
      return;
    }

    setLedgerLoading(true);
    setError("");

    try {
      const data = await getFundTransfers({
        distributorId,
        page,
        from,
        to,
        perPage: 5,
      });

      setTransfers(data.data ?? []);
      setCurrentPage(data.current_page ?? 1);
      setLastPage(data.last_page ?? 1);
      setTotalTransfers(data.total ?? 0);
    } catch (err) {
      setError(err.message || "Failed to fetch ledger.");
    } finally {
      setLedgerLoading(false);
    }
  };

  // When distributor changes
  const handleDistributorChange = (distributorId) => {
    setSelectedDistributor(distributorId);

    setError("");
    setSuccess("");

    setFromDate("");
    setToDate("");
    setCurrentPage(1);

    fetchLedger(distributorId, 1, "", "");
  };

  // Submit credit/debit
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // Distributor validation
    if (!selectedDistributor) {
      setError("Please select a distributor.");
      return;
    }

    // Amount validation
    if (!amount || Number(amount) <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    // Prevent negative balance
    if (
      type === "debit" &&
      distributor &&
      Number(amount) >
        Number(distributor.current_balance)
    ) {
      setError(
        "Debit amount cannot exceed the current balance."
      );
      return;
    }

    setSubmitting(true);

    try {
      const data = await createFundTransfer({
        distributorId: selectedDistributor,
        amount,
        type,
        remarks,
      });

      setSuccess(
        "Fund transfer completed successfully."
      );

      // Clear form
      setAmount("");
      setRemarks("");

      // Update current balance immediately
      setDistributors((current) =>
        current.map((item) =>
          item.id === Number(selectedDistributor)
            ? {
                ...item,
                current_balance:
                  data.data.balance_after,
              }
            : item
        )
      );

      // Refresh ledger
      await fetchLedger(
        selectedDistributor,
        1,
        fromDate,
        toDate
      );
    } catch (err) {
      setError(err.message || "Transfer failed.");
    } finally {
      setSubmitting(false);
    }
  };
  if (!user) {
    return (
      <Login
        onLogin={() => {
          setUser(true);
        }}
      />
    );
  }

  return (
    <div className="app">
      <header className="app-header">
  <div className="header-content">
    <div>
      <p className="eyebrow">ZuperMoney</p>

      <h1>Distributor Fund Transfer</h1>

      <p className="subtitle">
        Manage distributor balances and transaction history.
      </p>
    </div>

    <button
      type="button"
      className="logout-button"
      onClick={handleLogout}
    >
      Logout
    </button>
  </div>
</header>

      {/* Error message */}
      {error && (
        <div className="message error">
          {error}
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="message success">
          {success}
        </div>
      )}

      {/* Loading message */}
      {loading && (
        <div className="message info">
          Loading distributors...
        </div>
      )}

      {!loading && (
        <main className="content">

          {/* Distributor section */}
          <section className="card">
            <DistributorSelector
              distributors={distributors}
              selectedDistributor={
                selectedDistributor
              }
              onChange={
                handleDistributorChange
              }
            />

            {distributor && (
              <div className="balance-card">
                <div>
                  <p className="balance-label">
                    Current Balance
                  </p>

                  <p className="balance-amount">
                    ₹
                    {Number(
                      distributor.current_balance
                    ).toFixed(2)}
                  </p>
                </div>

                <span className="balance-status">
                  Available
                </span>
              </div>
            )}
          </section>

          {/* Transfer section */}
          {distributor && (
            <>
              <section className="card">
                <div className="section-header">
                  <div>
                    <h2>Transfer Funds</h2>

                    <p>
                      Credit or debit funds from this
                      distributor.
                    </p>
                  </div>
                </div>

                <TransferForm
                  amount={amount}
                  setAmount={setAmount}
                  type={type}
                  setType={setType}
                  remarks={remarks}
                  setRemarks={setRemarks}
                  onSubmit={handleSubmit}
                  submitting={submitting}
                />
              </section>

              {/* Ledger section */}
              <section className="card">
                <div className="section-header">
                  <div>
                    <h2>Transaction Ledger</h2>

                    <p>
                      {totalTransfers} transaction
                      {totalTransfers === 1
                        ? ""
                        : "s"}{" "}
                      found.
                    </p>
                  </div>
                </div>

                <DateFilters
                  fromDate={fromDate}
                  setFromDate={setFromDate}
                  toDate={toDate}
                  setToDate={setToDate}
                  onApply={() => {
                    setCurrentPage(1);

                    fetchLedger(
                      selectedDistributor,
                      1,
                      fromDate,
                      toDate
                    );
                  }}
                  onClear={() => {
                    setFromDate("");
                    setToDate("");
                    setCurrentPage(1);

                    fetchLedger(
                      selectedDistributor,
                      1,
                      "",
                      ""
                    );
                  }}
                />

                <LedgerTable
                  transfers={transfers}
                  loading={ledgerLoading}
                  currentPage={currentPage}
                  lastPage={lastPage}
                  onPrevious={() =>
                    fetchLedger(
                      selectedDistributor,
                      currentPage - 1,
                      fromDate,
                      toDate
                    )
                  }
                  onNext={() =>
                    fetchLedger(
                      selectedDistributor,
                      currentPage + 1,
                      fromDate,
                      toDate
                    )
                  }
                />
              </section>
            </>
          )}
        </main>
      )}
    </div>
  );
}

export default App;