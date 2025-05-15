import {deleteAccount} from "@/auth/profile/profile.actions";
import ActionButton from "./ActionButton";

const DeleteAccountBtn = () => (
  <ActionButton
    action={deleteAccount}
    variant="destructive"
    defaultText="Delete Account"
  />
);

export default DeleteAccountBtn;
