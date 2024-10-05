import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { LifecycleServerRouter } from "lifecycle-server/src/index";

const DEV_SERVER_PORT = 4000;
const ROUTER_PREFIX = "/trpc";

const eventsServiceClient = createTRPCProxyClient<LifecycleServerRouter>({
  links: [
    httpBatchLink({
      url: `http://localhost:${DEV_SERVER_PORT}${ROUTER_PREFIX}`,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
    }),
  ],
});

let currentArtifactId: string | null = null;
let currentStaticVersion: string | null = null;

async function getArtifactData(artifactId: string) {
  try {
    console.log("Fetching artifact data for:", artifactId);
    const { artifact } = await eventsServiceClient.artifacts.getArtifact.query({
      artifactId,
    });
    console.log("Received artifact data:", artifact);
    return artifact;
  } catch (error) {
    console.error("Error fetching artifact data:", error);
    alert("Failed to fetch artifact data. Check the console for details.");
  }
}

async function updateArtifactData(
  artifactId: string,
  newStaticsVersion: string
) {
  try {
    const { artifact } =
      await eventsServiceClient.artifacts.updateArtifact.query({
        artifactId,
        newStaticsVersion,
      });
    console.log("Updated artifact data:", artifact);
    return artifact;
  } catch (error) {
    console.error("Error updating artifact data:", error);
    alert("Failed to update artifact data. Check the console for details.");
  }
}

async function populateArtifactSelect() {
  const artifactSelect = document.getElementById(
    "artifact-select"
  ) as HTMLSelectElement;
  try {
    console.log("Fetching artifact list...");
    const { artifacts } = await eventsServiceClient.artifacts.list.query();
    console.log("Received artifacts:", artifacts);

    artifactSelect.innerHTML = ""; // Clear existing options
    artifacts.forEach((artifact) => {
      const option = document.createElement("option");
      option.value = artifact.id;
      option.textContent = artifact.id;
      artifactSelect.appendChild(option);
    });

    artifactSelect.addEventListener("change", handleArtifactChange);

    // Select the first artifact by default and trigger change event
    if (artifacts.length > 0) {
      artifactSelect.value = artifacts[0].id;
      artifactSelect.dispatchEvent(new Event("change"));
    }
  } catch (error) {
    console.error("Error fetching artifact list:", error);
    alert("Failed to fetch artifact list. Check the console for details.");
  }
}

async function handleArtifactChange(event: Event) {
  const select = event.target as HTMLSelectElement;
  currentArtifactId = select.value;

  if (currentArtifactId) {
    try {
      const artifact = await getArtifactData(currentArtifactId);
      if (artifact) {
        currentStaticVersion = artifact.staticsVersion || "None";
        updateLabels();
        populateVersionSelect(artifact.rcVersions || []);
      }
    } catch (error) {
      console.error("Error handling artifact change:", error);
    }
  }
}

function populateVersionSelect(versions: string[]) {
  const versionSelect = document.getElementById(
    "version-select"
  ) as HTMLSelectElement;
  versionSelect.innerHTML = ""; // Clear existing options

  versions.forEach((version) => {
    const option = document.createElement("option");
    option.value = version;
    option.textContent = version;
    versionSelect.appendChild(option);
  });

  // Set the current version as selected
  if (currentStaticVersion) {
    versionSelect.value = currentStaticVersion;
  }
}

function updateLabels() {
  const artifactIdSpan = document.getElementById("current-artifact-id");
  const staticVersionSpan = document.getElementById("current-static-version");

  if (artifactIdSpan)
    artifactIdSpan.textContent = currentArtifactId || "None selected";
  if (staticVersionSpan)
    staticVersionSpan.textContent = currentStaticVersion || "None";
}

async function handleUpdateClick() {
  const versionSelect = document.getElementById(
    "version-select"
  ) as HTMLSelectElement;
  const newVersion = versionSelect.value;

  if (currentArtifactId && newVersion) {
    const updatedArtifact = await updateArtifactData(
      currentArtifactId,
      newVersion
    );
    if (updatedArtifact) {
      currentStaticVersion = updatedArtifact.staticsVersion || "None";
      updateLabels();
      populateVersionSelect(updatedArtifact.rcVersions || []);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  populateArtifactSelect();

  const updateButton = document.getElementById("update-button");
  if (updateButton) {
    updateButton.addEventListener("click", handleUpdateClick);
  }
});
