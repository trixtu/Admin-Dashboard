import { Ripple } from "react-css-spinners";
import React from "react";
import { ClipLoader } from "react-spinners";
import Container from "./Container";

export default function Loading({ loading }: { loading: boolean }) {
  return (
    <>
      {loading && (
        <Container className="flex justify-center pt-20">
          <Ripple color="rgba(74,144,226,1)" size={100} thickness={7} />
        </Container>
      )}
    </>
  );
}
