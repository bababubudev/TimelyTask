import { Link } from "react-router-dom"

function Home() {

  return (
    <Link
      to={"/Task"}
      style={{ fontSize: "3rem" }}
    >
      Home
    </Link>
  )
}

export default Home
