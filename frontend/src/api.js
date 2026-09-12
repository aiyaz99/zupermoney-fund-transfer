const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong."
    );
  }

  return data;
}

export async function login(email, password) {
  const response = await fetch(
    `${API_BASE_URL}/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  return handleResponse(response);
}

export async function logout() {
  const token = localStorage.getItem("auth_token");

  const response = await fetch(
    `${API_BASE_URL}/logout`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return handleResponse(response);
}

function getAuthHeaders() {
  const token = localStorage.getItem("auth_token");

  return {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getDistributors() {
  const response = await fetch(
    `${API_BASE_URL}/distributors`,
    {
      headers: getAuthHeaders(),
    }
  );

  return handleResponse(response);
}

export async function getFundTransfers({
  distributorId,
  page = 1,
  from = "",
  to = "",
  perPage = 5,
}) {
  const params = new URLSearchParams({
    distributor_id: distributorId,
    page: page.toString(),
    per_page: perPage.toString(),
  });

  if (from) {
    params.append("from", from);
  }

  if (to) {
    params.append("to", to);
  }

  const response = await fetch(
    `${API_BASE_URL}/fund-transfers?${params.toString()}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return handleResponse(response);
}

export async function createFundTransfer({
  distributorId,
  amount,
  type,
  remarks,
}) {
  const response = await fetch(
    `${API_BASE_URL}/fund-transfers`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        distributor_id: Number(distributorId),
        amount: Number(amount),
        type,
        remarks: remarks || null,
      }),
    }
  );

  return handleResponse(response);
}