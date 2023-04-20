import Image from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { toast } from "react-toastify";
import { MdAddAPhoto, MdVerified, MdEmail, MdPerson, MdChevronRight } from "react-icons/md";
import { db, storage } from "../../config/firebase";
import { useLoading } from "../../contexts/loading";
import { getRegistrationDate } from "../../utils/convertTimestamp";
import createErrorMessage from "../../utils/createErrorMessage";
import Modal from "../modal";

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
  };

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
  };

  if (user) return (
    <section className="grow flex flex-col">
      <div className="space-y-2 px-6 pt-7 pb-8 sm:px-10 md:px-14 xl:px-24 2xl:px-32">
        <h1>User Profile</h1>
        <p>This is your profile section. You can see your personal information, as well as, update your display picture, display name, and password here.</p>
      </div>
      <div className="grow flex flex-col justify-center space-y-4 py-8 bg-[#2a2a2a] lg:py-16 xl:py-20 2xl:py-28">
        <div className="relative w-24 h-24 rounded-full mx-auto ring-4 ring-[#3f3f3f] md:w-32 md:h-32">
          <Image
            className="object-cover rounded-full"
            src={user.photoURL}
            alt="user"
            fill
            sizes="75vh"
            priority
          />
          <button
            className="absolute bottom-1 -right-1 w-8 h-8 flex justify-center items-center rounded-full cursor-pointer bg-[#f1f1f1] hover:bg-[#ffffff]"
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
        <h2 className="font-semibold text-lg text-center text-[#cfcfcf]">
          {user.displayName}
        </h2>
      </div>
      {isPhotoModalOpen && (
        <Modal
          type="confirm"
          id="update-photo-modal-bg"
          heading="Update Display Picture"
          description="Make sure to select a valid image file with a maximum size of 1 MB."
          setIsModalOpen={setIsPhotoModalOpen}
          handleSubmission={updateUserPhoto}
        >
          <input
            className="w-full text-sm text-[#a9a9a9] file:border-none file:py-3 file:px-5 file:mr-3 file:rounded-sm file:text-sm file:font-semibold file:cursor-pointer file:text-[#f1f1f1] file:bg-[#3a3a3a] hover:file:bg-[#4a4a4a] file:transition-all file:ease-in-out file:duration-300 peer"
            ref={photoRef}
            type="file"
            accept=".jpg, .jpeg, .png"
            maxLength={1000000}
            multiple={false}
          />
        </Modal>
      )}
      <div className="divide-y-2 divide-[#2f2f2f] [&>*]:info-container">
        <div>
          <div>
            <MdVerified size={20} />
            <p>Joined {getRegistrationDate(user.metadata.createdAt)}</p>
          </div>
        </div>
        <div>
          <div>
            <MdEmail size={20} />
            <p>{user.email}</p>
          </div>
        </div>
        <button className="info-container--hover" onClick={() => setIsNameModalOpen(true)}>
          <div>
            <MdPerson size={20} />
            <p>{user.displayName}</p>
          </div>
          <MdChevronRight size={22} color="#a9a9a9" />
        </button>
      </div>
      {isNameModalOpen && (
        <Modal
          type="confirm"
          id="name-modal-bg"
          heading="Update Your Name"
          description="As your display name is public, update your name to something appropriate."
          setIsModalOpen={setIsNameModalOpen}
          handleSubmission={updateUserDisplayName}
        >
          <input
            className="typing-input"
            type="text"
            ref={fullNameRef}
            defaultValue={user.displayName}
            autoFocus
          />
        </Modal>
      )}
    </section>
  );
}
