import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

export default function SignIn(props) {
  return (
    <div
      style={{
        marginTop: "15vh"
      }}
    >
      <StyledFirebaseAuth
        uiConfig={props.uiConfig}
        firebaseAuth={props.firebaseAuth}
      />
      <a
        href="/register"
        style={{
          textAlign: "center",
          display: "block",
          fontSize: "1.5em",
          margin: "0 24px"
        }}
      >
        <button
          style={{
            background: "#fff",
            cursor: "pointer",
            maxWidth: "220px",
            width: "100%",
            fontSize: "14px",
            color: "#757575",
            padding: "8px 16px",
            fontWeight: 500,
            borderRadius: "2px",
            boxShadow:
              "0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12)",
            border: "none"
          }}
        >
          Sign Up
        </button>
      </a>
    </div>
  );
}
