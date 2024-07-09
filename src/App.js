import React, { useEffect, useState } from 'react';

function App() {
  const [interactions, setInteractions] = useState([]);
  const [callStatus, setCallStatus] = useState([]);
  const [phonenumber, setPhonenumber] = useState('');

  const [content, setContent] = useState('');
  const [todo, setTodo] = useState('');

  const [notodo, setNotodo] = useState('');

  useEffect(() => {
    const ws = new WebSocket('wss://tescall.saleup.cloud/client-connection');
    ws.onopen = () => {
      console.log('Connected to WebSocket server');
    };
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Received message:', message);
      switch (message.event) {
        case 'call-initiated':
          setCallStatus((prevStatus) => [...prevStatus, message]);
          break;
        case 'transcription':
        case 'gpt-reply':
        case 'tts-speech':
          setInteractions((prevInteractions) => [...prevInteractions, message]);
          break;
        default:
          console.warn('Unknown event type:', message.event);
      }
    };
    ws.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    // Cleanup on component unmount
    return () => {
      ws.close();
    };
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://tescall.saleup.cloud/make-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phonenumber,
          content,
          todo,
          notodo,
        }),
      });

      if (response.ok) {
        console.log('Call initiated successfully');
      } else {
        console.error('Failed to initiate call', response.statusText);
      }
    } catch (error) {
      console.error('Error initiating call:', error);
    }
  };

  return (
    <div className="App">
      <h1>Make a Call</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Phone Numbers (comma-separated):</label>
          <input
            type="text"
            value={phonenumber}
            onChange={(e) => setPhonenumber(e.target.value)}
          />
        </div>
        <div>
          <div style ={{marginLeft: '100px', marginTop: '20px'}}>Content:</div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style = {{'width': '60%', 'height': '100px', 'margin-left': '100px', 'margin-top': '20px'}}
            rows="4" // Adjust the number of rows as needed
          />
        </div>
        <div>
          <div style ={{marginLeft: '100px', marginTop: '30px'}}>To Do:</div>
          <textarea
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            style = {{'width': '60%', 'height': '100px', 'margin-left': '100px', 'margin-top': '20px'}}
            rows="4" // Adjust the number of rows as needed
          />
        </div>
        <div>
          <div style ={{marginLeft: '100px', marginTop: '20px'}}>Not To Do:</div>
          <textarea
            value={notodo}
            onChange={(e) => setNotodo(e.target.value)}
            style = {{'width': '60%', 'height': '100px', 'margin-left': '100px', 'margin-top': '20px'}}
            rows="4" // Adjust the number of rows as needed
          />
        </div>
        <button type="submit">Make Call</button>
      </form>
      <h1>Call Status</h1>
      <ul>
        {callStatus.map((status, index) => (
          <li key={index}>
            Call to {status.phonenumber} initiated with SID: {status.callSid}
          </li>
        ))}
      </ul>
      <h1>Interaction Details</h1>
      <ul>
        {interactions.map((interaction, index) => (

          <li key={index}>
            {interaction.event === 'transcription' && (
              <>
                Interaction {interaction.interactionCount}: {interaction.text}
              </>
            )}

            {interaction.event === 'gpt-reply' && (
              <>
                GPT Reply {interaction.icount}: {interaction.gptReply.partialResponse}
              </>
            )}

            {interaction.event === 'tts-speech' && (
              <>
                TTS Speech {interaction.icount}: {interaction.label}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>

  );
}

export default App;