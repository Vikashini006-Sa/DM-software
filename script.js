// Disaster report data

const reports = [

    {
        id: 1,
        disaster: "Flood",
        location: "Salem",
        severity: "High",
        confidence: 92,
        status: "Verified",
        lat: 11.6643,
        lng: 78.1460
    },

    {
        id: 2,
        disaster: "Landslide",
        location: "Wayanad",
        severity: "High",
        confidence: 87,
        status: "Verified",
        lat: 11.6854,
        lng: 76.1320
    },

    {
        id: 3,
        disaster: "Flood",
        location: "Chennai",
        severity: "Medium",
        confidence: 78,
        status: "Pending",
        lat: 13.0827,
        lng: 80.2707
    },

    {
        id: 4,
        disaster: "Cyclone",
        location: "Nagapattinam",
        severity: "High",
        confidence: 95,
        status: "Verified",
        lat: 10.7672,
        lng: 79.8449
    },

    {
        id: 5,
        disaster: "Heavy Rain",
        location: "Coimbatore",
        severity: "Low",
        confidence: 65,
        status: "Pending",
        lat: 11.0168,
        lng: 76.9558
    }

];


// Display reports in table

function displayReports() {

    const table =
        document.getElementById("reportTable");

    table.innerHTML = "";


    reports.forEach(report => {

        const row =
            document.createElement("tr");


        // Action buttons for pending reports

        let actions = "";

        if (report.status === "Pending") {

            actions = `
                <button
                    class="verify-btn"
                    onclick="verifyReport(${report.id})">
                    ✓ Verify
                </button>

                <button
                    class="reject-btn"
                    onclick="rejectReport(${report.id})">
                    ✕ Reject
                </button>
            `;

        } else {

            actions = `
                <span class="completed">
                    ✓ Reviewed
                </span>
            `;

        }


        row.innerHTML = `

            <td>
                <strong>${report.disaster}</strong>
            </td>

            <td>
                ${report.location}
            </td>

            <td>
                <span class="severity ${report.severity.toLowerCase()}">
                    ${report.severity}
                </span>
            </td>

            <td>
                <strong>${report.confidence}%</strong>
            </td>

            <td>
                <span class="status ${report.status.toLowerCase()}">
                    ${report.status}
                </span>
            </td>

            <td>
                ${actions}
            </td>

        `;


        table.appendChild(row);

    });

}

function verifyReport(id) {

    const report =
        reports.find(r => r.id === id);

    if (!report) return;


    report.status = "Verified";


    displayReports();

    updateStatistics();


    alert(
        `${report.disaster} report from ${report.location} has been verified.`
    );
}

function rejectReport(id) {

    const report =
        reports.find(r => r.id === id);

    if (!report) return;


    report.status = "Rejected";


    displayReports();

    updateStatistics();


    alert(
        `${report.disaster} report from ${report.location} has been rejected.`
    );
}


// Update dashboard statistics

function updateStatistics() {

    const active =
        reports.length;

    const high =
        reports.filter(
            r => r.severity === "High"
        ).length;

    const confidence =
        reports.reduce(
            (sum, r) => sum + r.confidence,
            0
        ) / reports.length;

    const verified =
        reports.filter(
            r => r.status === "Verified"
        ).length;


    document.getElementById(
        "activeReports"
    ).textContent = active;


    document.getElementById(
        "highSeverity"
    ).textContent = high;


    document.getElementById(
        "avgConfidence"
    ).textContent =
        Math.round(confidence) + "%";


    document.getElementById(
        "verifiedReports"
    ).textContent = verified;

}


// Create the map
const map = L.map("map").setView(
    [11.1271, 78.6569],
    7
);


// -----------------------------
// LOCAL / CITIZEN MAP
// -----------------------------

const localTiles = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: "&copy; OpenStreetMap contributors"
    }
);


// -----------------------------
// ENGLISH / AGENCY MAP
// -----------------------------

const englishTiles = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
        attribution:
            "&copy; OpenStreetMap contributors &copy; CARTO",

        subdomains: "abcd"
    }
);


// -----------------------------
// DEFAULT MAP
// -----------------------------

// Citizen/local map is shown initially
localTiles.addTo(map);


// -----------------------------
// MAP LANGUAGE TOGGLE
// -----------------------------

const baseMaps = {
    "🌐 Local Language": localTiles,
    "🇬🇧 English (Agency)": englishTiles
};


// Add toggle control
L.control.layers(
    baseMaps,
    null,
    {
        collapsed: false
    }
).addTo(map);
// Add disaster markers

reports.forEach(report => {

    let marker =
        L.marker([
            report.lat,
            report.lng
        ]).addTo(map);


    marker.bindPopup(`

        <b>${report.disaster}</b>

        <br>

        Location:
        ${report.location}

        <br>

        Severity:
        ${report.severity}

        <br>

        Confidence:
        ${report.confidence}%

        <br>

        Status:
        ${report.status}

    `);

});


// Refresh dashboard

function refreshDashboard() {

    displayReports();

    updateStatistics();

    alert("Dashboard refreshed!");

}


// Start dashboard

displayReports();

updateStatistics();