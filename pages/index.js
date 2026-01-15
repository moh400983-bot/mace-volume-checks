import { useState } from "react";

export default function Home() {
  const [address, setAddress] = useState("");
  const [period, setPeriod] = useState("7d");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkVolume = async () => {
    if (!address) return alert("Enter wallet");
    setLoading(true);
    setResult(null);

    const res = await fetch(
      `/api/volume?address=${address}&period=${period}`
    );
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  const shareToX = () => {
    const text = `🔥 My Mace DEX trading volume

Wallet: ${address}
Period: ${period.toUpperCase()}
Volume: ${result.volume}

Check yours 👇`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text
      )}`,
      "_blank"
    );
  };

  return (
    <>
      <style jsx>{`
        body {
          margin: 0;
          background: radial-gradient(
            circle at top,
            #ff7a18,
            #0b0b0b 60%
          );
          font-family: system-ui, sans-serif;
          color: white;
        }

        .container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .card {
          background: rgba(0, 0, 0, 0.75);
          border-radius: 20px;
          padding: 28px;
          max-width: 420px;
          width: 100%;
          box-shadow: 0 0 40px rgba(255, 122, 24, 0.35);
          animation: glow 3s infinite alternate;
        }

        @keyframes glow {
          from {
            box-shadow: 0 0 20px rgba(255, 122, 24, 0.25);
          }
          to {
            box-shadow: 0 0 50px rgba(255, 122, 24, 0.55);
          }
        }

        .logo {
          display: block;
          margin: 0 auto 16px;
          width: 160px;
        }

        h1 {
          text-align: center;
          margin-bottom: 6px;
        }

        .brand {
          text-align: center;
          font-size: 0.85rem;
          opacity: 0.85;
        }

        .brand a {
          color: #ff7a18;
          text-decoration: none;
        }

        input,
        select,
        button {
          width: 100%;
          padding: 14px;
          margin-top: 14px;
          border-radius: 12px;
          border: none;
          font-size: 1rem;
        }

        input,
        select {
          background: #111;
          color: white;
        }

        button {
          background: linear-gradient(135deg, #ff7a18, #ff9f45);
          font-weight: bold;
          cursor: pointer;
        }

        .result {
          margin-top: 18px;
          text-align: center;
        }

        .share {
          background: #1d9bf0;
          margin-top: 10px;
        }
      `}</style>

      <div className="container">
        <div className="card">
          <img src="/mace-logo.png" className="logo" />

          <h1>Mace Volume Checker</h1>

          <div className="brand">
            Built by{" "}
            <a href="https://x.com/BigAbdulWeb3" target="_blank">
              BigAbdulWeb3
            </a>
          </div>

          <input
            placeholder="Wallet address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <select onChange={(e) => setPeriod(e.target.value)}>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>

          <button onClick={checkVolume}>
            {loading ? "Scanning Mace..." : "Check Volume"}
          </button>

          {result && (
            <div className="result">
              <p>
                <strong>Volume:</strong> {result.volume}
              </p>
              <button className="share" onClick={shareToX}>
                Share on X
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
