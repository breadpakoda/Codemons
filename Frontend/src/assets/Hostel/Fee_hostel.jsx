import React, { useEffect, useState } from "react";
import axios from "axios";

function Fee_hostel() {
  const [student, setStudent] = useState({});
  const [roomType, setRoomType] = useState("3");
  const [amount, setAmount] = useState(0);
  const [extra, setExtra] = useState("");
  const [remark, setRemark] = useState("");
  const [paymentStep, setPaymentStep] = useState(false);
  const [receipt, setReceipt] = useState(null); // ✅ added

  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${API}/hostel/info`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStudent(res.data.student));
  }, []);

  // calculate fee
  useEffect(() => {
    axios
      .post(`${API}/hostel/calculate`, { roomType })
      .then((res) => setAmount(res.data.amount));
  }, [roomType]);

  const handleProceed = () => {
    setPaymentStep(true);
  };

  const handlePay = (method) => {
    axios
      .post(
        `${API}/hostel/pay`,
        {
          roomType,
          extraAmount: extra,
          remark,
          method, // ✅ added
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setReceipt(res.data.receipt); // ✅ store receipt
        setPaymentStep(false);
      });
  };

  return (
    <div>
      <h2>Hostel Fee</h2>

      {!paymentStep ? (
        <>
          {/* Student Info */}
          <div className="card p-3 mb-3">
            <p><strong>Name:</strong> {student.name}</p>
            <p><strong>Roll:</strong> {student.roll_no}</p>
          </div>

          {/* Room Selection */}
          <div className="card p-3 mb-3">
            <h5>Select Room Type</h5>
            <select
              className="form-control"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
            >
              <option value="2">2 Sharing</option>
              <option value="3">3 Sharing</option>
            </select>
          </div>

          {/* Fee */}
          <div className="card p-3 mb-3">
            <h5>Hostel Fee: ₹{amount}</h5>
          </div>

          {/* Extra */}
          <div className="card p-3 mb-3">
            <input
              className="form-control mb-2"
              placeholder="Extra amount"
              value={extra}
              onChange={(e) => setExtra(e.target.value)}
            />
            <input
              className="form-control"
              placeholder="Remark"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </div>

          <button className="btn btn-primary" onClick={handleProceed}>
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

      {/* ✅ RECEIPT */}
      {receipt && (
        <div className="card p-4 mt-4">
          <h4>Payment Receipt</h4>

          <p><strong>Roll No:</strong> {receipt.roll_no}</p>
          <p><strong>Room:</strong> {receipt.room_no}</p>
          <p><strong>Hostel ID:</strong> {receipt.hostel_id}</p>
          <p><strong>Amount Paid:</strong> ₹{receipt.amount}</p>
          <p><strong>Method:</strong> {receipt.method}</p>
          <p><strong>Remark:</strong> {receipt.remark}</p>
          <p><strong>Date:</strong> {new Date(receipt.date).toLocaleString()}</p>

          <button
            className="btn btn-success mt-2"
            onClick={() => window.print()}
          >
            Print Receipt
          </button>
        </div>
      )}
    </div>
  );
}

export default Fee_hostel;