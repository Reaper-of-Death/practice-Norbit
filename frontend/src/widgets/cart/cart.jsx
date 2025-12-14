import React, { useState } from 'react';
import { useCart } from '@features/addToCart/cartContext/cartContext'

export const Cart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    getTotalItems,
    getTotalPrice,
  } = useCart();

  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    email: ''
  });
  const [errors, setErrors] = useState({});

  const getOriginalTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalDiscount = () => {
    return getOriginalTotal() - getTotalPrice();
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Введите ФИО';
    } else if (formData.fullName.trim().split(' ').length < 3) {
      newErrors.fullName = 'Введите полное ФИО (Фамилия Имя Отчество)';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Введите адрес доставки';
    } else if (formData.address.trim().split(',').length < 4) {
      newErrors.address = 'Введите полный адрес (Область, город, улица, дом)';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Введите email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }
    
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length === 0) {
      console.log('Заказ оформлен:', { formData, cartItems });
      alert('Заказ успешно оформлен!');
      clearCart();
    } else {
      setErrors(validationErrors);
    }
  };

  const isFormValid = () => {
    return formData.fullName.trim() && 
           formData.address.trim() && 
           formData.email.trim() &&
           formData.fullName.trim().split(' ').length >= 3 &&
           formData.address.trim().split(',').length >= 4 &&
           /\S+@\S+\.\S+/.test(formData.email);
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h3>Корзина пуста</h3>
        <p>Добавьте товары из каталога</p>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        {/* Левая колонка - товары */}
        <div className="cart-items-section">
          <div className="cart-header">
            <h2>Корзина</h2>
            <button 
              onClick={clearCart}
              className="cart-clear-btn"
              aria-label="Очистить корзину"
            >
              Очистить корзину
            </button>
          </div>
          
          <div className="cart-items-list">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item-card">
                <img 
                  src={item.image.url} 
                  alt={item.image.alt} 
                  className="cart-item-image"
                />
                <div className="cart-item-content">
                  <h3 className="cart-item-title">{item.name}</h3>
                  <div className="cart-item-price-info">
                    {item.discountPrice ? (
                      <>
                        <span className="cart-item-current-price">
                          {item.discountPrice * item.quantity} ₽
                        </span>
                        <span className="cart-item-original-price">
                          {item.price * item.quantity} ₽
                        </span>
                      </>
                    ) : (
                      <span className="cart-item-current-price">
                        {item.price * item.quantity} ₽
                      </span>
                    )}
                  </div>
                  <div className="cart-item-quantity-controls">
                    <div className="quantity-label">Количество:</div>
                    <div className="quantity-buttons">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="quantity-btn minus"
                        aria-label="Уменьшить количество"
                      >
                        −
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="quantity-btn plus"
                        aria-label="Увеличить количество"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="remove-item-btn"
                        aria-label="Удалить товар"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span>Количество товаров:</span>
              <span className="summary-value">{getTotalItems()} шт.</span>
            </div>
            <div className="summary-row">
              <span>Цена без скидок:</span>
              <span className="summary-value original-price">{getOriginalTotal()} ₽</span>
            </div>
            {getTotalDiscount() > 0 && (
              <div className="summary-row discount-row">
                <span>Скидка:</span>
                <span className="summary-value discount-price">-{getTotalDiscount()} ₽</span>
              </div>
            )}
            <div className="summary-row total-row">
              <span>Итого к оплате:</span>
              <span className="summary-value total-price">{getTotalPrice()} ₽</span>
            </div>
          </div>
        </div>

        {/* Правая колонка - форма заказа */}
        <div className="order-form-section">
          <h2 className="form-title">Оформление заказа</h2>
          
          <form onSubmit={handleSubmit} className="order-form">
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">
                ФИО Заказчика
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Иванов Иван Иванович"
                className={`form-input ${errors.fullName ? 'error' : ''}`}
              />
              {errors.fullName && (
                <span className="error-message">{errors.fullName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="address" className="form-label">
                Адрес доставки
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Область, город, улица, дом"
                className={`form-input ${errors.address ? 'error' : ''}`}
              />
              {errors.address && (
                <span className="error-message">{errors.address}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Почта
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="UserName@gmail.com"
                className={`form-input ${errors.email ? 'error' : ''}`}
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <div className="form-footer">
              <div className="form-total">
                <span className="form-total-label">Сумма заказа:</span>
                <span className="form-total-price">{getTotalPrice()} ₽</span>
              </div>
              
              <button
                type="submit"
                className={`submit-order-btn ${!isFormValid() ? 'disabled' : ''}`}
                disabled={!isFormValid()}
              >
                Заказать
              </button>
            </div>
          </form>

          <div className="policy-section">
            <p className="policy-text">
              Нажимая кнопку "Заказать", вы соглашаетесь с 
              <a href="/policy" className="policy-link"> Политикой конфиденциальности</a>
              и
              <a href="/terms" className="policy-link"> Условиями использования</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};