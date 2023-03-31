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
import { getRegistrationDate } from "../../utils/convertTimestamp";

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
    <section className="flex-grow flex flex-col">
      <div className="space-y-2 px-6 pt-4 pb-8">
        <h1>User Profile</h1>
        <p>This is your profile section. You can see your personal information, as well as, update your display picture, display name, and password here.</p>
      </div>
      <div className="flex-grow flex flex-col justify-center space-y-4 py-8 bg-[#2a2a2a]">
        <div className="relative w-24 h-24 rounded-full mx-auto ring-4 ring-[#3f3f3f]">
          <Image
            className="object-cover rounded-full"
            src={user.photoURL}
            fill
            alt="user"
          />
          <button
            className="absolute bottom-1 -right-1 w-8 h-8 flex justify-center items-center rounded-full cursor-pointer bg-[#f1f1f1]"
            id="update-photo-button"
            onClick={(event) => event.target.id === "update-photo-button" && setIsPhotoModalOpen(true)}
          >
            <MdAddAPhoto
              size={18}
              color="#1f1f1f"
              onClick={() => setIsPhotoModalOpen(true)}
            />
          </button>
        </div>
        <h2 className="font-semibold text-base text-center text-[#cfcfcf]">
          {user.displayName}
        </h2>
      </div>
      {isPhotoModalOpen && (
        <div
          className="modal-bg"
          id="update-photo-modal-bg"
          onClick={(event) => event.target.id === "update-photo-modal-bg" && setIsPhotoModalOpen(false)}
        >
          <form className="mx-6 p-8 space-y-8 rounded-md bg-[#1f1f1f]" onSubmit={updateUserPhoto}>
            <div className="space-y-8">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Update Display Picture</h3>
                <p>Make sure to select a valid image file with a maximum size of 1 MB.</p>
              </div>
              <input
                className="text-[#a9a9a9] text-xs w-full file:border-none file:py-3 file:px-5 file:mr-3 file:rounded-sm file:bg-[#3a3a3a] file:text-[#f1f1f1] file:text-sm file:font-semibold file:cursor-pointer peer"
                ref={photoRef}
                type="file"
                accept=".jpg, .jpeg, .png"
                maxLength={1000000}
                multiple={false}
              />
            </div>
            <div className="modal-btn-container">
              <button
                className="secondary-btn"
                type="button"
                onClick={() => setIsPhotoModalOpen(false)}
              >
                Cancel
              </button>
              <button className="primary-btn">
                Confirm
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="divide-y-2 divide-[#2f2f2f] [&>*]:info-container">
        <div>
          <div>
            <FaHandshake size={18} />
            <p>Joined {getRegistrationDate(user.metadata.createdAt)}</p>
          </div>
        </div>
        <div>
          <div>
            <FaEnvelope size={18} />
            <p>{user.email}</p>
          </div>
        </div>
        <button className="info-container--hover" onClick={() => setIsNameModalOpen(true)}>
          <div>
            <FaUser size={18} />
            <p>{user.displayName}</p>
          </div>
          <FaChevronRight size={14} color="#a9a9a9" />
        </button>
      </div>
      {isNameModalOpen && (
        <div
          className="modal-bg"
          id="name-modal-bg"
          onClick={(event) => event.target.id === "name-modal-bg" && setIsNameModalOpen(false)}
        >
          <div className="mx-6 p-8 space-y-8 rounded-md bg-[#1f1f1f]">
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Update Your Name</h3>
              <p> As your display name is public, update your name to something appropriate.</p>
            </div>
            <form className="space-y-8" onSubmit={updateUserDisplayName}>
              <input
                className="typing-input"
                type="text"
                ref={fullNameRef}
                defaultValue={user.displayName}
                autoFocus
              />
              <div className="modal-btn-container">
                <button
                  className="secondary-btn"
                  type="button"
                  onClick={() => setIsNameModalOpen(false)}
                >
                  Cancel
                </button>
                <button className="primary-btn">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}