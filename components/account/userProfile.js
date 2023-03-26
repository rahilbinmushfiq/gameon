import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Image from "next/image";
import { useRef, useState } from "react";
import { db, storage } from "../../config/firebase";
import createErrorMessage from "../../utils/createErrorMessage";
import { MdAddAPhoto } from "react-icons/md";
import { toast } from "react-toastify";
import { useLoading } from "../../contexts/loading";
import { useRouter } from "next/router";
import { FaEnvelope, FaHandshake, FaUser, FaChevronRight } from "react-icons/fa";

export default function UserProfile({ user }) {
  const { setIsPageLoading } = useLoading();
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const fullNameRef = useRef("");
  const photoRef = useRef("");
  const router = useRouter();

  const updateUserDisplayName = async (event) => {
    event.preventDefault();

    let name = fullNameRef?.current?.value;

    if (!name) {
      toast.error("Name field cannot be empty.");
      return;
    } else if (name === user.displayName) {
      toast.error("If you want to update your name, change it first.");
      return;
    } else if (!(/^[a-zA-Z.,\-\s]{3,}$/i.test(name))) {
      toast.error("Please provide a valid full name.");
      return;
    }

    setIsPageLoading(true);

    try {
      await updateProfile(user, {
        displayName: name
      });

      await updateDoc(doc(db, "users", user.uid), {
        fullName: name
      });

      setIsNameModalOpen(false);
      toast.success("Your name has been updated.");
    } catch (error) {
      toast.error(createErrorMessage(error));
    }

    setIsPageLoading(false);
    router.push(router.asPath, undefined, { scroll: false });
  }

  const updateUserPhoto = async (event) => {
    event.preventDefault();

    let image = photoRef?.current?.files[0];

    if (!image) {
      toast.error("You need to choose an image first.");
      return;
    } else if (image.size > 1000000 || !(/\/(jpe?g|png)$/i.test(image.type))) {
      toast.error("Please upload a valid image file (JPG, JPEG or PNG) with a maximum size of 1 MB.", {
        autoClose: 5000
      });
      return;
    }

    setIsPageLoading(true);

    try {
      let userPhotoRef = ref(storage, `userPhotos/${user.uid}`);
      await uploadBytes(userPhotoRef, image);
      let photoURL = await getDownloadURL(userPhotoRef);
      await updateProfile(user, { photoURL });
      await updateDoc(doc(db, "users", user.uid), { photoURL });

      setIsPhotoModalOpen(false);
      toast.success("Your profile picture has been updated.");
    } catch (error) {
      toast.error(createErrorMessage(error));
    }

    setIsPageLoading(false);
  }

  if (user) return (
    <section>
      <div className="space-y-8 pt-6">
        <div className="space-y-2 px-6">
          <h1 className="inline-block mb-1 text-xl font-bold relative after:content-[''] after:absolute after:h-[3px] after:w-1/4 after:-bottom-1 after:left-0 after:bg-[#e30e30]">
            USER PROFILE
          </h1>
          <p className="text-[#a9a9a9]">
            This is your profile section. You can see your personal information, as well as, update your display picture, display name, and password here.
          </p>
        </div>
        <div className="space-y-4 bg-[#2a2a2a] py-8">
          <div className="w-24 h-24 relative mx-auto rounded-full ring-4 ring-[#3f3f3f]">
            <Image className="object-cover rounded-full" src={user.photoURL} fill sizes="8rem" alt="user" />
            <button
              className="absolute bottom-1 -right-1 bg-[#f1f1f1] w-8 h-8 rounded-full flex justify-center items-center cursor-pointer"
              id="update-photo-button"
              onClick={(event) => event.target.id === "update-photo-button" && setIsPhotoModalOpen(true)}
            >
              <MdAddAPhoto onClick={() => setIsPhotoModalOpen(true)} size={17} color="#1f1f1f" />
            </button>
          </div>
          <h2 className="text-base text-center font-semibold text-[#cfcfcf]">{user.displayName}</h2>
        </div>
      </div>
      {isPhotoModalOpen && (
        <div
          className="fixed inset-0 w-screen h-screen bg-[#3f3f3f] bg-opacity-50 backdrop-blur-md flex justify-center items-center"
          id="update-photo-modal-bg"
          onClick={(event) => event.target.id === "update-photo-modal-bg" && setIsPhotoModalOpen(false)}
        >
          <form className="mx-6 p-8 rounded-md space-y-12 bg-[#1f1f1f]" onSubmit={updateUserPhoto}>
            <div className="space-y-8">
              <div className="space-y-2">
                <h3 className="inline-block mb-1 text-lg font-bold relative after:content-[''] after:absolute after:h-[3px] after:w-1/4 after:-bottom-1 after:left-0 after:bg-[#e30e30]">
                  Update Your Display Picture
                </h3>
                <p className="text-[#a9a9a9]">
                  Make sure to select a valid image file with a maximum size of 1 MB.
                </p>
              </div>
              <input
                className="file:border-none file:py-3 file:px-5 file:mr-3 file:rounded-sm file:bg-[#3a3a3a] file:text-[#f1f1f1]"
                ref={photoRef}
                type="file"
                accept=".jpg, .jpeg, .png"
                maxLength={1000000}
                multiple={false}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                className="w-full h-12 rounded-sm font-semibold text-[#1f1f1f] bg-[#f1f1f1]"
                type="button"
                onClick={() => setIsPhotoModalOpen(false)}
              >
                Cancel
              </button>
              <button className="w-full h-12 rounded-sm font-semibold text-[#f1f1f1] bg-[#e30e30]">
                Confirm
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="space-y-2">
        <div className="divide-y-2 divide-[#2f2f2f]">
          <div className="flex justify-between items-center w-full h-16 px-6">
            <div className="flex gap-4 items-center">
              <FaHandshake size={18} color="#f1f1f1" />
              <p className="font-semibold text-[#a9a9a9]">Joined {new Date(parseInt(user.metadata.createdAt)).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: "numeric"
              })}</p>
            </div>
          </div>
          <div className="flex justify-between items-center w-full h-16 px-6">
            <div className="flex gap-4 items-center">
              <FaEnvelope size={18} color="#f1f1f1" />
              <p className="font-semibold text-[#a9a9a9]">{user.email}</p>
            </div>
          </div>
          <button
            className="flex justify-between items-center w-full h-16 px-6 hover:bg-[#2a2a2a] [&>div>p]:hover:text-[#f1f1f1] [&>*]:hover:fill-[#f1f1f1]"
            onClick={() => setIsNameModalOpen(true)}
          >
            <div className="flex gap-4 items-center">
              <FaUser size={18} color="#f1f1f1" />
              <p className="font-semibold text-[#a9a9a9]">
                {user.displayName}
              </p>
            </div>
            <FaChevronRight size={14} color="#a9a9a9" />
          </button>
          {isNameModalOpen && (
            <div
              className="fixed inset-0 w-screen h-screen bg-[#3f3f3f] bg-opacity-50 backdrop-blur-md flex justify-center items-center"
              id="name-modal-bg"
              onClick={(event) => event.target.id === "name-modal-bg" && setIsNameModalOpen(false)}
            >
              <div className="w-full mx-6 px-6 py-12 rounded-md space-y-4 bg-[#1f1f1f]">
                <div className="space-y-2">
                  <h3 className="inline-block mb-1 text-lg font-bold relative after:content-[''] after:absolute after:h-[3px] after:w-1/4 after:-bottom-1 after:left-0 after:bg-[#e30e30]">
                    Update Your Name
                  </h3>
                  <p className="text-[#a9a9a9]">
                    As your display name is public, update your name to something appropriate.
                  </p>
                </div>
                <form className="space-y-10" onSubmit={updateUserDisplayName}>
                  <input
                    className="sign-in--input"
                    type="text"
                    ref={fullNameRef}
                    defaultValue={user.displayName}
                    autoFocus
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      className="w-full h-12 rounded-sm font-semibold text-[#1f1f1f] bg-[#f1f1f1]"
                      type="button"
                      onClick={() => setIsNameModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="w-full h-12 rounded-sm font-semibold text-[#f1f1f1] bg-[#e30e30]"
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}