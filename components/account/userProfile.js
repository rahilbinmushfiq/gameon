import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Image from "next/image";
import { useRef, useState } from "react";
import { db, storage } from "../../config/firebase";
import createErrorMessage from "../../utils/createErrorMessage";
import { MdAddAPhoto } from "react-icons/md";

export default function UserProfile({ user }) {
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const fullNameRef = useRef("");
  const photoRef = useRef("");

  const updateUserProfile = async () => {
    try {
      await updateProfile(user, {
        displayName: fullNameRef?.current?.value
      });

      try {
        await updateDoc(doc(db, "users", user.uid), {
          fullName: fullNameRef?.current?.value
        });
      } catch (updateDocError) {
        console.log(createErrorMessage(updateDocError));
      }
    } catch (updateProfileError) {
      console.log(createErrorMessage(updateProfileError));
    }

    setIsReadOnly(true);
  }

  const updateUserPhoto = async () => {
    let image = photoRef?.current?.files[0];

    if (image && image.size <= 1000000 && /\/(jpe?g|png)$/i.test(image.type)) {
      let userPhotoRef = ref(storage, `userPhotos/${user.uid}`);

      await uploadBytes(userPhotoRef, image);
      let photoURL = await getDownloadURL(userPhotoRef);

      try {
        await updateProfile(user, { photoURL });

        try {
          await updateDoc(doc(db, "users", user.uid), { photoURL });
        } catch (updateDocError) {
          console.log(createErrorMessage(updateDocError));
        }
      } catch (updateProfileError) {
        console.log(createErrorMessage(updateProfileError));
      }

      setIsPhotoModalOpen(false);
    } else {
      alert("Please select a valid image file (JPG, JPEG or PNG) with a maximum size of 1 MB.");
    }
  }

  if (user) return (
    <section className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-xl font-bold">Welcome, {user.displayName}</h1>
        <p className="text-[#a9a9a9]">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eum nihil veritatis ipsum necessitatibus recusandae animi?
        </p>
      </div>
      <div>
        <div className="w-32 h-32 relative mx-auto rounded-full ring-4 ring-[#3f3f3f]">
          <Image className="object-cover rounded-full" src={user.photoURL} fill sizes="8rem" alt="user" />
          <button
            className="absolute bottom-2 -right-1 bg-[#f1f1f1] w-9 h-9 rounded-full flex justify-center items-center cursor-pointer"
            id="update-photo-button"
            onClick={(event) => event.target.id === "update-photo-button" && setIsPhotoModalOpen(true)}
          >
            <MdAddAPhoto onClick={() => setIsPhotoModalOpen(true)} size={20} color="#1f1f1f" />
          </button>
        </div>
        {isPhotoModalOpen && (
          <div
            className="fixed inset-0 w-screen h-screen bg-[#3f3f3f] bg-opacity-50 backdrop-blur-md flex justify-center items-center"
            id="update-photo-modal-bg"
            onClick={(event) => event.target.id === "update-photo-modal-bg" && setIsPhotoModalOpen(false)}
          >
            <div className="mx-6 p-8 rounded-md space-y-12 bg-[#1f1f1f]">
              <div className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-lg font-bold">Update profile picture</h2>
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
                <button
                  className="w-full h-12 rounded-sm font-semibold text-[#f1f1f1] bg-[#e30e30]"
                  onClick={updateUserPhoto}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="space-y-4">
        <div className="space-y-4 p-4 bg-[#2a2a2a]">
          <label className="space-y-1">
            <p className="text-base font-semibold">Email</p>
            <input
              className="w-full h-12 px-3 rounded-sm bg-[#383838] text-[#a9a9a9]"
              type="email"
              disabled={true}
              value={user.email}
            />
          </label>
        </div>
        <div className="space-y-4 p-4 bg-[#2a2a2a]">
          <label className="space-y-1">
            <p className="text-base font-semibold">Name</p>
            <input
              className={`w-full h-12 px-3 rounded-sm bg-[#383838] text-[#a9a9a9] ${!isReadOnly && "text-[#f1f1f1] caret-[#f1f1f1] border border-[#4f4f4f] focus:outline-none focus:border focus:border-[#e30e30]/60"}`}
              type="text"
              disabled={isReadOnly}
              ref={fullNameRef}
              defaultValue={user.displayName}
            />
          </label>
          {isReadOnly ? (
            <button
              className="w-full h-12 rounded-sm font-semibold text-[#1f1f1f] bg-[#f1f1f1]"
              onClick={() => setIsReadOnly(false)}
            >
              Edit
            </button>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <button
                  className="w-full h-12 rounded-sm font-semibold text-[#1f1f1f] bg-[#f1f1f1]"
                  type="button"
                  onClick={() => {
                    setIsReadOnly(true);
                    fullNameRef.current.value = user.displayName;
                  }}
                >
                  Cancel
                </button>
                <button
                  className="w-full h-12 rounded-sm font-semibold text-[#f1f1f1] bg-[#e30e30]"
                  type="button"
                  onClick={updateUserProfile}
                >
                  Save
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}