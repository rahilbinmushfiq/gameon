import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Image from "next/image";
import { useRef, useState } from "react";
import { db, storage } from "../../config/firebase";
import createErrorMessage from "../../utils/createErrorMessage";

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
    <section>
      <div className="flex flex-col gap-10 mt-6 justify-center items-center">
        <div className="flex flex-col gap-2 justify-center items-center">
          <h1 className="text-2xl">Welcome, {user.displayName}</h1>
          <p className="w-[28rem]">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eum nihil veritatis ipsum necessitatibus recusandae animi?
          </p>
        </div>
        <div className="relative w-[8rem] h-[8rem]">
          <Image className="object-cover rounded-full" src={user.photoURL} fill sizes="8rem" alt="user" />
          <button
            className="absolute bottom-2 right-0 bg-black text-white w-8 h-8 rounded-full flex justify-center items-center cursor-pointer"
            id="update-photo-button"
            onClick={(event) => event.target.id === "update-photo-button" && setIsPhotoModalOpen(true)}
          >
            +
          </button>
        </div>
        {isPhotoModalOpen && (
          <div
            className="fixed inset-0 w-screen h-screen bg-black bg-opacity-25 backdrop-blur flex justify-center items-center"
            id="update-photo-modal-bg"
            onClick={(event) => event.target.id === "update-photo-modal-bg" && setIsPhotoModalOpen(false)}
          >
            <div className="w-[28rem] h-[22rem] flex flex-col justify-center items-center bg-white shadow-lg">
              <h2 className="mb-6 text-xl">Update profile picture</h2>
              <div className="flex flex-col gap-2">
                <h3 className="max-w-sm">
                  After you press the confirm button, you need to be re-authenticated to make sure you're the owner of this account.
                </h3>
                <input
                  ref={photoRef}
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  maxLength={1000000}
                  multiple={false}
                />
                <div className="flex justify-between mt-6">
                  <button
                    className="text-white bg-red-700 w-[5rem] h-8"
                    type="button"
                    onClick={() => setIsPhotoModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="text-white bg-green-700 w-[5rem] h-8"
                    onClick={updateUserPhoto}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div>
          <div className="flex gap-2">
            <label className="flex gap-2">
              <p className="text-xl h-8">Name:</p>
              <input
                className={`w-[15rem] h-8 bg-white ${isReadOnly ? "border-b" : "border"} border-neutral-900`}
                type="text"
                disabled={isReadOnly}
                ref={fullNameRef}
                defaultValue={user.displayName}
              />
            </label>
            <div className="flex gap-1 w-[10rem]">
              {isReadOnly ? (
                <button
                  className="text-white bg-neutral-900 w-[5rem] h-8"
                  onClick={() => setIsReadOnly(false)}
                >
                  Edit
                </button>
              ) : (
                <>
                  <button
                    className="text-white bg-neutral-900 w-[5rem] h-8"
                    onClick={updateUserProfile}
                  >
                    Save
                  </button>
                  <button
                    className="text-white bg-neutral-900 w-[5rem] h-8"
                    onClick={() => {
                      setIsReadOnly(true);
                      fullNameRef.current.value = user.displayName;
                    }}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
          <label className="flex gap-2">
            <p className="text-xl h-8">Eamil:</p>
            <input
              className="w-[15.5rem] h-8 bg-white border-b border-neutral-900"
              type="email"
              disabled={true}
              value={user.email}
            />
          </label>
        </div>
      </div>
    </section>
  )
}