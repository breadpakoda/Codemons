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
      <h2 style={{ color: "#ac0f0c" }}>Hostel Fee</h2>

      {!paymentStep ? (
        <>
          {/* Student Info */}
          <div className="card p-3 mb-3 shadow-hover">
            <p><strong style={{ color: "#ac0f0c" }}>Name:</strong> {student.name}</p>
            <p><strong style={{ color: "#ac0f0c" }}>Roll:</strong> {student.roll_no}</p>
          </div>

          {/* Room Selection */}
          <div className="card p-3 mb-3 shadow-hover">
            <h5 style={{ color: "#ac0f0c" }}>Select Room Type</h5>
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
          <div className="card p-3 mb-3 shadow-hover">
            <h5 style={{ color: "#ac0f0c" }}>Hostel Fee: ₹{amount}</h5>
          </div>

          {/* Extra */}
          <div className="card p-3 mb-3 shadow-hover">
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

          <button className="btn btn-primary btn-custom" style={{ backgroundColor: "#ac0f0c", borderColor: "#ac0f0c", color: "white" }} onClick={handleProceed}>
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

      {/* ✅ RECEIPT */}
      {receipt && (
        <div className="card p-4 mt-4 shadow-hover">
          <h4 style={{ color: "#ac0f0c" }}>Payment Receipt</h4>

          <p><strong style={{ color: "#ac0f0c" }}>Roll No:</strong> {receipt.roll_no}</p>
          <p><strong style={{ color: "#ac0f0c" }}>Room:</strong> {receipt.room_no}</p>
          <p><strong style={{ color: "#ac0f0c" }}>Hostel ID:</strong> {receipt.hostel_id}</p>
          <p><strong style={{ color: "#ac0f0c" }}>Amount Paid:</strong> ₹{receipt.amount}</p>
          <p><strong style={{ color: "#ac0f0c" }}>Method:</strong> {receipt.method}</p>
          <p><strong style={{ color: "#ac0f0c" }}>Remark:</strong> {receipt.remark}</p>
          <p><strong style={{ color: "#ac0f0c" }}>Date:</strong> {new Date(receipt.date).toLocaleString()}</p>

          <button
            className="btn btn-success mt-2 btn-custom"
            style={{ backgroundColor: "#ac0f0c", borderColor: "#ac0f0c", color: "white" }}
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