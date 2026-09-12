import { useState } from 'react'
import houses from '../data/houses'
import HouseCard from '../components/HouseCard'

function Home() {
  const [search, setSearch] = useState('')

  const filteredHouses = houses.filter((house) =>
    house.name.toLowerCase().includes(search.toLowerCase()) ||
    house.location.toLowerCase().includes(search.toLowerCase()) ||
    house.type.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="home">
      <h1>LifeFit</h1>

      <p>Find a house that fits your life.</p>

      <input
        type="text"
        placeholder="Search location, house, or type..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <h2>Available Houses</h2>

      <div className="house-list">
        {filteredHouses.map((house) => (
          <HouseCard
            key={house.id}
            house={house}
          />
        ))}
      </div>
    </div>
  )
}

export default Home