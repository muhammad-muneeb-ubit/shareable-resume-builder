interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  about: string;
  schoolName: string;
  schoolYear: string;
  schoolGrade: string;
  collegeName?: string;
  collegeYear?: string;
  collegeGrade: string;
  companyName: string;
  description: string;
  yearStart: string;
  yearEnd: string;
  skills: string[];
  languages: string[];
  customUrl: string;
}

function handleSubmit(event: Event) {
  event.preventDefault();

  const formData: FormData = {
    name: (document.querySelector('input[name="name"]') as HTMLInputElement).value,
    email: (document.querySelector('input[name="email"]') as HTMLInputElement).value,
    phone: (document.querySelector('input[name="phone"]') as HTMLInputElement).value,
    address: (document.querySelector('input[name="address"]') as HTMLInputElement).value,
    about: (document.querySelector('textarea[name="about"]') as HTMLTextAreaElement).value,
    schoolName: (document.querySelector('input[name="schoolName"]') as HTMLInputElement).value,
    schoolYear: (document.querySelector('input[name="schoolYear"]') as HTMLInputElement).value,
    schoolGrade: (document.querySelector('input[name="schoolGrade"]') as HTMLInputElement).value,
    collegeName: (document.querySelector('input[name="collegeName"]') as HTMLInputElement).value,
    collegeYear: (document.querySelector('input[name="collegeYear"]') as HTMLInputElement).value,
    collegeGrade: (document.querySelector('input[name="collegeGrade"]') as HTMLInputElement).value,
    companyName: (document.querySelector('input[name="companyName"]') as HTMLInputElement).value,
    description: (document.querySelector('textarea[name="description"]') as HTMLTextAreaElement).value,
    yearStart: (document.querySelector('input[name="yearStart"]') as HTMLInputElement).value,
    yearEnd: (document.querySelector('input[name="yearEnd"]') as HTMLInputElement).value,
    skills: (document.querySelector('textarea[name="skills"]') as HTMLInputElement).value.split(","),
    languages: (document.querySelector('textarea[name="languages"]') as HTMLInputElement).value.split(","),
    customUrl: (document.querySelector('input[name="customUrl"]') as HTMLInputElement).value,
  };

  displayResumeToUser(formData);
  uploadResumeToJsonBin(formData);
}

async function uploadResumeToJsonBin(formData: object) {
  const apiUrl = "https://api.jsonbin.io/v3/b";
  const apiKey = "$2a$10$WoeYq8GaB9ydTGAriBtBp.PgqjnrO06zR7YpINwL5wQxxR7FuUFUS"; // Replace with your JSONBin API key

  try {
    // Step 1: Create a new bin
    const createResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": apiKey,
      },
      body: JSON.stringify(formData),
    });

    if (!createResponse.ok) {
      throw new Error("Failed to create bin");
    }

    const createResult = await createResponse.json();
    const binId = createResult.metadata.id;
    console.log("Bin created:", binId);

    // Step 2: Make the bin public
    await makeBinPublic(binId);

    // Step 3: Generate the shareable URL
    const shareableUrl = `https://jsonbin.io/${binId}`;
    console.log("Your shareable resume URL:", shareableUrl);
    alert("Your resume has been uploaded! Share it with this link: " + shareableUrl);

  } catch (error) {
    console.error("Error uploading resume:", error);
    alert("Failed to upload resume. Please try again.");
  }
}

async function makeBinPublic(binId: string) {
  const url = `https://api.jsonbin.io/v3/b/${binId}`; // Corrected URL (removed /meta)
  const apiKey = "$2a$10$WoeYq8GaB9ydTGAriBtBp.PgqjnrO06zR7YpINwL5wQxxR7FuUFUS"; // Replace with your JSONBin API key

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": apiKey,
      },
      body: JSON.stringify({
        metadata: {
          private: false, // Set this to false to make the bin public
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to make bin public: ${errorText}`);
    }

  } catch (error) {
    console.error("Error making bin public:", error);
  }
}


async function displayResume(resumeId: string) {
  const url = `https://api.jsonbin.io/v3/b/${resumeId}/latest`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch resume data");
    }

    const resumeData = await response.json();
    displayResumeToUser(resumeData.record);
  } catch (error) {
    console.error("Error fetching resume:", error);
    alert("Unable to fetch resume data. Please check the URL or try again later.");
  }
}

function displayResumeToUser(formData: FormData) {
  document.getElementById("resume-name")!.textContent = formData.name;
  document.getElementById("resume-email")!.textContent = formData.email;
  document.getElementById("resume-phone")!.textContent = formData.phone;
  document.getElementById("resume-address")!.textContent = formData.address;
  document.getElementById("resume-about")!.textContent = formData.about;

  document.getElementById("resume-school")!.textContent = formData.schoolName;
  document.getElementById("resume-school-year")!.textContent = formData.schoolYear;
  document.getElementById("resume-school-grade")!.textContent = formData.schoolGrade;
  document.getElementById("resume-college")!.textContent = formData.collegeName || "N/A";
  document.getElementById("resume-college-year")!.textContent = formData.collegeYear || "N/A";
  document.getElementById("resume-college-grade")!.textContent = formData.collegeGrade || "N/A";

  document.getElementById("resume-company")!.textContent = formData.companyName;
  document.getElementById("resume-description")!.textContent = formData.description;
  document.getElementById("resume-year-start")!.textContent = formData.yearStart;
  document.getElementById("resume-year-end")!.textContent = formData.yearEnd;

  const skillsList = document.getElementById("resume-skills")!;
  skillsList.innerHTML = "";
  formData.skills.forEach(skill => {
    const li = document.createElement("li");
    li.textContent = skill;
    skillsList.appendChild(li);
  });

  const languagesList = document.getElementById("resume-languages")!;
  languagesList.innerHTML = "";
  formData.languages.forEach(language => {
    const li = document.createElement("li");
    li.textContent = language;
    languagesList.appendChild(li);
  });

  document.getElementById("resume")!.style.display = "block";
  document.getElementById("resume-form")!.style.display = "none";
}

