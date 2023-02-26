import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useRef, useState } from "react";
import { db } from "../../config/firebase";
import createErrorMessage from "../../utils/createErrorMessage";

export default function UserProfile({ user }) {
  const [isReadOnly, setIsReadOnly] = useState(true);
  const fullNameRef = useRef("");

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

  if (user) return (
    <section>
      <div className="flex flex-col gap-10 mt-6 justify-center items-center">
        <div className="flex flex-col gap-2 justify-center items-center">
          <h1 className="text-2xl">Welcome, {user.displayName}</h1>
          <p className="w-[28rem]">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eum nihil veritatis ipsum necessitatibus recusandae animi?
          </p>
        </div>
        <img className="w-[8rem] rounded-full" src={user.photoURL} alt="user" referrerPolicy="no-referrer" />
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