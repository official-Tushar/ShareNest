import { useState, useEffect } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { Country, State, City } from "country-state-city";

const EditProfile = ({ user }) => {
  console.log("[EditProfile] user prop on mount:", user);
  const [firstName, setFirstName] = useState(
    user.firstName || user?.data?.firstName
  );
  const [lastName, setLastName] = useState(
    user.lastName || user?.data?.lastName
  );
  const [photoUrl, setPhotoUrl] = useState(
    user.photoUrl || user?.data?.photoUrl
  );
  const [gender, setGender] = useState(user.gender || user?.data?.gender || "");
  const [age, setAge] = useState(user.age || user?.data?.age || "");
  const [about, setAbout] = useState(user.about || user?.data?.about || "");
  const [preferenceInput, setPreferenceInput] = useState("");
  const [preferences, setPreferences] = useState(
    user.preferences || user?.data?.preferences || []
  );
  const [city, setCity] = useState(user.city || user?.data?.city || "");
  const [country, setCountry] = useState(
    user.country || user?.data?.country || ""
  );
  const [state, setState] = useState(user.state || user?.data?.state || "");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch();

  // State for dropdown lists
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Load countries on mount
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (country) {
      const fetchedStates = State.getStatesOfCountry(country);
      setStates(fetchedStates);

      // Only set state if not already set
      if (!state && user?.state) {
        setState(user.state);
      }
    } else {
      setStates([]);
      setState("");
      setCities([]);
      setCity("");
    }
  }, [country]);

  // Load cities when state changes
  useEffect(() => {
    if (state) {
      const fetchedCities = City.getCitiesOfState(country, state);
      setCities(fetchedCities);

      // Only set city if not already set
      if (!city && user?.city) {
        setCity(user.city);
      }
    } else {
      setCities([]);
      setCity("");
    }
  }, [state, country]);

  const updateProfile = async () => {
    setError("");
    try {
      const payload = {
        photoUrl,
        ...(age !== "" && { age: Number(age) }),
        gender,
        about,
        preferences,
        country,
        state,
        city,
      };
      console.log(
        "[EditProfile] Sending PATCH /profile/edit with payload:",
        payload
      );

      const res = await axios.patch(BASE_URL + "/profile/edit", payload, {
        withCredentials: true,
      });
      console.log(
        "[EditProfile] Response from PATCH /profile/edit:",
        res?.data
      );
      dispatch(addUser(res?.data));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      setError(error?.response?.data || "Something went wrong");
      console.error("Error updating profile:", error?.response?.data || error);
    }
  };

  const handleAddPreference = () => {
    const trimmedInput = preferenceInput.trim();

    if (!trimmedInput) return;

    const words = trimmedInput
      .split(/\s+/) // split by one or more spaces
      .map((word) => word.trim()) // clean each word
      .filter((word) => word.length > 0); // remove empty ones

    // Filter out duplicates and limit to 10
    const newPreferences = [...preferences];

    for (const word of words) {
      if (!newPreferences.includes(word)) {
        if (newPreferences.length >= 10) break;
        newPreferences.push(word);
      }
    }

    setPreferences(newPreferences);
    setPreferenceInput("");
  };

  const handleRemovePreference = (preference) => {
    setPreferences(preferences.filter((p) => p !== preference));
  };
  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <div className="mt-20">
        <div className="card card-border bg-base-300 w-full sm:w-9/10 md:w-4/5 lg:w-3/4 mx-auto">
          <div className="card-body">
            <h2 className="card-title justify-center text:xl md:text-2xl font-bold uppercase">
              Edit Profile
            </h2>

            <div className="flex flex-wrap justify-between sm:px-10 px-5">
              <fieldset className="fieldset my-1 w-full sm:w-4/9">
                <legend className="fieldset-legend text-sm sm:text-lg">
                  First Name:
                </legend>
                <input
                  type="text"
                  value={firstName}
                  className="input w-full"
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled
                />
              </fieldset>

              <fieldset className="fieldset my-1 w-full sm:w-4/9">
                <legend className="fieldset-legend text-sm sm:text-lg">
                  Last Name:
                </legend>
                <input
                  type="text"
                  value={lastName}
                  className="input w-full"
                  onChange={(e) => setLastName(e.target.value)}
                  disabled
                />
              </fieldset>

              <fieldset className="fieldset my-1 w-full">
                <legend className="fieldset-legend text-sm sm:text-lg">
                  Photo URL:
                </legend>
                <input
                  type="text"
                  value={photoUrl}
                  className="input w-full"
                  onChange={(e) => setPhotoUrl(e.target.value)}
                />
              </fieldset>

              <fieldset className="fieldset my-1 w-4/9 sm:w-5/19">
                <legend className="fieldset-legend text-sm sm:text-lg">
                  Gender:
                </legend>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Others">Others</option>
                </select>
              </fieldset>

              <fieldset className="fieldset my-1 w-4/9 sm:w-4/19">
                <legend className="fieldset-legend text-sm sm:text-lg">
                  Age:
                </legend>
                <input
                  type="number"
                  value={age}
                  className="input w-full"
                  min="12"
                  step="1"
                  onChange={(e) => {
                    const val = e.target.value;
                    setAge(val === "" ? "" : Number(val));
                  }}
                />
              </fieldset>

              <fieldset className="fieldset my-1 w-full sm:w-7/19">
                <legend className="fieldset-legend text-sm sm:text-lg">
                  Country:
                </legend>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="">Select Country</option>
                  {countries.map((c) => (
                    <option key={c.isoCode} value={c.isoCode}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </fieldset>

              <fieldset className="fieldset my-1 w-full sm:w-7/19">
                <legend className="fieldset-legend text-sm sm:text-lg">
                  State:
                </legend>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="select select-bordered w-full"
                  disabled={!country}
                >
                  <option value="">Select State</option>
                  {states.map((s) => (
                    <option key={s.isoCode} value={s.isoCode}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </fieldset>

              <fieldset className="fieldset my-1 w-full sm:w-7/19">
                <legend className="fieldset-legend text-sm sm:text-lg">
                  City:
                </legend>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="select select-bordered w-full"
                  disabled={!state}
                >
                  <option value="">Select City</option>
                  {cities.map((cityObj) => (
                    <option key={cityObj.name} value={cityObj.name}>
                      {cityObj.name}
                    </option>
                  ))}
                </select>
              </fieldset>

              <fieldset className="fieldset my-1 w-full">
                <legend className="fieldset-legend text-sm sm:text-lg">
                  About:
                </legend>
                <textarea
                  value={about}
                  className="textarea w-full h-30"
                  rows="4"
                  onChange={(e) => setAbout(e.target.value)}
                />
              </fieldset>

              <fieldset className="fieldset my-1 w-full">
                <legend className="fieldset-legend text-sm sm:text-lg">
                  Preferences:
                </legend>
                <div className="space-y-2">
                  <div className="flex gap-2 sm:flex-row flex-col">
                    <input
                      type="text"
                      placeholder="Your preference (one word)"
                      value={preferenceInput}
                      className="input input-bordered w-full"
                      onChange={(e) => setPreferenceInput(e.target.value)}
                    />
                    <div>
                      <button
                        className="btn btn-secondary h-fit sm:py-2 py-1 text-xs md:text-sm"
                        onClick={handleAddPreference}
                        disabled={preferences.length >= 10}
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {preferences.map((preference, index) => (
                      <span
                        key={index}
                        className="badge badge-accent px-3 py-1 flex items-center gap-1 cursor-pointer"
                        onClick={() => handleRemovePreference(preference)}
                      >
                        {preference}
                        <span className="ml-1 text-white">✕</span>
                      </span>
                    ))}
                  </div>
                </div>
              </fieldset>
            </div>

            {error && <span className="text-red-500 px-10">{error}</span>}

            <div className="card-actions justify-center mt-4">
              <button
                className="btn btn-primary h-fit py-1 sm:py-2 text-xs md:text-sm"
                onClick={updateProfile}
              >
                Update
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 mx-auto w-3/4 sm:w-9/10 lg:w-4/5">
          <UserCard
            user={{
              firstName,
              lastName,
              photoUrl,
              gender,
              age,
              about,
              preferences,
              city,
            }}
          />
        </div>
      </div>

      {showToast && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-success">
            <span>Profile updated successfully.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
