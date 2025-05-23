import {logOut} from "@/auth/auth.actions";
import ActionButton from "./ActionButton";

const LogOutBtn = () => (
  <ActionButton action={logOut} variant="destructive" defaultText="Log Out" />
);

export default LogOutBtn;
