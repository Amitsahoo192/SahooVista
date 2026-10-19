
import "./listPage.scss";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import { Await, useLoaderData } from "react-router-dom";
import { Suspense } from "react";

function ListPage() {
  const data = useLoaderData();

  return (
    <div className="listPage">
      {/* Left: Filters */}
      <aside className="filterContainer">
        <div className="filterWrapper">
          <Filter />
        </div>
      </aside>

      {/* Middle: Property search results */}
      <main className="listContainer">
        <div className="wrapper">
          <Suspense fallback={<p>Loading properties...</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) => (
                postResponse.data.length > 0 ? (
                  postResponse.data.map((post) => (
                    <Card key={post.id} item={post} />
                  ))
                ) : (
                  <p>No properties found. Try changing your filters.</p>
                )
              )}
            </Await>
          </Suspense>
        </div>
      </main>

      {/* Right: Compact map */}
      <aside className="mapContainer">
        <Suspense fallback={<p>Loading map...</p>}>
          <Await
            resolve={data.postResponse}
            errorElement={<p>Error loading map!</p>}
          >
            {(postResponse) => (
              <Map items={postResponse.data} />
            )}
          </Await>
        </Suspense>
      </aside>
    </div>
  );
}

export default ListPage;
