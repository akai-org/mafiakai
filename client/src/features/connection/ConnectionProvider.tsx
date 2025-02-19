import { useMemo } from "react";
import { useParams } from "react-router";
import { ConnContext } from "./ConnectionContext";
import { socket } from "@/constants";
import { connect, disconnect } from "./utils";
import useConnection from "./useConnection";

function ConnectionProvider(props: { children: React.ReactNode }) {
  // Get the code from the URL
  const { code } = useParams();
  useConnection(code);

  const contextValue = useMemo(() => ({ socket, connect, disconnect }), []);

  return <ConnContext.Provider value={contextValue}>{props.children}</ConnContext.Provider>;
}

export default ConnectionProvider;
