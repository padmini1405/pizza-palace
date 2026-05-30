import React, { useState, useEffect } from "react";
import "../Styles/AdminDashboard.css";
import "../Styles/AdminPizzaList.css";
import toast from "react-hot-toast";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "../Styles/Navbar.css";
import "../Styles/Footer.css";
import AdminTableSkeleton from "../components/AdminTableSkeleton";
import API_URL from "../config/api";

const AdminPizzaList = ({ searchQuery }) => {
  const [pizzas, setPizzas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("token");
  const [editPizzaId, setEditPizzaId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewPizza, setViewPizza] = useState(null);
  
  // States for custom delete confirmation modal
  const [deleteModal, setDeleteModal] = useState({ show: false, pizzaId: null, pizzaName: "" });

  // Controlled Form Architecture
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "veg",
    imageUrl: "",
    imageFile: null,
    smallPrice: "",
    mediumPrice: "",
    largePrice: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchPizzas();
  }, []);

  const fetchPizzas = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/pizzas`);
      const data = await res.json();
      if (data.success) {
        setPizzas(data.pizza);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (id, currentStatus) => {
    try {
      const res = await fetch(`${API_URL}/pizzas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isAvailable: !currentStatus })
      });
      if (res.ok) fetchPizzas();
    } catch (err) {
      console.error("Error setting availability matrix:", err);
    }
  };

  // Triggers the beautiful confirmation modal instead of standard alert
  const openDeleteModal = (pizza) => {
    setDeleteModal({
      show: true,
      pizzaId: pizza._id,
      pizzaName: pizza.name
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, pizzaId: null, pizzaName: "" });
  };

  const handleDeletePizza = async () => {
    const id = deleteModal.pizzaId;
    closeDeleteModal();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/pizzas/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Pizza deleted successfully!");
        fetchPizzas();
      } else {
        toast.error("Failed to delete the pizza.");
      }
    } catch (err) {
      console.error("Error dropping catalog data node:", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Pizza name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.imageUrl) newErrors.imageUrl = "Pizza image is required";
    if (!formData.smallPrice || Number(formData.smallPrice) <= 0) newErrors.smallPrice = "Enter valid small price";
    if (!formData.mediumPrice || Number(formData.mediumPrice) <= 0) newErrors.mediumPrice = "Enter valid medium price";
    if (!formData.largePrice || Number(formData.largePrice) <= 0) newErrors.largePrice = "Enter valid large price";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditPizza = (pizza) => {
    setEditPizzaId(pizza._id);
    setShowModal(true);
    setFormData({
      name: pizza.name,
      description: pizza.description,
      category: pizza.category,
      imageUrl: pizza.imageUrl,
      imageFile: null,
      smallPrice: pizza.sizes.find((s) => s.size === "Small")?.price || "",
      mediumPrice: pizza.sizes.find((s) => s.size === "Medium")?.price || "",
      largePrice: pizza.sizes.find((s) => s.size === "Large")?.price || "",
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("description", formData.description);
      payload.append("category", formData.category);
      if (formData.imageFile) {
        payload.append("image", formData.imageFile);
      }
      payload.append(
        "sizes",
        JSON.stringify([
          { size: "Small", price: Number(formData.smallPrice) },
          { size: "Medium", price: Number(formData.mediumPrice) },
          { size: "Large", price: Number(formData.largePrice) },
        ])
      );

      const url = editPizzaId ? `${API_URL}/pizzas/${editPizzaId}` : `${API_URL}/pizzas`;
      const method = editPizzaId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      });
      const data = await res.json();
      if (data.success) {
        toast.success(editPizzaId ? "Pizza Updated Successfully" : "Pizza Added Successfully");
        setShowModal(false);
        setEditPizzaId(null);
        setFormData({
          name: "",
          description: "",
          category: "veg",
          imageUrl: "",
          imageFile: null,
          smallPrice: "",
          mediumPrice: "",
          largePrice: "",
        });
        fetchPizzas();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const filteredPizzas = pizzas.filter((pizza) =>
    pizza.name.toLowerCase().includes((searchQuery || "").toLowerCase())
  );

  return (
    <div className="page-layout">
      <Navbar />
      <div className="page-content">
        <div className="inventory-container">
          <div className="inventory-header">
            <div>
              <h1>Inventory Management</h1>
              <p className="subtitle">Manage your culinary catalog, pricing, and availability status.</p>
            </div>
            <button
              className="add-pizza-btn"
              onClick={() => {
                setEditPizzaId(null);
                setFormData({
                  name: "",
                  description: "",
                  category: "veg",
                  imageUrl: "",
                  imageFile: null,
                  smallPrice: "",
                  mediumPrice: "",
                  largePrice: "",
                });
                setShowModal(true);
              }}
            >
              ➕ Add Pizza
            </button>
          </div>

          <table className="inventory-table">
            <thead>
              <tr>
                <th>IMAGE</th>
                <th>PIZZA NAME</th>
                <th>CATEGORY</th>
                <th>PRICE (MED)</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <AdminTableSkeleton />
              ) : (
                filteredPizzas.map((pizza) => {
                  const mediumSize = pizza.sizes?.find((s) => s.size === "Medium");

                  return (
                    <tr key={pizza._id}>
                      <td>
                        <div className="pizza-image-wrapper">
                          <img
                            src={pizza.imageUrl}
                            alt={pizza.name}
                            className={`table-pizza-img ${!pizza.isAvailable ? "out-of-stock-img" : ""}`}
                            onError={(e) => {
                              e.target.src = "https://placehold.co/50x50?text=Pizza";
                            }}
                          />
                          {!pizza.isAvailable && <span className="stock-overlay">OUT OF STOCK</span>}
                        </div>
                      </td>

                      <td>
                        <div className="pizza-name-bold">{pizza.name}</div>
                        <div className="pizza-desc-small">
                          {pizza.description}
                          {pizza.description.length > 120 && (
                            <span className="read-more-link" onClick={() => setViewPizza(pizza)}>
                              Read More
                            </span>
                          )}
                        </div>
                      </td>

                      <td>
                        <span className={`category-tag tag-${pizza.category}`}>
                          {pizza.category.toUpperCase()}
                        </span>
                      </td>

                      <td className="price-text">
                        ${mediumSize ? mediumSize.price.toFixed(2) : "0.00"}
                      </td>

                      <td>
                        <div className="toggle-switch-wrapper">
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={pizza.isAvailable}
                              onChange={() => handleToggleAvailability(pizza._id, pizza.isAvailable)}
                            />
                            <span className="slider round"></span>
                          </label>
                          <span className="status-text-label">
                            {pizza.isAvailable ? "AVAILABLE" : "OUT OF STOCK"}
                          </span>
                        </div>
                      </td>

                      <td>
                        <div className="action-icons-wrap">
                          <button className="view-icon-btn" title="View Pizza" onClick={() => setViewPizza(pizza)}>👁️</button>
                          <button className="edit-icon-btn" title="Edit Item" onClick={() => handleEditPizza(pizza)}>✏️</button>
                          
                          {/* Updated to open the elegant modal wrapper */}
                          <button className="delete-icon-btn" title="Delete Item" onClick={() => openDeleteModal(pizza)}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* CREATE OR EDIT MODAL */}
          {showModal && (
            <div className="modal-backdrop">
              <div className="modal-view-card">
                <h2 className="add-button-model">{editPizzaId ? "Edit Pizza" : "Add New Pizza"}</h2>
                <form onSubmit={handleFormSubmit}>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Pizza Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <textarea
                      placeholder="Pizza Description"
                      rows="4"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                    {errors.description && <span className="error-text">{errors.description}</span>}
                  </div>

                  <div className="form-group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setFormData({
                            ...formData,
                            imageFile: file,
                            imageUrl: URL.createObjectURL(file),
                          });
                        }
                      }}
                    />
                    {errors.imageUrl && <span className="error-text">{errors.imageUrl}</span>}
                    {formData.imageUrl && <img src={formData.imageUrl} alt="" className="preview-image" />}
                  </div>

                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                    <option value="veg">Vegetarian</option>
                    <option value="non-veg">Non-Vegetarian</option>
                    <option value="speciality">Speciality</option>
                    <option value="combo">Combo</option>
                  </select>

                  <div className="size-pricing-row">
                    <div>
                      <input type="number" placeholder="Small Price" value={formData.smallPrice} onChange={(e) => setFormData({ ...formData, smallPrice: e.target.value })} />
                      {errors.smallPrice && <span className="error-text">{errors.smallPrice}</span>}
                    </div>
                    <div>
                      <input type="number" placeholder="Medium Price" value={formData.mediumPrice} onChange={(e) => setFormData({ ...formData, mediumPrice: e.target.value })} />
                      {errors.mediumPrice && <span className="error-text">{errors.mediumPrice}</span>}
                    </div>
                    <div>
                      <input type="number" placeholder="Large Price" value={formData.largePrice} onChange={(e) => setFormData({ ...formData, largePrice: e.target.value })} />
                      {errors.largePrice && <span className="error-text">{errors.largePrice}</span>}
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button type="button" className="cancel-btn" onClick={() => { setShowModal(false); setEditPizzaId(null); setErrors({}); }}>Cancel</button>
                    <button type="submit" className="save-btn" disabled={loading}>{loading ? "Saving..." : "Save Pizza"}</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* VIEW PIZZA MODAL */}
          {viewPizza && (
            <div className="modal-backdrop">
              <div className="view-modal-card">
                <div className="view-header">
                  <h2>Pizza Details</h2>
                  <button className="close-view-btn" onClick={() => setViewPizza(null)}>✖</button>
                </div>
                <img src={viewPizza.imageUrl} alt={viewPizza.name} className="view-pizza-image" />
                <div className="view-details">
                  <h3>{viewPizza.name}</h3>
                  <p className="view-description">{viewPizza.description}</p>
                  <div className="view-category">{viewPizza.category.toUpperCase()}</div>
                  <div className="view-status">Status: <span>{viewPizza.isAvailable ? " Available" : " Out Of Stock"}</span></div>
                  <div className="view-prices">
                    {viewPizza.sizes.map((size) => (
                      <div key={size.size} className="price-box">
                        <h4>{size.size}</h4>
                        <p>${size.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NEW: CUSTOM CULINARY CONFIRMATION DELETE MODAL */}
          {deleteModal.show && (
            <div className="modal-backdrop">
              <div className="modal-view-card confirmation-card">
                <div className="confirmation-icon">⚠️</div>
                <h2>Remove From Catalog?</h2>
                <p>
                  Are you sure you want to permanently delete <strong>{deleteModal.pizzaName}</strong>? This action cannot be reversed.
                </p>
                <div className="modal-actions explicit-gap">
                  <button type="button" className="cancel-btn" onClick={closeDeleteModal}>
                    Keep Item
                  </button>
                  <button type="button" className="delete-confirm-btn" onClick={handleDeletePizza}>
                    Yes, Delete
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminPizzaList;