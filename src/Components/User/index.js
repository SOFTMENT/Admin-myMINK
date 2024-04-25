import algoliasearch from "algoliasearch";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  collection,
  getDocs,
  query,
  orderBy,
  startAfter,
  limit,
} from "firebase/firestore";
import { db } from "../../config/firebase-config";
import { LinearProgress } from "@mui/material";
import { AWS_IMAGE_BASE_URL } from "../../config/appConfig";
const algoliaClient = algoliasearch(
  "9XQY8DOXRV",
  "0904fb732ab2992c81a3129991bb5100"
);
const index = algoliaClient.initIndex("Users");
const User = () => {
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetchUsers();
  }, []); // Trigger fetchUsers when lastVisible changes
  const fetchUsers = async () => {
    try {
      // Define a query to order users by some field (e.g., createdAt)
      let usersQuery;

      // If there's a lastVisible document, start after it
      if (lastVisible) {
        usersQuery = query(
          collection(db, "Users"),
          orderBy("registredAt", "desc"),
          startAfter(lastVisible),
          limit(18)
        );
      } else {
        usersQuery = query(
          collection(db, "Users"),
          orderBy("registredAt", "desc"),
          limit(18)
        );
      }
      // Execute the query
      const usersSnapshot = await getDocs(usersQuery);

      // Extract the users data
      const usersData = usersSnapshot.docs.map((doc) => doc.data());

      // Update the users state
      setUsers((prevUsers) => [...prevUsers, ...usersData]);

      // Update the lastVisible state for pagination
      const lastVisibleDoc = usersSnapshot.docs[usersSnapshot.docs.length - 1];
      setLastVisible(lastVisibleDoc);

      // Check if there are more documents to load
      setHasMore(usersSnapshot.docs.length === 18);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const fetchMoreData = async () => {
    console.log("more", lastVisible, hasMore);
    // Fetch more users when scrolling down
    // This will trigger useEffect and fetch additional data
    await fetchUsers();
  };
  const searchTerm = (text) => {
    index.search(text).then(({ hits }) => {
      console.log(hits);
      // if (hits.length == 0) setNoData(true);
      // else setNoData(false);
      // hits.map(hit=>console.log(hit))
      // setHits(hits.filter(hit=>hit.membershipActive));
      // // if(hits.length >0){
      // //   handleSearchHistory(hits,term)
      // // }
    });
  };
  return (
    <div className="userprofilebody">
      <div className="mainheading">
        <h3>User</h3>
      </div>

      <InfiniteScroll
        dataLength={users.length} // This is important field to render the next data
        next={fetchMoreData}
        hasMore={hasMore}
        
        loader={<LinearProgress color="error"/>}
        // endMessage={<p>No more users to load</p>}
        //scrollThreshold={0.9} // Load more data when 90% of the page is scrolled
      >
        <div className="row">
          {users.map((user, index) => (
            <div className="col-xxl-3 col-xl-3 col-lg-4" key={user.uid}>
              <a href="">
                <div className="userprofilewrap">
                  <div className="userimg">
                    <img
                      src={
                        user.profilePic
                          ? `${AWS_IMAGE_BASE_URL}${user.profilePic}`
                          : "assets/images/userprofile.png"
                      }
                      alt=""
                    />
                  </div>
                  <h4>{user.fullName}</h4>
                  <h6>{user?.phoneNumber ? user.phoneNumber : user.email}</h6>
                  <h6>Male</h6>
                </div>
              </a>
            </div>
          ))}
        </div>
      </InfiniteScroll>

      {/* <div className="pagination">
    <a  href="#">&laquo;</a>
    <a href="#">1</a>
    <a className="active" href="#">2</a>
    <a href="#">3</a>
    <a href="#">4</a>
    <a className="arrow" href="#">&raquo;</a>
  </div> */}
    </div>
  );
};
export default User;
