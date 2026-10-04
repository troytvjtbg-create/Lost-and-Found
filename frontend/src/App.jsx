import { useEffect, useState } from 'react'
import './App.css'

const ITEMS_API = 'http://127.0.0.1:5000'
const CLAIMS_API = 'http://127.0.0.1:5001'

function App() {
  const [items, setItems] = useState([])
  const [claims, setClaims] = useState([])

  const [itemName, setItemName] = useState('')
  const [itemType, setItemType] = useState('lost')
  const [itemLocation, setItemLocation] = useState('')

  const [claimItemId, setClaimItemId] = useState('')
  const [claimantName, setClaimantName] = useState('')
  const [claimContact, setClaimContact] = useState('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = async () => {
    try {
      const [itemsResponse, claimsResponse] = await Promise.all([
        fetch(`${ITEMS_API}/items`),
        fetch(`${CLAIMS_API}/claims`),
      ])

      if (!itemsResponse.ok || !claimsResponse.ok) {
        throw new Error('Failed to load data')
      }

      const itemsData = await itemsResponse.json()
      const claimsData = await claimsResponse.json()

      setItems(itemsData)
      setClaims(claimsData)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleAddItem = async (event) => {
    event.preventDefault()

    if (!itemName || !itemLocation) {
      return
    }

    try {
      const response = await fetch(`${ITEMS_API}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: itemName,
          type: itemType,
          location: itemLocation,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create item')
      }

      setItemName('')
      setItemType('lost')
      setItemLocation('')

      await loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleCreateClaim = async (event) => {
    event.preventDefault()

    if (!claimItemId || !claimantName || !claimContact) {
      return
    }

    try {
      const response = await fetch(`${CLAIMS_API}/claims`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          item_id: Number(claimItemId),
          claimant_name: claimantName,
          contact: claimContact,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create claim')
      }

      setClaimItemId('')
      setClaimantName('')
      setClaimContact('')

      await loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main className="app">
      <header className="header">
        <h1>Lost & Found</h1>
        <p>Find lost items and return found belongings.</p>
      </header>

      {error && <p className="error">{error}</p>}

      <section className="form-section">
        <h2>Report an Item</h2>

        <form onSubmit={handleAddItem}>
          <input
            type="text"
            placeholder="Item name"
            value={itemName}
            onChange={(event) => setItemName(event.target.value)}
          />

          <select
            value={itemType}
            onChange={(event) => setItemType(event.target.value)}
          >
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>

          <input
            type="text"
            placeholder="Location"
            value={itemLocation}
            onChange={(event) => setItemLocation(event.target.value)}
          />

          <button type="submit">Report Item</button>
        </form>
      </section>

      <section className="items-section">
        <h2>Items</h2>

        {loading && <p>Loading...</p>}

        {!loading && items.length === 0 && (
          <p>No items found.</p>
        )}

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
      </section>

      <section className="form-section">
        <h2>Claim an Item</h2>

        <form onSubmit={handleCreateClaim}>
          <select
            value={claimItemId}
            onChange={(event) => setClaimItemId(event.target.value)}
          >
            <option value="">Select an item</option>

            {items.map((item) => (
              <option key={item.id} value={item.id}>
                #{item.id} - {item.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Your name"
            value={claimantName}
            onChange={(event) => setClaimantName(event.target.value)}
          />

          <input
            type="text"
            placeholder="Contact information"
            value={claimContact}
            onChange={(event) => setClaimContact(event.target.value)}
          />

          <button type="submit">Submit Claim</button>
        </form>
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