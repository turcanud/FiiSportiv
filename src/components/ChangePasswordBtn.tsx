import {changePassword} from "@/auth/actions";
import ActionButton from "./ActionButton";

const ChangePasswordBtn = () => (
  <ActionButton
    action={changePassword}
    variant="destructive"
    defaultText="Change Password"
  />
);

export default ChangePasswordBtn;
