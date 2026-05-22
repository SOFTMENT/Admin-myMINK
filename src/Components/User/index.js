import { useCallback, useEffect, useState } from "react";
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
import { Button, LinearProgress, Typography } from "@mui/material";
import { AWS_IMAGE_BASE_URL } from "../../config/appConfig";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const User = (props) => {
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [users, setUsers] = useState([]);
  const [isSearch, setIsSearch] = useState("");
  const [noData, setNoData] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;

  const fetchUsers = useCallback(async (lastDoc = null) => {
    try {
      let usersQuery;

      if (lastDoc) {
        usersQuery = query(
          collection(db, "Users"),
          orderBy("registredAt", "desc"),
          startAfter(lastDoc),
          limit(18)
        );
      } else {
        usersQuery = query(
          collection(db, "Users"),
          orderBy("registredAt", "desc"),
          limit(18)
        );
      }

      const usersSnapshot = await getDocs(usersQuery);
      const usersData = usersSnapshot.docs.map((doc) => doc.data());

      setUsers((prevUsers) => [...prevUsers, ...usersData]);

      const lastVisibleDoc = usersSnapshot.docs[usersSnapshot.docs.length - 1];
      setLastVisible(lastVisibleDoc);
      setHasMore(usersSnapshot.docs.length === 18);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error loading users. Please refresh the page.");
      setHasMore(false);
    }
  }, []);

  useEffect(() => {
    if (state) {
      setIsSearch(true);
      setLastVisible(null);
      setHasMore(false);
      // console.log(state)
      if (state?.hits?.length) {
        setNoData(false);
        setUsers(state?.hits);
      } else {
        setNoData(true);
      }
    } else {
      // console.log("hereeee")
      fetchUsers();
    }
  }, [state, fetchUsers]);
  // useEffect(() => {

  // }, []); // Trigger fetchUsers when lastVisible changes
  const clearSearch = () => {
    // console.log("clearSearch")
    setIsSearch(false);
    setNoData(false);
    setUsers([]);
    setLastVisible(null);
    setHasMore(true);
    fetchUsers();
  };
  const fetchMoreData = async () => {
    // console.log("more", lastVisible, hasMore);
    // Fetch more users when scrolling down
    // This will trigger useEffect and fetch additional data
    await fetchUsers(lastVisible);
  };

  const handleClick = (event, user) => {
    event.preventDefault();
    navigate(`/user/${user.uid}`);
  };

  return (
    <div className="userprofilebody">
      <div className="mainheading">
        <h3>Users</h3>
        {isSearch && (
          <Button
            variant="outlined"
            color="error"
            sx={{ color: "red" }}
            onClick={() => clearSearch()}
          >
            Clear Search
          </Button>
        )}
      </div>
      {noData ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            height: "60vh",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Typography variant="h6" sx={{ color: '#666' }}>No Results Found</Typography>
          <Typography variant="body2" sx={{ color: '#999' }}>Try a different search term</Typography>
          <Button variant="outlined" onClick={clearSearch} sx={{ marginTop: 2 }}>
            Clear Search
          </Button>
        </div>
      ) : users.length === 0 && !isSearch ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            height: "60vh",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Typography variant="h6" sx={{ color: '#666' }}>No Users Found</Typography>
          <Typography variant="body2" sx={{ color: '#999' }}>Users will appear here once they register</Typography>
        </div>
      ) : (
        <InfiniteScroll
          dataLength={users.length} // This is important field to render the next data
          next={fetchMoreData}
          hasMore={isSearch ? false : hasMore}
          loader={<LinearProgress color="error" />}
          // endMessage={<p>No more users to load</p>}
          //scrollThreshold={0.9} // Load more data when 90% of the page is scrolled
        >
          <div className="row">
            {users.map((user) => (
              <div
                className="col-xxl-3 col-xl-3 col-lg-4 col-md-6"
                key={user.uid}
              >
                <a href={`/user/${user.uid}`} onClick={(event) => handleClick(event, user)}>
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
                    <h6>@{user?.username}</h6>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      )}

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
