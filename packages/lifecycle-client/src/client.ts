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
          credentials: "include", // This includes cookies in the request
        });
      },
    }),
  ],
});

let currentArtifactId: string | null = null;
let currentStaticVersion: string | null = null;

async function getArtifactData(artifactId: string) {
  const artifact = await eventsServiceClient.artifacts.getArtifact.query({
    artifactId,
  });
  console.log(artifact);
  return artifact;
}

async function updateArtifactData(
  artifactId: string,
  newStaticsVersion: string
) {
  const artifact = await eventsServiceClient.artifacts.updateArtifact.query({
    artifactId,
    newStaticsVersion,
  });
  console.log(artifact);
  return artifact;
}

async function populateArtifactSelect() {
  const artifactSelect = document.getElementById(
    "artifact-select"
  ) as HTMLSelectElement;
  try {
    const { artifacts } = await eventsServiceClient.artifacts.list.query();
    artifacts.forEach((artifact) => {
      const option = document.createElement("option");
      option.value = artifact.id;
      option.textContent = artifact.id;
      artifactSelect.appendChild(option);
    });

    artifactSelect.addEventListener("change", handleArtifactChange);
  } catch (error) {
    console.error(error);
  }
}

async function handleArtifactChange(event: Event) {
  const select = event.target as HTMLSelectElement;
  currentArtifactId = select.value;

  if (currentArtifactId) {
    const { artifact } = await getArtifactData(currentArtifactId);
    currentStaticVersion = artifact.staticsVersion || "";
    updateLabels();
    populateVersionSelect(artifact.rcVersions || []);
  }
}

function populateVersionSelect(versions: string[]) {
  const versionSelect = document.getElementById(
    "version-select"
  ) as HTMLSelectElement;
  versionSelect.innerHTML = "";

  versions.forEach((version) => {
    const option = document.createElement("option");
    option.value = version;
    option.textContent = version;
    versionSelect.appendChild(option);
  });

  versionSelect.value = currentStaticVersion || "";
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
    await updateArtifactData(currentArtifactId, newVersion);
    currentStaticVersion = newVersion;
    updateLabels();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  populateArtifactSelect();

  const updateButton = document.getElementById("update-button");
  if (updateButton) {
    updateButton.addEventListener("click", handleUpdateClick);
  }
});
