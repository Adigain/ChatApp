import React from "react";
import UserProfile from "./UserProfile";
import SearchUsers from "./SearchUsers";
import Notification from "./Notification";
import { useSelector } from "react-redux";

export default function Navbar() {
  const sign_in_success = useSelector(
    (state) => state.authReducer.sign_in_success
  );

  return (
    <nav className="bg-primary-800 border-primary-400">
      {sign_in_success && (
        <div className="flex flex-wrap items-center justify-between mx-auto p-4 px-10">
          <section className="flex flex-wrap gap-4 items-center">
            
            <SearchUsers />
          </section>

          <section className="flex flex-wrap gap-4 items-center">
            <Notification />
            <UserProfile />
          </section>
        </div>
      )}
    </nav>
  );
}
