import React, { useState, useEffect } from "react";

const App = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [accounts, setAccounts] = useState({});

  useEffect(() => {
    const storedAccounts = JSON.parse(localStorage.getItem("accounts")) || {};
    setAccounts(storedAccounts);
  }, []);

  const handleLogin = () => {
    if (walletAddress !== "" && password !== "") {
      const account = accounts[walletAddress];
      if (!account) {
        alert("Account is not registered. Please register first.");
        return;
      }
      setLoggedIn(true);
    } else {
      alert("Invalid wallet address or password.");
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setWalletAddress("");
    setPassword("");
  };

  const handleRegister = () => {
    if (accounts[walletAddress]) {
      alert("Account is already registered.");
      return;
    }
    const newAccount = {
      balance: 0,
      lastClaimTime: null,
    };
    const updatedAccounts = { ...accounts, [walletAddress]: newAccount };
    setAccounts(updatedAccounts);
    localStorage.setItem("accounts", JSON.stringify(updatedAccounts));
    alert("Account registered successfully.");
  };

  const handleClaim = () => {
    const currentTime = new Date().getTime();
    const account = accounts[walletAddress];
    if (!account || !loggedIn) {
      alert("Please login to claim.");
      return;
    }
    if (
      !account.lastClaimTime ||
      currentTime - account.lastClaimTime >= 15 * 60 * 1000
    ) {
      const newBalance = account.balance + 3;
      const updatedAccount = {
        ...account,
        balance: newBalance,
        lastClaimTime: currentTime,
      };
      const updatedAccounts = { ...accounts, [walletAddress]: updatedAccount };
      setAccounts(updatedAccounts);
      localStorage.setItem("accounts", JSON.stringify(updatedAccounts));
    } else {
      alert("You can claim every 15 minutes.");
    }
  };

  const handleWithdraw = () => {
    const account = accounts[walletAddress];
    if (!account || !loggedIn) {
      alert("Please login to withdraw.");
      return;
    }
    if (account.balance >= 500) {
      alert("Withdraw successful. Please allow up to 3 days for processing.");
      const updatedAccount = { ...account, balance: 0 };
      const updatedAccounts = { ...accounts, [walletAddress]: updatedAccount };
      setAccounts(updatedAccounts);
      localStorage.setItem("accounts", JSON.stringify(updatedAccounts));

      // Сохранение вывода в объекте accounts в localStorage
      const withdrawalHistory =
        JSON.parse(localStorage.getItem("withdrawalHistory")) || [];
      const newWithdrawal = {
        timestamp: new Date().getTime(),
        amount: account.balance,
      };
      withdrawalHistory.push(newWithdrawal);
      localStorage.setItem(
        "withdrawalHistory",
        JSON.stringify(withdrawalHistory)
      );
    } else {
      alert("Minimum balance required for withdrawal is 500 satoshi.");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "yellow",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "80%",
          maxWidth: "400px",
          padding: "20px",
          borderRadius: "10px",
          backgroundColor: "white",
        }}
      >
        <h1 style={{ color: "black", textAlign: "center" }}>
          Bitcoin Loot every 15 min
        </h1>
        {loggedIn ? (
          <div>
            <button
              style={{
                backgroundColor: "orange",
                color: "white",
                padding: "10px",
                margin: "5px",
                border: "none",
                borderRadius: "5px",
              }}
              onClick={handleLogout}
            >
              Logout
            </button>
            <p>Balance: {accounts[walletAddress]?.balance || 0} satoshi</p>
            <button
              style={{
                backgroundColor: "orange",
                color: "white",
                padding: "10px",
                margin: "5px",
                border: "none",
                borderRadius: "5px",
              }}
              onClick={handleClaim}
            >
              Claim BTC
            </button>
            <button
              style={{
                backgroundColor: "orange",
                color: "white",
                padding: "10px",
                margin: "5px",
                border: "none",
                borderRadius: "5px",
              }}
              onClick={handleWithdraw}
            >
              Withdraw
            </button>
          </div>
        ) : (
          <div>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter your wallet address"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            <button
              style={{
                backgroundColor: "orange",
                color: "white",
                padding: "10px",
                margin: "5px",
                border: "none",
                borderRadius: "5px",
              }}
              onClick={handleLogin}
            >
              Login
            </button>
            <button
              style={{
                backgroundColor: "orange",
                color: "white",
                padding: "10px",
                margin: "5px",
                border: "none",
                borderRadius: "5px",
              }}
              onClick={handleRegister}
            >
              Register
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default App;
