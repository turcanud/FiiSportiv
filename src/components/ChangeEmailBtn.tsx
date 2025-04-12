import {changeEmail} from "@/auth/actions";
import ActionButton from "./ActionButton";

const ChangeEmailBtn = () => (
  <ActionButton
    action={changeEmail}
    variant="outline"
    defaultText="Change Email"
  />
);

export default ChangeEmailBtn;
