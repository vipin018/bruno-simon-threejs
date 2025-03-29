import React, { useState } from 'react'

const App = () => {
  const [age, setAge] = useState(20)
  const username = 'John Doe'

  return (
    <div>
      <h1>Hello {username}</h1>
      <h2>You are {age} years old</h2>
      <button onClick={() => setAge(age + 1)}>Increase Age</button>
    </div>
  )
}

export default App