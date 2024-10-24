import { Link } from "react-router-dom"

function Task() {
  return (
    <Link
      to={"/Option"}
      style={{ fontSize: "3rem" }}
    >
      Tasks
    </Link>
  )
}

export default Task
