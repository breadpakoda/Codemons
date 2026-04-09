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

  if (!isBusUser) return <div>You are not a bus user</div>;

  return (
    <div>
      <h2>Bus Fee</h2>

      {!paymentStep ? (
        <>
          <div className="card p-3 mb-3">
            <p><strong>Name:</strong> {student?.name}</p>
            <p><strong>Roll:</strong> {student?.roll_no}</p>
          </div>

          <div className="card p-3 mb-3">
            <h5>Select Distance</h5>
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

          <div className="card p-3 mb-3">
            <h5>Fee: ₹{amount}</h5>
          </div>

          <div className="card p-3 mb-3">
            <input
              className="form-control"
              placeholder="Remark"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </div>

          <button className="btn btn-primary" onClick={() => setPaymentStep(true)}>
            Proceed to Payment
          </button>
        </>
      ) : (
        <>
          <h4>Select Payment Method</h4>

          <button className="btn btn-success m-2" onClick={() => handlePay("UPI")}>
            UPI
          </button>

          <button className="btn btn-warning m-2" onClick={() => handlePay("Card")}>
            Card
          </button>

          <button className="btn btn-secondary m-2" onClick={() => handlePay("Cash")}>
            Cash
          </button>
        </>
      )}

      {/* RECEIPT */}
      {receipt && (
        <div className="card p-4 mt-4">
          <h4>Receipt</h4>
          <p><strong>Roll:</strong> {receipt.roll_no}</p>
          <p><strong>Amount:</strong> ₹{receipt.amount}</p>
          <p><strong>Method:</strong> {receipt.method}</p>
          <p><strong>Remark:</strong> {receipt.remark}</p>
          <p><strong>Date:</strong> {new Date(receipt.date).toLocaleString()}</p>

          <button className="btn btn-success" onClick={() => window.print()}>
            Print
          </button>
        </div>
      )}
    </div>
  );
}

export default Fee_bus;