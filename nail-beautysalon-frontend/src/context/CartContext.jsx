import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);
const KEY = 'salon-cart';

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem(KEY)) || [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(KEY, JSON.stringify(cart));
    }, [cart]);

    const quantityOf = (productID) => cart.find((i) => i.productID === productID)?.quantity || 0;

    const addToCart = (product) => {
        if (quantityOf(product.productID) >= product.quantityInStock) return false;
        setCart((current) => {
            const existing = current.find((i) => i.productID === product.productID);
            if (existing) {
                return current.map((i) => (i.productID === product.productID ? { ...i, quantity: i.quantity + 1 } : i));
            }
            return [...current, { ...product, quantity: 1 }];
        });
        return true;
    };

    const changeQuantity = (productID, amount) =>
        setCart((current) =>
            current.map((i) => {
                if (i.productID !== productID) return i;
                const next = i.quantity + amount;
                // Ensure we don't exceed quantityInStock
                return next < 1 || next > i.quantityInStock ? i : { ...i, quantity: next };
            })
        );

    const removeItem = (productID) => setCart((current) => current.filter((i) => i.productID !== productID));
    const clearCart = () => setCart([]);

    const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
    const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, cartCount, cartTotal, quantityOf, addToCart, changeQuantity, removeItem, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);