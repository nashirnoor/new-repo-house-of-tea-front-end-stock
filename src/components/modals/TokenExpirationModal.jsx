import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '@/features/slices/authSlice';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const TokenExpirationModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isTokenExpired = useSelector(state => state.auth.isTokenExpired);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/");
    } catch (error) {
      console.error(`Failed to log out: ${error}`);
    }
  };

  return (
    <Dialog open={isTokenExpired} onOpenChange={() => {}}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Session Expired</DialogTitle>
          <DialogDescription>
            Your session has expired. Please log in again to continue.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleLogout}>
            Log Out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TokenExpirationModal;