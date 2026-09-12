function HouseCard({ house }) {
  return (
    <div className="house-card">
      <h2>{house.name}</h2>

      <p>📍 {house.location}</p>
      <p>🏠 {house.type}</p>
      <p>💰 ₩{house.price.toLocaleString()} / month</p>

      <strong>LifeFit Score: {house.score}%</strong>

      <br />
      <button>View House</button>
    </div>
  )
}

export default HouseCard