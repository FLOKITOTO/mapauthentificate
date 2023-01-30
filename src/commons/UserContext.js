import { createContext } from "react";

const UserContext = createContext({ user: {}, auth: false });

export default UserContext;
