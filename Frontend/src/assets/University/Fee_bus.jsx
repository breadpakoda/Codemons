import React, { useEffect, useState } from "react";
import axios from "axios";

function Fee_bus() {
  const [student, setStudent] = useState(null);
  const [isBusUser, setIsBusUser] = useState(false);
  const [distance, setDistance] = useState(5);
  const [amount, setAmount] = useState(0);
  const [remark, setRemark] = useState("");
  const [paymentStep, setPaymentStep] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${API}/bus/info`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setIsBusUser(res.data.isBusUser);
        setStudent(res.data.student);
      });
  }, []);

  useEffect(() => {
    if (isBusUser) {
      axios
        .post(`${API}/bus/calculate`, { distance })
        .then((res) => setAmount(res.data.amount));
    }
  }, [distance, isBusUser]);

  const handlePay = (method) => {
    axios
      .post(
        `${API}/bus/pay`,
        { amount, remark, method },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setReceipt(res.data.receipt);
        setPaymentStep(false);
      });
  };

  if (!isBusUser) return <div style={{ color: "#ac0f0c" }}>You are not a bus user</div>;

  return (
    <div>
      <h2 style={{ color: "#ac0f0c" }}>Bus Fee</h2>

      {!paymentStep ? (
        <>
          <div className="card p-3 mb-3 shadow-hover">
            <p><strong style={{ color: "#ac0f0c" }}>Name:</strong> {student?.name}</p>
            <p><strong style={{ color: "#ac0f0c" }}>Roll:</strong> {student?.roll_no}</p>
          </div>

          <div className="card p-3 mb-3 shadow-hover">
            <h5 style={{ color: "#ac0f0c" }}>Select Distance</h5>
            <select
              className="form-control"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
            >
              <option value={5}>0–5 km</option>
              <option value={10}>5–10 km</option>
              <option value={15}>10+ km</option>
            </select>
          </div>

          <div className="card p-3 mb-3 shadow-hover">
            <h5 style={{ color: "#ac0f0c" }}>Fee: ₹{amount}</h5>
          </div>

          <div className="card p-3 mb-3 shadow-hover">
            <input
              className="form-control"
              placeholder="Remark"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </div>

          <button className="btn btn-primary btn-custom" style={{ backgroundColor: "#ac0f0c", borderColor: "#ac0f0c", color: "white" }} onClick={() => setPaymentStep(true)}>
            Proceed to Payment
          </button>
        </>
      ) : (
        <>
          <h4 style={{ color: "#ac0f0c" }}>Select Payment Method</h4>

          <button className="btn btn-success m-2 btn-custom" style={{ backgroundColor: "#ac0f0c", borderColor: "#ac0f0c", color: "white" }} onClick={() => handlePay("UPI")}>
            UPI
          </button>

          <button className="btn btn-warning m-2 btn-custom" style={{ backgroundColor: "#ac0f0c", borderColor: "#ac0f0c", color: "white" }} onClick={() => handlePay("Card")}>
            Card
          </button>

          <button className="btn btn-secondary m-2 btn-custom" style={{ backgroundColor: "#ac0f0c", borderColor: "#ac0f0c", color: "white" }} onClick={() => handlePay("Cash")}>
            Cash
          </button>
        </>
      )}

      {/* RECEIPT */}
      {receipt && (
        <div className="card p-4 mt-4 shadow-hover">
          <h4 style={{ color: "#ac0f0c" }}>Receipt</h4>
          <p><strong style={{ color: "#ac0f0c" }}>Roll:</strong> {receipt.roll_no}</p>
          <p><strong style={{ color: "#ac0f0c" }}>Amount:</strong> ₹{receipt.amount}</p>
          <p><strong style={{ color: "#ac0f0c" }}>Method:</strong> {receipt.method}</p>
          <p><strong style={{ color: "#ac0f0c" }}>Remark:</strong> {receipt.remark}</p>
          <p><strong style={{ color: "#ac0f0c" }}>Date:</strong> {new Date(receipt.date).toLocaleString()}</p>

          <button
            className="btn btn-success mt-2 btn-custom"
            style={{ backgroundColor: "#ac0f0c", borderColor: "#ac0f0c", color: "white" }}
            onClick={() => window.print()}
          >
            Print
          </button>
        </div>
      )}
    </div>
  );
}

export default Fee_bus;