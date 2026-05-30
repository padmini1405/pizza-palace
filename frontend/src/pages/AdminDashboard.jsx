import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/AdminDashboard.css";
import Navbar from "../Components/Navbar";
import "../Styles/Navbar.css";
import jsPDF from "jspdf";
import "../Styles/Skeleton.css";
import API_URL from "../config/api.js";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState("today");
  const token = localStorage.getItem("token"); // Assumes storage architecture from auth flow

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `${API_URL}/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Error connecting to order pipeline: ", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `${API_URL}/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status: newStatus })
        });
      const data = await response.json();
      if (data.success) {
        fetchOrders(); // Sync real-time UI data matrix
      }
    } catch (err) {
      console.error("Error setting system status: ", err);
    }
  };

  const filteredOrders = orders.filter(
    (order) => {

      const orderDate =
        new Date(order.createdAt);

      const now = new Date();

      // TODAY

      if (reportType === "today") {

        return (
          orderDate.toDateString() ===
          now.toDateString()
        );
      }

      // LAST WEEK

      if (reportType === "week") {

        const lastWeek =
          new Date();

        lastWeek.setDate(
          now.getDate() - 7
        );

        return orderDate >= lastWeek;
      }

      // LAST MONTH

      if (reportType === "month") {

        const lastMonth =
          new Date();

        lastMonth.setMonth(
          now.getMonth() - 1
        );

        return orderDate >= lastMonth;
      }

      return true;
    }
  );

  // Analytical Reducer Matrices
  const totalRevenue = filteredOrders
    .filter(
      (order) =>
        order.status === "Delivered"
    )
    .reduce(
      (acc, curr) =>
        acc + curr.totalAmount,
      0
    );

  const activeUsersCount =
    new Set(
      filteredOrders.map(
        (order) =>
          order.customerId?._id
      )
    ).size;

  const downloadReport = () => {

    const doc = new jsPDF();

    doc.setFontSize(18);

    doc.text(
      "Pizza Palace Report",
      20,
      20
    );

    doc.setFontSize(12);

    doc.text(
      `Report Type: ${reportType}`,
      20,
      35
    );

    doc.text(
      `Total Orders: ${filteredOrders.length}`,
      20,
      45
    );

    doc.text(
      `Revenue: ₹${totalRevenue}`,
      20,
      55
    );

    let y = 75;

    filteredOrders.forEach(
      (order, index) => {

        doc.text(
          `${index + 1}. ${order.customerId?.name
          } - ₹${order.totalAmount} - ${order.status
          }`,
          20,
          y
        );

        y += 10;

        if (y > 270) {

          doc.addPage();

          y = 20;
        }
      }
    );

    doc.save(
      `${reportType}-report.pdf`
    );
  };

  if (loading) {
    return (
      <div className="dashboard-container">

        <div className="metrics-grid">

          {[1, 2, 3, 4].map((item) => (
            <div className="metric-card" key={item}>

              <div
                className="skeleton"
                style={{
                  width: "120px",
                  height: "18px",
                  marginBottom: "20px"
                }}
              ></div>

              <div
                className="skeleton"
                style={{
                  width: "80px",
                  height: "40px",
                  marginBottom: "15px"
                }}
              ></div>

              <div
                className="skeleton"
                style={{
                  width: "140px",
                  height: "14px"
                }}
              ></div>

            </div>
          ))}

        </div>

      </div>
    );
  }
  return (
    <div className="page-layout">

      <Navbar />

      <div className="dashboard-container">

        {/* HEADER */}

        <div className="dashboard-header">

          <div>
            <h1>Admin Overview</h1>

            <p className="subtitle">
              Real-time pizza business analytics and order tracking.
            </p>
          </div>

          <div className="report-actions">

            <select
              value={reportType}
              onChange={(e) =>
                setReportType(e.target.value)
              }
              className="report-dropdown"
            >

              <option value="today">
                Today Report
              </option>

              <option value="week">
                Last Week Report
              </option>

              <option value="month">
                Last Month Report
              </option>

            </select>

            <button
              className="download-btn"
              onClick={downloadReport}
            >
              ⬇ Download PDF
            </button>

          </div>

        </div>

        {/* TOP CARDS */}

        <div className="metrics-grid">

          {/* TOTAL REVENUE */}

          <div className="metric-card">

            <span className="metric-title">
              Total Revenue
            </span>

            <span className="metric-value">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </span>

            <span className="metric-trend text-green">
              Delivered Orders Revenue
            </span>

          </div>

          {/* ORDERS TODAY */}

          <div className="metric-card">

            <span className="metric-title">
              Orders Today
            </span>

            <span className="metric-value">
              {filteredOrders.length}
            </span>

            <span className="metric-trend text-brown">
              Total Orders Received
            </span>

          </div>

          <div className="metric-card">

            <span className="metric-title">
              Active Users
            </span>

            <span className="metric-value">
              {activeUsersCount}
            </span>

            <span className="metric-trend text-green">
              Customers placing orders
            </span>

          </div>

          {/* QUICK ACTIONS */}

          <div className="metric-card quick-actions-card">

            <span className="metric-title">
              Quick Actions
            </span>

            <button
              className="action-btn primary-action"
              onClick={() =>
                navigate("/admin-pizzalist")
              }
            >
              ➕ Add New Pizza
            </button>

            {/* <button className="action-btn secondary-action">
              📥 Export Report
            </button> */}

          </div>

        </div>
        {/* ------------------------------- */}
        {/* RECENT ORDERS */}

        {/* <div className="recent-orders-card">

          <div className="card-header">

            <h3>Recent Orders</h3>

          </div>

          <table className="orders-table">

            <thead>

              <tr>
                <th>ORDER ID</th>
                <th>CUSTOMER</th>
                <th>ITEMS</th>
                <th>STATUS</th>
                <th>TOTAL</th>
              </tr>

            </thead>

            <tbody>

              {filteredOrders.length > 0 ? (

                filteredOrders.map((order) => (

                  <tr key={order._id}>

                    <td className="order-id">
                      #{order._id.slice(-5)}
                    </td>

                    <td>
                      {order.customerId?.name || "Guest"}
                    </td>

                    <td>

                      {order.items.map((item, i) => (

                        <div key={i}>

                          {item.quantity} ×{" "}

                          {
                            item.pizza?.name
                              ? item.pizza.name
                              : "Pizza Item"
                          }

                          {" "}({item.size})

                        </div>

                      ))}

                    </td>

                    <td>

                      <select
                        className={`status-dropdown badge-${order.status
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}

                        value={order.status}

                        onChange={(e) =>
                          handleStatusChange(
                            order._id,
                            e.target.value
                          )
                        }
                      >

                        <option value="Pending">
                          Pending
                        </option>

                        <option value="Confirmed">
                          Confirmed
                        </option>

                        <option value="Preparing">
                          Preparing
                        </option>

                        <option value="Out for Delivery">
                          Out for Delivery
                        </option>

                        <option value="Delivered">
                          Delivered
                        </option>

                      </select>

                    </td>

                    <td className="order-total">
                      ₹{order.totalAmount || 0}
                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td colSpan="5">
                    No Orders Found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div> */}

        {/* Kitchen Orders  */}

        {/* <div className="staff-card">

          <h3>Kitchen Staff</h3>

          <div className="staff-row">

            <div className="staff-dot active-dot"></div>

            <div>
              <p className="staff-name">
                Chef Alberto
              </p>

              <p className="staff-role">
                Pizza Baking Specialist
              </p>
            </div>

          </div>

          <div className="staff-row">

            <div className="staff-dot active-dot"></div>

            <div>
              <p className="staff-name">
                Chef Sofia
              </p>

              <p className="staff-role">
                Dough Preparation
              </p>
            </div>

          </div>

          <div className="staff-row">

            <div className="staff-dot offline-dot"></div>

            <div>
              <p className="staff-name">
                Chef Marco
              </p>

              <p className="staff-role">
                Off Duty
              </p>
            </div>

          </div>

        </div> */}
        {/* ------------------------------------ */}


        <div className="bottom-grid">

          {/* RECENT ORDERS */}

          <div className="recent-orders-card">

            <div className="card-header">
              <h3>Recent Orders</h3>
            </div>

            <table className="orders-table">

              <thead>
                <tr>
                  <th>ORDER ID</th>
                  <th>CUSTOMER</th>
                  <th>ITEMS</th>
                  <th>STATUS</th>
                  <th>TOTAL</th>
                </tr>
              </thead>

              <tbody>

                {filteredOrders.length > 0 ? (

                  filteredOrders.map((order) => (

                    <tr key={order._id}>

                      <td className="order-id">
                        #{order._id.slice(-5)}
                      </td>

                      <td>
                        {order.customerId?.name || "Guest"}
                      </td>

                      <td>

                        {order.items.map((item, i) => (

                          <div key={i}>

                            {item.quantity} ×{" "}

                            {
                              item.pizza?.name
                                ? item.pizza.name
                                : "Pizza Item"
                            }

                            {" "}({item.size})

                          </div>

                        ))}

                      </td>

                      <td>

                        <select
                          className={`status-dropdown badge-${order.status
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}

                          value={order.status}

                          onChange={(e) =>
                            handleStatusChange(
                              order._id,
                              e.target.value
                            )
                          }
                        >

                          <option value="Pending">
                            Pending
                          </option>

                          <option value="Confirmed">
                            Confirmed
                          </option>

                          <option value="Preparing">
                            Preparing
                          </option>

                          <option value="Out for Delivery">
                            Out for Delivery
                          </option>

                          <option value="Delivered">
                            Delivered
                          </option>

                        </select>

                      </td>

                      <td className="order-total">
                        ₹{order.totalAmount || 0}
                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>
                    <td colSpan="5">
                      No Orders Found
                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>

          {/* KITCHEN STAFF */}

          <div className="staff-card">

            <h3>Kitchen Staff</h3>

            <div className="staff-row">

              <div className="staff-dot active-dot"></div>

              <div>
                <p className="staff-name">
                  Chef Alberto
                </p>

                <p className="staff-role">
                  Pizza Baking Specialist
                </p>
              </div>

            </div>

            <div className="staff-row">

              <div className="staff-dot active-dot"></div>

              <div>
                <p className="staff-name">
                  Chef Sofia
                </p>

                <p className="staff-role">
                  Dough Preparation
                </p>
              </div>

            </div>

            <div className="staff-row">

              <div className="staff-dot offline-dot"></div>

              <div>
                <p className="staff-name">
                  Chef Marco
                </p>

                <p className="staff-role">
                  Off Duty
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;