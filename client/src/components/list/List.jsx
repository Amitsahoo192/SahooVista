
import "./list.scss";
import { Link } from "react-router-dom";
import Card from "../card/Card";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

function List({ posts = [] }) {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="list">
      {posts.map((item) => {
        const isOwner = currentUser?.id === item.userId;

        return (
          <div className="listItem" key={item.id}>
            <Card item={item} />

            {isOwner && (
              <div className="listItemActions">
                <Link
                  to={`/edit/${item.id}`}
                  className="editPropertyButton"
                >
                  Edit Property
                </Link>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default List;
