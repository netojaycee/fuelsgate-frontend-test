import CustomButton from '@/components/atoms/custom-button';
import { CustomFileUpload } from '@/components/atoms/custom-fileupload';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AuthContext } from '@/contexts/AuthContext';
import useSellerHook from '@/hooks/useSeller.hook';
import useTransporterHook from '@/hooks/useTransporter.hook';
import { Camera } from 'lucide-react';
import React, { useContext, useState } from 'react';

const ProfilePictureModal = ({
  profilePicture = '',
}: {
  profilePicture?: string;
}) => {
  const [selectedPicture, setSelectedPicture] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const role = user?.data?.role;

  const { useUpdateSellerProfilePicture } = useSellerHook();
  const { useUpdateTransporterProfilePicture } = useTransporterHook();
  const { mutateAsync: updateSellerProfilePicture, isPending: updatingSeller } =
    useUpdateSellerProfilePicture();
  const {
    mutateAsync: updateTransporterProfilePicture,
    isPending: updatingTransporter,
  } = useUpdateTransporterProfilePicture();

  const handleUpdateProfilePicture = async () => {
    const data = { profilePicture: selectedPicture as string };
    if (role === 'seller') {
      await updateSellerProfilePicture(data);
    } else {
      await updateTransporterProfilePicture(data);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="absolute bottom-0 -right-3 bg-white h-6 w-6 border flex items-center justify-center rounded-full">
        <Camera height={18} width={18} color="#898A8D" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Profile Picture</DialogTitle>
        </DialogHeader>
        <form>
          <div className="relative mt-10">
            <CustomFileUpload
              name="profile-picture"
              customLabel="Profile Picture"
              fileType="image"
              defaultValue={profilePicture}
              onChange={setSelectedPicture}
            />
          </div>
          <div className="flex items-center justify-center gap-3">
            <CustomButton
              variant="white"
              label="cancel"
              onClick={() => setOpen(false)}
            />
            <CustomButton
              variant="primary"
              label="Save"
              onClick={handleUpdateProfilePicture}
              loading={updatingSeller || updatingTransporter}
              disabled={
                updatingSeller || updatingTransporter || !selectedPicture
              }
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfilePictureModal;
