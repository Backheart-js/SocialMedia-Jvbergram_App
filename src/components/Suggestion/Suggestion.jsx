import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { getSuggestionsProfilesByFollowing } from "~/services/firebaseServices";
import "./Suggestion.scss";
import SuggestionProfile from "./SuggestionProfile";

function Suggestion({ userId, following = [], min }) {
  const [profiles, setProfiles] = useState(null);

  useEffect(() => {
    const getSuggestions = async () => {
      const responses = await getSuggestionsProfilesByFollowing(userId, following, min ? 5 : 20);
      setProfiles(responses);
    };

    if (userId) {
      getSuggestions();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, following]);

  return !profiles ? (
    <>
      {
        [...new Array(5)].map((_, index) => (
          <div className={`suggestion__skeleton-wrapper${min ? '-min' : ''} flex`} key={index}>
            <div className=""><Skeleton circle height={42} width={42}/></div>
            <div className="ml-3">
              <Skeleton height={16} width={150}/>
              <Skeleton height={16} width={100}/>
            </div>
          </div>
        ))
      }
    </>
  ) : (
    <div className="w-full">
      {profiles.map((profile) => (
        <SuggestionProfile profile={profile} followState={false} key={profile.userId} min={min}/>
      ))}
    </div>
  );
}

Suggestion.propTypes = {
  userId: PropTypes.string,
  following: PropTypes.array.isRequired,
};

export default Suggestion;
