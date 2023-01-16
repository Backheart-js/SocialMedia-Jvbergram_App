import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { getSuggestionsProfilesById } from "~/services/firebaseServices";
import UserLabel from "../UserLabel";
import "./Suggestion.scss";

function Suggestion({ uid, following = [] }) {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const getSuggestions = async () => {
      const responses = await getSuggestionsProfilesById(uid);

      setProfiles(responses);
    };

    if (uid) {
      getSuggestions();
    }
  }, [uid]);

  return !profiles ? (
    <Skeleton count={5} height={48} />
  ) : (
    <div className="">
      {profiles.map((profile) => (
        <div className="flex justify-between items-center">
          <UserLabel
            avatarUrl={profile.avatarUrl}
            username={profile.username}
            fullname={profile.fullname}
            size={"small"}
            key={profile.userId}
          />
          <button className="suggestion__follow-btn">Theo dõi</button>
        </div>
      ))}
    </div>
  );
}

Suggestion.propTypes = {
  uid: PropTypes.string,
  following: PropTypes.array.isRequired,
};

export default Suggestion;
