import { useEffect, useState } from 'react'
import './App.css'

const ITEMS_API = 'http://127.0.0.1:5000'
const CLAIMS_API = 'http://127.0.0.1:5001'

function App() {
  const [items, setItems] = useState([])
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      fetch(`${ITEMS_API}/items`).then((res) => res.json()),
      fetch(`${CLAIMS_API}/claims`).then((res) => res.json()),
    ])
      .then(([itemsData, claimsData]) => {
        setItems(itemsData)
        setClaims(claimsData)
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load data')
        setLoading(false)
      })
  }, [])

  return (
    <main className="app">
      <header className="header">
        <h1>Lost & Found</h1>
        <p>Find lost items and return found belongings.</p>
      </header>

      <section className="items-section">
        <h2>Items</h2>

        {loading && <p>Loading...</p>}

        {error && <p className="error">{error}</p>}

        {!loading && !error && (
          <div className="items-grid">
            {items.map((item) => (
              <article className="item-card" key={item.id}>
                <span className={`badge ${item.type}`}>
                  {item.type}
                </span>

                <h3>{item.name}</h3>
                <p>📍 {item.location}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="claims-section">
        <h2>Claims</h2>

        {claims.length === 0 ? (
          <p>No claims yet.</p>
        ) : (
          <div className="claims-list">
            {claims.map((claim) => (
              <article className="claim-card" key={claim.id}>
                <h3>Claim #{claim.id}</h3>
                <p>Item ID: {claim.item_id}</p>
                <p>Claimant: {claim.claimant_name}</p>
                <p>Contact: {claim.contact}</p>
                <p>Status: {claim.status}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default App

