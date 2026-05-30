import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import "../Styles/OrderPage.css";
import "../Styles/Skeleton.css";
import API_URL from "../config/api.js";

const OrdersPage = ({ adminView = false }) => {

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const token =
    localStorage.getItem("token");

  useEffect(() => {

    if (!token) {
      setLoading(false);
      return;
    }

    fetchOrders();

  }, [token]);

  const fetchOrders = async () => {

    try {

      const endpoint = adminView
        ? `${API_URL}/orders`
        : `${API_URL}/orders/my`;

      const response = await fetch(endpoint, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log(data);

      if (!response.ok) {
        throw new Error(data.message);
      }

      if (data.success) {
        setOrders(data.orders);
      }

    } catch (error) {

      console.log("ORDER ERROR:", error.message);

    } finally {

      setLoading(false);

    }
  };

  // UPDATE STATUS (ADMIN)

  const updateStatus = async (
    orderId,
    status
  ) => {

    try {

      const response = await fetch(
        `${API_URL}/orders/${orderId}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      const data =
        await response.json();

      if (data.success) {
        fetchOrders();
      }

    } catch (error) {

      console.log(error);

    }
  };

  // CANCEL ORDER

  const cancelOrder = async (
    orderId
  ) => {

    try {

      const response = await fetch(
        `${API_URL}/orders/${orderId}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (data.success) {
        fetchOrders();
      }

    } catch (error) {

      console.log(error);

    }
  };

  // STATUS WIDTH

  const getProgressWidth = (
    status
  ) => {

    switch (status) {

      case "Pending":
        return "20%";

      case "Confirmed":
        return "40%";

      case "Preparing":
        return "60%";

      case "Out for Delivery":
        return "85%";

      case "Delivered":
        return "100%";

      default:
        return "10%";
    }
  };

  if (loading) {
    return (
      <div className="orders-page">
        <Navbar />

        <div className="orders-container">

          {[1, 2, 3].map((item) => (
            <div className="order-card" key={item}>

              <div className="order-left">

                <div
                  className="skeleton"
                  style={{
                    width: "90px",
                    height: "90px",
                    borderRadius: "14px"
                  }}
                ></div>

                <div className="order-details">

                  <div
                    className="skeleton"
                    style={{
                      width: "120px",
                      height: "18px",
                      marginBottom: "10px"
                    }}
                  ></div>

                  <div
                    className="skeleton"
                    style={{
                      width: "200px",
                      height: "16px",
                      marginBottom: "10px"
                    }}
                  ></div>

                  <div
                    className="skeleton"
                    style={{
                      width: "160px",
                      height: "14px"
                    }}
                  ></div>

                </div>

              </div>

            </div>
          ))}

        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">

      <Navbar />

      <div className="orders-container">

        <div className="orders-header">

          <h1>
            {adminView
              ? "All Orders"
              : "Order History"}
          </h1>

          <p>
            Track and manage your
            pizza orders.
          </p>

        </div>

        {orders.length > 0 ? (

          orders.map((order) => (

            <div
              className="order-card"
              key={order._id}
            >

              {/* LEFT */}

              <div className="order-left">

                <img
                  src={
                    order.items[0]
                      ?.imageUrl ||
                    order.items[0]
                      ?.pizza?.imageUrl
                  }

                  alt="pizza"

                  className="order-img"
                />

                <div className="order-details">

                  <div className="order-top">

                    <span className="order-id">
                      #{order._id.slice(-6)}
                    </span>

                    <span
                      className={`status-badge ${order.status
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        }`}
                    >
                      {order.status}
                    </span>

                  </div>

                  <h2>

                    {order.items
                      .map(
                        (item) =>
                          item.pizza?.name ||
                          item.name
                      )
                      .join(", ")}

                  </h2>

                  <p>

                    Ordered on{" "}

                    {new Date(
                      order.createdAt
                    ).toLocaleString()}

                  </p>

                  <div className="items-text">

                    {order.items.map(
                      (item, index) => (

                        <div key={index}>

                          {item.quantity} ×{" "}

                          {item.pizza?.name ||
                            item.name}

                          {" "}({item.size})

                        </div>

                      )
                    )}

                  </div>

                </div>

              </div>

              {/* RIGHT */}

              <div className="order-right">

                <h2>
                  ₹{order.totalAmount}
                </h2>

                {/* ADMIN */}

                {adminView ? (

                  <select
                    value={order.status}

                    onChange={(e) =>
                      updateStatus(
                        order._id,
                        e.target.value
                      )
                    }

                    className="status-select"
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

                ) : (

                  <button
                    className="cancel-btn"

                    disabled={order.status !== "Pending"}

                    onClick={() =>
                      cancelOrder(order._id)
                    }
                  >
                    {order.status === "Pending"
                      ? "Cancel Order"
                      : "Cannot Cancel"}
                  </button>

                )}

              </div>

              {/* PROGRESS BAR */}

              <div className="progress-wrapper">

                <div
                  className="progress-bar"

                  style={{
                    width:
                      getProgressWidth(
                        order.status
                      ),
                  }}
                ></div>

              </div>

            </div>

          ))

        ) : (

          <h2 className="no-orders">
            No Orders Found
          </h2>

        )}

      </div>

    </div>
  );
};

export default OrdersPage;