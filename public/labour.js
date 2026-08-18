// USER ID

let myUserId = localStorage.getItem("userId");

if (!myUserId) {
  myUserId = "user_" + Date.now();
  localStorage.setItem("userId", myUserId);
}

// LOAD LABOURS

const loadLabours = () => {
  fetch("/api/labours")
    .then((response) => response.json())

    .then((data) => {
      const table = document.getElementById("labourTableBody");

      const loading = document.getElementById("loading");

      const empty = document.getElementById("emptyState");

      table.innerHTML = "";

      loading.classList.add("hidden");

      document.getElementById("labourCount").innerText =
        data.labours.length + " labour";

      if (data.labours.length === 0) {
        empty.classList.remove("hidden");
        return;
      }

      empty.classList.add("hidden");

      data.labours.forEach((labour) => {
        const row = document.createElement("tr");

        // Check if this is my profile

        const myProfile = labour.ownerId === myUserId;

        if (myProfile) {
          row.classList.add("my-row");
        }

        // Button

        let button;

        if (myProfile) {
          button = `<button
                            class="remove-button"
                            onclick="removeLabour('${labour._id}')">
                            Remove
                        </button>`;
        } else {
          button = `<button
                            class="view-button"
                            onclick="viewDetails('${labour._id}')">
                            View Details
                        </button>`;
        }

        // You badge

        let you = "";

        if (myProfile) {
          you = `<span class="you-badge">
                            You
                        </span>`;
        }

        // Create row

        row.innerHTML = `

                    <td>
                        ${labour.name}
                        ${you}
                    </td>

                    <td>
                        ${labour.village}
                    </td>

                    <td>
                        ${labour.age}
                    </td>

                    <td>
                        ${labour.workType}
                    </td>

                    <td>
                        ${labour.experience} Years
                    </td>

                    <td>
                        ₹${labour.expectedSalary}/day
                    </td>

                    <td>
                        ${labour.availability}
                    </td>

                    <td>
                        ${labour.phone}
                    </td>

                    <td>
                        ${button}
                    </td>

                `;

        table.appendChild(row);
      });
    })

    .catch((error) => {
      console.log(error);

      document.getElementById("loading").innerText =
        "Unable to load labour data.";
    });
};

// OPEN ADD LABOUR MODAL

const openLabourModal = () => {
  document.getElementById("labourModal").classList.add("show");
};

// CLOSE ADD LABOUR MODAL

const closeLabourModal = () => {
  document.getElementById("labourModal").classList.remove("show");
};

// ADD LABOUR

const addLabour = (event) => {
  event.preventDefault();

  const labourData = {
    ownerId: myUserId,

    name: document.getElementById("name").value,

    village: document.getElementById("village").value,

    age: document.getElementById("age").value,

    workType: document.getElementById("workType").value,

    experience: document.getElementById("experience").value,

    expectedSalary: document.getElementById("expectedSalary").value,

    phone: document.getElementById("phone").value,

    availability: document.getElementById("availability").value,

    description: document.getElementById("description").value,
  };

  fetch("/api/labours", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(labourData),
  })
    .then((response) => response.json())

    .then((data) => {
      alert("Profile added successfully!");

      document.getElementById("labourForm").reset();

      closeLabourModal();

      // Reload labour list

      loadLabours();
    })

    .catch((error) => {
      console.log(error);

      alert("Something went wrong.");
    });
};

// REMOVE LABOUR

const removeLabour = (id) => {
  const answer = confirm("Are you sure you want to remove your profile?");

  if (!answer) {
    return;
  }

  fetch("/api/labours/" + id, {
    method: "DELETE",
  })
    .then((response) => response.json())

    .then((data) => {
      alert(data.message);

      loadLabours();
    })

    .catch((error) => {
      console.log(error);

      alert("Unable to remove profile.");
    });
};

// VIEW DETAILS

const viewDetails = (id) => {
  fetch("/api/labours/" + id)
    .then((response) => response.json())

    .then((labour) => {
      document.getElementById("detailsName").innerText = labour.name;

      document.getElementById("detailsVillage").innerText = labour.village;

      document.getElementById("detailsContent").innerHTML = `

                <div class="detail-item">

                    <span>Age</span>

                    <strong>
                        ${labour.age} Years
                    </strong>

                </div>


                <div class="detail-item">

                    <span>Work Type</span>

                    <strong>
                        ${labour.workType}
                    </strong>

                </div>


                <div class="detail-item">

                    <span>Experience</span>

                    <strong>
                        ${labour.experience} Years
                    </strong>

                </div>


                <div class="detail-item">

                    <span>Expected Salary</span>

                    <strong>
                        ₹${labour.expectedSalary}/day
                    </strong>

                </div>


                <div class="detail-item">

                    <span>Availability</span>

                    <strong>
                        ${labour.availability}
                    </strong>

                </div>


                <div class="detail-item">

                    <span>Contact</span>

                    <strong>
                        ${labour.phone}
                    </strong>

                </div>


                <div class="detail-item">

                    <span>Description</span>

                    <strong>
                        ${labour.description || "No description"}
                    </strong>

                </div>

            `;

      document.getElementById("detailsModal").classList.add("show");
    })

    .catch((error) => {
      console.log(error);

      alert("Unable to load details.");
    });
};

// CLOSE DETAILS MODAL

const closeDetailsModal = () => {
  document.getElementById("detailsModal").classList.remove("show");
};

// LOAD DATA WHEN PAGE OPENS

loadLabours();
