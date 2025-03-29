import React from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";

interface UserDetailCardProps {
  label: string;
  value: string;
  isEditing: boolean;
  disabled: boolean;
  handleChange: (name: string, value: string) => void;
}

const fieldLabels: Record<string, string> = {
  firstName: "First Name",
  lastName: "Last Name",
  instituteName: "School / Institute Name",
  phoneNumber: "Phone Number",
  authorCode: "Author Code",
};

const UserDetailCard: React.FC<UserDetailCardProps> = ({
  label,
  value,
  isEditing,
  disabled,
  handleChange,
}) => {
  return (
    <div>
      <Label className="text-lg capitalize">
        {fieldLabels[label] || label}
      </Label>
      {isEditing ? (
        <Input
          type="text"
          name={label}
          defaultValue={value}
          disabled={disabled}
          onChange={(e) => handleChange(label, e.target.value)}
        />
      ) : (
        <p className="text-foreground text-lg">{value}</p>
      )}
    </div>
  );
};

export default UserDetailCard;
