import ActionButton from "./ActionButton";

const ChangeNameBtn = ({className}: {className?: string}) => (
  <ActionButton
    variant="default"
    defaultText="Change Name"
    className={className}
  />
);

export default ChangeNameBtn;
