import { useEffect } from 'react';
import './App.css';

function App() {
  const getQueryParams = (query = null) => [...(new URLSearchParams(query||window.location.search||"")).entries()].reduce((a,[k,v])=>(a[k]=v,a),{});

  const authenticateUser = async () => {

    window.location.href = 'http://login.salesforce.com/services/oauth2/authorize?client_id=3MVG9yZ.WNe6byQDn_tc_.9aCjm_xoITkY9Wk9TX1us_oY_8ImbWF6cUgmkrRWmL4xlitLBRQgGA9pupDi.76&redirect_uri=http%3A//localhost%3A3000&response_type=token&scopes=api%20id';
    
  }

  useEffect(() => {
    if (window.location.href === 'http://localhost:3000/') {
      authenticateUser()
    }

    const { access_token: accessToken } = getQueryParams(window.location.href.replace('http://localhost:3000/#', ''))
    console.log(accessToken)

    const urlContacts = "https://test448-dev-ed.develop.my.salesforce.com/services/data/v56.0/query/?q=SELECT+name+from+Account";
    fetch(urlContacts,
    {method:'GET',
        headers: {
          'Content-Type': 'text/json',
          "Access-Control-Allow-Methods": "GET",
          "Access-Control-Allow-Origin": "*",
          "Authorization": `Bearer ${accessToken}`
        },
    })
    .then(response => response.json())
    .then(json => console.log(json));

  }, [])


  return (
    <div className="App">
      <button type='button'>Login</button>
    </div>
  );
}

export default App;
