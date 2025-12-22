import React, { useEffect, useState } from 'react';
import { useCart } from '@features/addToCart/cartContext/cartContext'
import { Image } from '../../entities/product/ui/image';

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
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [apiClient, setApiClient] = useState(null);

  useEffect(() => {
    if (window.FurnitureStoreAPI) {
      setApiClient(window.FurnitureStoreAPI); // используем правильное имя
    } else {
      console.error('API client not found. Make sure api-client.js is loaded.');
    }
  }, []);

  const getOriginalTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalDiscount = () => {
    return getOriginalTotal() - getTotalPrice();
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Валидация ФИО
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Введите ФИО';
    } else if (formData.fullName.trim().split(' ').length < 3) {
      newErrors.fullName = 'Введите полное ФИО (Фамилия Имя Отчество)';
    }
    
    // Валидация адреса
    if (!formData.address.trim()) {
      newErrors.address = 'Введите адрес доставки';
    } else if (formData.address.trim().split(',').length < 4) {
      newErrors.address = 'Введите полный адрес (Область, город, улица, дом)';
    }
    
    // Валидация email
    if (!formData.email.trim()) {
      newErrors.email = 'Введите email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }
    
    // Валидация телефона
    if (!formData.phone.trim()) {
      newErrors.phone = 'Введите номер телефона';
    } else {
      // Убираем все нецифровые символы для проверки
      const phoneDigits = formData.phone.replace(/\D/g, '');
      
      // Проверяем, что номер содержит от 10 до 15 цифр
      if (phoneDigits.length < 10 || phoneDigits.length > 15) {
        newErrors.phone = 'Введите корректный номер телефона (10-15 цифр)';
      } else if (!/^[+]?[0-9\s\-()]+$/.test(formData.phone)) {
        newErrors.phone = 'Номер телефона может содержать только цифры, пробелы, дефисы и круглые скобки';
      }
    }
    
    return newErrors;
  };

  const formatPhoneNumber = (value) => {
    // Удаляем все нецифровые символы
    const phoneNumber = value.replace(/\D/g, '');
    
    // Форматируем номер в зависимости от длины
    if (phoneNumber.length === 0) return '';
    
    if (phoneNumber.length <= 1) return `+${phoneNumber}`;
    if (phoneNumber.length <= 4) return `+${phoneNumber.slice(0,1)} (${phoneNumber.slice(1)}`;
    if (phoneNumber.length <= 7) return `+${phoneNumber.slice(0,1)} (${phoneNumber.slice(1,4)}) ${phoneNumber.slice(4)}`;
    if (phoneNumber.length <= 9) return `+${phoneNumber.slice(0,1)} (${phoneNumber.slice(1,4)}) ${phoneNumber.slice(4,7)}-${phoneNumber.slice(7)}`;
    
    return `+${phoneNumber.slice(0,1)} (${phoneNumber.slice(1,4)}) ${phoneNumber.slice(4,7)}-${phoneNumber.slice(7,9)}-${phoneNumber.slice(9,11)}`;
  };

  const handlePhoneChange = (e) => {
    const { value } = e.target;
    const formattedPhone = formatPhoneNumber(value);
    
    setFormData(prev => ({
      ...prev,
      phone: formattedPhone
    }));
    
    if (errors.phone) {
      setErrors(prev => ({
        ...prev,
        phone: ''
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      handlePhoneChange(e);
    } else {
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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Проверяем наличие API клиента
    if (!apiClient) { // используем правильное имя
      alert('Ошибка: API клиент не загружен');
      return;
    }
    
    // Проверяем валидность формы
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Проверяем, есть ли товары в корзине
    if (cartItems.length === 0) {
      alert('Корзина пуста');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Преобразуем данные формы для API
      const clientData = {
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: '+' + formData.phone.replace(/\D/g, ''),
        address: formData.address.trim()
      };
      
      const items = cartItems.map(item => ({
        furnitureId: item.id,
        count: item.quantity
      }));
      
      console.log('Отправка заказа:', { clientData, items });

      const result = await apiClient.createOrderWithClient({
        client: clientData,
        items: items
      });
      console.log(result)
      if (result.success) {
        setOrderResult({
          orderId: result.order.id,
          client: result.client,
          existed: result.clientExisted
        });
        
        // Очищаем корзину
        clearCart();
        
        // Сбрасываем форму
        setFormData({
          fullName: '',
          address: '',
          email: '',
          phone: ''
        });
        
        alert(`Заказ успешно оформлен! Номер заказа: #${result.order.id}`);
      } else {
        throw new Error('Не удалось создать заказ');
      }
      
    } catch (error) {
      console.error('Ошибка оформления заказа:', error);
      alert(`Ошибка оформления заказа: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    const phoneDigits = formData.phone.replace(/\D/g, '');
    
    return formData.fullName.trim() && 
           formData.address.trim() && 
           formData.email.trim() &&
           formData.phone.trim() &&
           formData.fullName.trim().split(' ').length >= 3 &&
           formData.address.trim().split(',').length >= 4 &&
           /\S+@\S+\.\S+/.test(formData.email) &&
           phoneDigits.length >= 10 && 
           phoneDigits.length <= 15 &&
           /^[+]?[0-9\s\-()]+$/.test(formData.phone);
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
                <Image url={item.image} className="cart-item-image" />
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
              <label htmlFor="phone" className="form-label">
                Номер телефона
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+7 (999) 123-45-67"
                className={`form-input ${errors.phone ? 'error' : ''}`}
              />
              {errors.phone && (
                <span className="error-message">{errors.phone}</span>
              )}
              <div className="input-hint">
                Формат: +7 (XXX) XXX-XX-XX
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
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