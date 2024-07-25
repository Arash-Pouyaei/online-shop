import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LoginForm = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    // Dynamically load the reCAPTCHA script
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?hl=fa';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    // Clean up the script when component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Ensure reCAPTCHA is loaded and use grecaptcha
      if (window.grecaptcha) {
        const recaptchaResponse = window.grecaptcha.getResponse();
        
        const response = await axios.post('http://localhost:5000/users/login', {
          Phone_Number: phoneNumber,
          Password: password,
          remember: remember ? 'yes' : 'no',
          'g-recaptcha-response': recaptchaResponse
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true
        });
        console.log(response);
        setSuccess(response.data.message);
        setError(null);
      } else {
        throw new Error('reCAPTCHA not loaded');
      }
    } catch (err) {
      console.log(err);
      setError(err.response ? err.response.data.error : err.message);
      setSuccess(null);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="09XXXXXXXXX"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="رمز عبور"
          required
        />
        <label>
          <input
            type="checkbox"
            checked={remember}
            onChange={() => setRemember(!remember)}
          />
          مرا به خاطر بسپار
        </label>
        <div className="g-recaptcha" data-sitekey="6LcGOhcqAAAAAJ35hZfWMLnSB5VqQbL6xjPgP3bN"></div>
        <button type="submit">ثبت نام</button>
      </form>
      {success && <div>{success}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default LoginForm;
