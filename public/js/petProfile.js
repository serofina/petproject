const petProfile = document.querySelector("#pet-profile");

const getPetProfile = async (userId, token) => {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", `Bearer ${token}`);

  var requestOptions = {
    method: "GET",
    headers: headers,
    redirect: "follow",
  };

  const res = await fetch(`/api/pet-form/${userId}`, requestOptions);

  const { data } = await res.json();

  return data;
};

const renderPetProfile = async () => {
  let template = "";

  const token = localStorage.getItem("accessToken");

  if (token) {
    const { iduser } = await decodeToken(token);

    const profiles = await getPetProfile(iduser, token);

    profiles.forEach((profile) => {
      const petDob = profile.dob
        ? new Date(profile.dob).toLocaleDateString()
        : "N/A";
      const parvoDate = profile.parvo_start_date
        ? `${new Date(
            profile.parvo_start_date
          ).toLocaleDateString()} - ${new Date(
            profile.parvo_end_date
          ).toLocaleDateString()}`
        : "N/A";

      const rabiesDate = profile.rabies_start_date
        ? `${new Date(
            profile.rabies_start_date
          ).toLocaleDateString()} - ${new Date(
            profile.rabies_end_date
          ).toLocaleDateString()}`
        : "N/A";

      const distemperoDate = profile.distemper_start_date
        ? `${new Date(
            profile.distemper_start_date
          ).toLocaleDateString()} - ${new Date(
            profile.distemper_end_date
          ).toLocaleDateString()}`
        : "N/A";

      template += `
            <div class="card">
            <img src="${profile.pet_photo}" class="card-img-top" alt="${
        profile.name
      }">
      
            <div class="card-body">
                <h5 class="card-title">${profile.name}</h5>
                <p class="card-text"><strong>Personality: </strong>${
                  profile.personality ? profile.personality : "N/A"
                }</p>
                <p class="card-text"><strong>Date of Birth: </strong>${petDob}</p>
                <p class="card-text"><strong>Breed: </strong>${
                  profile.breed ? profile.breed : "N/A"
                }</p>
                <p class="card-text"><strong>Microchip: </strong>${
                  profile.microchip ? profile.microchip : "N/A"
                }</p>
                <p class="card-text"><strong>Secondary Breed: </strong>${
                  profile.secondary_breed ? profile.secondary_breed : "N/A"
                }</p>
                <p class="card-text"><strong>Rabies Vaccinated: </strong>${rabiesDate}</p>
                <p class="card-text"><strong>Parvo Vaccinated: </strong>${parvoDate}</p>
                <p class="card-text"><strong>Distemper Vaccinated: </strong>${distemperoDate}</p>
                <p class="card-text"><strong>Notes: </strong>${
                  profile.notes ? profile.notes : "N/A"
                }</p>
                <button class="update-btn" data="${profile.id}">EDIT</button>
            </div>
            </div>
        `;
    });

    //const id = e.target.getAttribute('data');

    petProfile.innerHTML = template;
  }
};

if (petProfile) {
  renderPetProfile();
}
