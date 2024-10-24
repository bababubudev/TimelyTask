import { Link, useLocation } from "react-router-dom";
import { routes } from "../utility/routingUtil";

function HeaderRoutes() {
  const location = useLocation();

  return (
    <ul className="header-list">
      {routes.map((route) => {
        const isCurrent = location.pathname === route.path;

        return (
          <li
            key={route.path}
            className={isCurrent ? "active-list" : ""}
          >
            <Link
              to={route.path}
              className={isCurrent ? "active-link" : ""}
            >
              {route.label}
            </Link>
          </li>
        )
      })}
    </ul>
  );
}

export default HeaderRoutes;