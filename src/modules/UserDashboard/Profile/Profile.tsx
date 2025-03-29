import React, { useEffect, useState, useCallback, useMemo } from "react";
import { updateProfile } from "@/actions/UserAction/UserAction";
import { FilePicker } from "@/components/FilePicker/FilePicker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/UserDashboardComponents/DashboardLayout";
import UserDetailCard from "@/components/UserDashboardComponents/Profile/UserDetailCard";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { cn, getAuthorFallback } from "@/lib/utils";
import { type_user } from "@/types/UsersTypes";
import { toast } from "sonner";

const disabledFields = new Set(["email", "authorCode"]);

interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  instituteName: string;
  authorCode: string;
}

function Profile() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);

  // Memoize user details initialization
  const initialUserDetails = useMemo<UserDetails>(
    () => ({
      firstName: user?.fullName?.split(" ")[0] || "",
      lastName: user?.fullName?.split(" ")[1] || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      instituteName: user?.instituteName || "",
      authorCode: user?.authorCode || "",
    }),
    [user]
  );

  const [userDetails, setUserDetails] =
    useState<UserDetails>(initialUserDetails);

  // Keep user details in sync when `user` updates
  useEffect(() => {
    setUserDetails(initialUserDetails);
  }, [initialUserDetails]);

  const handleSubmit = useCallback(() => {
    const formData = new FormData();
    const { firstName, lastName, instituteName, authorCode, ...rest } =
      userDetails;

    const data = { ...rest, fullName: `${firstName} ${lastName}` };
    formData.append("userDetails", JSON.stringify(data));

    if (profilePhoto) formData.append("photo", profilePhoto);

    updateProfile(dispatch, formData).then(
      (res: { data: type_user; success: boolean }) => {
        if (res.success) toast.success("Your details updated successfully.");
      }
    );
  }, [dispatch, profilePhoto, userDetails]);

  return (
    <DashboardLayout
      title="Your Profile"
      subtitle="View and manage your profile."
    >
      <div className="space-y-6 border border-app-dark p-3 md:p-4 rounded-lg">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Avatar className="size-14 ring ring-app-primary/50">
              <AvatarImage
                src={`${user?.photoURL}?${user?.updateTime}`}
                alt={user?.fullName}
              />
              <AvatarFallback className="rounded-lg bg-app text-white">
                {getAuthorFallback(user?.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col justify-center">
              <h4 className="text-xl font-semibold">{user?.fullName}</h4>
              {isEditing && (
                <FilePicker
                  name="photo"
                  accept="image/*"
                  onChange={(files) => setProfilePhoto(files[0])}
                  Component={({ onClick }) => (
                    <Button
                      variant="link"
                      className="p-0 font-semibold"
                      onClick={onClick}
                    >
                      Change Profile Photo
                    </Button>
                  )}
                />
              )}
            </div>
          </div>
          <Button onClick={() => setIsEditing((prev) => !prev)}>
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {Object.entries(userDetails).map(([key, value]) => (
            <UserDetailCard
              key={key}
              label={key}
              value={value}
              disabled={disabledFields.has(key)}
              isEditing={isEditing}
              handleChange={(name, value) =>
                setUserDetails((prev) => ({ ...prev, [name]: value }))
              }
            />
          ))}
        </div>

        {isEditing && (
          <div className="flex items-center gap-4">
            <Button
              size="lg"
              className="text-lg rounded-full font-semibold"
              onClick={handleSubmit}
            >
              Save
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg rounded-full font-semibold"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Profile;
