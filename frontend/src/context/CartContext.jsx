import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

const CartContext = createContext(); 

export const CartProvider = ({ children }) => {

  const [cart, setCart] = useState(() => {

    const savedCart =
      localStorage.getItem("cart");

    return savedCart
      ? JSON.parse(savedCart)
      : [];
  });

  // SAVE CART TO LOCAL STORAGE

  useEffect(() => {

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

  }, [cart]);

  // ADD TO CART

  const addToCart = (pizzaItem) => {

    setCart((prevCart) => {

      // CHECK IF SAME ITEM + SAME SIZE ALREADY EXISTS

      const existingItem =
        prevCart.find(
          (item) =>
            item.id === pizzaItem.id &&
            item.size === pizzaItem.size
        );

      // IF EXISTS -> UPDATE QUANTITY

      if (existingItem) {

        return prevCart.map((item) =>

          item.id === pizzaItem.id &&
          item.size === pizzaItem.size

            ? {
                ...item,
                quantity:
                  item.quantity +
                  pizzaItem.quantity,
              }

            : item
        );
      }

      // ELSE ADD NEW ITEM

      return [
        ...prevCart,
        pizzaItem,
      ];
    });
  };

  // REMOVE ITEM

  const removeFromCart = (
    id,
    size
  ) => {

    setCart((prevCart) =>

      prevCart.filter(
        (item) =>
          !(
            item.id === id &&
            item.size === size
          )
      )
    );
  };

  // UPDATE QUANTITY

  const updateQuantity = (
    id,
    size,
    newQty
  ) => {

    if (newQty < 1) return;

    setCart((prevCart) =>

      prevCart.map((item) =>

        item.id === id &&
        item.size === size

          ? {
              ...item,
              quantity: newQty,
            }

          : item
      )
    );
  };

  // CLEAR CART

  const clearCart = () => {

    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () =>
  useContext(CartContext);