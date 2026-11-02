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
        try {
            localStorage.setItem(KEY, JSON.stringify(cart));
        } catch {
            /* storage unavailable - the cart still works for this visit */
        }
    }, [cart]);

    const quantityOf = (id) => cart.find((i) => i.id === id)?.quantity || 0;

    /** Returns true when added, false when the stock limit stops it. */
    const addToCart = (product) => {
        if (quantityOf(product.id) >= product.stock) return false;
        setCart((current) => {
            const existing = current.find((i) => i.id === product.id);
            if (existing) {
                return current.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
            }
            return [...current, { ...product, quantity: 1 }];
        });
        return true;
    };

    const changeQuantity = (id, amount) =>
        setCart((current) =>
            current.map((i) => {
                if (i.id !== id) return i;
                const next = i.quantity + amount;
                return next < 1 || next > i.stock ? i : { ...i, quantity: next };
            })
        );

    const removeItem = (id) => setCart((current) => current.filter((i) => i.id !== id));
    const clearCart = () => setCart([]);

    const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
    const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, cartCount, cartTotal, quantityOf, addToCart, changeQuantity, removeItem, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);
