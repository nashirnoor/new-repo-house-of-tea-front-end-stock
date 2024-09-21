import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/features/slices/authSlice";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LogOutIcon } from "lucide-react";

const LogoutBtn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/");
    } catch (error) {
      console.error(`Failed to log out: ${error}`);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          className="w-full flex items-center space-x-2 px-3 hover:text-red-500 cursor-pointer mt-2 justify-start py-1 rounded-md focus:outline-none"
        >
          <LogOutIcon />
          <p className="hidden sm:block">Logout</p>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to log out? You will need to log in again to access your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutBtn;
