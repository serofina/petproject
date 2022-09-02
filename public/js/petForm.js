// *** pet form logic
const petForm = document.querySelector("#petForm");

const uploadToCloudinary = async (file, field, microchip) => {
  const token = localStorage.getItem("accessToken");

  let headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", `Bearer ${token}`);

  // get signature
  const signatureRes = await fetch("/api/cloudSignature", {
    method: "GET",
    redirect: "follow",
    headers,
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


if (petForm) {
  
    // prepare form payload
    const token = localStorage.getItem("accessToken");

    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
  
    let requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
  
    fetch("/api/petform_info", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        document.querySelector("#inputPetName").value= result.data[0].name;
        document.querySelector("#inputDateOfBirth").value= result.data[0].dob;
        document.querySelector("#inputPicture").files[0]= result.data[0].pet_photo;
        document.querySelector("#inputPersonality").value = result.data[0].personality;
        document.querySelector("#inputBreed").value = result.data[0].breed;
        document.querySelector("#inputSecondBreed").value=result.data[0].secondary_breed;
        document.querySelector("#inputRabiesDocument").files[0]=result.data[0].rabies_pdf;
        document.querySelector("#inputDistemperDocument").files[0]=result.data[0].distemper_pdf;
        document.querySelector("#inputParvoDocument").files[0]= result.data[0].parvo_pdf;
        document.querySelector("#inputMicrochip").value=result.data[0].microchip;
        document.querySelector("#inputNotes").value= result.data[0].notes;
        document.querySelector("#inputRabiesDate").value = result.data[0].rabies_start_date;
        document.querySelector("#inputRabiesDueDate").value = result.data[0].rabies_end_date;
        document.querySelector("#inputDistemperDate").value = result.data[0].distemper_start_date;
        document.querySelector("#inputDistemperDueDate").value= result.data[0].distemper_end_date;
        document.querySelector("#inputParvoDate").value=result.data[0].parvo_start_date;
        document.querySelector("#inputParvoDueDate").value = result.data[0].parvo_end_date;
        const pet_id = result.data[0].id;
        console.log(pet_id);
      })
      .catch((error) => console.log("error", error));
}







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

    const token = localStorage.getItem("accessToken");

    const { iduser } = await decodeToken(token);

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
      userId: iduser,
    };

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

    document.querySelector("#pet-profile").innerHTML = "";

    await renderPetProfile();
  });
}











