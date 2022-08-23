// *** pet form logic
const petForm = document.querySelector("#petForm");

if (petForm) {
  petForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // get the form Details
    const name = document.querySelector("#inputPetName").value;
    const dob = document.querySelector("#inputDateOfBirth").value;
    const pet_photo = document.querySelector("#inputPicture").files[0];
    const personality = document.querySelector("#inputPersonality").value;
    const breed = document.querySelector("#inputBreed").value;
    const secondary_breed = document.querySelector("#inputSecondBreed").value;
    const rabies_pdf = document.querySelector("#inputRabiesDocument").files[0];
    const distemper_pdf = document.querySelector("#inputDistemperDocument")
      .files[0];
    const parvo_pdf = document.querySelector("#inputParvoDocument").files[0];
    const microchip = document.querySelector("#inputMicrochip").value;
    const notes = document.querySelector("#inputNotes").value;
    const rabies_start_date = document.querySelector("#inputRabiesDate").value;
    const rabies_end_date = document.querySelector("#inputRabiesDueDate").value;
    const distemper_start_date = document.querySelector(
      "#inputDistemperDate"
    ).value;
    const distemper_end_date = document.querySelector(
      "#inputDistemperDueDate"
    ).value;
    const parvo_start_date = document.querySelector("#inputParvoDate").value;
    const parvo_end_date = document.querySelector("#inputParvoDueDate").value;

    const petPhotoSignedUrl = pet_photo
      ? await uploadToCloudinary(pet_photo, "pet_photo", microchip)
      : null;
    const rabiesPdfSignedUrl = rabies_pdf
      ? await uploadToCloudinary(rabies_pdf, "rabies_pdf", microchip)
      : null;
    const distemperPdfSignedUrl = distemper_pdf
      ? await uploadToCloudinary(distemper_pdf, "distemper_pdf", microchip)
      : null;
    const parvoPdfSignedUrl = parvo_pdf
      ? await uploadToCloudinary(parvo_pdf, "parvo_pdf", microchip)
      : null;

    // prepare form payload
    const payload = {
      name,
      dob,
      pet_photo: petPhotoSignedUrl,
      personality,
      breed,
      secondary_breed,
      rabies_pdf: rabiesPdfSignedUrl,
      distemper_pdf: distemperPdfSignedUrl,
      parvo_pdf: parvoPdfSignedUrl,
      microchip,
      notes,
      rabies_start_date,
      rabies_end_date,
      distemper_start_date,
      distemper_end_date,
      parvo_start_date,
      parvo_end_date,
    };

    console.log(payload);

    const token = localStorage.getItem("accessToken");

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
      redirect: "follow",
    };

    const res = await fetch("/api/pet-form", requestOptions);

    const data = await res.json();

    console.log(data);
  });
}

const uploadToCloudinary = async (file, field, microchip) => {
  const token = localStorage.getItem("accessToken");

  let myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  // get signature
  const signatureRes = await fetch("/api/cloudSignature", {
    method: "GET",
    redirect: "follow",
    headers: myHeaders,
  });

  const { timestamp, signature, key, cloudName } = await signatureRes.json();

  // upload to cloudinary
  const formdata = new FormData();
  formdata.append("file", file, `${field}_${microchip}`);

  const signedRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload?api_key=${key}&signature=${signature}&timestamp=${timestamp}`,
    {
      method: "POST",
      body: formdata,
      redirect: "follow",
    }
  );

  const { secure_url } = await signedRes.json();

  return secure_url;
};
