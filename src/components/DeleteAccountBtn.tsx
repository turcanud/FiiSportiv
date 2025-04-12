import {deleteAccount} from "@/auth/actions";
import ActionButton from "./ActionButton";

const DeleteAccountBtn = () => (
  <ActionButton
    action={deleteAccount}
    variant="destructive"
    defaultText="Delete Account"
  />
);

export default DeleteAccountBtn;
