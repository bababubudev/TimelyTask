import { Link } from "react-router-dom";

function Header() {
  return (
    <header>
      <nav>
        <ul className="header-list">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/task">Tasks</Link>
          </li>
          <li>
            <Link to="/option">Options</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;