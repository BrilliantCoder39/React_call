import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`https://d313-185-107-69-214.ngrok-free.app/make-call/${phoneNumber}`);
      setMessage(response.data);
    } catch (error) {
      setMessage(`Error: ${error.response ? error.response.data : error.message}`);
    }
  };

  return (
    <div className="App">
      <h1>Initiate a Call</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="phonenumber">Phone Number:</label>
        <input
          type="text"
          id="phonenumber"
          name="phonenumber"
          value={phoneNumber}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Make Call</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
