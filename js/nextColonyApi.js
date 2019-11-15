// Planet 정보
const loadplanets = account => {
  return axios.get(
    `https://api.nextcolony.io/loadplanets?user=${account}&to=300`,
  );
};

const loadplanet = planetId => {
  return axios.get(`https://api.nextcolony.io/loadplanet?id=${planetId}`);
};

const loadskills = account => {
  return axios.get(`https://api.nextcolony.io/loadskills?user=${account}`);
};

const loadqyt = planetId => {
  return axios.get(`https://api.nextcolony.io/loadqyt?id=${planetId}`);
};

const loadbuilding = planetId => {
  return axios.get(`https://api.nextcolony.io/loadbuildings?id=${planetId}`);
};

const loadshipyard = planetId => {
  return axios.get(`https://api.nextcolony.io/shipyard?id=${planetId}`);
};

const loadproduction = (planetId, account) => {
  return axios.get(
    `https://api.nextcolony.io/loadproduction?id=${planetId}&user=${account}`,
  );
};

const loadGalaxy = (planetX, planetY, width = 120) => {
  return axios.get(
    `https://api.nextcolony.io/loadgalaxy?x=${planetX}&y=${planetY}&height=${width}&width=${width}`,
  );
};

const fleetMission = account => {
  return axios.get(
    `https://api.nextcolony.io/loadfleetmission?user=${account}&active=1`,
  );
};

const fleetMissionOutgoing = (account, planetId) => {
  return axios.get(
    `https://api.nextcolony.io/loadfleetmission?planetid=${planetId}&user=${account}&active=1`,
  );
};

const loadFleet = (account, planetId) => {
  return axios.get(
    `https://api.nextcolony.io/loadfleet?user=${account}&planetid=${planetId}`,
  );
};
